import { Box, HStack, Image, ScrollView, Text, VStack } from 'native-base';
import React, { useEffect, useState, useRef } from 'react';

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
import { TouchableOpacity, Dimensions } from 'react-native';
import { useOnboarding } from 'src/hooks/useOnboarding';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = 80; // w={20} = 80px
const CARD_SPACING = 16; // space={4} = 16px

export function Age() {
  const [selectedAge, setSelectedAge] = useState<number>(20);
  const scrollView = useRef<any>(null);

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
        ref={scrollView}
        mx={-6}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: SCREEN_WIDTH / 2 - CARD_WIDTH / 2,
          paddingLeft: SCREEN_WIDTH / 2 - CARD_WIDTH / 2,
          paddingRight: SCREEN_WIDTH / 2 - CARD_WIDTH / 2,
        }}
      >
        <HStack space={4} alignItems="center">
          {handleAges()}
        </HStack>
      </ScrollView>
    );
  }

  function scrollToCenter() {
    if (scrollView.current && selectedAge > 0) {
      // Calcular a posição x do card selecionado
      // (índice - 1) porque começamos em 1, não em 0
      const index = selectedAge - 1;

      // Posição do card = índice * (largura do card + espaçamento)
      const cardPosition = index * (CARD_WIDTH + CARD_SPACING);

      scrollView.current.scrollTo({
        x: cardPosition,
        y: 0,
        animated: true
      });
    }
  }

  useEffect(() => {
    if (onboardingData.age) {
      setSelectedAge(onboardingData.age);
    }
  }, []);

  useEffect(() => {
    if (selectedAge > 0) {
      // Pequeno delay para garantir que o layout foi renderizado
      setTimeout(() => {
        scrollToCenter();
      }, 100);
    }
  }, [selectedAge]);

  // Salvar automaticamente quando a idade mudar
  useEffect(() => {
    if (selectedAge > 0) {
      setOnboardingData({ ...onboardingData, age: selectedAge });
    }
  }, [selectedAge]);

  return (
    <VStack flex={1} mx={6} space={8}>
      <Text color="gray.900" fontSize={32} fontWeight={800} lineHeight={38} letterSpacing={-1.2} mt={4}>
        Qual é sua idade?
      </Text>

      <VStack alignItems="center" space={4}>
        {selectedAge <= 10 && <Image source={Babe} alt={'Babe'} resizeMode="stretch" w={360} h={280} />}

        {(onboardingData.gender == 'M' || !onboardingData.gender) && selectedAge > 10 && selectedAge <= 24 && (
          <Image source={MaleTeenage} alt={'MaleTeenage'} resizeMode="stretch" h={280} />
        )}

        {(onboardingData.gender == 'M' || !onboardingData.gender) && selectedAge > 24 && selectedAge <= 48 && (
          <Image source={MaleAdult} alt={'MaleAdult'} resizeMode="stretch" w={360} h={280} />
        )}

        {(onboardingData.gender == 'M' || !onboardingData.gender) && selectedAge > 48 && (
          <Image source={MaleElderly} alt={'MaleElderly'} resizeMode="stretch" w={360} h={280} />
        )}

        {onboardingData.gender == 'F' && selectedAge > 10 && selectedAge <= 24 && (
          <Image source={FameTeenage} alt={'FameTeenage'} resizeMode="stretch" w={360} h={280} />
        )}

        {onboardingData.gender == 'F' && selectedAge > 24 && selectedAge <= 48 && (
          <Image source={FameAdult} alt={'FameAdult'} resizeMode="stretch" w={360} h={280} />
        )}

        {onboardingData.gender == 'F' && selectedAge > 48 && (
          <Image source={FemaElderly} alt={'FemaElderly'} resizeMode="stretch" w={360} h={280} />
        )}

        {handleRulerAge()}

        <Text fontSize={16} fontWeight={500} lineHeight={25.6} color="gray.600">
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
