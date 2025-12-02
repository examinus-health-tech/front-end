import { useState, useEffect } from 'react';
import { VStack, Text, Box, HStack, View, useToast } from 'native-base';

// routes

// assets
import { ArrowIcon, AppleIcon, CoffeIcon, DinnerIcon, BoneIcon } from '@assets/icons';

// components
import { Button } from '@components/atoms';
import { TouchableOpacity, Dimensions } from 'react-native';
import { useOnboarding } from 'src/hooks/useOnboarding';
import { useAuth } from 'src/hooks/useAuth';

const SCREEN_WIDTH = Dimensions.get('window').width;
const HORIZONTAL_MARGIN = 48; // mx={6} * 2 = 48px
const SPACING = 24; // space={6} = 24px
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_MARGIN - SPACING) / 2;

export type ISelectedHabit = 'X' | 'B' | 'V' | 'N' | '';

export function Habits() {
  const [selectedHabit, setSelectedHabit] = useState<ISelectedHabit>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const { onboardingData, setOnboardingData, saveOnboarding } = useOnboarding();
  const { user } = useAuth();

  useEffect(() => {
    if (onboardingData.eatingHabits) {
      setSelectedHabit(onboardingData.eatingHabits as ISelectedHabit);
    }
  }, []);

  // Salvar automaticamente quando o hábito mudar
  useEffect(() => {
    if (selectedHabit) {
      setOnboardingData({ ...onboardingData, eatingHabits: selectedHabit });
    }
  }, [selectedHabit]);

  async function handleSaveOnboarding() {
    try {
      const payload = {
        gender: onboardingData.gender,
        weight: onboardingData.weight,
        height: onboardingData.height,
        age: onboardingData.age,
        workoutLevel: onboardingData.physicalLevel,
        eatingHabits: selectedHabit,
      };

      setIsLoading(true);
      setOnboardingData(payload);
      await saveOnboarding(payload);
    } catch (error) {
      const title = 'Não foi possível salvar seus dados';

      // toast.show({
      //   borderRadius: '12',
      //   title,
      //   _title: {
      //     textAlign: 'center',
      //     mx: '4',
      //   },
      //   _description: {
      //     textAlign: 'center',
      //     mx: '4',
      //   },
      //   placement: 'top',
      //   color: 'gray.900',
      //   bgColor: 'red.500',
      // });

      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} mx={6}>
      <Text color="gray.900" fontSize={32} fontWeight={800} lineHeight={38} letterSpacing={-1.2} mt={4}>
        Como são seus hábitos alimentares?
      </Text>

      <HStack flex={1} space={6} justifyContent="space-between">
        <TouchableOpacity onPress={() => setSelectedHabit('X')} style={{ flex: 1 }}>
          <Box
            bg={selectedHabit == 'X' ? 'ciano.300' : 'white'}
            flex={1}
            my={4}
            rounded="2xl"
            alignItems="center"
            borderWidth={selectedHabit == 'X' ? 4 : 0}
            borderColor="gray.200"
            minH={160}
          >
            <View position="absolute" right={3} top={3}>
              <AppleIcon color={selectedHabit == 'X' ? 'white' : '#444444'} />
            </View>
            <Text
              position="absolute"
              left={3}
              bottom={3}
              fontSize={16}
              fontWeight={600}
              letterSpacing={-0.16}
              color={selectedHabit == 'X' ? 'white' : 'gray.900'}
            >
              Não faço dieta
            </Text>
          </Box>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelectedHabit('B')} style={{ flex: 1 }}>
          <Box
            bg={selectedHabit == 'B' ? 'ciano.300' : 'white'}
            flex={1}
            my={4}
            rounded="2xl"
            alignItems="center"
            borderWidth={selectedHabit == 'B' ? 4 : 0}
            borderColor="gray.200"
            minH={160}
          >
            <View position="absolute" right={3} top={3}>
              <CoffeIcon color={selectedHabit == 'B' ? 'white' : '#444444'} />
            </View>
            <Text
              position="absolute"
              left={3}
              bottom={3}
              fontSize={16}
              fontWeight={600}
              letterSpacing={-0.16}
              color={selectedHabit == 'B' ? 'white' : 'gray.900'}
            >
              Dieta{'\n'}Balanceada
            </Text>
          </Box>
        </TouchableOpacity>
      </HStack>

      <HStack flex={1} space={6} justifyContent="space-between" mb={8}>
        <TouchableOpacity onPress={() => setSelectedHabit('V')} style={{ flex: 1 }}>
          <Box
            bg={selectedHabit == 'V' ? 'ciano.300' : 'white'}
            flex={1}
            my={4}
            rounded="2xl"
            alignItems="center"
            borderWidth={selectedHabit == 'V' ? 4 : 0}
            borderColor="gray.200"
            minH={160}
          >
            <View position="absolute" right={3} top={3}>
              <DinnerIcon color={selectedHabit == 'V' ? 'white' : '#444444'} />
            </View>
            <Text
              position="absolute"
              left={3}
              bottom={3}
              fontSize={16}
              fontWeight={600}
              letterSpacing={-0.16}
              color={selectedHabit == 'V' ? 'white' : 'gray.900'}
            >
              Vegetariano
            </Text>
          </Box>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelectedHabit('N')} style={{ flex: 1 }}>
          <Box
            bg={selectedHabit == 'N' ? 'ciano.300' : 'white'}
            flex={1}
            my={4}
            rounded="2xl"
            alignItems="center"
            borderWidth={selectedHabit == 'N' ? 4 : 0}
            borderColor="gray.200"
            minH={160}
          >
            <View position="absolute" right={3} top={3}>
              <BoneIcon color={selectedHabit == 'N' ? 'white' : '#444444'} />
            </View>
            <Text
              position="absolute"
              left={3}
              bottom={3}
              fontSize={16}
              fontWeight={600}
              letterSpacing={-0.16}
              color={selectedHabit == 'N' ? 'white' : 'gray.900'}
            >
              Nenhuma dessas
            </Text>
          </Box>
        </TouchableOpacity>
      </HStack>

      <Button
        position="absolute"
        bottom={-50}
        variant="primary"
        size="full"
        title="Continuar"
        onPress={() => handleSaveOnboarding()}
        icon={<ArrowIcon />}
        isLoading={isLoading}
      />
    </VStack>
  );
}
