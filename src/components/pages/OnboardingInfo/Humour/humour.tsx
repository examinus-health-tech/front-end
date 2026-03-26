import { useState } from 'react';
import { VStack, Text, HStack, Box, Slider } from 'native-base';

// assets
import {
  ArrowIcon,
  EmojiHappyIcon,
  EmojiNormalIcon,
  EmojiSadIcon,
  EmojiAnxiousIcon,
  EmojiDepressedIcon,
} from '@assets/icons';

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

export function Humour() {
  const { onboardingData, setOnboardingData, handleNextStep } = useOnboarding();

  const [selectedHumour, setSelectedHumour] = useState<ISelectedHumour>(
    (onboardingData.humor as ISelectedHumour) || 3
  );

  const handleSliderChange = (value: number) => {
    const humourValue = Math.round(value) as ISelectedHumour;
    setSelectedHumour(humourValue);
    setOnboardingData({ ...onboardingData, humor: humourValue });
  };

  return (
    <VStack flex={1} mx={6} space={4}>
      <Text color="gray.900" fontSize={32} fontWeight={800} lineHeight={38} letterSpacing={-1.2} mt={4}>
        Como está seu humor atualmente?
      </Text>

      <VStack flex={1} alignItems="center" justifyContent="center" space={8}>
        {/* Emojis com labels */}
        <VStack space={6} w="100%">
          {([1, 2, 3, 4, 5] as ISelectedHumour[]).map((value) => {
            const Icon = humourIcons[value];
            const isSelected = selectedHumour === value;

            return (
              <HStack
                key={value}
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

                <Box h={1} flex={1} bg="gray.200" mx={4} />

                <Icon size="48" color={isSelected ? '#3D4966' : '#BEC5D2'} />
              </HStack>
            );
          })}
        </VStack>

        {/* Slider vertical  - Simulado com slider horizontal rotacionado */}
        <Box w="80%" alignItems="center" mt={-16}>
          <Slider
            w="100%"
            minValue={1}
            maxValue={5}
            step={1}
            defaultValue={selectedHumour}
            onChange={handleSliderChange}
          >
            <Slider.Track bg="gray.200">
              <Slider.FilledTrack bg="#EC5569" />
            </Slider.Track>
            <Slider.Thumb bg="#EC5569" />
          </Slider>
        </Box>
      </VStack>

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
