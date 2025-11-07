import { VStack, Text, Center } from 'native-base';
import { RulerPicker } from 'react-native-ruler-picker';

// routes

// assets
import { ArrowIcon } from '@assets/icons';

// components
import { Button } from '@components/atoms';
import { useOnboarding } from 'src/hooks/useOnboarding';
import { useState } from 'react';

export function Height() {
  const { onboardingData, setOnboardingData, handleNextStep } = useOnboarding();

  const [height, setHeight] = useState<number>(onboardingData.height || 1.45);

  const handleHeightChange = (value: string) => {
    const parsedHeight = parseFloat(value);

    // Ignorar valor 0 que o RulerPicker dispara na inicialização
    if (parsedHeight === 0) {
      return;
    }

    setHeight(parsedHeight);
  };

  const handleHeightChangeEnd = (value: string) => {
    const parsedHeight = parseFloat(value);

    // Ignorar valor 0 que o RulerPicker dispara na inicialização
    if (parsedHeight === 0) {
      return;
    }

    setHeight(parsedHeight);
    setOnboardingData({ ...onboardingData, height: parsedHeight });
  };

  return (
    <VStack flex={1} mx={6} space={8}>
      <Text color="gray.900" fontSize={32} fontWeight={800} lineHeight={38} letterSpacing={-1.2} mt={4}>
        Qual é a sua altura?
      </Text>

      <Center>
        <RulerPicker
          min={0}
          max={240}
          step={0.01}
          fractionDigits={2}
          initialValue={height}
          onValueChange={handleHeightChange}
          onValueChangeEnd={handleHeightChangeEnd}
          unit="m"
          stepWidth={4}
          gapBetweenSteps={10}
          shortStepHeight={20}
          longStepHeight={90}
          indicatorHeight={180}
          indicatorColor="#0CC1AF"
          shortStepColor="#BEC5D2"
          longStepColor="#3D4966"
          valueTextStyle={{
            fontSize: 60,
            fontWeight: '800',
            color: '#052B3B',
          }}
          unitTextStyle={{
            fontSize: 24,
            fontWeight: '600',
            color: '#3D4966',
          }}
        />
      </Center>

      <Button
        position="absolute"
        bottom={-50}
        variant="primary"
        size="full"
        title="Continuar"
        onPress={() => {
          const data = { ...onboardingData, height };

          setOnboardingData(data);
          handleNextStep();
        }}
        icon={<ArrowIcon />}
      />
    </VStack>
  );
}
