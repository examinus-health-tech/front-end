import { useState, ReactNode } from 'react';
import { Box, HStack, VStack, Text } from 'native-base';
import { LayoutChangeEvent, TouchableOpacity } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

export type ActivityCardVariant = 'green' | 'yellow' | 'blue' | 'purple';

export type Props = {
  title: string;
  calories: number;
  variant?: ActivityCardVariant;
  icon?: ReactNode;
  onPress?: () => void;
};

const variantColors: Record<ActivityCardVariant, { bg: string; iconBg: string; chart: string; chartLight: string }> = {
  green: {
    bg: '#E6F7F5',
    iconBg: '#C2EDE8',
    chart: '#0CC1AF',
    chartLight: 'rgba(12, 193, 175, 0.2)',
  },
  yellow: {
    bg: '#FEF9E6',
    iconBg: '#FDF0C4',
    chart: '#F5C518',
    chartLight: 'rgba(245, 197, 24, 0.2)',
  },
  blue: {
    bg: '#E6F0FF',
    iconBg: '#C4D9FF',
    chart: '#3B82F6',
    chartLight: 'rgba(59, 130, 246, 0.2)',
  },
  purple: {
    bg: '#F3E8FF',
    iconBg: '#E2CFFF',
    chart: '#8B5CF6',
    chartLight: 'rgba(139, 92, 246, 0.2)',
  },
};

// Mini step chart component
function MiniStepChart({ color, lightColor }: { color: string; lightColor: string }) {
  const [containerWidth, setContainerWidth] = useState(0);
  const height = 40;

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const width = containerWidth || 80;
  const numBars = 5;
  const barWidth = width / numBars;

  // Pontos do gráfico em degraus
  const steps = [
    { x: 0, y: 25 },
    { x: barWidth, y: 25 },
    { x: barWidth, y: 12 },
    { x: barWidth * 2, y: 12 },
    { x: barWidth * 2, y: 30 },
    { x: barWidth * 3, y: 30 },
    { x: barWidth * 3, y: 18 },
    { x: barWidth * 4, y: 18 },
    { x: barWidth * 4, y: 8 },
    { x: width, y: 8 },
  ];

  // Criar path da linha em degraus com cantos arredondados
  const radius = 3;
  let linePath = `M ${steps[0].x} ${steps[0].y}`;

  for (let i = 1; i < steps.length; i++) {
    const prev = steps[i - 1];
    const curr = steps[i];

    const isHorizontal = prev.y === curr.y;
    const isVertical = prev.x === curr.x;

    if (i < steps.length - 1) {
      const next = steps[i + 1];
      const nextIsHorizontal = curr.y === next.y;
      const nextIsVertical = curr.x === next.x;

      if ((isHorizontal && nextIsVertical) || (isVertical && nextIsHorizontal)) {
        const beforeX = isHorizontal ? curr.x - (curr.x > prev.x ? radius : -radius) : curr.x;
        const beforeY = isVertical ? curr.y - (curr.y > prev.y ? radius : -radius) : curr.y;

        const afterX = nextIsHorizontal ? curr.x + (next.x > curr.x ? radius : -radius) : curr.x;
        const afterY = nextIsVertical ? curr.y + (next.y > curr.y ? radius : -radius) : curr.y;

        linePath += ` L ${beforeX} ${beforeY} Q ${curr.x} ${curr.y} ${afterX} ${afterY}`;
        continue;
      }
    }

    linePath += ` L ${curr.x} ${curr.y}`;
  }

  // Posição do indicador
  const indicatorX = width - barWidth / 2;
  const indicatorY = 8;

  return (
    <Box h={`${height}px`} w="100%" onLayout={handleLayout}>
      {containerWidth > 0 && (
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Path
            d={linePath}
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Indicador quadrado */}
          <Rect x={indicatorX - 5} y={indicatorY - 5} width={10} height={10} rx={3} ry={3} fill="white" />
          <Rect x={indicatorX - 3.5} y={indicatorY - 3.5} width={7} height={7} rx={2} ry={2} fill={color} />
        </Svg>
      )}
    </Box>
  );
}

export function ActivityCard({ title, calories, variant = 'green', icon, onPress }: Props) {
  const colors = variantColors[variant];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Box bg={colors.bg} borderRadius={16} px={4} py={4}>
        <HStack alignItems="center" space={3}>
          {/* Ícone */}
          {icon && (
            <Box
              bg={colors.iconBg}
              w={12}
              h={12}
              borderRadius={14}
              alignItems="center"
              justifyContent="center"
            >
              {icon}
            </Box>
          )}

          {/* Texto */}
          <VStack flex={1}>
            <Text
              fontFamily="Poligon"
              fontSize={14}
              fontWeight={600}
              color="gray.900"
              letterSpacing={-0.14}
            >
              {title}
            </Text>
            <Text
              fontFamily="Poligon"
              fontSize={12}
              fontWeight={500}
              color="gray.400"
              letterSpacing={-0.12}
            >
              {calories} Calorias gastas
            </Text>
          </VStack>

          {/* Gráfico */}
          <Box w={20}>
            <MiniStepChart color={colors.chart} lightColor={colors.chartLight} />
          </Box>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
}
