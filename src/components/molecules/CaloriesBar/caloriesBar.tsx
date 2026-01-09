import { useState } from 'react';
import { Box, HStack } from 'native-base';
import { LayoutChangeEvent } from 'react-native';

export type Props = {
  burned: number; // calorias gastas
  target: number; // meta de calorias
  gap?: number;
};

export function CaloriesBar({ burned, target, gap = 8 }: Props) {
  const [containerWidth, setContainerWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  // Calcula as proporções
  const remaining = Math.max(0, target - burned);
  const total = target;

  // Proporções para cada segmento (normalizado para o total)
  const burnedRatio = Math.min(burned / total, 1);
  const targetRatio = burned >= target ? 0 : 0.15; // Pequena porção para indicar alvo
  const remainingRatio = Math.max(0, 1 - burnedRatio - targetRatio);

  // Larguras calculadas
  const totalGapWidth = gap * 2;
  const availableWidth = containerWidth - totalGapWidth;

  const burnedWidth = availableWidth * burnedRatio;
  const targetWidth = availableWidth * targetRatio;
  const remainingWidth = availableWidth * remainingRatio;

  // Altura das barras
  const barHeight = '56px';
  const borderRadius = 10;

  return (
    <HStack w="100%" space={`${gap}px`} onLayout={handleLayout}>
      {containerWidth > 0 && (
        <>
          {/* Calorias Gastas - Verde claro */}
          {burnedWidth > 0 && (
            <Box
              bg="#6FD3C6"
              h={barHeight}
              w={burnedWidth}
              borderRadius={borderRadius}
            />
          )}

          {/* Alvo - Verde */}
          {targetWidth > 0 && (
            <Box
              bg="#0CC1AF"
              h={barHeight}
              w={targetWidth}
              borderRadius={borderRadius}
            />
          )}

          {/* Faltam - Roxo */}
          {remainingWidth > 0 && (
            <Box
              bg="#8A3FFC"
              h={barHeight}
              w={remainingWidth}
              borderRadius={borderRadius}
            />
          )}
        </>
      )}
    </HStack>
  );
}
