import { EditIcon, AddIcon } from '@assets/icons';
import { Text, Box, Flex, HStack, VStack } from 'native-base';
import { useState } from 'react';
import { LayoutChangeEvent, TouchableOpacity } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

export type FitnessCardVariant = 'weight' | 'nutrition' | 'calories' | 'sleep-grid' | 'hydration' | 'add-new';

export type Props = {
  title: string;
  value?: string;
  unit?: 'kg' | 'kcal' | 'h' | 'ml';
  variant?: FitnessCardVariant;
  goTo?: () => void;
  data?: number[];
  fullWidth?: boolean;
};

// Componente para gráfico de barras verticais (Peso) - tons de azul
function WeightChart() {
  const lightColor = '#DCF0FF';
  const darkColor = '#99BACE';

  // [altura clara, altura escura] em percentual
  const bars = [
    { light: 50, dark: 30 },
    { light: 80, dark: 15 },
    { light: 60, dark: 25 },
    { light: 70, dark: 35 },
    { light: 55, dark: 30 },
    { light: 75, dark: 15 },
    { light: 100, dark: 50 },
  ];

  return (
    <HStack space={2.5} alignItems="flex-end" h={24} mt="auto" w="100%">
      {bars.map((bar, index) => (
        <Box key={index} flex={1} h="100%" justifyContent="flex-end">
          {/* Barra clara (fundo) */}
          <Box bg={lightColor} w="100%" h={`${bar.light}%`} borderRadius={4} position="absolute" bottom={0} />
          {/* Barra escura (frente) */}
          <Box bg={darkColor} w="100%" h={`${bar.dark}%`} borderRadius={4} position="relative" />
        </Box>
      ))}
    </HStack>
  );
}

// Componente placeholder para Nutrição (retângulo com borda arredondada e progress)
function NutritionPlaceholder() {
  const [containerWidth, setContainerWidth] = useState(0);
  const progress = 65; // percentual de progresso
  const strokeWidth = 10;
  const height = 95;
  const radius = 16;

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const width = containerWidth || 120;

  // Calcula o perímetro do retângulo arredondado
  const straightWidth = width - 2 * radius;
  const straightHeight = height - 2 * radius;
  const cornerLength = (2 * Math.PI * radius) / 4; // 1/4 de círculo por canto
  const perimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerLength;

  // Quanto do perímetro preencher baseado no progress
  const progressLength = (progress / 100) * perimeter;

  // Path do retângulo arredondado começando do topo centro (0 graus)
  const pathD = `
    M ${width / 2} ${strokeWidth / 2}
    H ${width - radius - strokeWidth / 2}
    A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${radius + strokeWidth / 2}
    V ${height - radius - strokeWidth / 2}
    A ${radius} ${radius} 0 0 1 ${width - radius - strokeWidth / 2} ${height - strokeWidth / 2}
    H ${radius + strokeWidth / 2}
    A ${radius} ${radius} 0 0 1 ${strokeWidth / 2} ${height - radius - strokeWidth / 2}
    V ${radius + strokeWidth / 2}
    A ${radius} ${radius} 0 0 1 ${radius + strokeWidth / 2} ${strokeWidth / 2}
    H ${width / 2}
  `;

  return (
    <Box mt="auto" h={`${height}px`} w="100%" onLayout={handleLayout}>
      {containerWidth > 0 && (
        <Svg width={width} height={height}>
          {/* Borda clara (fundo) */}
          <Path
            d={pathD}
            stroke="#DCE1E8"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          {/* Progress escuro */}
          <Path
            d={pathD}
            stroke="#818BA0"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="butt"
            strokeDasharray={`${progressLength} ${perimeter}`}
          />
        </Svg>
      )}
    </Box>
  );
}

// Componente para gráfico de linha em degraus (Calorias)
function CaloriesStepChart() {
  const [containerWidth, setContainerWidth] = useState(0);
  const height = 80;
  const numBars = 7;

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  // Calcula largura da barra baseado no espaço disponível
  const width = containerWidth || 154;
  const barWidth = width / numBars;

  // Pontos do gráfico em degraus (step chart)
  // Cada barra horizontal tem a mesma largura
  const steps = [
    { x: 0, y: 35 },
    { x: barWidth, y: 35 },
    { x: barWidth, y: 15 },
    { x: barWidth * 2, y: 15 },
    { x: barWidth * 2, y: 28 },
    { x: barWidth * 3, y: 28 },
    { x: barWidth * 3, y: 8 },
    { x: barWidth * 4, y: 8 },
    { x: barWidth * 4, y: 18 },
    { x: barWidth * 5, y: 18 },
    { x: barWidth * 5, y: 30 },
    { x: barWidth * 6, y: 30 },
    { x: barWidth * 6, y: 15 },
    { x: width, y: 15 },
  ];

  // Centro da última barra para posicionar o indicador
  const lastBarStart = barWidth * 6;
  const lastBarEnd = width;
  const indicatorX = (lastBarStart + lastBarEnd) / 2;
  const indicatorY = 15;

  // Criar path da linha em degraus com cantos arredondados
  const radius = 4; // raio do arredondamento
  let linePath = `M ${steps[0].x} ${steps[0].y}`;

  for (let i = 1; i < steps.length; i++) {
    const prev = steps[i - 1];
    const curr = steps[i];

    // Verifica se é uma mudança de direção (horizontal para vertical ou vice-versa)
    const isHorizontal = prev.y === curr.y;
    const isVertical = prev.x === curr.x;

    if (i < steps.length - 1) {
      const next = steps[i + 1];
      const nextIsHorizontal = curr.y === next.y;
      const nextIsVertical = curr.x === next.x;

      // Se há mudança de direção no ponto atual, usar curva
      if ((isHorizontal && nextIsVertical) || (isVertical && nextIsHorizontal)) {
        // Calcular ponto antes da curva
        const beforeX = isHorizontal ? curr.x - (curr.x > prev.x ? radius : -radius) : curr.x;
        const beforeY = isVertical ? curr.y - (curr.y > prev.y ? radius : -radius) : curr.y;

        // Calcular ponto depois da curva
        const afterX = nextIsHorizontal ? curr.x + (next.x > curr.x ? radius : -radius) : curr.x;
        const afterY = nextIsVertical ? curr.y + (next.y > curr.y ? radius : -radius) : curr.y;

        linePath += ` L ${beforeX} ${beforeY} Q ${curr.x} ${curr.y} ${afterX} ${afterY}`;
        continue;
      }
    }

    linePath += ` L ${curr.x} ${curr.y}`;
  }

  // Posição do círculo final
  const lastPoint = steps[steps.length - 1];

  // Criar path da área (fecha até o fundo - desce reto do último ponto)
  const areaPath = `${linePath} L ${lastPoint.x} ${height} L 0 ${height} Z`;

  return (
    <Box mt="auto" h={20} overflow="visible" w="100%" onLayout={handleLayout}>
      {containerWidth > 0 && (
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient id="stepGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
              <Stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path d={areaPath} fill="url(#stepGradient)" />
          <Path
            d={linePath}
            stroke="#8B5CF6"
            strokeWidth="2.5"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Indicador quadrado arredondado com borda branca - centralizado na última barra */}
          <Rect x={indicatorX - 7} y={indicatorY - 7} width={14} height={14} rx={5} ry={5} fill="white" />
          <Rect x={indicatorX - 5} y={indicatorY - 5} width={10} height={10} rx={3} ry={3} fill="#8B5CF6" />
        </Svg>
      )}
    </Box>
  );
}

// Componente para grid de sono (heat map em tons de rosa/vermelho)
function SleepGrid() {
  const [containerWidth, setContainerWidth] = useState(0);
  const numCols = 7;
  const gap = 4; // espaço entre quadrados

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  // Calcula tamanho do quadrado baseado no espaço disponível
  const squareSize = containerWidth > 0 ? (containerWidth - gap * (numCols - 1)) / numCols : 14;

  // Grid 7x4 com padrão de cores rosa/vermelho
  const pattern = [
    ['#FFE5E5', '#FFB8B8', '#FF8A8A', '#F87171', '#FFB8B8', '#FFE5E5', '#F87171'],
    ['#FFB8B8', '#991B1B', '#7F1D1D', '#FFB8B8', '#F87171', '#FFE5E5', '#FF8A8A'],
    ['#FFE5E5', '#FFB8B8', '#F87171', '#FF8A8A', '#FFE5E5', '#F87171', '#FFB8B8'],
    ['#F87171', '#FFE5E5', '#FFB8B8', '#F87171', '#FFB8B8', '#FF8A8A', '#F87171'],
  ];

  return (
    <VStack space={`${gap}px`} mt="auto" w="100%" onLayout={handleLayout}>
      {containerWidth > 0 &&
        pattern.map((row, rowIndex) => (
          <HStack key={rowIndex} space={`${gap}px`} justifyContent="space-between">
            {row.map((color, colIndex) => (
              <Box key={colIndex} bg={color} w={squareSize} h={squareSize} borderRadius={4} />
            ))}
          </HStack>
        ))}
    </VStack>
  );
}

// Componente para barras horizontais de hidratação (grid 2x3 estilo)
function HydrationBars() {
  // Layout 3 linhas x 2 colunas de barras com proporções (flex)
  const rows = [
    [
      { flex: 2, color: '#0CC1AF' },
      { flex: 8, color: '#ABE4DD' },
    ],
    [
      { flex: 4, color: '#ABE4DD' },
      { flex: 6, color: '#0CC1AF' },
    ],
    [
      { flex: 7, color: '#0CC1AF' },
      { flex: 3, color: '#ABE4DD' },
    ],
  ];

  return (
    <Box mt="auto" w="100%" overflow="hidden">
      <VStack space={2}>
        {rows.map((row, rowIndex) => (
          <HStack key={rowIndex} space={1} alignItems="center">
            {row.map((bar, colIndex) => (
              <Box key={colIndex} bg={bar.color} h={5} flex={bar.flex} borderRadius={5} />
            ))}
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}

// Componente para botão de adicionar novo
function AddNewButton() {
  return (
    <Flex flex={1} alignItems="center" justifyContent="center">
      <Box bg="gray.100" w={12} h={12} borderRadius="full" alignItems="center" justifyContent="center">
        <AddIcon size="24" color="#818BA0" />
      </Box>
    </Flex>
  );
}

export function FitnessCard({ title, value, unit, variant = 'weight', goTo, data, fullWidth }: Props) {
  const isAddNew = variant === 'add-new';

  const renderVisualization = () => {
    switch (variant) {
      case 'weight':
        return <WeightChart />;
      case 'nutrition':
        return <NutritionPlaceholder />;
      case 'calories':
        return <CaloriesStepChart />;
      case 'sleep-grid':
        return <SleepGrid />;
      case 'hydration':
        return <HydrationBars />;
      case 'add-new':
        return <AddNewButton />;
      default:
        return <WeightChart />;
    }
  };

  if (fullWidth) {
    return (
      <Box bg="white" rounded="2xl" h={100} w="100%" overflow="hidden">
        <TouchableOpacity onPress={goTo} style={{ flex: 1 }}>
          <Flex p={4} flex={1} direction="row" alignItems="center" justifyContent="space-between">
            <VStack>
              <Text color="gray.900" fontFamily="Poligon" fontSize={16} fontWeight={600} letterSpacing={-0.16}>
                {title}
              </Text>
              <Flex direction="row" align="flex-end" mt={2}>
                <Text
                  color="gray.900"
                  fontFamily="Poligon"
                  fontSize={28}
                  fontWeight={600}
                  letterSpacing={-0.28}
                  lineHeight={32}
                >
                  {value}
                </Text>
                {unit && (
                  <Text
                    color="gray.500"
                    fontFamily="Poligon"
                    fontSize={14}
                    fontWeight={600}
                    letterSpacing={-0.14}
                    pl={1}
                    lineHeight={20}
                  >
                    {unit}
                  </Text>
                )}
              </Flex>
            </VStack>

            <Box w="40%">
              {renderVisualization()}
            </Box>
          </Flex>
        </TouchableOpacity>
      </Box>
    );
  }

  return (
    <Box bg="white" rounded="2xl" h={230} w={156} flex={1} overflow="hidden">
      <TouchableOpacity onPress={goTo} style={{ flex: 1 }}>
        <Flex p={4} flex={1}>
          <Flex direction="row" justify="space-between" alignItems="center">
            <Text color="gray.900" fontFamily="Poligon" fontSize={16} fontWeight={600} letterSpacing={-0.16}>
              {title}
            </Text>

            {!isAddNew && <EditIcon color="#818BA0" size="24" />}
          </Flex>

          {!isAddNew && value && (
            <Flex direction="row" align="flex-end" mt="17.5px">
              <Text
                color="gray.900"
                fontFamily="Poligon"
                fontSize={24}
                fontWeight={600}
                letterSpacing={-0.24}
                lineHeight={28}
              >
                {value}
              </Text>
              {unit && (
                <Text
                  color="gray.500"
                  fontFamily="Poligon"
                  fontSize={14}
                  fontWeight={600}
                  letterSpacing={-0.14}
                  pl={1}
                  lineHeight={20}
                >
                  {unit}
                </Text>
              )}
            </Flex>
          )}

          {renderVisualization()}
        </Flex>
      </TouchableOpacity>
    </Box>
  );
}
