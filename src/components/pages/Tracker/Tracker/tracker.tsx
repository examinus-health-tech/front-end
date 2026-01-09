import { useRef } from 'react';
import { VStack, ScrollView, IScrollViewProps, Box, Flex, Text, Image, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { FitnessCard } from '@components/molecules/FitnessCard';
import { Progress } from '@components/molecules/Progress/progress';
import { HeaderTitle } from '@components/molecules';

// assets
import Vector from '@assets/png/vector-12.png';

// hooks
import { useHome } from 'src/hooks/useHome';
import { TouchableOpacity } from 'react-native';

export function Tracker() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { trackerData } = useHome();

  // Dados do contexto
  const stepsCompleted = Number(trackerData?.step?.[0]?.step_completed) || 0;
  const stepsGoal = Number(trackerData?.step?.[0]?.step_goal) || 10000;
  const weightCompleted = Number(trackerData?.weight?.[0]?.weight_completed) || 0;
  const kcalCompleted = Number(trackerData?.kcal?.[0]?.kcal_completed) || 0;
  const sleepCompleted = Number(trackerData?.sleep?.[0]?.sleep_completed) || 0;
  const hydrationCompleted = Number(trackerData?.hydration?.[0]?.hydration_completed) || 0;

  // Calcula progresso dos passos
  const stepsProgress = stepsGoal > 0 ? Math.min(Math.round((stepsCompleted / stepsGoal) * 100), 100) : 0;

  // Mensagem motivacional baseada no progresso
  const getStepsMessage = () => {
    if (stepsCompleted === 0) return 'Comece a se movimentar hoje!';
    if (stepsProgress >= 100) return 'Parabéns! Você atingiu sua meta!';
    if (stepsProgress >= 50) return 'Você está dando mais passos do que o normal. Isso aí!';
    return 'Continue assim, você está no caminho certo!';
  };

  return (
    <VStack flex={1} py={16}>
      <HeaderTitle withBackButton={() => navigation.navigate('homepage')} title="Rastreador Fitness" />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack flex={1} mx={6} mt={2} pb={32}>
          {/* Card principal de Passos */}
          <TouchableOpacity onPress={() => navigation.navigate('steps')}>
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
                <Text color="white" fontFamily="Poligon" fontSize={16} fontWeight={800} letterSpacing={-0.16} mb={3}>
                  Passos
                </Text>

                <Text color="white" fontFamily="Poligon" fontSize={36} fontWeight={800} lineHeight={44} letterSpacing={-1.44} mb={2}>
                  {stepsCompleted.toLocaleString('pt-BR')}
                </Text>

                <Progress value={stepsProgress} sizeW={60} bgColor="ciano.700" filledColor="ciano.50" />

                <Text color="white" fontFamily="Poligon" fontSize={14} fontWeight={500} lineHeight={22.4} letterSpacing={0} w={200} mt={4}>
                  {getStepsMessage()}
                </Text>
              </Flex>
            </Box>
          </TouchableOpacity>

          {/* Linha 1: Peso e Nutrição */}
          <HStack flex={1} mt={6} space={4} alignItems="center" justifyContent="space-between">
            <FitnessCard
              title="Peso"
              value={weightCompleted > 0 ? weightCompleted.toString() : '--'}
              unit="kg"
              variant="weight"
              goTo={() => navigation.navigate('weight')}
            />
            <FitnessCard
              title="Nutrição"
              value={kcalCompleted > 0 ? kcalCompleted.toLocaleString('pt-BR') : '--'}
              unit="kcal"
              variant="nutrition"
              goTo={() => navigation.navigate('nutrition')}
            />
          </HStack>

          {/* Linha 2: Calorias e Sono */}
          <HStack flex={1} mt={4} space={4} alignItems="center" justifyContent="space-between">
            <FitnessCard
              title="Calorias"
              value={kcalCompleted > 0 ? kcalCompleted.toLocaleString('pt-BR') : '--'}
              unit="kcal"
              variant="calories"
              goTo={() => navigation.navigate('calories')}
            />
            <FitnessCard
              title="Sono"
              value={sleepCompleted > 0 ? sleepCompleted.toString() : '--'}
              unit="h"
              variant="sleep-grid"
            />
          </HStack>

          {/* Linha 3: Hidratação e Adicionar Novo */}
          <HStack flex={1} mt={4} space={4} alignItems="center" justifyContent="space-between">
            <FitnessCard
              title="Hidratação"
              value={hydrationCompleted > 0 ? (hydrationCompleted * 250).toString() : '--'}
              unit="ml"
              variant="hydration"
              goTo={() => navigation.navigate('hydration')}
            />
            <FitnessCard
              title="Adicionar Novo"
              variant="add-new"
            />
          </HStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
