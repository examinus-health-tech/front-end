import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Keyboard } from 'react-native';
import { VStack, Box, Text, HStack, Input, Pressable, Skeleton } from 'native-base';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  FadeIn,
} from 'react-native-reanimated';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { HeaderTitle, TimeRangePicker, GoalCard, WeightStepChart } from '@components/molecules';
import type { TimeRange, WeightDataPoint } from '@components/molecules';
import { Button } from '@components/atoms';

// assets
import { CoffeeIcon, DinnerIcon, SunIcon, AppleIcon } from '@assets/icons';

// hooks
import { useHome } from 'src/hooks/useHome';
import { useTabBar } from 'src/hooks/useTabBar';

// services
import { saveDailyLog, setCaloriesGoal, getCaloriesGoal, getDailyLogsHistory } from 'src/services/fitnessService';

// utils
import Toast from 'react-native-toast-message';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

type MealOption = {
  id: MealType;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
};

const mealOptions: MealOption[] = [
  {
    id: 'breakfast',
    label: 'Café da Manhã',
    icon: <CoffeeIcon size="24" color="#F97316" />,
    color: '#F97316',
    bgColor: '#FFF7ED',
  },
  {
    id: 'lunch',
    label: 'Almoço',
    icon: <SunIcon size="24" color="#22C55E" />,
    color: '#22C55E',
    bgColor: '#F0FDF4',
  },
  {
    id: 'dinner',
    label: 'Jantar',
    icon: <DinnerIcon size="24" color="#8B5CF6" />,
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
  },
  {
    id: 'snack',
    label: 'Lanche',
    icon: <AppleIcon size="24" color="#EC4899" />,
    color: '#EC4899',
    bgColor: '#FDF2F8',
  },
];

// Constantes para animação do header
const HEADER_EXPANDED_HEIGHT = 320;
const HEADER_COLLAPSED_HEIGHT = 180;
const SCROLL_THRESHOLD = 120;

export function Nutrition() {
  const [rangeSelected, setRangeSelected] = useState<TimeRange>('1w');
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
  const [caloriesInput, setCaloriesInput] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [localCaloriesGoal, setLocalCaloriesGoal] = useState<number>(2000);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [chartData, setChartData] = useState<WeightDataPoint[]>([]);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { trackerData, refreshFitnessData } = useHome();
  const { hideTabBar, showTabBar } = useTabBar();
  const insets = useSafeAreaInsets();

  // Bottom sheet refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const goalSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['65%'], []);
  const goalSnapPoints = useMemo(() => ['45%'], []);

  const handleOpenSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseSheet = useCallback(() => {
    Keyboard.dismiss();
    bottomSheetRef.current?.close();
  }, []);

  const handleOpenGoalSheet = useCallback(() => {
    setGoalInput(localCaloriesGoal.toString());
    setIsEditingGoal(true);
    goalSheetRef.current?.expand();
  }, [localCaloriesGoal]);

  const handleCloseGoalSheet = useCallback(() => {
    Keyboard.dismiss();
    setIsEditingGoal(false);
    setGoalInput('');
    goalSheetRef.current?.close();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        style={[props.style, { zIndex: 100 }]}
      />
    ),
    []
  );

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
      Extrapolation.CLAMP
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
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  // Hide tab bar, set status bar style and load calories goal when screen is focused
  useFocusEffect(
    useCallback(() => {
      hideTabBar();
      setStatusBarStyle('light');

      // Carregar meta de calorias salva
      async function loadCaloriesGoal() {
        const savedGoal = await getCaloriesGoal();
        if (savedGoal !== null) {
          setLocalCaloriesGoal(savedGoal);
        }
      }
      loadCaloriesGoal();

      return () => {
        showTabBar();
        setStatusBarStyle('dark');
      };
    }, [hideTabBar, showTabBar])
  );

  // Dados do contexto
  const nutritionData = trackerData?.nutrition?.[0];

  // Calcular total de calorias ingeridas hoje
  const todayCalories = useMemo(() => {
    if (!nutritionData?.nutrition_completed) return 0;
    if (Array.isArray(nutritionData.nutrition_completed)) {
      return nutritionData.nutrition_completed.reduce((total: number, item: { kcal?: number }) => {
        return total + (Number(item.kcal) || 0);
      }, 0);
    }
    return Number(nutritionData.nutrition_completed) || 0;
  }, [nutritionData]);

  // Calcular porcentagem
  const percentage = Math.min((todayCalories / localCaloriesGoal) * 100, 100);
  const isOverGoal = todayCalories > localCaloriesGoal;

  // Helper para converter range em dias
  const getDaysForRange = (range: TimeRange): number => {
    switch (range) {
      case '1d': return 1;
      case '1w': return 7;
      case '1m': return 30;
      case '1y': return 365;
      case 'all': return 365;
      default: return 7;
    }
  };

  // Busca dados do gráfico da API
  useEffect(() => {
    async function fetchChartData() {
      setIsLoadingChart(true);
      try {
        const days = getDaysForRange(rangeSelected);
        const history = await getDailyLogsHistory(days);

        if (history.length > 0) {
          // Converte logs para formato do gráfico (caloriesConsumed)
          const data = history.map(log => ({
            value: log.caloriesConsumed || 0,
          }));
          setChartData(data);
        } else {
          // Se não há dados, mostra apenas o valor atual
          setChartData([{ value: todayCalories }]);
        }
      } catch (error) {
        console.error('Erro ao buscar histórico de nutrição:', error);
        setChartData([{ value: todayCalories }]);
      } finally {
        setIsLoadingChart(false);
      }
    }

    fetchChartData();
  }, [rangeSelected, todayCalories]);

  const handleMealSelect = (mealId: MealType) => {
    setSelectedMeal(mealId);
  };

  const handleAddCalories = async () => {
    if (!selectedMeal || !caloriesInput) return;

    const calories = parseInt(caloriesInput, 10);
    if (isNaN(calories) || calories <= 0) return;

    const mealLabel = mealOptions.find(m => m.id === selectedMeal)?.label || 'Refeição';

    // Reset e fechar primeiro
    setSelectedMeal(null);
    setCaloriesInput('');
    handleCloseSheet();

    setIsSaving(true);
    try {
      // Calcula o novo total de calorias consumidas (atual + quantidade adicionada)
      const currentCaloriesConsumed = todayCalories;
      const newCaloriesConsumed = currentCaloriesConsumed + calories;

      await saveDailyLog({
        date: new Date().toISOString().split('T')[0],
        caloriesConsumed: newCaloriesConsumed,
        caloriesGoal: localCaloriesGoal,
      });

      Toast.show({
        type: 'success',
        text1: 'Refeição registrada!',
        text2: `${mealLabel}: +${calories} kcal`,
      });

      // Atualiza os dados do contexto
      await refreshFitnessData();
    } catch (error: any) {
      console.error('Erro ao salvar nutrição:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar',
        text2: error.message || 'Tente novamente mais tarde',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedMeal(null);
    setCaloriesInput('');
    handleCloseSheet();
  };

  const handleSaveGoal = async () => {
    if (!goalInput) return;

    const value = parseInt(goalInput, 10);
    if (isNaN(value) || value <= 0) return;

    // Fecha o sheet primeiro para melhor UX
    handleCloseGoalSheet();

    setIsSaving(true);
    try {
      await setCaloriesGoal(value);
      setLocalCaloriesGoal(value);

      Toast.show({
        type: 'success',
        text1: 'Meta definida!',
        text2: `Meta de ${value.toLocaleString('pt-BR')} kcal salva`,
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
  };

  return (
    <VStack flex={1} bg="#F5F5F5">
      <StatusBar style="light" />
      {/* Header animado com fundo laranja - posição absoluta */}
      <Animated.View style={[headerAnimatedStyle, { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }]}>
        <Box w="100%" h="100%" bg="orange.400" borderBottomRadius={36} pt={16} pb={6} overflow="hidden">
          <HeaderTitle withBackButton={() => navigation.navigate('tracker')} title="Nutrição" color="white" />

          {/* Conteúdo expandido (some ao scrollar) */}
          <Animated.View style={[expandedContentStyle, { position: 'absolute', top: 120, left: 24, right: 24 }]}>
            <Text color="white" fontFamily="Poligon" fontSize={16} fontWeight={500} mb={3} letterSpacing={-0.16}>
              Calorias Ingeridas Hoje
            </Text>
            <HStack alignItems="flex-end">
              <Text color="white" fontFamily="Poligon" fontSize={72} fontWeight={800} letterSpacing={-0.72}>
                {todayCalories.toLocaleString('pt-BR')}
              </Text>
              <Text fontFamily="Poligon" fontSize={36} letterSpacing={-0.36} color="orange.200" mb={3}>
                kcal
              </Text>
            </HStack>

            {/* Barra de progresso */}
            <Box w="100%" h={2} bg="orange.300" borderRadius={4} mt={2}>
              <Box w={`${percentage}%`} h={2} bg={isOverGoal ? 'red.400' : 'white'} borderRadius={4} />
            </Box>
            <Text color="orange.100" fontFamily="Poligon" fontSize={12} fontWeight={500} mt={1}>
              {percentage.toFixed(0)}% da meta diária
            </Text>
          </Animated.View>

          {/* Conteúdo colapsado (aparece ao scrollar) */}
          <Animated.View style={[collapsedContentStyle, { position: 'absolute', top: 100, left: 24, right: 24 }]}>
            <HStack alignItems="center" justifyContent="space-between">
              <VStack>
                <Text color="white" fontFamily="Poligon" fontSize={28} fontWeight={800} letterSpacing={-0.28}>
                  {todayCalories.toLocaleString('pt-BR')} kcal
                </Text>
                <Text color="orange.100" fontFamily="Poligon" fontSize={12} fontWeight={500}>
                  Meta: {localCaloriesGoal.toLocaleString('pt-BR')} kcal ({percentage.toFixed(0)}%)
                </Text>
              </VStack>
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
            <Pressable flex={1} onPress={handleOpenGoalSheet}>
              <Box bg="white" rounded="2xl" p={4} borderWidth={2} borderColor="transparent" _pressed={{ borderColor: 'orange.200' }}>
                <Box size={12} background="#FFF7ED" rounded={12} alignItems="center" justifyContent="center">
                  <AppleIcon size="24" color="#F97316" />
                </Box>
                <Text fontFamily="Poligon" fontSize={28} letterSpacing={-0.28} fontWeight={800} mt={4} color="gray.900">
                  {localCaloriesGoal.toLocaleString('pt-BR')}{' '}
                  <Text color="gray.300" fontFamily="Poligon" fontSize={16} letterSpacing={-0.16} fontWeight={800}>
                    kcal
                  </Text>
                </Text>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text color="gray.300" fontFamily="Poligon" fontSize={14} letterSpacing={-0.14} fontWeight={500}>
                    Meta Diária
                  </Text>
                  <Text color="orange.400" fontFamily="Poligon" fontSize={12} fontWeight={700}>
                    Editar
                  </Text>
                </HStack>
              </Box>
            </Pressable>
            <GoalCard
              icon={<AppleIcon size="24" color={isOverGoal ? '#EF4444' : '#22C55E'} />}
              iconBgColor={isOverGoal ? '#FEF2F2' : '#F0FDF4'}
              value={todayCalories.toLocaleString('pt-BR')}
              unit="kcal"
              label="Consumo Hoje"
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
              <Box bg="white" rounded="2xl" p={4} h={200}>
                <Skeleton h={4} w="30%" mb={4} rounded="md" />
                <Skeleton h={120} w="100%" rounded="md" />
                <Skeleton h={4} w="50%" mt={4} rounded="md" alignSelf="center" />
              </Box>
            ) : (
              <Animated.View entering={FadeIn.duration(400)}>
                <WeightStepChart
                  data={chartData}
                  unit="kcal"
                  lineColor="#F97316"
                  gradientColor="#F97316"
                  indicatorColor="#F97316"
                  goalValue={localCaloriesGoal}
                  goalLineColor="#9CA3AF"
                />
              </Animated.View>
            )}
          </Box>

          {/* Legenda do gráfico */}
          <HStack mt={4} justifyContent="center" space={6}>
            <HStack alignItems="center" space={2}>
              <Box w={3} h={3} bg="orange.400" borderRadius={2} />
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
                Meta ({localCaloriesGoal} kcal)
              </Text>
            </HStack>
          </HStack>

          {/* Botão de adicionar */}
          <Box mt={8}>
            <Button title="Adicionar Refeição" variant="primary" size="full" onPress={handleOpenSheet} />
          </Box>
        </VStack>
      </Animated.ScrollView>

      {/* Modal de adicionar refeição */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        topInset={insets.top + 50}
        handleIndicatorStyle={{ backgroundColor: '#D1D5DB', width: 40 }}
        backgroundStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
        containerStyle={{ zIndex: 100 }}
      >
        <BottomSheetView style={{ paddingHorizontal: 24 }}>
          <Box w="100%" py={4}>
            <Text fontFamily="Poligon" fontSize={20} fontWeight={800} color="gray.900" textAlign="center">
              Adicionar Refeição
            </Text>
            <Text fontFamily="Poligon" fontSize={14} fontWeight={500} color="gray.400" textAlign="center" mt={1}>
              Selecione o tipo e informe as calorias
            </Text>
          </Box>

          {/* Opções de refeição - Grid 2x2 */}
          <VStack w="100%" mt={4} space={3}>
            <HStack justifyContent="space-between" space={3}>
              {mealOptions.slice(0, 2).map((meal) => (
                <Pressable key={meal.id} onPress={() => handleMealSelect(meal.id)} flex={1}>
                  <HStack
                    alignItems="center"
                    p={3}
                    borderRadius={16}
                    borderWidth={2}
                    borderColor={selectedMeal === meal.id ? meal.color : 'transparent'}
                    bg={selectedMeal === meal.id ? meal.bgColor : 'gray.50'}
                    space={3}
                  >
                    <Box size={10} bg={meal.bgColor} borderRadius={10} alignItems="center" justifyContent="center">
                      {meal.icon}
                    </Box>
                    <Text
                      fontFamily="Poligon"
                      fontSize={14}
                      fontWeight={600}
                      color={selectedMeal === meal.id ? meal.color : 'gray.600'}
                      numberOfLines={1}
                      flexShrink={1}
                    >
                      {meal.label}
                    </Text>
                  </HStack>
                </Pressable>
              ))}
            </HStack>
            <HStack justifyContent="space-between" space={3}>
              {mealOptions.slice(2, 4).map((meal) => (
                <Pressable key={meal.id} onPress={() => handleMealSelect(meal.id)} flex={1}>
                  <HStack
                    alignItems="center"
                    p={3}
                    borderRadius={16}
                    borderWidth={2}
                    borderColor={selectedMeal === meal.id ? meal.color : 'transparent'}
                    bg={selectedMeal === meal.id ? meal.bgColor : 'gray.50'}
                    space={3}
                  >
                    <Box size={10} bg={meal.bgColor} borderRadius={10} alignItems="center" justifyContent="center">
                      {meal.icon}
                    </Box>
                    <Text
                      fontFamily="Poligon"
                      fontSize={14}
                      fontWeight={600}
                      color={selectedMeal === meal.id ? meal.color : 'gray.600'}
                      numberOfLines={1}
                      flexShrink={1}
                    >
                      {meal.label}
                    </Text>
                  </HStack>
                </Pressable>
              ))}
            </HStack>
          </VStack>

          {/* Input de calorias */}
          <VStack w="100%" mt={6}>
            <Text fontFamily="Poligon" fontSize={14} fontWeight={600} color="gray.700" mb={2}>
              Calorias consumidas
            </Text>
            <HStack
              alignItems="center"
              bg="#F9FAFB"
              borderRadius={12}
              borderWidth={1}
              borderColor="#E5E7EB"
              px={4}
              py={3}
            >
              <BottomSheetTextInput
                value={caloriesInput}
                onChangeText={setCaloriesInput}
                placeholder="Ex: 450"
                keyboardType="numeric"
                style={{
                  flex: 1,
                  fontFamily: 'Poligon',
                  fontSize: 16,
                  color: '#111827',
                }}
                placeholderTextColor="#9CA3AF"
              />
              <Text fontFamily="Poligon" fontSize={14} fontWeight={500} color="gray.400">
                kcal
              </Text>
            </HStack>
          </VStack>

          {/* Botões de ação */}
          <HStack w="100%" mt={6} space={4}>
            <Button title="Cancelar" variant="secondary" size="full" flex={1} onPress={handleCloseModal} />
            <Button
              title={isSaving ? "Salvando..." : "Adicionar"}
              variant="primary"
              size="full"
              flex={1}
              onPress={handleAddCalories}
              isDisabled={!selectedMeal || !caloriesInput || isSaving}
              isLoading={isSaving}
            />
          </HStack>
        </BottomSheetView>
      </BottomSheet>

      {/* Modal de editar meta */}
      <BottomSheet
        ref={goalSheetRef}
        index={-1}
        snapPoints={goalSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        topInset={insets.top + 50}
        handleIndicatorStyle={{ backgroundColor: '#D1D5DB', width: 40 }}
        backgroundStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
        containerStyle={{ zIndex: 100 }}
      >
        <BottomSheetView style={{ paddingHorizontal: 24 }}>
          <Box w="100%" py={4}>
            <Text fontFamily="Poligon" fontSize={20} fontWeight={800} color="gray.900" textAlign="center">
              Definir Meta Diária
            </Text>
            <Text fontFamily="Poligon" fontSize={14} fontWeight={500} color="gray.400" textAlign="center" mt={1}>
              Quantas calorias você deseja consumir por dia?
            </Text>
          </Box>

          {/* Input de meta */}
          <VStack w="100%" mt={4}>
            <HStack
              alignItems="center"
              bg="#F9FAFB"
              borderRadius={12}
              borderWidth={1}
              borderColor="#E5E7EB"
              px={4}
              py={3}
            >
              <BottomSheetTextInput
                value={goalInput}
                onChangeText={setGoalInput}
                placeholder="Ex: 2000"
                keyboardType="numeric"
                style={{
                  flex: 1,
                  fontFamily: 'Poligon',
                  fontSize: 24,
                  fontWeight: '700',
                  textAlign: 'center',
                  color: '#111827',
                }}
                placeholderTextColor="#9CA3AF"
              />
              <Text fontFamily="Poligon" fontSize={16} fontWeight={500} color="gray.400">
                kcal
              </Text>
            </HStack>
          </VStack>

          {/* Atalhos rápidos */}
          <HStack w="100%" justifyContent="center" mt={4} space={2}>
            {[1500, 2000, 2500, 3000].map((value) => (
              <Pressable
                key={value}
                onPress={() => setGoalInput(value.toString())}
                px={3}
                py={2}
                bg={goalInput === value.toString() ? 'orange.100' : 'gray.100'}
                borderRadius={8}
                borderWidth={1}
                borderColor={goalInput === value.toString() ? 'orange.300' : 'transparent'}
              >
                <Text fontFamily="Poligon" fontSize={12} fontWeight={600} color={goalInput === value.toString() ? 'orange.600' : 'gray.600'}>
                  {value}
                </Text>
              </Pressable>
            ))}
          </HStack>

          {/* Botões de ação */}
          <HStack w="100%" mt={6} space={4}>
            <Button title="Cancelar" variant="secondary" size="full" flex={1} onPress={handleCloseGoalSheet} />
            <Button
              title={isSaving ? "Salvando..." : "Salvar"}
              variant="primary"
              size="full"
              flex={1}
              onPress={handleSaveGoal}
              isDisabled={!goalInput || parseInt(goalInput, 10) <= 0 || isSaving}
              isLoading={isSaving}
            />
          </HStack>
        </BottomSheetView>
      </BottomSheet>
    </VStack>
  );
}
