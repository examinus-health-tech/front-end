import { AppleIcon, BarbellIcon, BedIcon, CheckIcon, WalkingIcon, WaterIcon } from '@assets/icons';
import { Progress } from '@components/molecules/Progress/progress';
import { Box, VStack, Text, HStack, Badge } from 'native-base';
import { useState } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useHome } from 'src/hooks/useHome';

export function StatusCards() {
  const { trackerData } = useHome();

  function renderHydration(hydration) {
    if (hydration) {
      const cards = Array.from({ length: hydration.hydration_goal }, (_, i) => {
        return i + 1;
      });

      return cards.map((card) => {
        if (card <= hydration.hydration_completed) {
          return <Box bg={'ciano.300'} h={2} borderRadius={10} flex={1} />;
        }
        return <Box bg={'gray.300'} h={2} borderRadius={10} flex={1} />;
      });
    }
  }

  return (
    <VStack mt={4} space={4}>
      <Box
        bg={'white'}
        w={'100%'}
        p={4}
        borderRadius={16}
        flexDir={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box bg={'gray.50'} w={20} h={20} borderRadius={12} alignItems={'center'} justifyContent={'center'}>
          <BarbellIcon size="30" />
        </Box>

        <VStack flex={1} ml={4}>
          <Text fontSize={20} fontWeight={800} letterSpacing={-0.16} mb={3}>
            Calorias Perdidas
          </Text>

          {trackerData?.kcal[0]?.kcal_completed && (
            <Progress
              value={
                trackerData?.kcal[0]?.kcal_completed ? Math.round((trackerData.kcal[0].kcal_completed / 2000) * 100) : 0
              }
              sizeW={100}
              filledColor="red.400"
              bgColor="red.100"
            />
          )}

          <HStack justifyContent={'space-between'} mt={2}>
            <Text color={'gray.400'} fontSize={16} fontWeight={600} letterSpacing={-0.12}>
              {trackerData.kcal[0].kcal_completed}kcal
            </Text>
            <Text color={'gray.400'} fontSize={16} fontWeight={600} letterSpacing={-0.12}>
              2000kcal
            </Text>
          </HStack>
        </VStack>
      </Box>

      <Box
        bg={'white'}
        w={'100%'}
        p={4}
        borderRadius={16}
        flexDir={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box bg={'gray.50'} w={20} h={20} borderRadius={12} alignItems={'center'} justifyContent={'center'}>
          <WalkingIcon size="30" />
        </Box>

        <VStack flex={1} ml={4}>
          <Text fontSize={20} fontWeight={800} letterSpacing={-0.16} mb={1}>
            Passos
          </Text>

          <Text color={'gray.400'} fontSize={16} fontWeight={600} letterSpacing={-0.12}>
            Você deu {trackerData.step[0].step_completed} passos
          </Text>
        </VStack>

        <Box bg="ciano.50" w={12} h={12} borderRadius={8} alignItems={'center'} justifyContent={'center'}>
          <CheckIcon size="36" />
        </Box>
      </Box>

      <Box
        bg={'white'}
        w={'100%'}
        p={4}
        borderRadius={16}
        flexDir={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box bg={'gray.50'} w={20} h={20} borderRadius={12} alignItems={'center'} justifyContent={'center'}>
          <AppleIcon size="30" />
        </Box>

        <VStack flex={1} ml={4}>
          <Text fontSize={20} fontWeight={800} letterSpacing={-0.16} mb={1}>
            Nutrição
          </Text>

          <HStack space={2}>
            {trackerData.nutrition[0].nutrition_completed.map((nutr, i) => {
              if (i === 0) {
                return (
                  <Badge
                    borderRadius={6}
                    bg={'dark_blue.200'}
                    _text={{
                      fontSize: 16,
                      fontWeight: 600,
                      letterSpacing: -0.12,
                      color: 'dark_blue.50',
                    }}
                  >
                    {nutr}
                  </Badge>
                );
              }
              return (
                <Badge
                  borderRadius={6}
                  bg={'dark_blue.50'}
                  _text={{
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: -0.12,
                    color: 'dark_blue.300',
                  }}
                >
                  {nutr}
                </Badge>
              );
            })}
          </HStack>
        </VStack>
      </Box>

      <Box
        bg={'white'}
        w={'100%'}
        p={4}
        borderRadius={16}
        flexDir={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box bg={'gray.50'} w={20} h={20} borderRadius={12} alignItems={'center'} justifyContent={'center'}>
          <BedIcon size="30" />
        </Box>

        <VStack flex={1} ml={4}>
          <Text fontSize={20} fontWeight={800} letterSpacing={-0.16} mb={1}>
            Sono
          </Text>

          <Text color={'gray.400'} fontSize={16} fontWeight={600} letterSpacing={-0.12}>
            {Math.round(trackerData.sleep[0].sleep_completed)}/{Math.round(trackerData.sleep[0].sleep_goal)} {'\n'}
            Circadiano Mensal
          </Text>
        </VStack>

        {trackerData?.sleep[0]?.sleep_completed && (
          <AnimatedCircularProgress
            size={68}
            lineCap="round"
            width={5}
            fill={
              trackerData?.sleep[0]?.sleep_completed
                ? Math.round((trackerData.sleep[0].sleep_completed / trackerData.sleep[0].sleep_goal) * 100)
                : 0
            }
            children={() => (
              <Text fontSize={14} fontWeight={800} letterSpacing={1}>
                {Math.round((trackerData.sleep[0].sleep_completed / trackerData.sleep[0].sleep_goal) * 100)}%
              </Text>
            )}
            rotation={10}
            tintColor="#8A3FFC"
            backgroundColor="#DCE1E8"
          />
        )}
      </Box>

      <Box
        bg={'white'}
        w={'100%'}
        p={4}
        borderRadius={16}
        flexDir={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box bg={'gray.50'} w={20} h={20} borderRadius={12} alignItems={'center'} justifyContent={'center'}>
          <WaterIcon size="30" />
        </Box>

        <VStack flex={1} ml={4}>
          <Text fontSize={20} fontWeight={800} letterSpacing={-0.16} mb={3}>
            Hidratação
          </Text>

          <HStack space={1}>{renderHydration(trackerData.hydration[0])}</HStack>

          <HStack justifyContent={'space-between'} mt={1}>
            <Text color={'gray.600'} fontSize={16} fontWeight={600} letterSpacing={-0.12}>
              {trackerData.hydration[0].hydration_completed}
            </Text>
            <Text color={'gray.600'} fontSize={16} fontWeight={600} letterSpacing={-0.12}>
              {trackerData.hydration[0].hydration_goal}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
}
