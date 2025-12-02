import React, { useMemo } from 'react';
import { Dimensions } from 'react-native';
import { VStack, Text, HStack, Box } from 'native-base';
import { LineChart } from 'react-native-gifted-charts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type HistoryDataPoint = {
  value: number;
  date: string;
  label: string;
  dataPointText?: string;
};

type HistoryChartProps = {
  examItemDescription: string;
  historyData: HistoryDataPoint[];
  unit: string;
  referenceMin?: number;
  referenceMax?: number;
  color?: string;
};

export function HistoryChart({
  examItemDescription,
  historyData,
  unit,
  referenceMin,
  referenceMax,
  color = '#00B39D',
}: HistoryChartProps) {
  const chartData = useMemo(() => {
    if (!historyData || historyData.length === 0) return [];

    return historyData.map((point, index) => ({
      value: point.value,
      label: point.label,
      dataPointText: point.value.toString(),
      dataPointLabelComponent: () => (
        <Text fontSize={10} color="gray.600" mt={-4}>
          {point.value}
        </Text>
      ),
    }));
  }, [historyData]);

  const { minValue, maxValue } = useMemo(() => {
    if (!historyData || historyData.length === 0) {
      return { minValue: 0, maxValue: 100 };
    }

    const values = historyData.map((d) => d.value);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);

    // Include reference values in range calculation if provided
    let min = dataMin;
    let max = dataMax;

    if (referenceMin !== undefined) min = Math.min(min, referenceMin);
    if (referenceMax !== undefined) max = Math.max(max, referenceMax);

    // Add padding
    const padding = (max - min) * 0.15;
    return {
      minValue: Math.max(0, min - padding),
      maxValue: max + padding,
    };
  }, [historyData, referenceMin, referenceMax]);

  if (!historyData || historyData.length === 0) {
    return (
      <VStack flex={1} alignItems="center" justifyContent="center" py={8}>
        <Text fontSize={14} color="gray.500" textAlign="center">
          Nenhum dado disponível para{'\n'}mostrar o histórico
        </Text>
      </VStack>
    );
  }

  if (historyData.length === 1) {
    return (
      <VStack flex={1} alignItems="center" justifyContent="center" py={8}>
        <Text fontSize={14} color="gray.500" textAlign="center">
          Você precisa de pelo menos 2 exames{'\n'}para visualizar a evolução
        </Text>
        <Box mt={4} p={4} bg="gray.100" borderRadius={12}>
          <Text fontSize={12} color="gray.600" textAlign="center">
            Valor atual: {historyData[0].value} {unit}
          </Text>
          <Text fontSize={10} color="gray.400" textAlign="center" mt={1}>
            {historyData[0].date}
          </Text>
        </Box>
      </VStack>
    );
  }

  return (
    <VStack flex={1}>
      <Text fontSize={18} fontWeight={700} color="gray.800" mb={2}>
        {examItemDescription}
      </Text>

      <HStack space={4} mb={4}>
        <HStack alignItems="center" space={1}>
          <Box w={3} h={3} bg={color} borderRadius="full" />
          <Text fontSize={12} color="gray.600">
            Seus valores
          </Text>
        </HStack>
        {(referenceMin !== undefined || referenceMax !== undefined) && (
          <HStack alignItems="center" space={1}>
            <Box w={3} h={1} bg="gray.300" />
            <Text fontSize={12} color="gray.600">
              Referencia
            </Text>
          </HStack>
        )}
      </HStack>

      <Box bg="gray.50" borderRadius={16} p={4} overflow="hidden">
        <LineChart
          data={chartData}
          width={SCREEN_WIDTH - 100}
          height={180}
          spacing={(SCREEN_WIDTH - 160) / Math.max(chartData.length - 1, 1)}
          color={color}
          thickness={3}
          dataPointsColor={color}
          dataPointsRadius={6}
          startFillColor={color}
          endFillColor={`${color}10`}
          startOpacity={0.3}
          endOpacity={0.05}
          areaChart
          curved
          yAxisColor="transparent"
          xAxisColor="#E2E8F0"
          yAxisTextStyle={{ color: '#718096', fontSize: 10 }}
          xAxisLabelTextStyle={{ color: '#718096', fontSize: 10 }}
          hideRules
          yAxisOffset={minValue}
          maxValue={maxValue - minValue}
          noOfSections={4}
          showVerticalLines
          verticalLinesColor="#E2E8F0"
          verticalLinesThickness={1}
          pointerConfig={{
            pointerStripColor: color,
            pointerStripWidth: 2,
            pointerColor: color,
            radius: 8,
            pointerLabelWidth: 100,
            pointerLabelHeight: 60,
            activatePointersOnLongPress: false,
            autoAdjustPointerLabelPosition: true,
            pointerLabelComponent: (items: any) => {
              return (
                <Box bg="gray.800" px={3} py={2} borderRadius={8}>
                  <Text fontSize={14} fontWeight={700} color="white">
                    {items[0].value} {unit}
                  </Text>
                </Box>
              );
            },
          }}
          // Reference lines
          showReferenceLine1={referenceMax !== undefined}
          referenceLine1Position={referenceMax !== undefined ? referenceMax - minValue : 0}
          referenceLine1Config={{
            color: '#FC8181',
            dashWidth: 4,
            dashGap: 4,
            thickness: 1,
            labelText: `Max: ${referenceMax}`,
            labelTextStyle: { color: '#FC8181', fontSize: 9 },
          }}
          showReferenceLine2={referenceMin !== undefined}
          referenceLine2Position={referenceMin !== undefined ? referenceMin - minValue : 0}
          referenceLine2Config={{
            color: '#68D391',
            dashWidth: 4,
            dashGap: 4,
            thickness: 1,
            labelText: `Min: ${referenceMin}`,
            labelTextStyle: { color: '#68D391', fontSize: 9 },
          }}
        />
      </Box>

      <HStack justifyContent="space-between" mt={3} px={2}>
        <VStack>
          <Text fontSize={10} color="gray.400">
            Primeiro registro
          </Text>
          <Text fontSize={12} fontWeight={600} color="gray.700">
            {historyData[0].date}
          </Text>
        </VStack>
        <VStack alignItems="flex-end">
          <Text fontSize={10} color="gray.400">
            Ultimo registro
          </Text>
          <Text fontSize={12} fontWeight={600} color="gray.700">
            {historyData[historyData.length - 1].date}
          </Text>
        </VStack>
      </HStack>

      {historyData.length >= 2 && (
        <Box mt={4} p={3} bg="gray.100" borderRadius={12}>
          <VStack>
            <Text fontSize={12} fontWeight={600} color="gray.700">
              {historyData[historyData.length - 1].value < historyData[0].value
                ? 'Redução'
                : historyData[historyData.length - 1].value > historyData[0].value
                ? 'Aumento'
                : 'Estável'}
            </Text>
            <Text fontSize={11} color="gray.500">
              Variação de {Math.abs(historyData[historyData.length - 1].value - historyData[0].value).toFixed(1)}{' '}
              {unit} desde o primeiro exame
            </Text>
          </VStack>
        </Box>
      )}
    </VStack>
  );
}
