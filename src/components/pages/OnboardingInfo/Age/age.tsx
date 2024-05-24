import { Box, HStack, Image, ScrollView, Text, VStack } from 'native-base';
import { useEffect, useState } from 'react';

// routes

// assets
import { ArrowIcon } from '@assets/icons';
import MaleElderly from '@assets/png/vector-7.png';
import FemaElderly from '@assets/png/vector-24.png';
import Babe from '@assets/png/vector-25.png';
import MaleTeenage from '@assets/png/vector-28.png';
import FameTeenage from '@assets/png/vector-29.png';
import MaleAdult from '@assets/png/vector-26.png';
import FameAdult from '@assets/png/vector-27.png';

// components
import { Button } from '@components/atoms';
import { TouchableOpacity } from 'react-native';
import { useOnboarding } from 'src/hooks/useOnboarding';

export function Age() {
  const [selectedAge, setSelectedAge] = useState<number>(20);
  const [coordinate, setCoordinate] = useState<number[]>([]);
  const [ref, setRef] = useState<string>('');

  const { onboardingData, setOnboardingData, handleNextStep } = useOnboarding();

  const manyTimes = 90;

  function handleRulerAge() {
    const agesComponents: JSX.Element[] = [];

    const handleAges = () => {
      for (let i = 1; i <= manyTimes; i++) {
        agesComponents.push(
          <TouchableOpacity
            key={i}
            onPress={() => {
              setSelectedAge(i);
            }}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              coordinate[i] = layout.x;
              setCoordinate(coordinate);
            }}
          >
            <Box
              bg={selectedAge === i ? 'ciano.300' : 'gray.100'}
              rounded="xl"
              w={20}
              h={28}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Text
                color={selectedAge === i ? 'ciano.50' : 'gray.300'}
                fontSize={40}
                fontWeight={800}
                letterSpacing={-1.44}
              >
                {i}
              </Text>
            </Box>
          </TouchableOpacity>
        );
      }

      return agesComponents;
    };

    return (
      <ScrollView
        horizontal
        ref={(ref: string) => {
          setRef(ref);
        }}
        mx={-6}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        <HStack space={4} mx={4} alignItems="center">
          {handleAges()}
        </HStack>
      </ScrollView>
    );
  }

  useEffect(() => {
    if (coordinate.length > selectedAge) {
      ref?.scrollTo({
        x: 0,
        y: coordinate[selectedAge - 3] + 120,
        animated: true,
      });
    }
  }, []);

  return (
    <VStack flex={1} mx={6} space={8}>
      <Text
        color="gray.900"
        fontSize={32}
        fontWeight={800}
        lineHeight={38}
        letterSpacing={-1.2}
        mt={4}
      >
        Qual é sua idade?
      </Text>

      <VStack mt={16} alignItems="center" space={16}>
        {selectedAge <= 10 && (
          <Image
            source={Babe}
            alt={'Babe'}
            resizeMode="stretch"
            w={360}
            h={280}
          />
        )}

        {(onboardingData.gender == 'M' || !onboardingData.gender) &&
          selectedAge > 10 &&
          selectedAge <= 24 && (
            <Image
              source={MaleTeenage}
              alt={'MaleTeenage'}
              resizeMode="stretch"
              h={280}
            />
          )}

        {(onboardingData.gender == 'M' || !onboardingData.gender) &&
          selectedAge > 24 &&
          selectedAge <= 48 && (
            <Image
              source={MaleAdult}
              alt={'MaleAdult'}
              resizeMode="stretch"
              w={360}
              h={280}
            />
          )}

        {(onboardingData.gender == 'M' || !onboardingData.gender) &&
          selectedAge > 48 && (
            <Image
              source={MaleElderly}
              alt={'MaleElderly'}
              resizeMode="stretch"
              w={360}
              h={280}
            />
          )}

        {onboardingData.gender == 'F' &&
          selectedAge > 10 &&
          selectedAge <= 24 && (
            <Image
              source={FameTeenage}
              alt={'FameTeenage'}
              resizeMode="stretch"
              w={360}
              h={280}
            />
          )}

        {onboardingData.gender == 'F' &&
          selectedAge > 24 &&
          selectedAge <= 48 && (
            <Image
              source={FameAdult}
              alt={'FameAdult'}
              resizeMode="stretch"
              w={360}
              h={280}
            />
          )}

        {onboardingData.gender == 'F' && selectedAge > 48 && (
          <Image
            source={FemaElderly}
            alt={'FemaElderly'}
            resizeMode="stretch"
            w={360}
            h={280}
          />
        )}

        {handleRulerAge()}

        <Text
          fontSize={16}
          fontWeight={500}
          lineHeight={25.6}
          mt={-12}
          color="gray.600"
        >
          Eu tenho {selectedAge} anos
        </Text>
      </VStack>

      <Button
        position="absolute"
        bottom={-50}
        variant="primary"
        size="full"
        title="Continuar"
        onPress={() => {
          const data = { ...onboardingData, age: selectedAge };
          setOnboardingData(data);
          handleNextStep();
        }}
        icon={<ArrowIcon />}
      />
    </VStack>
  );
}
