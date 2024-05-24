import { useState } from 'react';
import { VStack, Text, Box, HStack, View, useToast } from 'native-base';

// routes

// assets
import {
  ArrowIcon,
  AppleIcon,
  CoffeIcon,
  DinnerIcon,
  BoneIcon,
} from '@assets/icons';

// components
import { Button } from '@components/atoms';
import { TouchableOpacity } from 'react-native';
import { useOnboarding } from 'src/hooks/useOnboarding';
import { useAuth } from 'src/hooks/useAuth';

export type ISelectedHabit = 0 | 1 | 2 | 3 | 4;

export function Habits() {
  const [selectedHabit, setSelectedHabit] = useState<ISelectedHabit>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const { onboardingData, setOnboardingData, saveOnboarding } = useOnboarding();
  const { user } = useAuth();

  async function handleSaveOnboarding() {
    try {
      const data = { ...onboardingData, eatingHabits: selectedHabit };
      console.log('!@# 🚀 ~ handleSaveOnboarding ~ data:', data);
      const payload = { ...data, email: user.email };

      setIsLoading(true);
      setOnboardingData(data);
      await saveOnboarding(payload);
    } catch (error) {
      console.log('!@# 🚀 ~ handleSaveOnboarding ~ error:', error);
      const title = 'Não foi possível salvar seus dados';

      toast.show({
        borderRadius: '12',
        title,
        _title: {
          textAlign: 'center',
          mx: '4',
        },
        _description: {
          textAlign: 'center',
          mx: '4',
        },
        placement: 'top',
        color: 'gray.900',
        bgColor: 'red.500',
      });

      setIsLoading(false);
    }
  }

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
        Como são seus hábitos alimentares?
      </Text>

      <HStack flex={1} alignItems="center" space={6} justifyContent="center">
        <TouchableOpacity onPress={() => setSelectedHabit(1)}>
          <Box
            bg={selectedHabit == 1 ? 'ciano.300' : 'white'}
            w={180}
            h={210}
            rounded="2xl"
            alignItems="center"
            borderWidth={selectedHabit == 1 ? 4 : 0}
            borderColor="gray.200"
          >
            <View position="absolute" right={3} top={3}>
              <AppleIcon color={selectedHabit == 1 ? 'white' : '#444444'} />
            </View>
            <Text
              position="absolute"
              left={3}
              bottom={3}
              fontSize={16}
              fontWeight={600}
              letterSpacing={-0.16}
              color={selectedHabit == 1 ? 'white' : 'gray.900'}
            >
              Dieta{'\n'}Balanceada
            </Text>
          </Box>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelectedHabit(2)}>
          <Box
            bg={selectedHabit == 2 ? 'ciano.300' : 'white'}
            w={180}
            h={210}
            rounded="2xl"
            alignItems="center"
            borderWidth={selectedHabit == 2 ? 4 : 0}
            borderColor="gray.200"
          >
            <View position="absolute" right={3} top={3}>
              <CoffeIcon color={selectedHabit == 2 ? 'white' : '#444444'} />
            </View>
            <Text
              position="absolute"
              left={3}
              bottom={3}
              fontSize={16}
              fontWeight={600}
              letterSpacing={-0.16}
              color={selectedHabit == 2 ? 'white' : 'gray.900'}
            >
              Vegetariano
            </Text>
          </Box>
        </TouchableOpacity>
      </HStack>

      <HStack
        flex={1}
        alignItems="center"
        space={6}
        justifyContent="center"
        mt={-20}
      >
        <TouchableOpacity onPress={() => setSelectedHabit(3)}>
          <Box
            bg={selectedHabit == 3 ? 'ciano.300' : 'white'}
            w={180}
            h={210}
            rounded="2xl"
            alignItems="center"
            borderWidth={selectedHabit == 3 ? 4 : 0}
            borderColor="gray.200"
          >
            <View position="absolute" right={3} top={3}>
              <DinnerIcon color={selectedHabit == 3 ? 'white' : '#444444'} />
            </View>
            <Text
              position="absolute"
              left={3}
              bottom={3}
              fontSize={16}
              fontWeight={600}
              letterSpacing={-0.16}
              color={selectedHabit == 3 ? 'white' : 'gray.900'}
            >
              Low Carb
            </Text>
          </Box>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelectedHabit(4)}>
          <Box
            bg={selectedHabit == 4 ? 'ciano.300' : 'white'}
            w={180}
            h={210}
            rounded="2xl"
            alignItems="center"
            borderWidth={selectedHabit == 4 ? 4 : 0}
            borderColor="gray.200"
          >
            <View position="absolute" right={3} top={3}>
              <BoneIcon color={selectedHabit == 4 ? 'white' : '#444444'} />
            </View>
            <Text
              position="absolute"
              left={3}
              bottom={3}
              fontSize={16}
              fontWeight={600}
              letterSpacing={-0.16}
              color={selectedHabit == 4 ? 'white' : 'gray.900'}
            >
              Gluten Free
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
