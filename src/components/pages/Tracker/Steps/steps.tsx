import { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { VStack, ScrollView, IScrollViewProps, Box, Text, HStack, Pressable, Skeleton } from 'native-base';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { HeaderTitle, StepsProgress, StepStatCard, WeeklyStepsChart } from '@components/molecules';

// assets
import {
  EnergyBoltIcon,
  CompassTargetIcon,
  ChevronDownSmIcon,
  CalendarIcon,
  StepsIcon,
} from '@assets/icons';

// hooks
import { useHome } from 'src/hooks/useHome';
import { useTabBar } from 'src/hooks/useTabBar';

// services
import { getDailyLogsHistory } from 'src/services/fitnessService';

type PeriodType = 'Semanal' | 'Mensal' | 'Anual';

type ChartDataPoint = {
  label: string;
  value: number;
  isActive: boolean;
};

export function Steps() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { trackerData } = useHome();
  const { hideTabBar, showTabBar } = useTabBar();
  const [selectedRange, setSelectedRange] = useState<PeriodType>('Semanal');
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Hide tab bar when screen is focused
  useFocusEffect(
    useCallback(() => {
      hideTabBar();
      return () => showTabBar();
    }, [hideTabBar, showTabBar]),
  );

  // Dados do contexto
  const stepData = trackerData?.step?.[0];
  const stepsGoal = Number(stepData?.step_goal) || 10000;
  const currentSteps = Number(stepData?.step_completed) || 0;
  const distanceCompleted = Number(stepData?.distance_completed) || 0;
  const distanceGoal = Number(stepData?.distance_goal) || 8;
  // Calorias do contexto kcal
  const kcalData = trackerData?.kcal?.[0];
  const caloriesBurned = Number(kcalData?.kcal_completed) || 0;
  const caloriesGoal = Number(kcalData?.kcal_goal) || 500;


  // Calcular progresso para os cards
  const caloriesProgress = caloriesGoal > 0 ? Math.min((caloriesBurned / caloriesGoal) * 100, 100) : 0;
  const distanceProgress = distanceGoal > 0 ? Math.min((distanceCompleted / distanceGoal) * 100, 100) : 0;

  // Helper para obter dias/labels baseado no período
  const getDaysForPeriod = (period: PeriodType): number => {
    switch (period) {
      case 'Semanal':
        return 7;
      case 'Mensal':
        return 30;
      case 'Anual':
        return 365;
      default:
        return 7;
    }
  };

  // Busca dados do histórico de passos da API
  useEffect(() => {
    async function fetchChartData() {
      setIsLoadingChart(true);
      try {
        const days = getDaysForPeriod(selectedRange);
        const history = await getDailyLogsHistory(days);

        if (history.length > 0) {
          let data: ChartDataPoint[] = [];

          if (selectedRange === 'Semanal') {
            // Agrupa por dia da semana
            const dayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
            const today = new Date().getDay();
            const adjustedToday = today === 0 ? 6 : today - 1;

            // Pega os últimos 7 dias de dados
            const last7Days = history.slice(-7);
            data = dayLabels.map((label, index) => ({
              label,
              value: last7Days[index]?.steps || 0,
              isActive: index === adjustedToday,
            }));

            // Se último dia tem dados, usa valor atual
            if (data.length > 0 && adjustedToday < data.length) {
              data[adjustedToday].value = currentSteps || data[adjustedToday].value;
            }
          } else if (selectedRange === 'Mensal') {
            // Agrupa por semana
            const weekLabels = ['S1', 'S2', 'S3', 'S4'];
            const currentWeek = Math.floor(new Date().getDate() / 7);

            // Agrupa logs por semana
            const weeklyTotals = [0, 0, 0, 0];
            history.forEach((log) => {
              const logDate = new Date(log.date);
              const weekIndex = Math.min(Math.floor(logDate.getDate() / 7), 3);
              weeklyTotals[weekIndex] += log.steps || 0;
            });

            data = weekLabels.map((label, index) => ({
              label,
              value: weeklyTotals[index],
              isActive: index === currentWeek,
            }));
          } else if (selectedRange === 'Anual') {
            // Agrupa por mês
            const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            const currentMonth = new Date().getMonth();

            // Agrupa logs por mês
            const monthlyTotals = new Array(12).fill(0);
            history.forEach((log) => {
              const logDate = new Date(log.date);
              const monthIndex = logDate.getMonth();
              monthlyTotals[monthIndex] += log.steps || 0;
            });

            data = monthLabels.map((label, index) => ({
              label,
              value: monthlyTotals[index],
              isActive: index === currentMonth,
            }));
          }

          setChartData(data);
        } else {
          // Se não há dados, mostra estrutura vazia com valor atual
          const dayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
          const today = new Date().getDay();
          const adjustedToday = today === 0 ? 6 : today - 1;

          const emptyData = dayLabels.map((label, index) => ({
            label,
            value: index === adjustedToday ? currentSteps : 0,
            isActive: index === adjustedToday,
          }));
          setChartData(emptyData);
        }
      } catch (error) {
        if (__DEV__) console.error('Erro ao buscar histórico de passos:', error);
        // Em caso de erro, mostra estrutura vazia
        const dayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
        const today = new Date().getDay();
        const adjustedToday = today === 0 ? 6 : today - 1;

        setChartData(
          dayLabels.map((label, index) => ({
            label,
            value: index === adjustedToday ? currentSteps : 0,
            isActive: index === adjustedToday,
          })),
        );
      } finally {
        setIsLoadingChart(false);
      }
    }

    fetchChartData();
  }, [selectedRange, currentSteps]);

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

  // Mensagem motivacional
  const getMotivationalMessage = () => {
    const progress = (currentSteps / stepsGoal) * 100;
    if (currentSteps === 0) return 'Comece a caminhar para atingir sua meta!';
    if (progress >= 100) return 'Parabéns! Você atingiu sua meta de hoje!';
    if (progress >= 75) return 'Quase lá! Continue assim!';
    if (progress >= 50) return 'Ótimo progresso! Você está na metade!';
    if (progress >= 25) return 'Bom começo! Continue se movendo!';
    return 'Cada passo conta! Vamos lá!';
  };

  return (
    <VStack testID="screen-steps" flex={1} pt={16}>
      <HeaderTitle withBackButton={() => navigation.navigate('tracker')} title="Passos" withMoreButton />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack flex={1} pb={8}>
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
          <Box mx={16} mt={4} mb={6}>
            <StepsProgress steps={currentSteps} goal={stepsGoal} />
          </Box>

          {/* Mensagem motivacional */}
          <Text
            fontFamily="Poligon"
            fontSize={14}
            fontWeight={500}
            color="gray.500"
            letterSpacing={-0.14}
            textAlign="center"
            mb={4}
          >
            {getMotivationalMessage()}
          </Text>

          {/* Cards de estatísticas */}
          <HStack mx={6} space={3} mt={4}>
            <StepStatCard
              value={caloriesBurned > 0 ? caloriesBurned.toString() : '--'}
              unit="kcal"
              icon={<EnergyBoltIcon size="28" color="#FA4D5E" />}
              variant="orange"
              progress={caloriesProgress}
            />
            <StepStatCard
              value={distanceCompleted > 0 ? distanceCompleted.toFixed(1) : '--'}
              unit="km"
              icon={<CompassTargetIcon size="28" color="#99BACE" />}
              variant="blue"
              progress={distanceProgress}
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

            {isLoadingChart ? (
              <Box mt={4}>
                <HStack justifyContent="space-between" alignItems="flex-end" h={120}>
                  {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                    <Skeleton key={index} h={`${20 + Math.random() * 60}%`} w="10%" rounded="md" />
                  ))}
                </HStack>
                <HStack justifyContent="space-between" mt={2}>
                  {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                    <Skeleton key={index} h={3} w="10%" rounded="sm" />
                  ))}
                </HStack>
              </Box>
            ) : (
              <Animated.View entering={FadeIn.duration(400)}>
                <WeeklyStepsChart data={chartData} goal={getChartGoal()} />
              </Animated.View>
            )}
          </Box>

          {/* Info sobre sincronização */}
          <Box mx={6} mt={6} bg="ciano.50" p={4} borderRadius={16}>
            <HStack alignItems="center" space={2} mb={2}>
              <StepsIcon size="20" color="#0CC1AF" />
              <Text fontFamily="Poligon" fontSize={14} fontWeight={700} color="ciano.700">
                Sincronização Automática
              </Text>
            </HStack>
            <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="ciano.600">
              Seus passos são sincronizados automaticamente do Apple Health ou do sensor do seu celular. Mantenha o
              celular no bolso para contagem precisa!
            </Text>
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
