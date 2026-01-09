import { BarbellIcon, BedIcon, CheckIcon, WalkingIcon, WaterIcon } from '@assets/icons';
import { Progress } from '@components/molecules/Progress/progress';
import { Box, VStack, Text, HStack } from 'native-base';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useHome } from 'src/hooks/useHome';

export function StatusCards({ userTrackerData }: { userTrackerData: boolean }) {
  const { trackerData } = useHome();

  // Safeguards and fallbacks to avoid runtime errors when data is missing
  const kcalCompleted = Number(trackerData?.kcal?.[0]?.kcal_completed) || 0;
  const stepsCompleted = Number(trackerData?.step?.[0]?.step_completed) || 0;
  const sleepCompleted = Number(trackerData?.sleep?.[0]?.sleep_completed) || 0;
  const sleepGoal = Number(trackerData?.sleep?.[0]?.sleep_goal) || 0;
  const hydrationCompleted = Number(trackerData?.hydration?.[0]?.hydration_completed) || 0;
  const hydrationGoal = Number(trackerData?.hydration?.[0]?.hydration_goal) || 0;

  function renderHydration() {
    // Define o goal padrão de 8 copos se não houver dados
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
      <Box
        bg={'white'}
        w={'100%'}
        p={3}
        borderRadius={16}
        flexDir={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box bg={'gray.50'} w={16} h={16} borderRadius={10} alignItems={'center'} justifyContent={'center'}>
          <BarbellIcon size="24" />
        </Box>

        <VStack flex={1} ml={3}>
          <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} mb={2}>
            Calorias Perdidas
          </Text>

          <Progress
            value={userTrackerData ? 0 : Math.round((kcalCompleted / 2000) * 100)}
            sizeW={100}
            filledColor="red.400"
            bgColor={userTrackerData ? 'gray.100' : 'red.100'}
          />

          <HStack justifyContent={'space-between'} mt={1}>
            <Text color={'gray.400'} fontSize={14} fontWeight={600} letterSpacing={-0.12}>
              {userTrackerData ? 0 : `${kcalCompleted}`}kcal
            </Text>
            <Text color={'gray.400'} fontSize={14} fontWeight={600} letterSpacing={-0.12}>
              2000kcal
            </Text>
          </HStack>
        </VStack>
      </Box>

      <Box
        bg={'white'}
        w={'100%'}
        p={3}
        borderRadius={16}
        flexDir={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box bg={'gray.50'} w={16} h={16} borderRadius={10} alignItems={'center'} justifyContent={'center'}>
          <WalkingIcon size="24" />
        </Box>

        <VStack flex={1} ml={3}>
          <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} mb={1}>
            Passos
          </Text>

          {userTrackerData || !stepsCompleted ? (
            <Text color={'gray.400'} fontSize={14} fontWeight={600} letterSpacing={-0.12}>
              Você não andou hoje. Se movimente!
            </Text>
          ) : (
            <Text color={'gray.400'} fontSize={14} fontWeight={600} letterSpacing={-0.12}>
              Você deu {stepsCompleted} passos
            </Text>
          )}
        </VStack>

        {!userTrackerData && (
          <Box bg="ciano.50" w={10} h={10} borderRadius={6} alignItems={'center'} justifyContent={'center'}>
            <CheckIcon size="28" />
          </Box>
        )}
      </Box>

      {/* Card de Nutrição removido temporariamente */}

      <Box
        bg={'white'}
        w={'100%'}
        p={3}
        borderRadius={16}
        flexDir={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box bg={'gray.50'} w={16} h={16} borderRadius={10} alignItems={'center'} justifyContent={'center'}>
          <BedIcon size="24" />
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
              {Math.round(sleepCompleted)}h de {Math.round(sleepGoal)}h
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
          tintColor="#8A3FFC"
          backgroundColor="#DCE1E8"
        />
      </Box>

      <Box
        bg={'white'}
        w={'100%'}
        p={3}
        borderRadius={16}
        flexDir={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box bg={'gray.50'} w={16} h={16} borderRadius={10} alignItems={'center'} justifyContent={'center'}>
          <WaterIcon size="24" />
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
    </VStack>
  );
}
