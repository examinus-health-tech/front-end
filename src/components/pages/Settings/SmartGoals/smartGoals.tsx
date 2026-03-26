import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { VStack, Text, ScrollView, IScrollViewProps, View, StatusBar, HStack, Box, Pressable } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { Header } from '../components/header/header';
import { useCustomToast } from 'src/hooks/useCustomToast';

// hooks
import { useOnboarding } from 'src/hooks/useOnboarding';

// services
import {
  setHydrationGoal,
  getHydrationGoal,
  setCaloriesGoal,
  getCaloriesGoal,
} from '@services/fitnessService';
import {
  calculateHydrationGoal,
  calculateTMB,
  calculateCaloriesGoal as calcCalories,
  calculateStepsGoal,
  getActivityLevelText,
  WeightGoalType,
} from '@services/goalCalculatorService';

// icons
import {
  WaterDropFilledIcon,
  FireIcon,
  StepsIcon,
  CheckIcon,
} from '@assets/icons';

const WEIGHT_GOAL_TYPE_KEY = '@examinus:weight_goal_type';

type GoalObjective = 'lose' | 'maintain' | 'gain';

const objectives: { type: GoalObjective; label: string; description: string }[] = [
  { type: 'lose', label: 'Perder peso', description: 'Déficit de 500 kcal/dia' },
  { type: 'maintain', label: 'Manter peso', description: 'Calorias de manutenção' },
  { type: 'gain', label: 'Ganhar peso', description: 'Superávit de 300 kcal/dia' },
];

export function SmartGoals() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { showSuccess, showError } = useCustomToast();
  const { personalData } = useOnboarding();

  const [selectedObjective, setSelectedObjective] = useState<GoalObjective>('maintain');
  const [currentGoals, setCurrentGoals] = useState({
    hydration: 2000,
    calories: 2000,
    steps: 10000,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Carrega dados salvos
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);

      const [hydrationGoal, caloriesGoal, weightGoalType] = await Promise.all([
        getHydrationGoal(),
        getCaloriesGoal(),
        AsyncStorage.getItem(WEIGHT_GOAL_TYPE_KEY),
      ]);

      setCurrentGoals({
        hydration: hydrationGoal || 2000,
        calories: caloriesGoal || 2000,
        steps: 10000,
      });

      if (weightGoalType) {
        setSelectedObjective(weightGoalType as GoalObjective);
      }
    } catch (error) {
      if (__DEV__) console.error('[SMART_GOALS] Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Dados do perfil do usuário
  const profile = useMemo(() => {
    const data = personalData as {
      weight?: number;
      height?: number;
      age?: number;
      gender?: string;
      workoutLevel?: number;
    } | undefined;

    return {
      weight: data?.weight || 70,
      height: data?.height || 1.70,
      age: data?.age || 30,
      gender: (data?.gender || 'M') as 'M' | 'F',
      workoutLevel: data?.workoutLevel || 3,
    };
  }, [personalData]);

  // Calcula metas sugeridas
  const suggestedGoals = useMemo(() => {
    const hydration = calculateHydrationGoal(profile.weight);

    const tmb = calculateTMB(
      profile.gender,
      profile.weight,
      profile.height,
      profile.age
    );

    const calories = calcCalories(tmb, profile.workoutLevel, selectedObjective);
    const steps = calculateStepsGoal(profile.workoutLevel);

    return { hydration, calories, steps };
  }, [profile, selectedObjective]);

  // Salva objetivo de peso
  const handleSelectObjective = useCallback(async (objective: GoalObjective) => {
    setSelectedObjective(objective);
    await AsyncStorage.setItem(WEIGHT_GOAL_TYPE_KEY, objective);
  }, []);

  // Aplica uma meta específica
  const handleApplyGoal = useCallback(async (type: 'hydration' | 'calories' | 'steps') => {
    try {
      const value = suggestedGoals[type];

      switch (type) {
        case 'hydration':
          await setHydrationGoal(value);
          setCurrentGoals(prev => ({ ...prev, hydration: value }));
          break;
        case 'calories':
          await setCaloriesGoal(value);
          setCurrentGoals(prev => ({ ...prev, calories: value }));
          break;
        case 'steps':
          setCurrentGoals(prev => ({ ...prev, steps: value }));
          break;
      }

      showSuccess({
        title: 'Meta aplicada',
        description: `Meta de ${type === 'hydration' ? 'hidratação' : type === 'calories' ? 'calorias' : 'passos'} atualizada`,
        duration: 1500,
      });
    } catch (error) {
      if (__DEV__) console.error('[SMART_GOALS] Erro ao aplicar meta:', error);
      showError({
        title: 'Erro',
        description: 'Não foi possível aplicar a meta',
      });
    }
  }, [suggestedGoals, showSuccess, showError]);

  // Aplica todas as metas de uma vez
  const handleApplyAll = useCallback(async () => {
    try {
      await Promise.all([
        setHydrationGoal(suggestedGoals.hydration),
        setCaloriesGoal(suggestedGoals.calories),
      ]);

      setCurrentGoals(suggestedGoals);

      showSuccess({
        title: 'Todas as metas aplicadas',
        description: 'Suas metas foram atualizadas com sucesso',
        duration: 2000,
      });
    } catch (error) {
      if (__DEV__) console.error('[SMART_GOALS] Erro ao aplicar metas:', error);
      showError({
        title: 'Erro',
        description: 'Não foi possível aplicar as metas',
      });
    }
  }, [suggestedGoals, showSuccess, showError]);

  const isGoalApplied = (type: 'hydration' | 'calories' | 'steps') => {
    return currentGoals[type] === suggestedGoals[type];
  };

  return (
    <View flex={1}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <VStack pt={16} mx={6}>
        <Header title="Metas Inteligentes" handleBackTo={() => navigation.goBack()} />
      </VStack>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack flex={1} mx={6} mb={20}>
          {/* Seção: Seu Objetivo */}
          <VStack mt={2}>
            <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color="gray.900">
              Seu Objetivo
            </Text>
            <Text fontSize={13} fontWeight={500} color="gray.400" mt={1}>
              Escolha seu objetivo de peso
            </Text>

            <VStack mt={4} space={3}>
              {objectives.map((obj) => (
                <Pressable key={obj.type} onPress={() => handleSelectObjective(obj.type)}>
                  <HStack
                    bg={selectedObjective === obj.type ? 'ciano.50' : 'white'}
                    p={4}
                    borderRadius={16}
                    borderWidth={2}
                    borderColor={selectedObjective === obj.type ? 'ciano.300' : 'gray.100'}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <VStack flex={1}>
                      <Text fontFamily="Poligon" fontSize={15} fontWeight={700} color="gray.900">
                        {obj.label}
                      </Text>
                      <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="gray.400">
                        {obj.description}
                      </Text>
                    </VStack>
                    {selectedObjective === obj.type && (
                      <Box bg="ciano.300" p={1.5} borderRadius={20}>
                        <CheckIcon size="16" color="#FFFFFF" />
                      </Box>
                    )}
                  </HStack>
                </Pressable>
              ))}
            </VStack>
          </VStack>

          {/* Seção: Metas Sugeridas */}
          <VStack mt={8}>
            <HStack justifyContent="space-between" alignItems="center">
              <VStack>
                <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color="gray.900">
                  Metas Sugeridas
                </Text>
                <Text fontSize={13} fontWeight={500} color="gray.400" mt={1}>
                  Baseadas no seu perfil
                </Text>
              </VStack>
              <Pressable onPress={handleApplyAll}>
                <Box bg="ciano.300" px={4} py={2} borderRadius={12}>
                  <Text fontFamily="Poligon" fontSize={12} fontWeight={700} color="white">
                    Aplicar Todas
                  </Text>
                </Box>
              </Pressable>
            </HStack>

            <VStack mt={4} space={3}>
              {/* Hidratação */}
              <HStack
                bg="white"
                p={4}
                borderRadius={16}
                borderWidth={1}
                borderColor="gray.100"
                alignItems="center"
                space={3}
              >
                <Box bg="blue.100" p={3} borderRadius={14}>
                  <WaterDropFilledIcon size="24" color="#3B82F6" />
                </Box>
                <VStack flex={1}>
                  <Text fontFamily="Poligon" fontSize={14} fontWeight={700} color="gray.900">
                    Hidratação
                  </Text>
                  <HStack alignItems="baseline" space={1}>
                    <Text fontFamily="Poligon" fontSize={24} fontWeight={800} color="gray.900">
                      {(suggestedGoals.hydration / 1000).toFixed(1)}L
                    </Text>
                    <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="gray.400">
                      /dia
                    </Text>
                  </HStack>
                  <Text fontFamily="Poligon" fontSize={11} fontWeight={500} color="gray.400">
                    35ml × {profile.weight}kg
                  </Text>
                </VStack>
                <Pressable onPress={() => handleApplyGoal('hydration')}>
                  <Box
                    bg={isGoalApplied('hydration') ? 'green.100' : 'blue.100'}
                    px={4}
                    py={2}
                    borderRadius={10}
                  >
                    <Text
                      fontFamily="Poligon"
                      fontSize={12}
                      fontWeight={700}
                      color={isGoalApplied('hydration') ? 'green.600' : 'blue.600'}
                    >
                      {isGoalApplied('hydration') ? 'Aplicado' : 'Aplicar'}
                    </Text>
                  </Box>
                </Pressable>
              </HStack>

              {/* Calorias */}
              <HStack
                bg="white"
                p={4}
                borderRadius={16}
                borderWidth={1}
                borderColor="gray.100"
                alignItems="center"
                space={3}
              >
                <Box bg="orange.100" p={3} borderRadius={14}>
                  <FireIcon size="24" color="#F97316" />
                </Box>
                <VStack flex={1}>
                  <Text fontFamily="Poligon" fontSize={14} fontWeight={700} color="gray.900">
                    Calorias
                  </Text>
                  <HStack alignItems="baseline" space={1}>
                    <Text fontFamily="Poligon" fontSize={24} fontWeight={800} color="gray.900">
                      {suggestedGoals.calories.toLocaleString('pt-BR')}
                    </Text>
                    <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="gray.400">
                      kcal/dia
                    </Text>
                  </HStack>
                  <Text fontFamily="Poligon" fontSize={11} fontWeight={500} color="gray.400">
                    {selectedObjective === 'lose' ? 'Déficit' : selectedObjective === 'gain' ? 'Superávit' : 'Manutenção'}, {getActivityLevelText(profile.workoutLevel)}
                  </Text>
                </VStack>
                <Pressable onPress={() => handleApplyGoal('calories')}>
                  <Box
                    bg={isGoalApplied('calories') ? 'green.100' : 'orange.100'}
                    px={4}
                    py={2}
                    borderRadius={10}
                  >
                    <Text
                      fontFamily="Poligon"
                      fontSize={12}
                      fontWeight={700}
                      color={isGoalApplied('calories') ? 'green.600' : 'orange.600'}
                    >
                      {isGoalApplied('calories') ? 'Aplicado' : 'Aplicar'}
                    </Text>
                  </Box>
                </Pressable>
              </HStack>

              {/* Passos */}
              <HStack
                bg="white"
                p={4}
                borderRadius={16}
                borderWidth={1}
                borderColor="gray.100"
                alignItems="center"
                space={3}
              >
                <Box bg="ciano.100" p={3} borderRadius={14}>
                  <StepsIcon size="24" color="#0CC1AF" />
                </Box>
                <VStack flex={1}>
                  <Text fontFamily="Poligon" fontSize={14} fontWeight={700} color="gray.900">
                    Passos
                  </Text>
                  <HStack alignItems="baseline" space={1}>
                    <Text fontFamily="Poligon" fontSize={24} fontWeight={800} color="gray.900">
                      {suggestedGoals.steps.toLocaleString('pt-BR')}
                    </Text>
                    <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="gray.400">
                      /dia
                    </Text>
                  </HStack>
                  <Text fontFamily="Poligon" fontSize={11} fontWeight={500} color="gray.400">
                    Baseado no nível de atividade
                  </Text>
                </VStack>
                <Pressable onPress={() => handleApplyGoal('steps')}>
                  <Box
                    bg={isGoalApplied('steps') ? 'green.100' : 'ciano.100'}
                    px={4}
                    py={2}
                    borderRadius={10}
                  >
                    <Text
                      fontFamily="Poligon"
                      fontSize={12}
                      fontWeight={700}
                      color={isGoalApplied('steps') ? 'green.600' : 'ciano.600'}
                    >
                      {isGoalApplied('steps') ? 'Aplicado' : 'Aplicar'}
                    </Text>
                  </Box>
                </Pressable>
              </HStack>
            </VStack>
          </VStack>

          {/* Info sobre cálculos */}
          <Box mt={6} bg="gray.50" p={4} borderRadius={16}>
            <Text fontFamily="Poligon" fontSize={13} fontWeight={600} color="gray.600">
              Cálculos baseados em:
            </Text>
            <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="gray.400" mt={1}>
              {profile.weight}kg, {profile.age} anos, {profile.height.toFixed(2)}m, {profile.gender === 'M' ? 'Masculino' : 'Feminino'}, {getActivityLevelText(profile.workoutLevel)}
            </Text>
          </Box>
        </VStack>
      </ScrollView>
    </View>
  );
}
