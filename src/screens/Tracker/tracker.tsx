import { useRef } from 'react';
import {
  VStack,
  ScrollView,
  IScrollViewProps,
  Box,
  Flex,
  Text,
  Image,
  HStack,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { Header } from './components/header';
import { FitnessCard } from './components/fitnessCard';
import { Progress } from '@components/molecules/Progress/progress';

// assets
import Vector from '@assets/png/vector-12.png';

export function Tracker() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleBackTo() {
    navigation.navigate('upload');
  }

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} py={24} mx={6} mb={16}>
        <Header title="Rastreador Fitness" backTo={handleBackTo} />

        <Box bg="ciano.300" rounded="2xl" h={206} position="relative">
          <Image
            source={Vector}
            defaultSource={Vector}
            alt="Vetor"
            resizeMode="contain"
            position="absolute"
            bottom={0}
            right={-16}
            h="100%"
          />

          <Flex p={6}>
            <Text
              color="white"
              fontFamily="Manrope"
              fontSize={16}
              fontWeight={800}
              letterSpacing={-0.16}
              mb={3}
            >
              Passos
            </Text>

            <Text
              color="white"
              fontFamily="Poligon"
              fontSize={36}
              fontWeight={800}
              letterSpacing={-1.44}
              mb={2}
            >
              1781
            </Text>

            <Progress
              value={40}
              sizeW={60}
              bgColor="ciano.600"
              filledColor="ciano.400"
            />

            <Text
              fontFamily="Poligon"
              color="white"
              fontSize={14}
              fontWeight={500}
              w={200}
              mt={4}
            >
              Você está dando mais passos do que o normal. Isso aí!
            </Text>
          </Flex>
        </Box>

        <HStack
          flex={1}
          mt={6}
          alignItems="center"
          justifyContent="space-between"
        >
          <FitnessCard title="peso" value="91" unit="kg" />
          <FitnessCard title="Nutrição" value="485" unit="mg" />
        </HStack>

        <HStack
          flex={1}
          mt={6}
          alignItems="center"
          justifyContent="space-between"
        >
          <FitnessCard title="Calorias" value="2124" unit="kcal" />
          <FitnessCard title="Sono" value="51" unit="h" />
        </HStack>

        <HStack
          flex={1}
          mt={6}
          alignItems="center"
          justifyContent="space-between"
        >
          <FitnessCard title="Hidratação" value="500" unit="ml" />
          <FitnessCard title="Adicionar novo" />
        </HStack>
      </VStack>
    </ScrollView>
  );
}
