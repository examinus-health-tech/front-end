import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { VStack, Box, Text, HStack, Actionsheet, useDisclose, Pressable, Input, Skeleton } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { HeaderTitle, TimeRangePicker, GoalCard, WeightStepChart } from '@components/molecules';
import type { TimeRange, WeightDataPoint } from '@components/molecules';
import { Button } from '@components/atoms';

// assets
import { WaterDropFilledIcon, WaterIcon } from '@assets/icons';

// hooks
import { useHome } from 'src/hooks/useHome';
import { useTabBar } from 'src/hooks/useTabBar';
import { useOnboarding } from 'src/hooks/useOnboarding';

// services
import { saveDailyLog, setHydrationGoal, getHydrationGoal, getDailyLogsHistory } from 'src/services/fitnessService';
import { calculateHydrationGoal } from 'src/services/goalCalculatorService';

// utils
import Toast from 'react-native-toast-message';

type ModalMode = 'water' | 'goal' | null;

type WaterAmount = {
  id: string;
  label: string;
  ml: number;
};

const waterAmounts: WaterAmount[] = [
  { id: 'small', label: 'Copo', ml: 200 },
  { id: 'medium', label: 'Garrafa P', ml: 350 },
  { id: 'large', label: 'Garrafa M', ml: 500 },
  { id: 'xlarge', label: 'Garrafa G', ml: 750 },
];

// Função auxiliar para obter dias baseado no range
const getDaysForRange = (range: TimeRange): number => {
  switch (range) {
    case '1d':
      return 1;
    case '1w':
      return 7;
    case '1m':
      return 30;
    case '1y':
      return 365;
    case 'all':
      return 365 * 2;
    default:
      return 7;
  }
};

// Constantes para animação do header
const HEADER_EXPANDED_HEIGHT = 290;
const HEADER_COLLAPSED_HEIGHT = 160;
const SCROLL_THRESHOLD = 120;

export function Hydration() {
  const [rangeSelected, setRangeSelected] = useState<TimeRange>('1w');
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [chartData, setChartData] = useState<WeightDataPoint[]>([]);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [goalInput, setGoalInput] = useState('');
  const [localHydrationGoal, setLocalHydrationGoal] = useState<number>(2000);
  const { isOpen, onOpen, onClose } = useDisclose();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  // Animated scroll value
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated style for header container
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
      Extrapolation.CLAMP,
    );

    return {
      height,
    };
  });

  // Animated style for expanded content (fades out)
  const expandedContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, SCROLL_THRESHOLD * 0.5], [1, 0], Extrapolation.CLAMP);

    const translateY = interpolate(scrollY.value, [0, SCROLL_THRESHOLD], [0, -20], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Animated style for collapsed content (fades in)
  const collapsedContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_THRESHOLD * 0.3, SCROLL_THRESHOLD * 0.7],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
    };
  });
  const { trackerData, refreshFitnessData } = useHome();
  const { hideTabBar, showTabBar } = useTabBar();
  const { personalData } = useOnboarding();

  // Calcula sugestão de hidratação baseada no peso
  const suggestedHydration = useMemo(() => {
    const profile = personalData as { weight?: number } | undefined;
    if (!profile?.weight) return null;
    return calculateHydrationGoal(profile.weight);
  }, [personalData]);

  const userWeight = useMemo(() => {
    const profile = personalData as { weight?: number } | undefined;
    return profile?.weight;
  }, [personalData]);

  // Hide tab bar, set status bar style and load hydration goal when screen is focused
  useFocusEffect(
    useCallback(() => {
      hideTabBar();
      setStatusBarStyle('light');

      // Carregar meta de hidratação salva
      async function loadHydrationGoal() {
        const savedGoal = await getHydrationGoal();
        if (savedGoal !== null) {
          setLocalHydrationGoal(savedGoal);
        }
      }
      loadHydrationGoal();

      return () => {
        showTabBar();
        setStatusBarStyle('dark');
      };
    }, [hideTabBar, showTabBar]),
  );

  // Dados do contexto
  const hydrationData = trackerData?.hydration?.[0];
  const hydrationGoal = localHydrationGoal;
  const hydrationCompleted = Number(hydrationData?.hydration_completed) || 0;
  // Converte copos para ml (cada copo = 250ml)
  const currentHydration = hydrationCompleted > 0 ? hydrationCompleted * 250 : 0;

  // Calcular porcentagem e restante
  const percentage = Math.min((currentHydration / hydrationGoal) * 100, 100);
  const remaining = Math.max(hydrationGoal - currentHydration, 0);

  // Busca dados históricos do gráfico
  useEffect(() => {
    async function fetchChartData() {
      setIsLoadingChart(true);
      try {
        const days = getDaysForRange(rangeSelected);
        const history = await getDailyLogsHistory(days);

        if (history.length > 0) {
          // Converte dados do backend para formato do gráfico
          const data = history.map((log) => ({
            value: log.waterMl || 0,
          }));
          setChartData(data);
        } else {
          // Se não houver histórico, mostra apenas o valor atual
          setChartData([{ value: currentHydration }]);
        }
      } catch (error) {
        console.error('Erro ao buscar histórico de hidratação:', error);
        // Fallback para valor atual em caso de erro
        setChartData([{ value: currentHydration }]);
      } finally {
        setIsLoadingChart(false);
      }
    }

    fetchChartData();
  }, [rangeSelected, currentHydration]);

  // Calcular média do período
  const averageHydration = useMemo(() => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, item) => acc + item.value, 0);
    return Math.round(sum / chartData.length);
  }, [chartData]);

  const handleAmountSelect = (amountId: string) => {
    setSelectedAmount(amountId);
  };

  const handleOpenWaterModal = () => {
    setModalMode('water');
    onOpen();
  };

  const handleOpenGoalModal = () => {
    setModalMode('goal');
    setGoalInput(localHydrationGoal.toString());
    onOpen();
  };

  const handleAddWater = async () => {
    if (!selectedAmount) return;

    const amount = waterAmounts.find((a) => a.id === selectedAmount);
    if (!amount) return;

    setIsSaving(true);
    try {
      // Calcula o novo total de água (atual + quantidade adicionada)
      const currentWaterMl = currentHydration;
      const newWaterMl = currentWaterMl + amount.ml;

      await saveDailyLog({
        date: new Date().toISOString().split('T')[0],
        waterMl: newWaterMl,
        waterGoalMl: hydrationGoal,
      });

      Toast.show({
        type: 'success',
        text1: 'Água registrada!',
        text2: `+${amount.ml}ml adicionados`,
      });

      // Atualiza os dados do contexto
      await refreshFitnessData();
    } catch (error: any) {
      console.error('Erro ao salvar hidratação:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar',
        text2: error.message || 'Tente novamente mais tarde',
      });
    } finally {
      setIsSaving(false);
    }

    // Reset e fechar
    setSelectedAmount(null);
    setModalMode(null);
    onClose();
  };

  const handleSaveGoal = async () => {
    if (!goalInput) return;

    const value = parseInt(goalInput, 10);
    if (isNaN(value) || value <= 0) return;

    setIsSaving(true);
    try {
      await setHydrationGoal(value);
      setLocalHydrationGoal(value);

      Toast.show({
        type: 'success',
        text1: 'Meta definida!',
        text2: `Meta de ${value.toLocaleString('pt-BR')}ml salva com sucesso`,
      });
    } catch (error: any) {
      console.error('Erro ao salvar meta:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar',
        text2: error.message || 'Tente novamente mais tarde',
      });
    } finally {
      setIsSaving(false);
    }

    // Reset e fechar
    setGoalInput('');
    setModalMode(null);
    onClose();
  };

  const handleCloseModal = () => {
    setSelectedAmount(null);
    setGoalInput('');
    setModalMode(null);
    onClose();
  };

  return (
    <VStack flex={1} bg="#F5F5F5">
      <StatusBar style="light" />
      {/* Header animado com fundo azul - posição absoluta */}
      <Animated.View style={[headerAnimatedStyle, { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }]}>
        <Box w="100%" h="100%" bg="blue.500" borderBottomRadius={36} pt={16} pb={6} overflow="hidden">
          <HeaderTitle withBackButton={() => navigation.navigate('tracker')} title="Hidratação" color="white" />

          {/* Conteúdo expandido (some ao scrollar) */}
          <Animated.View style={[expandedContentStyle, { position: 'absolute', top: 110, left: 24, right: 24 }]}>
            <HStack alignItems="center" space={2} mb={2}>
              <WaterDropFilledIcon size="18" color="#93C5FD" />
              <Text color="blue.200" fontFamily="Poligon" fontSize={14} fontWeight={500} letterSpacing={-0.14}>
                Você bebeu hoje
              </Text>
            </HStack>

            <HStack alignItems="flex-end">
              <Text color="white" fontFamily="Poligon" fontSize={64} fontWeight={800} letterSpacing={-0.64}>
                {currentHydration.toLocaleString('pt-BR')}
              </Text>
              <Text fontFamily="Poligon" fontSize={28} letterSpacing={-0.28} color="blue.200" mb={2}>
                ml
              </Text>
            </HStack>

            {/* Barra de progresso */}
            <Box w="100%" h={2} bg="blue.400" borderRadius={4} mt={1}>
              <Box w={`${percentage}%`} h={2} bg="white" borderRadius={4} />
            </Box>
            <HStack justifyContent="space-between" mt={1}>
              <Text color="blue.200" fontFamily="Poligon" fontSize={12} fontWeight={500}>
                {percentage.toFixed(0)}% da meta
              </Text>
              <Text color="blue.100" fontFamily="Poligon" fontSize={12} fontWeight={600}>
                Faltam {remaining.toLocaleString('pt-BR')}ml
              </Text>
            </HStack>
          </Animated.View>

          {/* Conteúdo colapsado (aparece ao scrollar) */}
          <Animated.View style={[collapsedContentStyle, { position: 'absolute', top: 100, left: 24, right: 24 }]}>
            <HStack alignItems="center" justifyContent="space-between">
              <HStack alignItems="center" space={3}>
                <WaterDropFilledIcon size="20" color="#93C5FD" />
                <VStack space={-1}>
                  <Text
                    color="white"
                    fontFamily="Poligon"
                    fontSize={28}
                    fontWeight={800}
                    letterSpacing={-0.28}
                    lineHeight={32}
                  >
                    {currentHydration.toLocaleString('pt-BR')} ml
                  </Text>
                  <Text color="blue.200" fontFamily="Poligon" fontSize={12} fontWeight={500}>
                    Meta: {hydrationGoal.toLocaleString('pt-BR')} ml
                  </Text>
                </VStack>
              </HStack>
            </HStack>
          </Animated.View>
        </Box>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: HEADER_EXPANDED_HEIGHT, flexGrow: 1 }}
        style={{ flex: 1 }}
      >
        {/* Conteúdo principal */}
        <VStack flex={1} mx={6} mt={4} pb={32} bg="#F5F5F5">
          {/* Cards de Meta e Consumo */}
          <HStack mt={2} justifyContent="space-between" space={4}>
            <Pressable flex={1} onPress={handleOpenGoalModal}>
              {({ isPressed }) => (
                <Box
                  bg="white"
                  rounded="2xl"
                  p={4}
                  borderWidth={2}
                  borderColor={isPressed ? 'blue.200' : 'transparent'}
                >
                  <Box size={12} background="#DBEAFE" rounded={12} alignItems="center" justifyContent="center">
                    <WaterIcon size="24" color="#3B82F6" />
                  </Box>
                  <Text
                    fontFamily="Poligon"
                    fontSize={28}
                    letterSpacing={-0.28}
                    fontWeight={800}
                    mt={4}
                    color="gray.900"
                  >
                    {hydrationGoal.toLocaleString('pt-BR')}{' '}
                    <Text color="gray.300" fontFamily="Poligon" fontSize={16} letterSpacing={-0.16} fontWeight={800}>
                      ml
                    </Text>
                  </Text>
                  <HStack alignItems="center" justifyContent="space-between">
                    <Text color="gray.300" fontFamily="Poligon" fontSize={14} letterSpacing={-0.14} fontWeight={500}>
                      Meta Diária
                    </Text>
                    <Text color="blue.500" fontFamily="Poligon" fontSize={12} fontWeight={700}>
                      Editar
                    </Text>
                  </HStack>
                </Box>
              )}
            </Pressable>
            <GoalCard
              icon={<WaterDropFilledIcon size="24" color="#0EA5E9" />}
              iconBgColor="#E0F2FE"
              value={averageHydration.toLocaleString('pt-BR')}
              unit="ml"
              label="Média do Período"
            />
          </HStack>

          {/* Seletor de período */}
          <Box mt={6}>
            <HStack justifyContent="space-between" alignItems="center" mb={4}>
              <Text fontFamily="Poligon" fontSize={16} fontWeight={800} letterSpacing={-0.16} color="gray.900">
                Histórico
              </Text>
            </HStack>
            <TimeRangePicker selected={rangeSelected} onSelect={setRangeSelected} />
          </Box>

          {/* Área do gráfico */}
          <Box mt={4}>
            {isLoadingChart ? (
              <Box h={200} justifyContent="center" alignItems="center">
                <Skeleton h={180} w="100%" borderRadius={16} startColor="gray.100" endColor="gray.200" />
              </Box>
            ) : chartData.length > 0 ? (
              <Animated.View entering={FadeIn.duration(300)}>
                <WeightStepChart
                  data={chartData}
                  unit="ml"
                  lineColor="#3B82F6"
                  gradientColor="#3B82F6"
                  indicatorColor="#3B82F6"
                />
              </Animated.View>
            ) : (
              <Box h={200} justifyContent="center" alignItems="center" bg="gray.50" borderRadius={16}>
                <Text fontFamily="Poligon" fontSize={14} color="gray.400">
                  Nenhum dado disponível
                </Text>
              </Box>
            )}
          </Box>

          {/* Legenda do gráfico */}
          <HStack mt={4} justifyContent="center" space={6}>
            <HStack alignItems="center" space={2}>
              <Box w={3} h={3} bg="blue.500" borderRadius={2} />
              <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="gray.500">
                Consumo
              </Text>
            </HStack>
            <HStack alignItems="center" space={2}>
              <Box
                w={3}
                h={3}
                bg="gray.300"
                borderRadius={2}
                borderWidth={1}
                borderColor="gray.400"
                borderStyle="dashed"
              />
              <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="gray.500">
                Meta ({(hydrationGoal / 1000).toFixed(1)}L)
              </Text>
            </HStack>
          </HStack>

          {/* Botão de adicionar */}
          <Box mt={8}>
            <Button
              title="Registrar Água"
              variant="primary"
              size="full"
              onPress={handleOpenWaterModal}
              bg="blue.500"
              _pressed={{ bg: 'blue.600' }}
            />
          </Box>

          {/* Dica de hidratação */}
          <Box mt={6} bg="blue.50" p={4} borderRadius={16}>
            <HStack alignItems="center" space={2} mb={2}>
              <WaterDropFilledIcon size="20" color="#3B82F6" />
              <Text fontFamily="Poligon" fontSize={14} fontWeight={700} color="blue.700">
                Dica de Hidratação
              </Text>
            </HStack>
            <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="blue.600">
              Beber água regularmente ao longo do dia é mais eficaz do que beber grandes quantidades de uma vez. Tente
              manter uma garrafa de água sempre por perto!
            </Text>
          </Box>
        </VStack>
      </Animated.ScrollView>

      {/* Modal de adicionar água / editar meta */}
      <Actionsheet isOpen={isOpen} onClose={handleCloseModal}>
        <Actionsheet.Content bg="white" borderTopRadius={24} px={6} pb={8}>
          {modalMode === 'water' ? (
            <>
              <Box w="100%" py={4}>
                <Text fontFamily="Poligon" fontSize={20} fontWeight={800} color="gray.900" textAlign="center">
                  Registrar Água
                </Text>
                <Text fontFamily="Poligon" fontSize={14} fontWeight={500} color="gray.400" textAlign="center" mt={1}>
                  Selecione a quantidade
                </Text>
              </Box>

              {/* Opções de quantidade */}
              <HStack w="100%" justifyContent="space-between" mt={4}>
                {waterAmounts.map((amount) => (
                  <Pressable key={amount.id} onPress={() => handleAmountSelect(amount.id)} flex={1} mx={1}>
                    <VStack
                      alignItems="center"
                      p={3}
                      borderRadius={16}
                      borderWidth={2}
                      borderColor={selectedAmount === amount.id ? '#3B82F6' : 'transparent'}
                      bg={selectedAmount === amount.id ? '#DBEAFE' : 'gray.50'}
                    >
                      <Box
                        size={10}
                        bg={selectedAmount === amount.id ? '#93C5FD' : 'gray.200'}
                        borderRadius={20}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <WaterDropFilledIcon size="20" color={selectedAmount === amount.id ? '#3B82F6' : '#9CA3AF'} />
                      </Box>
                      <Text
                        fontFamily="Poligon"
                        fontSize={14}
                        fontWeight={700}
                        color={selectedAmount === amount.id ? 'blue.600' : 'gray.700'}
                        mt={2}
                      >
                        {amount.ml}ml
                      </Text>
                      <Text
                        fontFamily="Poligon"
                        fontSize={12}
                        fontWeight={500}
                        color={selectedAmount === amount.id ? 'blue.500' : 'gray.500'}
                      >
                        {amount.label}
                      </Text>
                    </VStack>
                  </Pressable>
                ))}
              </HStack>

              {/* Botões de ação */}
              <HStack w="100%" mt={6} space={4}>
                <Button title="Cancelar" variant="secondary" size="full" flex={1} onPress={handleCloseModal} />
                <Button
                  title={isSaving ? 'Salvando...' : 'Adicionar'}
                  variant="primary"
                  size="full"
                  flex={1}
                  onPress={handleAddWater}
                  isDisabled={!selectedAmount || isSaving}
                  isLoading={isSaving}
                />
              </HStack>
            </>
          ) : modalMode === 'goal' ? (
            <>
              <Box w="100%" py={4}>
                <Text fontFamily="Poligon" fontSize={20} fontWeight={800} color="gray.900" textAlign="center">
                  Definir Meta
                </Text>
                <Text fontFamily="Poligon" fontSize={14} fontWeight={500} color="gray.400" textAlign="center" mt={1}>
                  Defina sua meta diária de hidratação
                </Text>
              </Box>

              {/* Input de meta */}
              <VStack w="100%" mt={4}>
                <Input
                  value={goalInput}
                  onChangeText={setGoalInput}
                  placeholder="Ex: 2000"
                  keyboardType="number-pad"
                  fontFamily="Poligon"
                  fontSize={32}
                  fontWeight={800}
                  textAlign="center"
                  py={4}
                  px={4}
                  borderRadius={16}
                  borderColor="gray.200"
                  bg="gray.50"
                  _focus={{
                    borderColor: 'blue.400',
                    bg: 'white',
                  }}
                  InputRightElement={
                    <Text fontFamily="Poligon" fontSize={20} fontWeight={600} color="gray.400" mr={4}>
                      ml
                    </Text>
                  }
                />
              </VStack>

              {/* Sugestão baseada no peso */}
              {suggestedHydration && userWeight && (
                <Pressable w="100%" mt={3} onPress={() => setGoalInput(suggestedHydration.toString())}>
                  <Box bg="blue.50" p={3} borderRadius={12}>
                    <HStack alignItems="center" space={2}>
                      <Box bg="blue.100" p={1.5} borderRadius={8}>
                        <WaterDropFilledIcon size="16" color="#3B82F6" />
                      </Box>
                      <VStack flex={1}>
                        <Text fontFamily="Poligon" fontSize={13} fontWeight={600} color="blue.700">
                          Sugerido: {suggestedHydration.toLocaleString('pt-BR')}ml
                        </Text>
                        <Text fontFamily="Poligon" fontSize={11} fontWeight={500} color="blue.500">
                          35ml × {userWeight}kg
                        </Text>
                      </VStack>
                      <Text fontFamily="Poligon" fontSize={12} fontWeight={700} color="blue.600">
                        Usar
                      </Text>
                    </HStack>
                  </Box>
                </Pressable>
              )}

              {/* Atalhos rápidos para ajuste */}
              <HStack w="100%" justifyContent="center" mt={4} space={2}>
                {[1500, 2000, 2500, 3000].map((preset) => (
                  <Pressable
                    key={preset}
                    onPress={() => setGoalInput(preset.toString())}
                    px={4}
                    py={2}
                    bg={goalInput === preset.toString() ? 'blue.100' : 'gray.100'}
                    borderRadius={8}
                  >
                    <Text
                      fontFamily="Poligon"
                      fontSize={14}
                      fontWeight={600}
                      color={goalInput === preset.toString() ? 'blue.600' : 'gray.600'}
                    >
                      {(preset / 1000).toFixed(1)}L
                    </Text>
                  </Pressable>
                ))}
              </HStack>

              {/* Botões de ação */}
              <HStack w="100%" mt={6} space={4}>
                <Button title="Cancelar" variant="secondary" size="full" flex={1} onPress={handleCloseModal} />
                <Button
                  title={isSaving ? 'Salvando...' : 'Salvar'}
                  variant="primary"
                  size="full"
                  flex={1}
                  onPress={handleSaveGoal}
                  isDisabled={!goalInput || parseInt(goalInput, 10) <= 0 || isSaving}
                  isLoading={isSaving}
                />
              </HStack>
            </>
          ) : null}
        </Actionsheet.Content>
      </Actionsheet>
    </VStack>
  );
}
