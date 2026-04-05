import { useState, useCallback, useMemo, useRef } from 'react';
import { TouchableOpacity, Share, Clipboard, TextInput, StyleSheet, View, ScrollView as RNScrollView, LayoutChangeEvent, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  VStack,
  Text,
  Box,
  HStack,
  StatusBar,
  Spinner,
  Center,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { StarIcon, CheckIcon, LocationIcon, ClockIcon, SearchIcon } from '@assets/icons';

// components
import { Header } from '../components/header/header';
import { useAuth } from 'src/hooks/useAuth';
import { checkCampaignVoucher, renewVoucher } from '@services/campaignService';

// data
import { labiUnits } from 'src/data/labiUnits';

// Cor da Labi
const LABI_PURPLE = '#7B2E8E';
const LABI_PURPLE_LIGHT = '#9B4EAE';

interface VoucherData {
  voucher: string;
  message?: string;
  validade?: string;
  status?: string;
}

function formatValidade(dateString?: string): string {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch {
    return dateString;
  }
}

export function Bonus() {
  const [isLoading, setIsLoading] = useState(true);
  const [voucherData, setVoucherData] = useState<VoucherData | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRenewing, setIsRenewing] = useState(false);
  const scrollRef = useRef<RNScrollView>(null);
  const stickyHeaderY = useRef(0);

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadVoucher() {
        if (!user?.email) {
          if (isMounted) {
            setIsLoading(false);
            setError('Email não encontrado');
          }
          return;
        }

        if (isMounted) setIsLoading(true);

        try {
          if (__DEV__) console.log('📢 [BONUS] Buscando voucher para:', user.email);
          const result = await checkCampaignVoucher(user.email);
          if (__DEV__) console.log('📢 [BONUS] Resultado:', result);

          if (isMounted) {
            if (result.success && result.voucher) {
              setVoucherData({
                voucher: result.voucher,
                message: result.message,
                validade: result.validade,
                status: result.status,
              });
            } else {
              setVoucherData(null);
            }
          }
        } catch (err: any) {
          if (__DEV__) console.error('📢 [BONUS] Erro ao buscar voucher:', err);
          if (isMounted) {
            setError(err?.message || 'Erro desconhecido');
            setVoucherData(null);
          }
        } finally {
          if (isMounted) setIsLoading(false);
        }
      }

      loadVoucher();

      return () => {
        isMounted = false;
      };
    }, [user?.email])
  );

  const handleCopyVoucher = () => {
    if (voucherData?.voucher) {
      try {
        Clipboard.setString(voucherData.voucher);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        if (__DEV__) console.error('Erro ao copiar:', err);
      }
    }
  };

  const handleShareVoucher = async () => {
    if (voucherData?.voucher) {
      try {
        await Share.share({
          message: `Meu voucher Examinus: ${voucherData.voucher}\n\nBaixe o app Examinus e cuide da sua saúde!`,
        });
      } catch (err) {
        if (__DEV__) console.error('Erro ao compartilhar:', err);
      }
    }
  };

  const isExpired = voucherData?.status === 'Expirado';

  const handleRenewVoucher = async () => {
    if (!user?.email || isRenewing) return;

    setIsRenewing(true);
    try {
      const result = await renewVoucher(user.email);

      if (result.success && result.voucher) {
        setVoucherData({
          voucher: result.voucher,
          message: result.message,
          validade: result.validade,
          status: result.status,
        });
      } else {
        setError(result.message || 'Não foi possível renovar o voucher.');
        // Limpa o erro após 3 segundos
        setTimeout(() => setError(null), 3000);
      }
    } catch {
      setError('Erro ao renovar voucher. Tente novamente.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsRenewing(false);
    }
  };

  const filteredUnits = useMemo(() => {
    if (!searchQuery.trim()) return labiUnits;
    const q = searchQuery.toLowerCase().trim();
    return labiUnits.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.neighborhood.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.cep.includes(q) ||
        u.street.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const showUnits = !isLoading && !error && !!voucherData && !isExpired;

  return (
    <VStack testID="screen-bonus" flex={1} bg="gray.50">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <VStack pt={16} mx={6}>
        <Header title="Meu Voucher" handleBackTo={() => navigation.goBack()} />
      </VStack>

      <RNScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        stickyHeaderIndices={showUnits ? [1] : undefined}
        keyboardShouldPersistTaps="handled"
      >
        {/* Child 0: Main content */}
        <View>
          {isLoading ? (
            <Center flex={1} mt={20}>
              <Spinner size="lg" color={LABI_PURPLE} />
              <Text mt={4} fontSize={14} color="gray.500">
                Carregando seu voucher...
              </Text>
            </Center>
          ) : error ? (
            <Center flex={1} px={6} mt={10}>
              <Box bg="red.100" p={4} borderRadius={12}>
                <Text color="red.600" textAlign="center">
                  Erro: {error}
                </Text>
              </Box>
            </Center>
          ) : voucherData ? (
            <VStack mx={6} space={4} mt={4}>
              <Box
                bg={isExpired ? 'gray.400' : LABI_PURPLE}
                borderRadius={20}
                p={6}
                shadow={4}
              >
                <VStack alignItems="center" space={4}>
                  <Box bg="white" p={3} borderRadius={100}>
                    <StarIcon size="32" color={isExpired ? '#9CA3AF' : LABI_PURPLE} />
                  </Box>

                  <Text fontSize={16} fontWeight={600} color="white" textAlign="center">
                    {isExpired ? 'Voucher Expirado' : 'Seu voucher de Hemograma Grátis'}
                  </Text>

                  <Box bg="white" px={4} py={3} borderRadius={12} w="100%">
                    <Text
                      fontSize={18}
                      fontWeight={700}
                      color={isExpired ? 'gray.400' : 'gray.900'}
                      textAlign="center"
                      letterSpacing={1}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {voucherData.voucher}
                    </Text>
                  </Box>

                  {voucherData.validade && (
                    <Box
                      bg={isExpired ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}
                      px={3}
                      py={1.5}
                      borderRadius={8}
                    >
                      <Text fontSize={12} fontWeight={500} color="white" textAlign="center">
                        {isExpired ? 'Expirou em: ' : 'Válido até: '}
                        {formatValidade(voucherData.validade)}
                      </Text>
                    </Box>
                  )}

                  {!isExpired && (
                    <HStack space={3} w="100%">
                      <TouchableOpacity style={{ flex: 1 }} onPress={handleCopyVoucher}>
                        <Box bg="white" py={3} borderRadius={12} alignItems="center">
                          <HStack space={2} alignItems="center">
                            {copied ? (
                              <>
                                <CheckIcon size="20" color={LABI_PURPLE} />
                                <Text fontSize={14} fontWeight={600} color={LABI_PURPLE}>
                                  Copiado!
                                </Text>
                              </>
                            ) : (
                              <Text fontSize={14} fontWeight={600} color={LABI_PURPLE}>
                                Copiar código
                              </Text>
                            )}
                          </HStack>
                        </Box>
                      </TouchableOpacity>

                      <TouchableOpacity style={{ flex: 1 }} onPress={handleShareVoucher}>
                        <Box
                          bg="rgba(255,255,255,0.2)"
                          py={3}
                          borderRadius={12}
                          alignItems="center"
                          borderWidth={1}
                          borderColor="white"
                        >
                          <Text fontSize={14} fontWeight={600} color="white">
                            Compartilhar
                          </Text>
                        </Box>
                      </TouchableOpacity>
                    </HStack>
                  )}
                </VStack>
              </Box>

              {!isExpired && (
                <Box bg="white" borderRadius={16} p={4} borderWidth={1} borderColor="gray.200">
                  <Text fontSize={14} fontWeight={700} color="gray.900" mb={2}>
                    Como usar seu voucher
                  </Text>
                  <VStack space={2}>
                    <HStack space={2} alignItems="flex-start">
                      <Text fontSize={14} color={LABI_PURPLE} fontWeight={700}>1.</Text>
                      <Text fontSize={13} fontWeight={500} color="gray.600" flex={1}>
                        Vá até uma unidade LABI Exames participante
                      </Text>
                    </HStack>
                    <HStack space={2} alignItems="flex-start">
                      <Text fontSize={14} color={LABI_PURPLE} fontWeight={700}>2.</Text>
                      <Text fontSize={13} fontWeight={500} color="gray.600" flex={1}>
                        Apresente este código no balcão de atendimento
                      </Text>
                    </HStack>
                    <HStack space={2} alignItems="flex-start">
                      <Text fontSize={14} color={LABI_PURPLE} fontWeight={700}>3.</Text>
                      <Text fontSize={13} fontWeight={500} color="gray.600" flex={1}>
                        Realize seu hemograma gratuitamente
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              )}

              <Box
                bg={isExpired ? 'gray.100' : 'purple.50'}
                borderRadius={12}
                p={3}
                borderWidth={1}
                borderColor={isExpired ? 'gray.300' : 'purple.200'}
              >
                <Text
                  fontSize={12}
                  fontWeight={500}
                  color={isExpired ? 'gray.600' : 'purple.800'}
                  textAlign="center"
                >
                  {isExpired
                    ? 'Este voucher expirou e não pode mais ser utilizado.'
                    : 'Este voucher é pessoal e intransferível. Válido por tempo limitado.'}
                </Text>
              </Box>

              {isExpired && (
                <TouchableOpacity onPress={handleRenewVoucher} disabled={isRenewing}>
                  <Box
                    bg="ciano.400"
                    py={4}
                    borderRadius={14}
                    alignItems="center"
                    opacity={isRenewing ? 0.6 : 1}
                  >
                    <HStack space={2} alignItems="center">
                      {isRenewing ? (
                        <Spinner size="sm" color="white" />
                      ) : (
                        <Text fontSize={16} fontWeight={700} color="white">
                          Renovar Voucher
                        </Text>
                      )}
                    </HStack>
                  </Box>
                </TouchableOpacity>
              )}
            </VStack>
          ) : (
            <Center flex={1} px={6} mt={20}>
              <Box bg="gray.100" p={8} borderRadius={20} alignItems="center">
                <Box bg="gray.200" p={4} borderRadius={100} mb={4}>
                  <StarIcon size="48" color="#9CA3AF" />
                </Box>
                <Text fontSize={18} fontWeight={700} color="gray.700" textAlign="center" mb={2}>
                  Nenhum voucher disponível
                </Text>
                <Text fontSize={14} fontWeight={500} color="gray.500" textAlign="center" lineHeight={20}>
                  Você ainda não possui vouchers ativos.
                  Fique de olho nas nossas campanhas!
                </Text>
              </Box>
            </Center>
          )}
        </View>

        {/* Child 1: Sticky search header */}
        {showUnits ? (
          <Box
            bg="gray.50"
            px={6}
            pt={2}
            pb={2}
            onLayout={(e: LayoutChangeEvent) => {
              stickyHeaderY.current = e.nativeEvent.layout.y;
            }}
          >
            <Text fontSize={18} fontWeight={700} color="gray.900" mb={2}>
              Unidades Participantes
            </Text>
            <HStack style={styles.searchWrapper} space={2} alignItems="center">
              <SearchIcon size="16" color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nome, bairro, cidade ou CEP..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => {
                  scrollRef.current?.scrollTo({ y: stickyHeaderY.current, animated: true });
                }}
              />
            </HStack>
            <Text fontSize={12} fontWeight={500} color="gray.500" mt={2}>
              {filteredUnits.length} {filteredUnits.length === 1 ? 'unidade encontrada' : 'unidades encontradas'}
            </Text>
          </Box>
        ) : <View />}

        {/* Child 2: Unit cards */}
        {showUnits ? (
          <VStack mx={6} space={3} mt={2} minH={Dimensions.get('window').height}>
            {filteredUnits.map((unit) => (
              <Box
                key={unit.unit_id}
                bg="white"
                borderRadius={14}
                p={4}
                borderWidth={1}
                borderColor="gray.200"
              >
                <HStack justifyContent="space-between" alignItems="center" mb={2}>
                  <Text fontSize={14} fontWeight={700} color="gray.900" flex={1} mr={2}>
                    {unit.name}
                  </Text>
                  <Box bg={LABI_PURPLE} px={2} py={0.5} borderRadius={6}>
                    <Text fontSize={10} fontWeight={600} color="white">
                      {unit.region}
                    </Text>
                  </Box>
                </HStack>

                <HStack space={1.5} alignItems="flex-start" mb={1}>
                  <Box mt={0.5}>
                    <LocationIcon size="14" color="#9CA3AF" />
                  </Box>
                  <VStack flex={1}>
                    <Text fontSize={12} fontWeight={500} color="gray.600">
                      {unit.street}, {unit.number}
                    </Text>
                    <Text fontSize={12} fontWeight={400} color="gray.500">
                      CEP {unit.cep} - {unit.neighborhood} - {unit.city}
                    </Text>
                  </VStack>
                </HStack>

                <HStack space={1.5} alignItems="flex-start">
                  <Box mt={0.5}>
                    <ClockIcon size="14" color="#9CA3AF" />
                  </Box>
                  <VStack flex={1}>
                    <Text fontSize={12} fontWeight={500} color="gray.600">
                      {unit.hours_weekday}
                    </Text>
                    <Text fontSize={12} fontWeight={400} color="gray.500">
                      {unit.hours_saturday}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            ))}

            {filteredUnits.length === 0 && (
              <Box alignItems="center" mt={10}>
                <Box bg="gray.100" p={6} borderRadius={12} alignItems="center">
                  <SearchIcon size="32" color="#9CA3AF" />
                  <Text fontSize={15} fontWeight={600} color="gray.500" textAlign="center" mt={3}>
                    Nenhuma unidade encontrada
                  </Text>
                  <Text fontSize={13} fontWeight={400} color="gray.400" textAlign="center" mt={1}>
                    Tente buscar por outro nome, bairro ou CEP
                  </Text>
                </Box>
              </Box>
            )}
          </VStack>
        ) : <View />}
      </RNScrollView>
    </VStack>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 8,
  },
});
