import { useRef } from 'react';
import { VStack, ScrollView, IScrollViewProps, Box, Flex, Text, Image, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components

import { FitnessCard } from './fitnessCard';
import { Progress } from '@components/molecules/Progress/progress';

// assets
import Vector from '@assets/png/vector-12.png';
import { HeaderTitle } from '@components/molecules';
import { TouchableOpacity } from 'react-native';

export function Tracker() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} py={16} mb={16}>
        <HeaderTitle withBackButton={() => navigation.navigate('homepage')} title="Rastreador Fitness" withMoreButton />

        <VStack flex={1} mx={6} mt={2}>
          <TouchableOpacity onPress={() => navigation.navigate('sleep')}>
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
                <Text color="white" fontSize={16} fontWeight={800} letterSpacing={-0.16} mb={3}>
                  Passos
                </Text>

                <Text color="white" fontSize={36} fontWeight={800} letterSpacing={-1.44} mb={2}>
                  1781
                </Text>

                <Progress value={40} sizeW={60} bgColor="ciano.700" filledColor="ciano.50" />

                <Text color="white" fontSize={14} fontWeight={500} w={200} mt={4}>
                  Você está dando mais passos do que o normal. Isso aí!
                </Text>
              </Flex>
            </Box>
          </TouchableOpacity>

          <HStack flex={1} mt={6} space={6} alignItems="center" justifyContent="space-between">
            <FitnessCard title="Peso" value="91" unit="kg" goTo={() => navigation.navigate('weight')} />
            <FitnessCard title="Nutrição" value="485" unit="mg" goTo={() => navigation.navigate('nutrition')} />
          </HStack>

          <HStack flex={1} mt={6} space={6} alignItems="center" justifyContent="space-between">
            <FitnessCard title="Calorias" value="2124" unit="kcal" goTo={() => navigation.navigate('calories')} />
            <FitnessCard title="Sono" value="51" unit="h" />
          </HStack>

          <HStack flex={1} mt={6} space={6} alignItems="center" justifyContent="space-between">
            <FitnessCard title="Hidratação" value="500" unit="ml" />
            <FitnessCard title="Adicionar novo" />
          </HStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
