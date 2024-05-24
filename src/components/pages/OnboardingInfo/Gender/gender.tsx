import { useEffect, useRef, useState } from 'react';
import {
  Image,
  VStack,
  Text,
  Flex,
  Box,
  HStack,
  Checkbox,
  ScrollView,
  IScrollViewProps,
} from 'native-base';
import { TouchableOpacity } from 'react-native';

// routes

// assets
import { ArrowIcon, FemaleIcon, MaleIcon } from '@assets/icons';
import Vector1 from '@assets/png/vector-5.png';
import Vector2 from '@assets/png/vector-6.png';

// components
import { Button } from '@components/atoms/Button/button';
import { useOnboarding } from 'src/hooks/useOnboarding';

export function Gender() {
  const [gender, setGender] = useState<'M' | 'F'>('' as 'M' | 'F');

  const { onboardingData, setOnboardingData, handleNextStep } = useOnboarding();

  const scrollRef = useRef<null | IScrollViewProps | HTMLElement>(null);

  useEffect(() => {
    if (onboardingData.gender) {
      setGender(onboardingData.gender);

      if (onboardingData.gender === 'M') {
        scrollRef.current?.scrollToEnd({ animated: true });
      }
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
        Qual seu Gênero?
      </Text>

      <Text
        color="gray.500"
        fontSize={16}
        fontWeight={500}
        lineHeight={24}
        mt={-2}
      >
        Selecione seu gênero para uma melhor {'\n'}
        experiência de saúde personalizada.
      </Text>

      <ScrollView
        horizontal
        ref={scrollRef}
        mx={-6}
        mt={-16}
        showsHorizontalScrollIndicator={false}
      >
        <HStack space={8} mx={4} alignItems="center">
          <TouchableOpacity
            onPress={() => {
              setGender('F');
              scrollRef.current?.scrollTo({ y: 0, animated: true });
            }}
          >
            <Box
              bg={'red.400'}
              rounded="xl"
              w={gender == 'F' ? 260 : 240}
              h={gender == 'F' ? 380 : 320}
              shadow={gender == 'F' ? 9 : 0}
            >
              <Flex
                direction="row"
                align="center"
                my={gender == 'F' ? 5 : 4}
                mx={-2}
                justify="space-around"
              >
                <Flex direction="row" align="center">
                  <FemaleIcon />

                  <Text
                    color="white"
                    fontSize={16}
                    fontWeight={600}
                    letterSpacing={-0.16}
                    ml={2}
                  >
                    Eu sou Mulher
                  </Text>
                </Flex>

                <Checkbox
                  value="ok"
                  bg="red.400"
                  borderColor="white"
                  aria-label="Eu sou Mulher"
                  isChecked={gender == 'F'}
                  _icon={{ color: 'white' }}
                  _checked={{
                    borderColor: 'white',
                    bg: 'red.400',
                  }}
                />
              </Flex>

              <Image
                source={Vector2}
                defaultSource={Vector2}
                alt="Vetor"
                resizeMode="stretch"
                position="absolute"
                bottom={0}
                rounded="xl"
                w="100%"
                h="90%"
              />
            </Box>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setGender('M');
              scrollRef.current?.scrollToEnd({ animated: true });
            }}
          >
            <Box
              bg={'ciano.200'}
              rounded="xl"
              w={gender == 'M' ? 260 : 240}
              h={gender == 'M' ? 380 : 320}
              shadow={gender == 'M' ? 9 : 0}
            >
              <Flex
                direction="row"
                align="center"
                my={gender == 'F' ? 5 : 4}
                mx={-2}
                justify="space-around"
              >
                <Flex direction="row" align="center">
                  <MaleIcon />

                  <Text
                    color="white"
                    fontSize={16}
                    fontWeight={600}
                    letterSpacing={-0.16}
                    ml={2}
                  >
                    Eu sou Homem
                  </Text>
                </Flex>

                <Checkbox
                  value="ok"
                  bg="ciano.200"
                  borderColor="white"
                  aria-label="Eu sou Homem"
                  isChecked={gender == 'M'}
                  _icon={{ color: 'white' }}
                  _checked={{
                    borderColor: 'white',
                    bg: 'ciano.200',
                  }}
                />
              </Flex>

              <Image
                source={Vector1}
                defaultSource={Vector1}
                alt="Vetor"
                resizeMode="stretch"
                position="absolute"
                bottom={0}
                rounded="xl"
                w="100%"
                h="90%"
              />
            </Box>
          </TouchableOpacity>
        </HStack>
      </ScrollView>

      <VStack position="absolute" bottom={-50} w="100%" space={2}>
        <Button
          variant="transparent"
          size="full"
          title="Prefiro pular isto"
          onPress={() => {
            handleNextStep();
          }}
          icon={<ArrowIcon color="#3D4966" />}
        />

        <Button
          variant="primary"
          size="full"
          title="Continuar"
          onPress={() => {
            setOnboardingData({ gender });
            handleNextStep();
          }}
          icon={<ArrowIcon />}
        />
      </VStack>
    </VStack>
  );
}
