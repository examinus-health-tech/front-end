import { useRef, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon, FemaleIcon, MaleIcon } from '@assets/icons';
import Vector1 from '@assets/png/vector-5.png';
import Vector2 from '@assets/png/vector-6.png';

// components
import { Button } from '@components/atoms/Button/button';
import { HeaderProgress } from '@components/molecules/Header/HeaderProgress/headerProgress';

export function Gender() {
  const [isCheckFemale, setCheckFemale] = useState(false);
  const [isCheckMale, setCheckMale] = useState(false);

  const scrollRef = useRef<null | IScrollViewProps | HTMLElement>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack bg={'gray.400'} flex={1} space={8} py={24}>
      <HeaderProgress
        progressValue={33}
        withBackButton
        jumpTo={() => navigation.navigate('upload')}
      />

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
                setCheckFemale(true);
                setCheckMale(false);
                scrollRef.current?.scrollTo({ y: 0, animated: true });
              }}
            >
              <Box
                bg={'red.50'}
                rounded="xl"
                w={isCheckFemale ? 260 : 240}
                h={isCheckFemale ? 380 : 320}
                shadow={isCheckFemale ? 9 : 0}
              >
                <Flex
                  direction="row"
                  align="center"
                  my={isCheckFemale ? 5 : 4}
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
                    bg="red.50"
                    borderColor="white"
                    aria-label="Eu sou Mulher"
                    isChecked={isCheckFemale}
                    _icon={{ color: 'white' }}
                    _checked={{
                      borderColor: 'white',
                      bg: 'red.50',
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
                setCheckFemale(false);
                setCheckMale(true);
                scrollRef.current?.scrollToEnd({ animated: true });
              }}
            >
              <Box
                bg={'ciano.200'}
                rounded="xl"
                w={isCheckMale ? 260 : 240}
                h={isCheckMale ? 380 : 320}
                shadow={isCheckMale ? 9 : 0}
              >
                <Flex
                  direction="row"
                  align="center"
                  my={isCheckFemale ? 5 : 4}
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
                    isChecked={isCheckMale}
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
            icon={<ArrowIcon color="#3D4966" />}
          />

          <Button
            variant="primary"
            size="full"
            title="Continuar"
            onPress={() => navigation.navigate('weight')}
            icon={<ArrowIcon />}
          />
        </VStack>
      </VStack>
    </VStack>
  );
}
