import { useRef, useState, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { VStack, ScrollView, IScrollViewProps, Box, Text, HStack } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { HeaderTitle, TimeRangePicker, GoalCard, WeightStepChart } from '@components/molecules';
import type { TimeRange, WeightDataPoint } from '@components/molecules';

// assets
import { WeightInitialIcon, WeightTargetIcon } from '@assets/icons';

// hooks
import { useHome } from 'src/hooks/useHome';
import { useTabBar } from 'src/hooks/useTabBar';

export function Weight() {
  const [rangeSelected, setRangeSelected] = useState<TimeRange>('1d');
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { trackerData } = useHome();
  const { hideTabBar, showTabBar } = useTabBar();

  // Hide tab bar when screen is focused
  useFocusEffect(
    useCallback(() => {
      hideTabBar();
      return () => showTabBar();
    }, [hideTabBar, showTabBar])
  );

  // Dados do contexto
  const weightCompleted = Number(trackerData?.weight?.[0]?.weight_completed) || 75.22;
  const weightInitial = Number(trackerData?.weight?.[0]?.weight_initial) || 78.54;
  const weightGoal = Number(trackerData?.weight?.[0]?.weight_goal) || 68.54;

  // Dados do gráfico por período (mock - substituir por dados reais)
  const chartDataByRange: Record<TimeRange, WeightDataPoint[]> = {
    '1d': [
      { value: 75.2 },
      { value: 75.1 },
      { value: 75.3 },
    ],
    '1w': [
      { value: 76.5 },
      { value: 76.2 },
      { value: 75.8 },
      { value: 75.5 },
      { value: 75.4 },
      { value: 75.3 },
      { value: 75.2 },
    ],
    '1m': [
      { value: 78.0 },
      { value: 77.2 },
      { value: 76.5 },
      { value: 75.8 },
    ],
    '1y': [
      { value: 85.0 },
      { value: 84.0 },
      { value: 82.5 },
      { value: 81.0 },
      { value: 79.5 },
      { value: 78.0 },
      { value: 77.0 },
      { value: 76.0 },
      { value: 75.2 },
    ],
    'all': [
      { value: 88.0 },
      { value: 86.5 },
      { value: 85.0 },
      { value: 83.0 },
      { value: 81.0 },
      { value: 79.0 },
      { value: 77.0 },
      { value: 75.2 },
    ],
  };

  const chartData = chartDataByRange[rangeSelected];

  return (
    <VStack flex={1}>
      {/* Header com fundo ciano */}
      <Box w="100%" bg="ciano.300" borderBottomRadius={36} pt={16} pb={6}>
        <HeaderTitle
          withBackButton={() => navigation.navigate('tracker')}
          title="Peso"
          color="white"
        />

        <VStack mx={6}>
          <Text color="white" fontFamily="Poligon" fontSize={16} fontWeight={500} mb={3} letterSpacing={-0.16}>
            Peso Atual
          </Text>
          <Text color="white" fontFamily="Poligon" fontSize={72} fontWeight={800} letterSpacing={-0.72}>
            {weightCompleted.toFixed(2)}
            <Text fontFamily="Poligon" fontSize={36} letterSpacing={-0.36} color="ciano.200">
              kg
            </Text>
          </Text>
        </VStack>
      </Box>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {/* Conteúdo principal */}
        <VStack flex={1} mx={6} mt={4} pb={32}>
          {/* Seletor de período */}
          <Box mt={4}>
            <TimeRangePicker selected={rangeSelected} onSelect={setRangeSelected} />
          </Box>

          {/* Área do gráfico */}
          <Box mt={4}>
            <WeightStepChart data={chartData} />
          </Box>

          {/* Seção de Metas */}
          <HStack mt={4} justifyContent="space-between" alignItems="center">
            <Text fontFamily="Poligon" fontSize={16} fontWeight={800} letterSpacing={-0.16} color="gray.900">
              Metas
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate('tracker')}>
              <Text fontFamily="Poligon" fontSize={12} fontWeight={800} letterSpacing={-0.12} color="ciano.200">
                Ver todas
              </Text>
            </TouchableOpacity>
          </HStack>

          {/* Cards de Meta */}
          <HStack mt={4} justifyContent="space-between" space={4}>
            <GoalCard
              icon={<WeightInitialIcon size="24" color="#8A3FFC" />}
              iconBgColor="#F3ECFF"
              value={weightInitial.toFixed(2)}
              unit="kg"
              label="Peso Inicial"
            />
            <GoalCard
              icon={<WeightTargetIcon size="24" color="#FA4D5E" />}
              iconBgColor="#FFEDEF"
              value={weightGoal.toFixed(2)}
              unit="kg"
              label="Peso Alvo"
            />
          </HStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
