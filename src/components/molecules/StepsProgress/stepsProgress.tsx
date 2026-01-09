import { useState } from 'react';
import { Box, VStack, Text, HStack } from 'native-base';
import { LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { WalkingIcon } from '@assets/icons';

export type Props = {
  steps: number;
  goal: number;
};

export function StepsProgress({ steps, goal }: Props) {
  const [containerWidth, setContainerWidth] = useState(0);

  const progress = Math.min((steps / goal) * 100, 100);
  const strokeWidth = 20;
  const height = 190;
  const radius = 32;

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const width = containerWidth || 200;

  // Path do meio retângulo (U invertido) - começa na esquerda embaixo, sobe, curva, vai pra direita, curva, desce
  const pathD = `
    M ${strokeWidth / 2} ${height}
    V ${radius + strokeWidth / 2}
    A ${radius} ${radius} 0 0 1 ${radius + strokeWidth / 2} ${strokeWidth / 2}
    H ${width - radius - strokeWidth / 2}
    A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${radius + strokeWidth / 2}
    V ${height}
  `;

  // Calcula o perímetro do meio retângulo (U)
  const straightHeight = height - radius - strokeWidth / 2;
  const straightWidth = width - 2 * radius - strokeWidth;
  const cornerLength = (2 * Math.PI * radius) / 4;
  const perimeter = 2 * straightHeight + straightWidth + 2 * cornerLength;

  // Quanto do perímetro preencher baseado no progress
  const progressLength = (progress / 100) * perimeter;

  return (
    <Box w="100%" onLayout={handleLayout}>
      {containerWidth > 0 && (
        <Box position="relative" h={`${height}px`}>
          {/* SVG do progresso */}
          <Svg width={width} height={height} style={{ position: 'absolute' }}>
            {/* Borda clara (fundo) */}
            <Path d={pathD} stroke="#E5E7EB" strokeWidth={strokeWidth} fill="none" strokeLinecap="butt" />
            {/* Progress colorido */}
            <Path
              d={pathD}
              stroke="#0CC1AF"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="butt"
              strokeDasharray={`${progressLength} ${perimeter}`}
            />
            {/* Linha pontilhada interna */}
            <Path
              d={`
                M ${strokeWidth + 20} ${height}
                V ${strokeWidth + 20 + 16}
                A 16 16 0 0 1 ${strokeWidth + 20 + 16} ${strokeWidth + 20}
                H ${width - strokeWidth - 20 - 16}
                A 16 16 0 0 1 ${width - strokeWidth - 20} ${strokeWidth + 20 + 16}
                V ${height}
              `}
              stroke="#1F2937"
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              strokeDasharray="0.1 18"
            />
          </Svg>

          {/* Conteúdo central */}
          <VStack position="absolute" top={0} left={0} right={0} bottom={0} alignItems="center" pt={16}>
            <Box>
              <WalkingIcon size="24" color="#052B3B" />
            </Box>
            <Text
              fontFamily="Poligon"
              fontSize={48}
              fontWeight={800}
              letterSpacing={-1.92}
              color="gray.900"
              lineHeight={56}
              mt={3}
            >
              {steps.toLocaleString('pt-BR')}
            </Text>
            <Text fontFamily="Poligon" fontSize={20} fontWeight={600} color="gray.400" letterSpacing={-0.2} mt="12px">
              Passos
            </Text>
          </VStack>

          {/* Labels 0 e meta */}
          <Box position="absolute" bottom={-24} left={0}>
            <Text
              fontFamily="Poligon"
              fontSize={12}
              fontWeight={600}
              color="gray.300"
              textAlign="center"
              w={`${strokeWidth}px`}
            >
              0
            </Text>
          </Box>
          <Box position="absolute" bottom={-24} right={-15}>
            <Text
              fontFamily="Poligon"
              fontSize={12}
              fontWeight={600}
              color="gray.300"
              textAlign="center"
              w={`${strokeWidth + 30}px`}
            >
              {goal.toLocaleString('pt-BR')}
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
