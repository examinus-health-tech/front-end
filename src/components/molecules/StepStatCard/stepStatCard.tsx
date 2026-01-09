import { ReactNode } from 'react';
import { Box, VStack, Text } from 'native-base';
import Svg, { Path } from 'react-native-svg';

export type StepStatCardVariant = 'orange' | 'blue' | 'purple';

export type Props = {
  value: string;
  unit: string;
  icon: ReactNode;
  variant?: StepStatCardVariant;
  progress?: number; // 0-100
};

const variantColors: Record<StepStatCardVariant, { stroke: string; bg: string }> = {
  orange: {
    stroke: '#FA4D5E',
    bg: '#FFF7ED',
  },
  blue: {
    stroke: '#99BACE',
    bg: '#EFF6FF',
  },
  purple: {
    stroke: '#8A3FFC',
    bg: '#F5F3FF',
  },
};

function MiniProgress({ progress = 50, color }: { progress: number; color: string }) {
  const size = 68;
  const strokeWidth = 8;
  const radius = 14;

  // Path do quadrado completo com cantos arredondados (começa do topo centro)
  const pathD = `
    M ${size / 2} ${strokeWidth / 2}
    H ${size - radius - strokeWidth / 2}
    A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${radius + strokeWidth / 2}
    V ${size - radius - strokeWidth / 2}
    A ${radius} ${radius} 0 0 1 ${size - radius - strokeWidth / 2} ${size - strokeWidth / 2}
    H ${radius + strokeWidth / 2}
    A ${radius} ${radius} 0 0 1 ${strokeWidth / 2} ${size - radius - strokeWidth / 2}
    V ${radius + strokeWidth / 2}
    A ${radius} ${radius} 0 0 1 ${radius + strokeWidth / 2} ${strokeWidth / 2}
    H ${size / 2}
  `;

  // Calcula o perímetro do quadrado arredondado
  const straightSide = size - 2 * radius - strokeWidth;
  const cornerLength = (2 * Math.PI * radius) / 4;
  const perimeter = 4 * straightSide + 4 * cornerLength;

  const progressLength = (progress / 100) * perimeter;

  return (
    <Svg width={size} height={size}>
      {/* Fundo cinza */}
      <Path
        d={pathD}
        stroke="#E5E7EB"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="butt"
      />
      {/* Progress colorido */}
      <Path
        d={pathD}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="butt"
        strokeDasharray={`${progressLength} ${perimeter}`}
      />
    </Svg>
  );
}

export function StepStatCard({ value, unit, icon, variant = 'orange', progress = 50 }: Props) {
  const colors = variantColors[variant];

  return (
    <VStack flex={1} alignItems="center" space={2}>
      {/* Mini progress com ícone */}
      <Box position="relative" w="68px" h="68px">
        <MiniProgress progress={progress} color={colors.stroke} />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </Box>
      </Box>

      <Text fontFamily="Poligon" fontSize={14} fontWeight={700} color="gray.900" letterSpacing={-0.14}>
        {value}
        <Text fontFamily="Poligon" fontSize={12} fontWeight={600} color="gray.400">
          {unit}
        </Text>
      </Text>
    </VStack>
  );
}
