import { useState, useRef, useEffect } from 'react';
import { VStack, Text, HStack, Box } from 'native-base';
import { View, PanResponder } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { StaggeredStep } from '@components/atoms';

// assets
import {
  ArrowIcon,
  EmojiHappyIcon,
  EmojiNormalIcon,
  EmojiSadIcon,
  EmojiAnxiousIcon,
  EmojiDepressedIcon,
} from '@assets/icons';

// Chevrons inline: precisamos controlar strokeWidth (as Chevron*SmIcon tem strokeWidth hardcoded)
const ThickChevronUp = ({ size = 24, color = '#9CA3AF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 15L10.5858 10.4142C11.3668 9.63317 12.6332 9.63317 13.4142 10.4142L18 15"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ThickChevronDown = ({ size = 24, color = '#9CA3AF' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9L10.5858 13.5858C11.3668 14.3668 12.6332 14.3668 13.4142 13.5858L18 9"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// components
import { Button } from '@components/atoms';
import { useOnboarding } from 'src/hooks/useOnboarding';

export type ISelectedHumour = 1 | 2 | 3 | 4 | 5;

export const humourLabels = {
  1: 'Feliz',
  2: 'Normal',
  3: 'Triste',
  4: 'Ansioso',
  5: 'Depressivo',
};

const humourIcons = {
  1: EmojiHappyIcon,
  2: EmojiNormalIcon,
  3: EmojiSadIcon,
  4: EmojiAnxiousIcon,
  5: EmojiDepressedIcon,
};

const ROW_HEIGHT = 70;
const TOTAL_HEIGHT = ROW_HEIGHT * 5;
const TRACK_WIDTH = 10;
const THUMB_SIZE = 52;

export function Humour() {
  const { onboardingData, setOnboardingData, handleNextStep } = useOnboarding();

  const [selectedHumour, setSelectedHumour] = useState<ISelectedHumour>(
    (onboardingData.humor as ISelectedHumour) || 3,
  );

  const update = (humour: ISelectedHumour) => {
    setSelectedHumour(humour);
    setOnboardingData({ ...onboardingData, humor: humour });
  };

  // Converte Y (px do topo do track) -> humour 1-5
  const yToHumour = (y: number): ISelectedHumour => {
    const idx = Math.floor(y / ROW_HEIGHT);
    return (Math.max(0, Math.min(4, idx)) + 1) as ISelectedHumour;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        update(yToHumour(evt.nativeEvent.locationY));
      },
      onPanResponderMove: (evt) => {
        update(yToHumour(evt.nativeEvent.locationY));
      },
    }),
  ).current;

  // Animação suave do thumb + filled track via SharedValue + spring
  const thumbY = useSharedValue((selectedHumour - 1) * ROW_HEIGHT + ROW_HEIGHT / 2);

  useEffect(() => {
    thumbY.value = withSpring((selectedHumour - 1) * ROW_HEIGHT + ROW_HEIGHT / 2, {
      damping: 18,
      stiffness: 220,
      mass: 0.6,
    });
  }, [selectedHumour]);

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    top: thumbY.value - THUMB_SIZE / 2,
  }));

  const filledAnimatedStyle = useAnimatedStyle(() => ({
    height: TOTAL_HEIGHT - thumbY.value,
  }));

  return (
    <VStack flex={1} mx={6} space={4}>
      <StaggeredStep flexChildIndex={1} space={4}>
        <Text color="gray.900" fontSize={32} fontWeight={800} lineHeight={38} letterSpacing={-1.2} mt={4}>
          Como está seu humor atualmente?
        </Text>

        <Box flex={1} alignItems="center" justifyContent="center">
        <Box position="relative" w="100%" h={`${TOTAL_HEIGHT}px`}>
          {/* Rows: label esquerda + emoji direita (sem linha decorativa) */}
          {([1, 2, 3, 4, 5] as ISelectedHumour[]).map((value) => {
            const Icon = humourIcons[value];
            const isSelected = selectedHumour === value;

            return (
              <HStack
                key={value}
                h={`${ROW_HEIGHT}px`}
                alignItems="center"
                justifyContent="space-between"
                opacity={isSelected ? 1 : 0.4}
              >
                <Text
                  fontSize={16}
                  fontWeight={isSelected ? 600 : 400}
                  color={isSelected ? 'gray.900' : 'gray.400'}
                  w={24}
                >
                  {humourLabels[value]}
                </Text>

                <Icon size="48" color={isSelected ? '#3D4966' : '#BEC5D2'} />
              </HStack>
            );
          })}

          {/* Slider vertical custom: track + filled + thumb quadrado */}
          <View
            {...panResponder.panHandlers}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: TOTAL_HEIGHT,
              alignItems: 'center',
            }}
            testID="slider-humour"
          >
            {/* Track de fundo (cinza, vertical, contínuo) */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                width: TRACK_WIDTH,
                height: TOTAL_HEIGHT,
                backgroundColor: '#E5E7EB',
                borderRadius: TRACK_WIDTH / 2,
              }}
            />
            {/* Track preenchido (animado via SharedValue) */}
            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: 'absolute',
                  bottom: 0,
                  width: TRACK_WIDTH,
                  backgroundColor: '#EC5569',
                  borderRadius: TRACK_WIDTH / 2,
                },
                filledAnimatedStyle,
              ]}
            />
            {/* Thumb: quadrado branco com borda vermelha + glow + chevrons (animado) */}
            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: 'absolute',
                  width: THUMB_SIZE,
                  height: THUMB_SIZE,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  borderWidth: 7,
                  borderColor: '#EC5569',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#EC5569',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 8,
                },
                thumbAnimatedStyle,
              ]}
            >
              <ThickChevronUp size={18} color="#9CA3AF" />
              <View style={{ marginTop: -6 }}>
                <ThickChevronDown size={18} color="#9CA3AF" />
              </View>
            </Animated.View>
          </View>
        </Box>
      </Box>
      </StaggeredStep>

      <Button
        testID="btn-onboarding-continue"
        position="absolute"
        bottom={-50}
        variant="primary"
        size="full"
        title="Continuar"
        onPress={() => {
          handleNextStep();
        }}
        icon={<ArrowIcon />}
      />
    </VStack>
  );
}
