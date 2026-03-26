import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { VStack, ScrollView, IScrollViewProps, Box, Flex, Text, Image, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Platform } from 'react-native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { FitnessCard } from '@components/molecules/FitnessCard';
import { Progress } from '@components/molecules/Progress/progress';
import { HeaderTitle, SmartSuggestionCard, DailyAnalysisCard } from '@components/molecules';

// assets
import Vector from '@assets/png/vector-12.png';
import { HeartIcon } from '@assets/icons';

// hooks
import { useHome } from 'src/hooks/useHome';
import { useOnboarding } from 'src/hooks/useOnboarding';

// services
import { generateSuggestions, GoalSuggestion } from 'src/services/goalCalculatorService';
import { setHydrationGoal, getHydrationGoal, setCaloriesGoal, getCaloriesGoal, setStepsGoal, getStepsGoal } from 'src/services/fitnessService';
import type { DailyFitnessData } from 'src/services/dailyAnalysisService';

// utils
import Toast from 'react-native-toast-message';

export function Tracker() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { trackerData, refreshFitnessData } = useHome();
  const { personalData } = useOnboarding();

  // Estados para metas locais
  const [currentGoals, setCurrentGoals] = useState({
    hydration: 2000,
    calories: 2000,
    steps: 10000,
  });

  // Carrega metas salvas
  useEffect(() => {
    async function loadGoals() {
      const [hydrationGoal, caloriesGoal, stepsGoalLocal] = await Promise.all([
        getHydrationGoal(),
        getCaloriesGoal(),
        getStepsGoal(),
      ]);
      setCurrentGoals(prev => ({
        ...prev,
        hydration: hydrationGoal || 2000,
        calories: caloriesGoal || 2000,
        // Prioriza meta local, senão usa do backend
        steps: stepsGoalLocal || Number(trackerData?.step?.[0]?.step_goal) || 10000,
      }));
    }
    loadGoals();
  }, []);

  // Dados do contexto
  const stepsCompleted = Number(trackerData?.step?.[0]?.step_completed) || 0;
  const stepsGoal = Number(trackerData?.step?.[0]?.step_goal) || 10000;
  const weightCompleted = Number(trackerData?.weight?.[0]?.weight_completed) || 0;
  const kcalBurned = Number(trackerData?.kcal?.[0]?.kcal_completed) || 0;
  const sleepCompleted = Number(trackerData?.sleep?.[0]?.sleep_completed) || 0;
  const hydrationCompleted = Number(trackerData?.hydration?.[0]?.hydration_completed) || 0;

  // Calorias consumidas (nutrição) - pode ser número ou array
  const nutritionData = trackerData?.nutrition?.[0]?.nutrition_completed;
  const nutritionCompleted = typeof nutritionData === 'number'
    ? nutritionData
    : Array.isArray(nutritionData)
      ? nutritionData.reduce((acc: number, item: any) => acc + (Number(item.kcal) || 0), 0)
      : 0;

  // Calcula progresso dos passos
  const stepsProgress = stepsGoal > 0 ? Math.min(Math.round((stepsCompleted / stepsGoal) * 100), 100) : 0;

  // Gera sugestões baseadas no perfil do usuário
  const suggestions = useMemo(() => {
    const profile = personalData as {
      weight?: number;
      height?: number;
      age?: number;
      gender?: string;
      workoutLevel?: number;
    } | undefined;

    if (!profile?.weight) return [];

    return generateSuggestions(
      {
        weight: profile.weight,
        height: profile.height,
        age: profile.age,
        gender: profile.gender as 'M' | 'F',
        workoutLevel: profile.workoutLevel,
      },
      currentGoals
    );
  }, [personalData, currentGoals]);

  // Aplica sugestão
  const handleApplySuggestion = useCallback(async (suggestion: GoalSuggestion) => {
    try {
      switch (suggestion.type) {
        case 'hydration':
          await setHydrationGoal(suggestion.suggestedGoal);
          setCurrentGoals(prev => ({ ...prev, hydration: suggestion.suggestedGoal }));
          break;
        case 'calories':
          await setCaloriesGoal(suggestion.suggestedGoal);
          setCurrentGoals(prev => ({ ...prev, calories: suggestion.suggestedGoal }));
          break;
        case 'steps':
          await setStepsGoal(suggestion.suggestedGoal);
          setCurrentGoals(prev => ({ ...prev, steps: suggestion.suggestedGoal }));
          break;
      }

      Toast.show({
        type: 'success',
        text1: 'Meta atualizada!',
        text2: `Nova meta de ${suggestion.type === 'hydration' ? 'hidratação' : suggestion.type === 'calories' ? 'calorias' : 'passos'} aplicada`,
      });

      // Atualiza dados se necessário
      await refreshFitnessData();
    } catch (error) {
      console.error('Erro ao aplicar sugestão:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível aplicar a sugestão',
      });
    }
  }, [refreshFitnessData]);

  // Mensagem motivacional baseada no progresso
  const getStepsMessage = () => {
    if (stepsCompleted === 0) return 'Comece a se movimentar hoje!';
    if (stepsProgress >= 100) return 'Parabéns! Você atingiu sua meta!';
    if (stepsProgress >= 50) return 'Você está dando mais passos do que o normal. Isso aí!';
    return 'Continue assim, você está no caminho certo!';
  };

  // Dados para análise diária
  const dailyFitnessData: DailyFitnessData = useMemo(() => ({
    steps: stepsCompleted,
    stepsGoal: currentGoals.steps,
    caloriesBurned: kcalBurned,
    caloriesConsumed: nutritionCompleted,
    caloriesGoal: currentGoals.calories,
    hydrationMl: hydrationCompleted * 250, // copos para ml
    hydrationGoalMl: currentGoals.hydration,
    sleepHours: sleepCompleted,
    sleepGoalHours: 8,
    weight: weightCompleted > 0 ? weightCompleted : null,
    weightGoal: null,
  }), [stepsCompleted, currentGoals, kcalBurned, nutritionCompleted, hydrationCompleted, sleepCompleted, weightCompleted]);

  // Nome da fonte de dados de saúde baseado na plataforma
  const DISABLE_HEALTH_SOURCE_INDICATORS = false;
  const healthSourceName = Platform.OS === 'ios' ? 'Apple Health' : 'Health Connect';
  const healthSourceColor = Platform.OS === 'ios' ? '#FF2D55' : '#4285F4';

  return (
    <VStack flex={1} py={16} testID="screen-tracker">
      <HeaderTitle withBackButton={() => navigation.navigate('homepage')} title="Rastreador Fitness" />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack flex={1} mx={6} mt={2} pb={32}>
          {/* Indicador de fonte de dados - HealthKit/Health Connect */}
          {!DISABLE_HEALTH_SOURCE_INDICATORS && (
            <HStack
              bg="gray.50"
              px={3}
              py={2}
              mb={4}
              borderRadius={8}
              alignItems="center"
              space={2}
            >
              <HeartIcon size="16" color={healthSourceColor} />
              <Text
                color="gray.600"
                fontFamily="Poligon"
                fontSize={12}
                fontWeight={500}
              >
                Dados sincronizados com {healthSourceName}
              </Text>
            </HStack>
          )}
          {/* Card principal de Passos */}
          <TouchableOpacity onPress={() => navigation.navigate('steps')}>
            <Box bg="ciano.300" rounded="2xl" h={206} position="relative">
              <Image
                source={Vector}
                defaultSource={Vector}
                alt="Vetor"
                resizeMode="contain"
                position="absolute"
                bottom={0}
                right={-16}
                h="100%"
              />

              {/* Badge indicando fonte de dados */}
              {!DISABLE_HEALTH_SOURCE_INDICATORS && (
                <HStack
                  position="absolute"
                  top={3}
                  right={3}
                  bg="rgba(255,255,255,0.2)"
                  px={2}
                  py={1}
                  borderRadius={6}
                  alignItems="center"
                  space={1}
                >
                  <HeartIcon size="12" color="#FFFFFF" />
                  <Text color="white" fontFamily="Poligon" fontSize={10} fontWeight={600}>
                    {healthSourceName}
                  </Text>
                </HStack>
              )}

              <Flex p={6}>
                <Text color="white" fontFamily="Poligon" fontSize={16} fontWeight={800} letterSpacing={-0.16} mb={3}>
                  Passos
                </Text>

                <Text color="white" fontFamily="Poligon" fontSize={36} fontWeight={800} lineHeight={44} letterSpacing={-1.44} mb={2}>
                  {stepsCompleted.toLocaleString('pt-BR')}
                </Text>

                <Progress value={stepsProgress} sizeW={60} bgColor="ciano.700" filledColor="ciano.50" />

                <Text color="white" fontFamily="Poligon" fontSize={14} fontWeight={500} lineHeight={22.4} letterSpacing={0} w={200} mt={4}>
                  {getStepsMessage()}
                </Text>
              </Flex>
            </Box>
          </TouchableOpacity>

          {/* Card de Sugestões Inteligentes */}
          {(personalData as { weight?: number } | undefined)?.weight && (
            <Box mt={4}>
              <Text fontFamily="Poligon" fontSize={16} fontWeight={700} color="gray.900" mb={3}>
                Sugestões para Você
              </Text>
              <SmartSuggestionCard
                suggestions={suggestions}
                onApply={handleApplySuggestion}
                onConfigure={() => navigation.navigate('smartGoals')}
                showEmptyState
              />
            </Box>
          )}

          {/* Linha 1: Peso e Nutrição */}
          <HStack flex={1} mt={6} space={4} alignItems="center" justifyContent="space-between">
            <FitnessCard
              title="Peso"
              value={weightCompleted > 0 ? weightCompleted.toString() : '--'}
              unit="kg"
              variant="weight"
              goTo={() => navigation.navigate('weight')}
            />
            <FitnessCard
              title="Nutrição"
              value={nutritionCompleted > 0 ? nutritionCompleted.toLocaleString('pt-BR') : '--'}
              unit="kcal"
              variant="nutrition"
              goTo={() => navigation.navigate('nutrition')}
            />
          </HStack>

          {/* Linha 2: Calorias e Sono */}
          <HStack flex={1} mt={4} space={4} alignItems="center" justifyContent="space-between">
            <FitnessCard
              title="Calorias Gastas"
              value={kcalBurned > 0 ? kcalBurned.toLocaleString('pt-BR') : '--'}
              unit="kcal"
              variant="calories"
              goTo={() => navigation.navigate('calories')}
            />
            <FitnessCard
              title="Sono"
              value={sleepCompleted > 0 ? sleepCompleted.toString() : '--'}
              unit="h"
              variant="sleep-grid"
              goTo={() => navigation.navigate('sleep')}
            />
          </HStack>

          {/* Linha 3: Hidratação */}
          <Box mt={4}>
            <FitnessCard
              title="Hidratação"
              value={hydrationCompleted > 0 ? (hydrationCompleted * 250).toString() : '--'}
              unit="ml"
              variant="hydration"
              goTo={() => navigation.navigate('hydration')}
              fullWidth
            />
          </Box>

          {/* Card de Análise do Dia */}
          <Box mt={6}>
            <Text fontFamily="Poligon" fontSize={16} fontWeight={700} color="gray.900" mb={3}>
              Como está seu dia
            </Text>
            <DailyAnalysisCard
              fitnessData={dailyFitnessData}
              onRefresh={refreshFitnessData}
            />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
