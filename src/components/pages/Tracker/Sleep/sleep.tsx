import { useState, useCallback, useMemo, useEffect } from 'react';
import { VStack, Box, Text, HStack, Skeleton } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
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

// assets
import { MoonIcon, BedIcon, SleepZzzIcon } from '@assets/icons';

// hooks
import { useHome } from 'src/hooks/useHome';
import { useTabBar } from 'src/hooks/useTabBar';

// services
import { getSleepHistory } from 'src/services/fitnessService';

// Função para converter horas decimais em formato legível
function formatSleepTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// Função para calcular qualidade do sono baseado nas horas
function getSleepQuality(hours: number, goal: number): { label: string; color: string; percentage: number } {
  const percentage = Math.min((hours / goal) * 100, 100);

  if (percentage >= 90) {
    return { label: 'Excelente', color: '#22C55E', percentage };
  } else if (percentage >= 75) {
    return { label: 'Bom', color: '#84CC16', percentage };
  } else if (percentage >= 50) {
    return { label: 'Regular', color: '#F97316', percentage };
  } else {
    return { label: 'Insuficiente', color: '#EF4444', percentage };
  }
}

// Constantes para animação do header
const HEADER_EXPANDED_HEIGHT = 320;
const HEADER_COLLAPSED_HEIGHT = 180;
const SCROLL_THRESHOLD = 120;

export function Sleep() {
  const [rangeSelected, setRangeSelected] = useState<TimeRange>('1w');
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [chartData, setChartData] = useState<WeightDataPoint[]>([]);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { trackerData } = useHome();
  const { hideTabBar, showTabBar } = useTabBar();

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
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD * 0.5],
      [1, 0],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [0, -20],
      Extrapolation.CLAMP
    );

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

  // Hide tab bar and set status bar style when screen is focused
  useFocusEffect(
    useCallback(() => {
      hideTabBar();
      setStatusBarStyle('light');
      return () => {
        showTabBar();
        setStatusBarStyle('dark');
      };
    }, [hideTabBar, showTabBar])
  );

  // Dados do contexto
  const sleepData = trackerData?.sleep?.[0];
  const sleepCompleted = Number(sleepData?.sleep_completed) || 0;
  const sleepGoal = Number(sleepData?.sleep_goal) || 8;

  // Calcular qualidade do sono
  const sleepQuality = useMemo(() => {
    return getSleepQuality(sleepCompleted, sleepGoal);
  }, [sleepCompleted, sleepGoal]);

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

  // Busca dados do histórico de sono da API
  useEffect(() => {
    async function fetchChartData() {
      setIsLoadingChart(true);
      try {
        const days = getDaysForRange(rangeSelected);
        const history = await getSleepHistory(days);

        if (history.length > 0) {
          // Converte minutos para horas decimais
          const data = history.map(record => ({
            value: (record.durationMinutes || 0) / 60,
          }));
          setChartData(data);
        } else {
          // Se não há dados, mostra apenas o valor atual
          setChartData([{ value: sleepCompleted }]);
        }
      } catch (error) {
        console.error('Erro ao buscar histórico de sono:', error);
        setChartData([{ value: sleepCompleted }]);
      } finally {
        setIsLoadingChart(false);
      }
    }

    fetchChartData();
  }, [rangeSelected, sleepCompleted]);

  // Calcular média do período
  const averageSleep = useMemo(() => {
    const sum = chartData.reduce((acc, item) => acc + item.value, 0);
    return sum / chartData.length;
  }, [chartData]);

  return (
    <VStack flex={1} bg="#F5F5F5">
      <StatusBar style="light" />
      {/* Header animado com fundo roxo escuro - posição absoluta */}
      <Animated.View style={[headerAnimatedStyle, { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }]}>
        <Box w="100%" h="100%" bg="purple.900" borderBottomRadius={36} pt={16} pb={6} overflow="hidden">
          <HeaderTitle
            withBackButton={() => navigation.navigate('tracker')}
            title="Sono"
            color="white"
          />

          {/* Conteúdo expandido (some ao scrollar) */}
          <Animated.View style={[expandedContentStyle, { position: 'absolute', top: 120, left: 24, right: 24 }]}>
            <HStack alignItems="center" space={2} mb={3}>
              <MoonIcon size="20" color="#C4B5FD" />
              <Text color="purple.300" fontFamily="Poligon" fontSize={16} fontWeight={500} letterSpacing={-0.16}>
                Última Noite
              </Text>
            </HStack>

            <HStack alignItems="flex-end">
              <Text color="white" fontFamily="Poligon" fontSize={72} fontWeight={800} letterSpacing={-0.72}>
                {formatSleepTime(sleepCompleted)}
              </Text>
            </HStack>

            {/* Barra de progresso */}
            <Box w="100%" h={2} bg="purple.800" borderRadius={4} mt={2}>
              <Box
                w={`${sleepQuality.percentage}%`}
                h={2}
                bg={sleepQuality.color}
                borderRadius={4}
              />
            </Box>
            <HStack justifyContent="space-between" mt={1}>
              <Text color="purple.400" fontFamily="Poligon" fontSize={12} fontWeight={500}>
                {sleepQuality.percentage.toFixed(0)}% da meta
              </Text>
              <Text color={sleepQuality.color} fontFamily="Poligon" fontSize={12} fontWeight={700}>
                {sleepQuality.label}
              </Text>
            </HStack>
          </Animated.View>

          {/* Conteúdo colapsado (aparece ao scrollar) */}
          <Animated.View style={[collapsedContentStyle, { position: 'absolute', top: 100, left: 24, right: 24 }]}>
            <HStack alignItems="center" justifyContent="space-between">
              <HStack alignItems="center" space={3}>
                <MoonIcon size="20" color="#C4B5FD" />
                <VStack>
                  <Text color="white" fontFamily="Poligon" fontSize={28} fontWeight={800} letterSpacing={-0.28}>
                    {formatSleepTime(sleepCompleted)}
                  </Text>
                  <Text color="purple.300" fontFamily="Poligon" fontSize={12} fontWeight={500}>
                    Meta: {formatSleepTime(sleepGoal)} • {sleepQuality.label}
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
        <VStack flex={1} mx={6} mt={4} pb={48} bg="#F5F5F5">
          {/* Seletor de período */}
          <Box mt={2}>
            <HStack justifyContent="space-between" alignItems="center" mb={4}>
              <Text fontFamily="Poligon" fontSize={16} fontWeight={800} letterSpacing={-0.16} color="gray.900">
                Histórico de Sono
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
            ) : chartData.length > 0 ? (
              <Animated.View entering={FadeIn.duration(400)}>
                <WeightStepChart
                  data={chartData}
                  unit="h"
                  lineColor="#7C3AED"
                  gradientColor="#7C3AED"
                  indicatorColor="#7C3AED"
                />
              </Animated.View>
            ) : (
              <Box bg="white" rounded="2xl" p={6} alignItems="center">
                <MoonIcon size="48" color="#D1D5DB" />
                <Text fontFamily="Poligon" fontSize={14} fontWeight={500} color="gray.400" mt={3} textAlign="center">
                  Nenhum registro de sono ainda.{'\n'}Os dados serão sincronizados automaticamente.
                </Text>
              </Box>
            )}
          </Box>

          {/* Legenda do gráfico */}
          <HStack mt={4} justifyContent="center" space={6}>
            <HStack alignItems="center" space={2}>
              <Box w={3} h={3} bg="purple.600" borderRadius={2} />
              <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="gray.500">
                Horas Dormidas
              </Text>
            </HStack>
            <HStack alignItems="center" space={2}>
              <Box w={3} h={3} bg="gray.300" borderRadius={2} borderWidth={1} borderColor="gray.400" borderStyle="dashed" />
              <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="gray.500">
                Meta ({sleepGoal}h)
              </Text>
            </HStack>
          </HStack>

          {/* Cards inline verticais */}
          <VStack mt={6} bg="white" p={4} borderRadius={16} space={3}>
            <HStack alignItems="center" justifyContent="space-between">
              <HStack alignItems="center" space={3}>
                <Box size={10} bg="#F3E8FF" borderRadius={10} alignItems="center" justifyContent="center">
                  <BedIcon size="20" color="#7C3AED" />
                </Box>
                <Text fontFamily="Poligon" fontSize={14} fontWeight={500} color="gray.500">
                  Dormido
                </Text>
              </HStack>
              <Text fontFamily="Poligon" fontSize={16} fontWeight={800} color="gray.900">
                {formatSleepTime(sleepCompleted)}
              </Text>
            </HStack>

            <Box h={0.5} bg="gray.100" />

            <HStack alignItems="center" justifyContent="space-between">
              <HStack alignItems="center" space={3}>
                <Box size={10} bg={sleepQuality.color + '20'} borderRadius={10} alignItems="center" justifyContent="center">
                  <SleepZzzIcon size="20" color={sleepQuality.color} />
                </Box>
                <Text fontFamily="Poligon" fontSize={14} fontWeight={500} color="gray.500">
                  Qualidade
                </Text>
              </HStack>
              <Text fontFamily="Poligon" fontSize={16} fontWeight={800} color={sleepQuality.color}>
                {sleepQuality.label}
              </Text>
            </HStack>

            <Box h={0.5} bg="gray.100" />

            <HStack alignItems="center" justifyContent="space-between">
              <HStack alignItems="center" space={3}>
                <Box size={10} bg="#EEF2FF" borderRadius={10} alignItems="center" justifyContent="center">
                  <MoonIcon size="20" color="#6366F1" />
                </Box>
                <Text fontFamily="Poligon" fontSize={14} fontWeight={500} color="gray.500">
                  Meta Diária
                </Text>
              </HStack>
              <Text fontFamily="Poligon" fontSize={16} fontWeight={800} color="gray.900">
                {formatSleepTime(sleepGoal)}
              </Text>
            </HStack>

            <Box h={0.5} bg="gray.100" />

            <HStack alignItems="center" justifyContent="space-between">
              <HStack alignItems="center" space={3}>
                <Box size={10} bg="#F5F3FF" borderRadius={10} alignItems="center" justifyContent="center">
                  <MoonIcon size="20" color="#8B5CF6" />
                </Box>
                <Text fontFamily="Poligon" fontSize={14} fontWeight={500} color="gray.500">
                  Média do Período
                </Text>
              </HStack>
              <Text fontFamily="Poligon" fontSize={16} fontWeight={800} color="gray.900">
                {formatSleepTime(averageSleep)}
              </Text>
            </HStack>
          </VStack>

          {/* Dicas de Sono */}
          <Box mt={6} bg="purple.50" p={4} borderRadius={16}>
            <HStack alignItems="center" space={2} mb={2}>
              <SleepZzzIcon size="20" color="#7C3AED" />
              <Text fontFamily="Poligon" fontSize={14} fontWeight={700} color="purple.700">
                Dicas para Melhorar o Sono
              </Text>
            </HStack>
            <VStack space={2}>
              <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="purple.600">
                • Mantenha um horário regular para dormir e acordar
              </Text>
              <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="purple.600">
                • Evite telas 1 hora antes de dormir
              </Text>
              <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="purple.600">
                • Mantenha o quarto escuro e fresco
              </Text>
              <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="purple.600">
                • Evite cafeína após as 14h
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Animated.ScrollView>
    </VStack>
  );
}
