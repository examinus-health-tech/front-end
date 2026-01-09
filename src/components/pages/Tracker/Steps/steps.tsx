import { useRef, useMemo, useState, useCallback } from 'react';
import { VStack, ScrollView, IScrollViewProps, Box, Text, HStack, Pressable } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { HeaderTitle, StepsProgress, StepStatCard, WeeklyStepsChart } from '@components/molecules';

// assets
import { EnergyBoltIcon, CompassTargetIcon, ClockSquareIcon, ChevronDownSmIcon, CalendarIcon } from '@assets/icons';

// hooks
import { useHome } from 'src/hooks/useHome';
import { useTabBar } from 'src/hooks/useTabBar';

type PeriodType = 'Semanal' | 'Mensal' | 'Anual';

export function Steps() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { trackerData } = useHome();
  const { hideTabBar, showTabBar } = useTabBar();
  const [selectedRange, setSelectedRange] = useState<PeriodType>('Semanal');

  // Hide tab bar when screen is focused
  useFocusEffect(
    useCallback(() => {
      hideTabBar();
      return () => showTabBar();
    }, [hideTabBar, showTabBar])
  );

  // Dados do contexto ou mock
  const stepsGoal = 10000;
  const currentSteps = 1542;
  const caloriesBurned = 500;
  const distanceKm = 51;
  const activeHours = 1;

  // Mock de dados semanais
  const weeklyData = useMemo(
    () => [
      { label: 'Seg', value: 8500, isActive: false },
      { label: 'Ter', value: 6200, isActive: false },
      { label: 'Qua', value: 9800, isActive: false },
      { label: 'Qui', value: 4500, isActive: true },
      { label: 'Sex', value: 7200, isActive: false },
      { label: 'Sáb', value: 3000, isActive: false },
      { label: 'Dom', value: 5500, isActive: false },
    ],
    []
  );

  // Mock de dados mensais (semanas)
  const monthlyData = useMemo(
    () => [
      { label: 'S1', value: 45000, isActive: false },
      { label: 'S2', value: 62000, isActive: false },
      { label: 'S3', value: 58000, isActive: true },
      { label: 'S4', value: 71000, isActive: false },
    ],
    []
  );

  // Mock de dados anuais (meses)
  const yearlyData = useMemo(
    () => [
      { label: 'Jan', value: 180000, isActive: false },
      { label: 'Fev', value: 165000, isActive: false },
      { label: 'Mar', value: 210000, isActive: false },
      { label: 'Abr', value: 195000, isActive: false },
      { label: 'Mai', value: 220000, isActive: false },
      { label: 'Jun', value: 185000, isActive: false },
      { label: 'Jul', value: 240000, isActive: false },
      { label: 'Ago', value: 230000, isActive: false },
      { label: 'Set', value: 200000, isActive: false },
      { label: 'Out', value: 215000, isActive: false },
      { label: 'Nov', value: 190000, isActive: false },
      { label: 'Dez', value: 175000, isActive: true },
    ],
    []
  );

  const getChartData = () => {
    switch (selectedRange) {
      case 'Mensal':
        return monthlyData;
      case 'Anual':
        return yearlyData;
      default:
        return weeklyData;
    }
  };

  const getChartGoal = () => {
    switch (selectedRange) {
      case 'Mensal':
        return stepsGoal * 7;
      case 'Anual':
        return stepsGoal * 30;
      default:
        return stepsGoal;
    }
  };

  const cyclePeriod = () => {
    const periods: PeriodType[] = ['Semanal', 'Mensal', 'Anual'];
    const currentIndex = periods.indexOf(selectedRange);
    const nextIndex = (currentIndex + 1) % periods.length;
    setSelectedRange(periods[nextIndex]);
  };

  return (
    <VStack flex={1} py={16}>
      <HeaderTitle withBackButton={() => navigation.navigate('tracker')} title="Passos" withMoreButton />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack flex={1} pb={32}>
          {/* Texto de introdução */}
          <Text
            fontFamily="Poligon"
            fontSize={16}
            fontWeight={600}
            color="#052B3B"
            letterSpacing={-0.16}
            textAlign="center"
            mt={4}
          >
            Hoje, você caminhou
          </Text>

          {/* Progresso circular/retangular */}
          <Box mx={16} mt={4} mb={8}>
            <StepsProgress steps={currentSteps} goal={stepsGoal} />
          </Box>

          {/* Cards de estatísticas */}
          <HStack mx={6} space={3} mt={4}>
            <StepStatCard
              value={caloriesBurned.toString()}
              unit="kcal"
              icon={<EnergyBoltIcon size="28" color="#FA4D5E" />}
              variant="orange"
              progress={65}
            />
            <StepStatCard
              value={distanceKm.toString()}
              unit="km"
              icon={<CompassTargetIcon size="28" color="#99BACE" />}
              variant="blue"
              progress={80}
            />
            <StepStatCard
              value={activeHours.toString()}
              unit="h"
              icon={<ClockSquareIcon size="28" color="#8A3FFC" />}
              variant="purple"
              progress={45}
            />
          </HStack>

          {/* Seção de Progresso Atual */}
          <Box mx={6} mt={10} bg="white" borderRadius={20} p={5}>
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontFamily="Poligon" fontSize={18} fontWeight={700} color="gray.900" letterSpacing={-0.18}>
                Progresso Atual
              </Text>
              <Pressable onPress={cyclePeriod}>
                <HStack alignItems="center" space={2} bg="gray.100" px={3} py={2} borderRadius={8}>
                  <CalendarIcon size="16" color="#052B3B" />
                  <Text fontFamily="Poligon" fontSize={12} fontWeight={600} color="gray.600">
                    {selectedRange}
                  </Text>
                  <ChevronDownSmIcon size="16" color="#6B7280" />
                </HStack>
              </Pressable>
            </HStack>

            <WeeklyStepsChart data={getChartData()} goal={getChartGoal()} />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
