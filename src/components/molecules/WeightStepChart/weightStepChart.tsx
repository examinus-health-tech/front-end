import React, { useState, useEffect } from 'react';
import { Box, Text, VStack } from 'native-base';
import { LayoutChangeEvent } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Line, G, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

export type DataPoint = {
  value: number;
  label?: string;
};

export type Props = {
  data: DataPoint[];
  unit?: string;
  lineColor?: string;
  gradientColor?: string;
  indicatorColor?: string;
  goalValue?: number;
  goalLineColor?: string;
};

export function WeightStepChart({
  data,
  unit = 'kg',
  lineColor = '#00A38B',
  gradientColor = '#00A38B',
  indicatorColor = '#00A38B',
  goalValue,
  goalLineColor = '#EF4444',
}: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayData, setDisplayData] = useState(data);
  const height = 200;
  const paddingLeft = 40;
  const paddingTop = 20;
  const paddingBottom = 10;
  const chartHeight = height - paddingTop - paddingBottom;

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  // Animação de transição quando dados mudam
  useEffect(() => {
    if (JSON.stringify(data) !== JSON.stringify(displayData)) {
      setIsAnimating(true);
      const timeout = setTimeout(() => {
        setDisplayData(data);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [data]);

  if (displayData.length === 0) return null;

  const chartWidth = containerWidth - paddingLeft;
  const numBars = displayData.length;
  const barWidth = chartWidth / numBars;

  // Encontrar min e max para escala (incluindo goalValue se existir)
  const values = displayData.map((d) => d.value);
  if (goalValue !== undefined) {
    values.push(goalValue);
  }
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);

  // Arredondar para múltiplos de 10 com margem
  const rawMin = Math.floor(dataMin / 10) * 10 - 10;
  const rawMax = Math.ceil(dataMax / 10) * 10 + 10;

  // Gerar labels do eixo Y
  const yAxisLabels: number[] = [];
  const step = Math.ceil((rawMax - rawMin) / 4 / 5) * 5 || 10;
  for (let v = rawMax; v >= rawMin; v -= step) {
    yAxisLabels.push(v);
  }

  // Usar o primeiro e último label como os limites reais da escala
  // Isso garante que a linha de meta fique alinhada com os valores do eixo Y
  const maxValue = yAxisLabels[0];
  const minValue = yAxisLabels[yAxisLabels.length - 1];
  const valueRange = maxValue - minValue;

  // Converter valor para coordenada Y
  const valueToY = (value: number) => {
    return paddingTop + ((maxValue - value) / valueRange) * chartHeight;
  };

  // Criar path com cantos arredondados
  const maxRadius = 18;
  let linePath = '';

  displayData.forEach((point, index) => {
    const xStart = paddingLeft + index * barWidth;
    const xEnd = xStart + barWidth;
    const y = valueToY(point.value);

    if (index === 0) {
      // Se é o único ponto ou o primeiro de vários
      const isOnlyPoint = displayData.length === 1;
      const nextRadius = isOnlyPoint
        ? 0  // Sem arredondamento para ponto único - linha reta até o final
        : index < displayData.length - 1
          ? Math.min(maxRadius, Math.abs(valueToY(displayData[index + 1].value) - y) / 2, barWidth / 2)
          : 0;
      linePath = `M ${xStart} ${y}`;
      linePath += ` L ${xEnd - nextRadius} ${y}`;
    } else {
      const prevY = valueToY(displayData[index - 1].value);
      const goingDown = y > prevY;

      const verticalDistance = Math.abs(y - prevY);
      const r = Math.min(maxRadius, verticalDistance / 2, barWidth / 2);

      if (goingDown) {
        linePath += ` Q ${xStart} ${prevY} ${xStart} ${prevY + r}`;
      } else {
        linePath += ` Q ${xStart} ${prevY} ${xStart} ${prevY - r}`;
      }

      if (verticalDistance > r * 2) {
        if (goingDown) {
          linePath += ` L ${xStart} ${y - r}`;
        } else {
          linePath += ` L ${xStart} ${y + r}`;
        }
      }

      linePath += ` Q ${xStart} ${y} ${xStart + r} ${y}`;

      if (index < displayData.length - 1) {
        const nextVerticalDistance = Math.abs(valueToY(displayData[index + 1].value) - y);
        const nextR = Math.min(maxRadius, nextVerticalDistance / 2, barWidth / 2);
        linePath += ` L ${xEnd - nextR} ${y}`;
      } else {
        linePath += ` L ${xEnd} ${y}`;
      }
    }
  });

  // Gerar steps para cálculo do areaPath
  const steps: { x: number; y: number }[] = [];
  displayData.forEach((point, index) => {
    const xStart = paddingLeft + index * barWidth;
    const xEnd = xStart + barWidth;
    const y = valueToY(point.value);
    if (index > 0) {
      steps.push({ x: xStart, y: valueToY(displayData[index - 1].value) });
    }
    steps.push({ x: xStart, y });
    steps.push({ x: xEnd, y });
  });

  const lastPoint = steps[steps.length - 1];
  const areaPath = `${linePath} L ${lastPoint.x} ${height} L ${paddingLeft} ${height} Z`;

  // Posições dos indicadores (centro de cada barra)
  const indicators = displayData.map((point, index) => ({
    x: paddingLeft + index * barWidth + barWidth / 2,
    y: valueToY(point.value),
    value: point.value,
  }));

  return (
    <Box w="100%" h={height} onLayout={handleLayout}>
      {containerWidth > 0 && (
        <Box position="relative" w="100%" h="100%">
          {/* Labels do eixo Y */}
          <VStack
            position="absolute"
            left={0}
            top={0}
            h="100%"
            justifyContent="space-between"
            pt={`${paddingTop}px`}
            pb={`${paddingBottom}px`}
          >
            {yAxisLabels.map((label, index) => (
              <Text
                key={index}
                fontFamily="Poligon"
                fontSize={12}
                fontWeight={500}
                color="gray.300"
                w={8}
                textAlign="right"
              >
                {label}
              </Text>
            ))}
          </VStack>

          {/* Gráfico SVG com animação */}
          <Animated.View
            key={displayData.map(d => d.value).join('-')}
            entering={FadeIn.duration(300).easing(Easing.out(Easing.cubic))}
            style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: isAnimating ? 0 : 1 }}
          >
            <Svg width={containerWidth} height={height}>
              <Defs>
                <LinearGradient id="weightChartGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={gradientColor} stopOpacity="0.2" />
                  <Stop offset="100%" stopColor={gradientColor} stopOpacity="0" />
                </LinearGradient>
                <LinearGradient id="goalGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={goalLineColor} stopOpacity="0.15" />
                  <Stop offset="100%" stopColor={goalLineColor} stopOpacity="0" />
                </LinearGradient>
              </Defs>

              {/* Linhas de grade horizontais */}
              {yAxisLabels.map((label, index) => {
                const y = paddingTop + (index / (yAxisLabels.length - 1)) * chartHeight;
                return (
                  <Line
                    key={index}
                    x1={paddingLeft}
                    y1={y}
                    x2={containerWidth}
                    y2={y}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                );
              })}

              {/* Área de gradiente abaixo da linha da meta */}
              {goalValue !== undefined && (
                <Path
                  d={`M ${paddingLeft} ${valueToY(goalValue)} L ${containerWidth} ${valueToY(goalValue)} L ${containerWidth} ${height} L ${paddingLeft} ${height} Z`}
                  fill="url(#goalGradient)"
                />
              )}

              {/* Linha horizontal da meta */}
              {goalValue !== undefined && (
                <Line
                  x1={paddingLeft}
                  y1={valueToY(goalValue)}
                  x2={containerWidth}
                  y2={valueToY(goalValue)}
                  stroke={goalLineColor}
                  strokeWidth="2"
                  strokeDasharray="6,4"
                  opacity={0.8}
                />
              )}

              {/* Área do gradiente */}
              <Path d={areaPath} fill="url(#weightChartGradient)" />

              {/* Linha do gráfico */}
              <Path
                d={linePath}
                stroke={lineColor}
                strokeWidth="3"
                fill="none"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* Indicadores em cada ponto */}
              {indicators.map((indicator, index) => (
                <G key={index}>
                  {/* Borda branca */}
                  <Rect
                    x={indicator.x - 9}
                    y={indicator.y - 9}
                    width={18}
                    height={18}
                    rx={6}
                    ry={6}
                    fill="white"
                  />
                  {/* Quadrado colorido */}
                  <Rect
                    x={indicator.x - 7}
                    y={indicator.y - 7}
                    width={14}
                    height={14}
                    rx={4}
                    ry={4}
                    fill={indicatorColor}
                  />
                </G>
              ))}
            </Svg>
          </Animated.View>

          {/* Labels dos valores nos indicadores */}
          {!isAnimating && indicators.map((indicator, index) => (
            <Animated.View
              key={`${index}-${indicator.value}`}
              entering={FadeIn.delay(100 + index * 50).duration(200)}
              style={{
                position: 'absolute',
                left: indicator.x - 28,
                top: indicator.y - 32,
                minWidth: 56,
                alignItems: 'center',
              }}
            >
              <Box bg="gray.800" px={2} py={1} borderRadius={6}>
                <Text fontFamily="Poligon" fontSize={12} fontWeight={600} color="white" numberOfLines={1}>
                  {indicator.value.toLocaleString('pt-BR')}
                </Text>
              </Box>
            </Animated.View>
          ))}
        </Box>
      )}
    </Box>
  );
}
