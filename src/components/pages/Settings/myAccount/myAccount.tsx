import { useRef, useState, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  VStack,
  Text,
  Box,
  HStack,
  ScrollView,
  IScrollViewProps,
  Image,
  View,
  StatusBar,
  Actionsheet,
  useDisclose,
  Flex,
  Input,
  Spinner,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import {
  ArrowCurvedIcon,
  BellSecondaryIcon,
  ChatIcon,
  EditIcon,
  EyeIcon,
  FlagIcon,
  GearIcon,
  LockIcon,
  MoreIcon,
  QuestionIcon,
  StarIcon,
  TelephoneIcon,
  TrashIcon,
  UserIcon,
  WarningIcon,
} from '@assets/icons';

// components
import { Header } from '../components/header/header';
import { Card } from '../components/card/card';
import { Button } from '@components/atoms';
import { useAuth } from 'src/hooks/useAuth';
import { useHome } from 'src/hooks/useHome';
import { getUserPersonalData } from '@services/userService';

// Cor da Labi
const LABI_PURPLE = '#7B2E8E';

export function MyAccount() {
  const { isOpen: isSignOutOpen, onOpen: onSignOutOpen, onClose: onSignOutClose } = useDisclose();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclose();
  const { isOpen: isFeedbackOpen, onOpen: onFeedbackOpen, onClose: onFeedbackClose } = useDisclose();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [deleteFeedback, setDeleteFeedback] = useState({
    reason: '',
    customReason: '',
  });

  const deleteReasons = [
    { value: 'not_using', label: 'Não uso mais o app' },
    { value: 'privacy', label: 'Preocupações com privacidade' },
    { value: 'found_alternative', label: 'Encontrei alternativa melhor' },
    { value: 'not_useful', label: 'App não atende minhas necessidades' },
    { value: 'other', label: 'Outro motivo' },
  ];

  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { user, signOut, deleteAccount, updateUserPhoto } = useAuth();
  const { clearHomeData } = useHome();

  // Buscar foto de perfil do backend apenas se não estiver no contexto
  useFocusEffect(
    useCallback(() => {
      async function loadProfilePhotoIfNeeded() {
        // Se já tem foto no contexto, não precisa buscar
        if (user?.profilePhotoBase64) {
          console.log('📷 [MY_ACCOUNT] Foto já está no contexto, não precisa buscar');
          return;
        }

        setIsLoadingPhoto(true);
        try {
          console.log('📷 [MY_ACCOUNT] Buscando foto de perfil do backend...');
          const profileData = await getUserPersonalData();
          if (profileData?.profilePhotoBase64) {
            // Salva no contexto para cache
            updateUserPhoto(profileData.profilePhotoBase64);
            console.log('✅ [MY_ACCOUNT] Foto de perfil carregada e salva no contexto');
          } else {
            console.log('ℹ️ [MY_ACCOUNT] Usuário não possui foto de perfil');
          }
        } catch (error) {
          console.log('⚠️ [MY_ACCOUNT] Erro ao buscar foto de perfil:', error);
        } finally {
          setIsLoadingPhoto(false);
        }
      }

      loadProfilePhotoIfNeeded();
    }, [user?.profilePhotoBase64, updateUserPhoto])
  );

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      // Limpar dados do contexto de Home
      clearHomeData();
      // Fazer logout (limpa AsyncStorage e user state)
      await signOut();
      onSignOutClose();
    } catch (error) {
      console.error('Erro ao sair:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccountClick = () => {
    onFeedbackOpen();
  };

  const handleContinueToDelete = () => {
    onFeedbackClose();
    onDeleteOpen();
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      // TODO: Enviar feedback para backend quando endpoint estiver disponível
      // if (deleteFeedback.reason) {
      //   await api.post('/user-feedback/delete-account', {
      //     reason: deleteFeedback.reason,
      //     customReason: deleteFeedback.customReason,
      //   });
      // }
      console.log('Feedback de exclusão:', deleteFeedback);
      onDeleteClose();
      await deleteAccount();
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View flex={1} testID="screen-settings">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header fixo */}
      <VStack pt={16} mx={6}>
        <Header title="Minha Conta" handleBackTo={() => navigation.navigate('homepage')} />
      </VStack>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <VStack flex={1} mx={6} mb={10}>
          {/* Perfil card - animação 1 */}
          <Animated.View entering={!hasAnimated ? FadeInDown.duration(400).delay(0) : undefined}>
            <TouchableOpacity onPress={() => navigation.navigate('info')} activeOpacity={0.8}>
              <Box bg={'gray.800'} w="100%" borderRadius={16} p={4}>
                <HStack space={3} alignItems={'center'}>
                  {/* Foto de perfil ou ícone padrão */}
                  <Box
                    size={20}
                    borderRadius={10}
                    overflow="hidden"
                    bg="gray.700"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {isLoadingPhoto ? (
                      <Spinner color="gray.400" size="lg" />
                    ) : user?.profilePhotoBase64 || user?.photoUrl ? (
                      <Image
                        source={{ uri: user?.profilePhotoBase64 || user?.photoUrl }}
                        size={20}
                        alt="Foto de perfil"
                      />
                    ) : (
                      <UserIcon size="48" color="#9CA3AF" />
                    )}
                  </Box>

                  <VStack flex={1} space={2}>
                    <Text color={'white'} fontSize={22} fontWeight={800} letterSpacing={-0.36}>
                      {user?.fullName || 'Usuário'}
                    </Text>
                    {user?.email ? (
                      <Text color={'gray.200'} fontSize={14} fontWeight={600} letterSpacing={-0.12}>
                        {user.email}
                      </Text>
                    ) : null}
                  </VStack>

                  <EditIcon size="30" />
                </HStack>
              </Box>
            </TouchableOpacity>
          </Animated.View>

          {/* Configurações Gerais - animação 2 */}
          <Animated.View entering={!hasAnimated ? FadeInDown.duration(400).delay(100) : undefined}>
            <VStack>
              <Text mt={12} fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                Configurações Gerais
              </Text>

              <VStack mt={4} space={3}>
                <Card
                  testID="card-personal-info"
                  title="Informação Pessoal"
                  variant="primary"
                  action="chevron"
                  goTo={() => navigation.navigate('info')}
                  icon={<UserIcon color="#3D4966" size="30" />}
                />
                <Card
                  testID="card-notifications"
                  title="Notificações"
                  variant="primary"
                  action="chevron"
                  goTo={() => navigation.navigate('configNotifications')}
                  icon={<BellSecondaryIcon color="#3D4966" size="30" />}
                />
                <Card
                  testID="card-preferences"
                  title="Preferências"
                  variant="primary"
                  action="chevron"
                  goTo={() => navigation.navigate('preferences')}
                  icon={<GearIcon color="#3D4966" size="30" />}
                />
                <Card
                  testID="card-security"
                  title="Segurança"
                  variant="primary"
                  action="chevron"
                  goTo={() => navigation.navigate('security')}
                  icon={<LockIcon color="#3D4966" size="30" />}
                />
              </VStack>
            </VStack>
          </Animated.View>

          {/* Promoções - animação 3 */}
          <Animated.View entering={!hasAnimated ? FadeInDown.duration(400).delay(200) : undefined}>
            <VStack>
              <Text mt={8} fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                Promoções
              </Text>

              <VStack mt={4} space={3}>
                <Card
                  testID="card-bonus"
                  title="Meu Voucher"
                  variant="primary"
                  action="chevron"
                  goTo={() => navigation.navigate('bonus')}
                  icon={<StarIcon color={LABI_PURPLE} size="30" />}
                />
              </VStack>
            </VStack>
          </Animated.View>

          {/* Acessibilidade - animação 4 */}
          <Animated.View entering={!hasAnimated ? FadeInDown.duration(400).delay(300) : undefined}>
            <VStack>
              <Text mt={8} fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                Acessibilidade
              </Text>

              <VStack mt={4} space={3}>
                <Card
                  title="Idioma"
                  variant="primary"
                  action="chevron"
                  comingSoon={true}
                  icon={<FlagIcon color="#3D4966" size="30" />}
                />
                <Card
                  title="Dark Mode"
                  variant="primary"
                  icon={<EyeIcon color="#3D4966" size="30" />}
                  action="switch"
                  comingSoon={true}
                />
              </VStack>
            </VStack>
          </Animated.View>

          {/* Ajuda & Suporte - animação 5 */}
          <Animated.View entering={!hasAnimated ? FadeInDown.duration(400).delay(400) : undefined}>
            <VStack>
              <Text mt={8} fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                Ajuda & Suporte
              </Text>

              <VStack mt={4} space={3}>
                <Card
                  testID="card-about"
                  title="Sobre"
                  variant="primary"
                  action="chevron"
                  goTo={() => navigation.navigate('aboutUs')}
                  icon={<QuestionIcon color="#3D4966" size="30" />}
                />
                <Card
                  title="Central de Ajuda"
                  variant="primary"
                  action="chevron"
                  comingSoon={true}
                  icon={<ChatIcon color="#3D4966" size="30" />}
                />
                <Card
                  testID="card-contact"
                  title="Fale com o Team X"
                  variant="primary"
                  action="chevron"
                  goTo={() => navigation.navigate('contactUs')}
                  icon={<TelephoneIcon color="#3D4966" size="30" />}
                />
              </VStack>
            </VStack>
          </Animated.View>

          {/* Desconectar - animação 6 */}
          <Animated.View
            entering={!hasAnimated ? FadeInDown.duration(400).delay(500) : undefined}
            onLayout={() => !hasAnimated && setHasAnimated(true)}
          >
            <VStack>
              <Text mt={8} fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
                Desconectar
              </Text>

              <VStack mt={4} space={3}>
                <Card
                  testID="card-logout"
                  title="Sair"
                  variant="primary"
                  action="chevron"
                  goTo={onSignOutOpen}
                  icon={<ArrowCurvedIcon color="#3D4966" size="30" />}
                />
              </VStack>
            </VStack>

            <VStack mt={12}>
              <TouchableOpacity onPress={handleDeleteAccountClick}>
                <HStack alignItems="center" space={3} bg="gray.100" px={4} py={3} borderRadius={12}>
                  <TrashIcon color="#9CA3AF" size="20" />
                  <Text fontSize={14} fontWeight={500} color="gray.500">
                    Deletar Conta
                  </Text>
                </HStack>
              </TouchableOpacity>
            </VStack>
          </Animated.View>
        </VStack>
      </ScrollView>

      {/* BottomSheet para confirmação de sair */}
      <Actionsheet isOpen={isSignOutOpen} onClose={onSignOutClose}>
        <Actionsheet.Content>
          <Box w="100%" px={4} py={6}>
            <VStack space={4} alignItems="center">
              <Box p={3} bg="red.100" borderRadius={12}>
                <ArrowCurvedIcon color="#EF4444" size="36" />
              </Box>

              <VStack space={2} alignItems="center">
                <Text fontSize={20} fontWeight={800} letterSpacing={-0.2} color="gray.900">
                  Sair da Conta
                </Text>
                <Text fontSize={16} fontWeight={500} textAlign="center" color="gray.600" lineHeight={24}>
                  Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para acessar o app.
                </Text>
              </VStack>

              <HStack space={3} w="100%" mt={4}>
                <Button
                  testID="btn-confirm-logout"
                  flex={1}
                  variant="primary"
                  size="md"
                  title={isSigningOut ? 'Saindo...' : 'Sair'}
                  onPress={handleSignOut}
                  bgColor="red.500"
                  _pressed={{ bgColor: 'red.600' }}
                  isLoading={isSigningOut}
                  isDisabled={isSigningOut}
                />
                <Button
                  testID="btn-cancel-logout"
                  flex={1}
                  variant="primary"
                  size="md"
                  title="Cancelar"
                  onPress={onSignOutClose}
                  borderColor="gray.300"
                  _text={{ color: 'gray.600' }}
                  isDisabled={isSigningOut}
                />
              </HStack>
            </VStack>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>

      {/* BottomSheet de Feedback - Por que está saindo? */}
      <Actionsheet isOpen={isFeedbackOpen} onClose={onFeedbackClose}>
        <Actionsheet.Content>
          <Box w="100%" px={4} py={6}>
            <VStack space={4}>
              <Text fontSize={20} fontWeight={800} color="gray.900">
                Por que você está saindo?
              </Text>
              <Text fontSize={14} color="gray.600">
                Sua opinião nos ajuda a melhorar o app
              </Text>

              <VStack space={2}>
                {deleteReasons.map((reason) => (
                  <TouchableOpacity
                    key={reason.value}
                    onPress={() => setDeleteFeedback({ ...deleteFeedback, reason: reason.value })}
                  >
                    <HStack
                      space={3}
                      alignItems="center"
                      p={3}
                      borderRadius={8}
                      bg={deleteFeedback.reason === reason.value ? 'ciano.50' : 'gray.50'}
                      borderWidth={1}
                      borderColor={deleteFeedback.reason === reason.value ? 'ciano.400' : 'gray.100'}
                    >
                      <Box
                        w={5}
                        h={5}
                        borderRadius={10}
                        borderWidth={2}
                        borderColor={deleteFeedback.reason === reason.value ? 'ciano.500' : 'gray.300'}
                        bg={deleteFeedback.reason === reason.value ? 'ciano.500' : 'white'}
                        alignItems="center"
                        justifyContent="center"
                      >
                        {deleteFeedback.reason === reason.value && <Box w={2} h={2} borderRadius={4} bg="white" />}
                      </Box>
                      <Text fontSize={14} color="gray.700">
                        {reason.label}
                      </Text>
                    </HStack>
                  </TouchableOpacity>
                ))}
              </VStack>

              {deleteFeedback.reason === 'other' && (
                <Input
                  placeholder="Conte-nos mais..."
                  value={deleteFeedback.customReason}
                  onChangeText={(text) => setDeleteFeedback({ ...deleteFeedback, customReason: text })}
                  multiline
                  h={20}
                  fontSize={14}
                  borderRadius={8}
                  borderColor="gray.200"
                  _focus={{ borderColor: 'ciano.400' }}
                />
              )}

              <HStack space={3} w="100%" mt={4}>
                <Button
                  flex={1}
                  variant="primary"
                  size="md"
                  title="Voltar"
                  onPress={onFeedbackClose}
                  borderColor="gray.300"
                  _text={{ color: 'gray.600' }}
                />
                <Button
                  flex={1}
                  variant="primary"
                  size="md"
                  title="Continuar"
                  onPress={handleContinueToDelete}
                  bgColor="red.500"
                  _pressed={{ bgColor: 'red.600' }}
                />
              </HStack>
            </VStack>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>

      {/* BottomSheet para confirmação de deletar conta */}
      <Actionsheet isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <Actionsheet.Content>
          <Box w="100%" px={4} py={6}>
            <VStack space={4} alignItems="center">
              <Box p={3} bg="red.100" borderRadius={12}>
                <WarningIcon color="#EF4444" size="36" />
              </Box>

              <VStack space={2} alignItems="center">
                <Text fontSize={20} fontWeight={800} letterSpacing={-0.2} color="gray.900">
                  Deletar Conta
                </Text>
                <VStack space={3} alignItems="center">
                  <Text fontSize={16} fontWeight={600} textAlign="center" color="red.600">
                    Esta ação e irreversível!
                  </Text>
                  <Text fontSize={14} fontWeight={500} textAlign="center" color="gray.600" lineHeight={20}>
                    Ao deletar sua conta, todos os seus dados serão permanentemente removidos:
                  </Text>
                  <VStack space={1} alignItems="center" w="100%">
                    <Text fontSize={14} color="gray.600">
                      - Histórico de exames
                    </Text>
                    <Text fontSize={14} color="gray.600">
                      - Dados de saude
                    </Text>
                    <Text fontSize={14} color="gray.600">
                      - Configurações personalizadas
                    </Text>
                  </VStack>
                </VStack>
              </VStack>

              <HStack space={3} w="100%" mt={4}>
                <Button
                  flex={1}
                  variant="primary"
                  size="lg"
                  title={isDeleting ? 'Deletando...' : 'Deletar Conta'}
                  onPress={handleDeleteAccount}
                  bgColor="red.500"
                  _pressed={{ bgColor: 'red.600' }}
                  isLoading={isDeleting}
                  isDisabled={isDeleting}
                />
                <Button
                  flex={1}
                  variant="primary"
                  size="lg"
                  title="Cancelar"
                  onPress={onDeleteClose}
                  borderColor="gray.300"
                  _text={{ color: 'gray.600' }}
                  isDisabled={isDeleting}
                />
              </HStack>
            </VStack>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
}
