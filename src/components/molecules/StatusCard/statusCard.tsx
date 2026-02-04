import { useState, useEffect } from 'react';
import { BarbellIcon, BedIcon, CheckIcon, WalkingIcon, WaterIcon, AppleIcon } from '@assets/icons';
import { Progress } from '@components/molecules/Progress/progress';
import { Box, VStack, Text, HStack, Pressable } from 'native-base';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { useHome } from 'src/hooks/useHome';
import { getCaloriesGoal, getHydrationGoal, getStepsGoal } from 'src/services/fitnessService';
import { useCallback } from 'react';

export function StatusCards({ userTrackerData }: { userTrackerData: boolean }) {
  const { trackerData } = useHome();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  // Estados para metas locais
  const [localGoals, setLocalGoals] = useState({
    calories: 2000,
    hydration: 8,
    steps: 10000,
  });

  // Carrega metas salvas localmente
  useFocusEffect(
    useCallback(() => {
      async function loadGoals() {
        const [caloriesGoal, hydrationGoal, stepsGoal] = await Promise.all([
          getCaloriesGoal(),
          getHydrationGoal(),
          getStepsGoal(),
        ]);
        setLocalGoals({
          calories: caloriesGoal || 2000,
          hydration: hydrationGoal ? Math.round(hydrationGoal / 250) : 8, // Converte ml para copos
          steps: stepsGoal || 10000,
        });
      }
      loadGoals();
    }, [])
  );

  // Safeguards and fallbacks to avoid runtime errors when data is missing
  const kcalCompleted = Number(trackerData?.kcal?.[0]?.kcal_completed) || 0;
  const kcalGoal = localGoals.calories;
  const stepsCompleted = Number(trackerData?.step?.[0]?.step_completed) || 0;
  const stepsGoal = localGoals.steps;
  const sleepCompleted = Number(trackerData?.sleep?.[0]?.sleep_completed) || 0;
  const sleepGoal = Number(trackerData?.sleep?.[0]?.sleep_goal) || 8;
  const hydrationCompleted = Number(trackerData?.hydration?.[0]?.hydration_completed) || 0;
  const hydrationGoal = localGoals.hydration;

  // Dados de nutrição
  const nutritionData = trackerData?.nutrition?.[0];
  const nutritionCalories = (() => {
    if (!nutritionData?.nutrition_completed) return 0;
    if (Array.isArray(nutritionData.nutrition_completed)) {
      return nutritionData.nutrition_completed.reduce((total: number, item: { kcal?: number }) => {
        return total + (Number(item.kcal) || 0);
      }, 0);
    }
    return Number(nutritionData.nutrition_completed) || 0;
  })();
  const nutritionGoal = localGoals.calories; // Meta de calorias ingeridas = meta de calorias

  function renderHydration() {
    const goal = hydrationGoal > 0 ? hydrationGoal : 8;
    const completed = userTrackerData ? 0 : hydrationCompleted;

    const cards = Array.from({ length: goal }, (_, i) => i + 1);

    return cards.map((card, index) => (
      <Box
        key={index}
        bg={card <= completed ? 'ciano.300' : 'gray.300'}
        h={2}
        borderRadius={10}
        flex={1}
      />
    ));
  }

  return (
    <VStack mt={4} space={3}>
      {/* Card Calorias Queimadas */}
      <Pressable onPress={() => navigation.navigate('calories')}>
        <Box
          bg={'white'}
          w={'100%'}
          p={3}
          borderRadius={16}
          flexDir={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box bg={'red.50'} w={16} h={16} borderRadius={10} alignItems={'center'} justifyContent={'center'}>
            <BarbellIcon size="24" color="#EF4444" />
          </Box>

          <VStack flex={1} ml={3}>
            <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} mb={2}>
              Calorias Queimadas
            </Text>

            <Progress
              value={userTrackerData ? 0 : Math.round((kcalCompleted / kcalGoal) * 100)}
              sizeW={100}
              filledColor="red.400"
              bgColor={userTrackerData ? 'gray.100' : 'red.100'}
            />

            <HStack justifyContent={'space-between'} mt={1}>
              <Text color={'gray.400'} fontSize={14} fontWeight={600} letterSpacing={-0.12}>
                {userTrackerData ? 0 : kcalCompleted.toLocaleString('pt-BR')} kcal
              </Text>
              <Text color={'gray.400'} fontSize={14} fontWeight={600} letterSpacing={-0.12}>
                {kcalGoal.toLocaleString('pt-BR')} kcal
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Pressable>

      {/* Card Nutrição (Calorias Ingeridas) */}
      <Pressable onPress={() => navigation.navigate('nutrition')}>
        <Box
          bg={'white'}
          w={'100%'}
          p={3}
          borderRadius={16}
          flexDir={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box bg={'orange.50'} w={16} h={16} borderRadius={10} alignItems={'center'} justifyContent={'center'}>
            <AppleIcon size="24" color="#F97316" />
          </Box>

          <VStack flex={1} ml={3}>
            <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} mb={2}>
              Nutrição
            </Text>

            <Progress
              value={userTrackerData ? 0 : Math.min(Math.round((nutritionCalories / nutritionGoal) * 100), 100)}
              sizeW={100}
              filledColor="orange.400"
              bgColor={userTrackerData ? 'gray.100' : 'orange.100'}
            />

            <HStack justifyContent={'space-between'} mt={1}>
              <Text color={'gray.400'} fontSize={14} fontWeight={600} letterSpacing={-0.12}>
                {userTrackerData ? 0 : nutritionCalories.toLocaleString('pt-BR')} kcal
              </Text>
              <Text color={'gray.400'} fontSize={14} fontWeight={600} letterSpacing={-0.12}>
                {nutritionGoal.toLocaleString('pt-BR')} kcal
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Pressable>

      {/* Card Passos */}
      <Pressable onPress={() => navigation.navigate('steps')}>
        <Box
          bg={'white'}
          w={'100%'}
          p={3}
          borderRadius={16}
          flexDir={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box bg={'blue.50'} w={16} h={16} borderRadius={10} alignItems={'center'} justifyContent={'center'}>
            <WalkingIcon size="24" color="#3B82F6" />
          </Box>

          <VStack flex={1} ml={3}>
            <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} mb={2}>
              Passos
            </Text>

            <Progress
              value={userTrackerData ? 0 : Math.min(Math.round((stepsCompleted / stepsGoal) * 100), 100)}
              sizeW={100}
              filledColor="blue.400"
              bgColor={userTrackerData ? 'gray.100' : 'blue.100'}
            />

            <HStack justifyContent={'space-between'} mt={1}>
              <Text color={'gray.400'} fontSize={14} fontWeight={600} letterSpacing={-0.12}>
                {userTrackerData ? 0 : stepsCompleted.toLocaleString('pt-BR')} passos
              </Text>
              <Text color={'gray.400'} fontSize={14} fontWeight={600} letterSpacing={-0.12}>
                {stepsGoal.toLocaleString('pt-BR')} passos
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Pressable>

      {/* Card Sono */}
      <Pressable onPress={() => navigation.navigate('sleep')}>
        <Box
          bg={'white'}
          w={'100%'}
          p={3}
          borderRadius={16}
          flexDir={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box bg={'purple.50'} w={16} h={16} borderRadius={10} alignItems={'center'} justifyContent={'center'}>
            <BedIcon size="24" color="#8B5CF6" />
          </Box>

          <VStack flex={1} ml={3}>
            <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} mb={1}>
              Sono
            </Text>

            {userTrackerData || (!sleepCompleted && !sleepGoal) ? (
              <Text color={'gray.400'} fontSize={14} fontWeight={600} letterSpacing={-0.12}>
                Sem registro do seu ciclo
              </Text>
            ) : (
              <Text color={'gray.400'} fontSize={14} fontWeight={600} letterSpacing={-0.12}>
                {sleepCompleted.toFixed(1)}h de {sleepGoal}h ({Math.round((sleepCompleted / sleepGoal) * 100)}%)
              </Text>
            )}
          </VStack>

          <AnimatedCircularProgress
            size={56}
            lineCap="round"
            width={4}
            fill={
              userTrackerData || !sleepGoal
                ? 0
                : Math.min(Math.round((sleepCompleted / sleepGoal) * 100), 100)
            }
            children={() => (
              <Text fontSize={12} fontWeight={800} letterSpacing={1}>
                {userTrackerData || !sleepGoal
                  ? '0%'
                  : `${Math.min(Math.round((sleepCompleted / sleepGoal) * 100), 100)}%`}
              </Text>
            )}
            rotation={10}
            tintColor="#8B5CF6"
            backgroundColor="#DCE1E8"
          />
        </Box>
      </Pressable>

      {/* Card Hidratação */}
      <Pressable onPress={() => navigation.navigate('hydration')}>
        <Box
          bg={'white'}
          w={'100%'}
          p={3}
          borderRadius={16}
          flexDir={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box bg={'ciano.50'} w={16} h={16} borderRadius={10} alignItems={'center'} justifyContent={'center'}>
            <WaterIcon size="24" color="#0CC1AF" />
          </Box>

          <VStack flex={1} ml={3}>
            <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} mb={2}>
              Hidratação
            </Text>

            <HStack space={1}>{renderHydration()}</HStack>

            <HStack justifyContent={'space-between'} mt={1}>
              <Text color={'gray.600'} fontSize={14} fontWeight={600} letterSpacing={-0.12}>
                {userTrackerData ? 0 : hydrationCompleted} copos
              </Text>
              <Text color={'gray.600'} fontSize={14} fontWeight={600} letterSpacing={-0.12}>
                {hydrationGoal > 0 ? hydrationGoal : 8} copos
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Pressable>
    </VStack>
  );
}
