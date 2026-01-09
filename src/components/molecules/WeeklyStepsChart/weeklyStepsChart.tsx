import { useState, useEffect, useRef } from 'react';
import { Box, HStack, VStack, Text } from 'native-base';
import { LayoutChangeEvent, Animated } from 'react-native';

export type DayData = {
  label: string;
  value: number;
  isActive?: boolean;
};

export type ChartPeriod = 'weekly' | 'monthly' | 'yearly';

export type Props = {
  data: DayData[];
  goal: number;
  period?: ChartPeriod;
};

function AnimatedBar({ heightPercent, barWidth, barHeight, lightColor, darkColor, delay }: {
  heightPercent: number;
  barWidth: number;
  barHeight: number;
  lightColor: string;
  darkColor: string;
  delay: number;
}) {
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animatedHeight.setValue(0);
    Animated.timing(animatedHeight, {
      toValue: Math.max(heightPercent, 5),
      duration: 400,
      delay: delay * 50,
      useNativeDriver: false,
    }).start();
  }, [heightPercent]);

  return (
    <Box h={`${barHeight}px`} w={`${barWidth}px`} justifyContent="flex-end">
      {/* Barra clara (fundo - 100%) */}
      <Box
        bg={lightColor}
        h="100%"
        w={`${barWidth}px`}
        borderRadius={6}
        position="absolute"
        bottom={0}
      />
      {/* Barra escura (frente - dados) */}
      <Animated.View
        style={{
          backgroundColor: darkColor,
          height: animatedHeight.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
          width: barWidth,
          borderRadius: 6,
        }}
      />
    </Box>
  );
}

export function WeeklyStepsChart({ data, goal, period = 'weekly' }: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [data]);

  const maxValue = Math.max(...data.map((d) => d.value), goal);
  const barHeight = 85;
  const barWidth = 12;

  const lightColor = '#DCE1E8';
  const darkColor = '#052B3B';

  return (
    <VStack w="100%" onLayout={handleLayout} mt={4}>
      {containerWidth > 0 && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <HStack justifyContent="space-between" alignItems="flex-end" h={`${barHeight + 28}px`}>
            {data.map((item, index) => {
              const heightPercent = (item.value / maxValue) * 100;

              return (
                <VStack key={`${period}-${index}`} alignItems="center" space={3} flex={1}>
                  <AnimatedBar
                    heightPercent={heightPercent}
                    barWidth={barWidth}
                    barHeight={barHeight}
                    lightColor={lightColor}
                    darkColor={darkColor}
                    delay={index}
                  />
                  {/* Label */}
                  <Text
                    fontFamily="Poligon"
                    fontSize={12}
                    fontWeight={item.isActive ? 700 : 500}
                    color={item.isActive ? 'gray.900' : 'gray.400'}
                    letterSpacing={-0.12}
                  >
                    {item.label}
                  </Text>
                </VStack>
              );
            })}
          </HStack>
        </Animated.View>
      )}
    </VStack>
  );
}
