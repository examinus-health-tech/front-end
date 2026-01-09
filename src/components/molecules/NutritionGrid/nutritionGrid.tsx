import { useState, useMemo } from 'react';
import { Box, HStack, VStack } from 'native-base';
import { LayoutChangeEvent } from 'react-native';

export type NutritionStatus = 'within' | 'above' | 'none';

export type NutritionDayData = {
  day: number;
  status: NutritionStatus;
};

export type Props = {
  data?: NutritionDayData[];
  month?: number; // 0-11 (Janeiro = 0)
  year?: number;
  gap?: number;
};

const statusColors: Record<NutritionStatus, string> = {
  within: '#0CC1AF', // ciano - dentro da meta
  above: '#FA4D5E', // vermelho - acima da meta
  none: '#E5E7EB', // cinza - sem dados
};

export function NutritionGrid({ data = [], month, year, gap = 6 }: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const numCols = 7;
  const numRows = 5;

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  // Calcula tamanho do quadrado baseado no espaço disponível
  const squareSize = containerWidth > 0 ? (containerWidth - gap * (numCols - 1)) / numCols : 14;

  // Usa mês/ano atual se não fornecido
  const today = new Date();
  const currentMonth = month ?? today.getMonth();
  const currentYear = year ?? today.getFullYear();
  const currentDay = today.getDate();

  // Calcula informações do calendário
  const calendarData = useMemo(() => {
    // Primeiro dia do mês (0 = Domingo, 1 = Segunda, etc.)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    // Último dia do mês
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Cria mapa dos dados de nutrição por dia
    const dataMap = new Map<number, NutritionStatus>();
    data.forEach(item => {
      dataMap.set(item.day, item.status);
    });

    // Monta o grid
    const grid: Array<Array<{ day: number | null; status: NutritionStatus | null }>> = [];
    let dayCounter = 1;

    for (let row = 0; row < numRows; row++) {
      const rowData: Array<{ day: number | null; status: NutritionStatus | null }> = [];

      for (let col = 0; col < numCols; col++) {
        const cellIndex = row * numCols + col;

        // Antes do primeiro dia do mês ou depois do último dia
        if (cellIndex < firstDayOfMonth || dayCounter > lastDayOfMonth) {
          rowData.push({ day: null, status: null });
        } else {
          // Dia válido do mês
          const isCurrentMonth = month === undefined && year === undefined;
          const isFutureDay = isCurrentMonth && dayCounter > currentDay;

          // Se é dia futuro, não tem dados ainda
          const status = isFutureDay ? null : (dataMap.get(dayCounter) || 'none');

          rowData.push({ day: dayCounter, status });
          dayCounter++;
        }
      }

      grid.push(rowData);
    }

    return grid;
  }, [currentMonth, currentYear, currentDay, data]);

  // Determina a cor de fundo do quadrado
  const getSquareBackground = (cell: { day: number | null; status: NutritionStatus | null }) => {
    // Se tem status (dia com dados), usa a cor do status
    if (cell.status) {
      return statusColors[cell.status];
    }
    // Se é dia válido sem status (dia futuro), transparente com borda
    if (cell.day !== null) {
      return 'transparent';
    }
    // Se é célula antes do dia 1 ou após último dia, mostra cinza claro
    return '#E5E7EB';
  };

  return (
    <VStack space={`${gap}px`} w="100%" onLayout={handleLayout}>
      {containerWidth > 0 &&
        calendarData.map((row, rowIndex) => (
          <HStack key={rowIndex} space={`${gap}px`} justifyContent="space-between">
            {row.map((cell, colIndex) => (
              <Box
                key={colIndex}
                bg={getSquareBackground(cell)}
                w={squareSize}
                h={squareSize}
                borderRadius={8}
                borderWidth={cell.day !== null && cell.status === null ? 1 : 0}
                borderColor="gray.200"
              />
            ))}
          </HStack>
        ))}
    </VStack>
  );
}
