import { useState } from 'react';
import { VStack, Text, Box, HStack, View } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import {
  ArrowIcon,
  AppleIcon,
  CoffeIcon,
  DinnerIcon,
  BoneIcon,
} from '@assets/icons';

// components
import { Button } from '@components/Button/button';
import { Header } from '@components/Header';
import { TouchableOpacity } from 'react-native';
import { ISelectedHabit } from './habits.type';

export function Habits() {
  const [selectedHabit, setSelectedHabit] = useState<ISelectedHabit>(1);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleNextStep() {
    navigation.navigate('upload');
  }

  function handleGoToUpload() {
    navigation.navigate('');
  }

  return (
    <VStack flex={1} bg={'gray.10'} space={8} py={24} mx={6}>
      <Header progressValue={33} withBackButton jumpTo={handleGoToUpload} />
      <Text
        color="gray.100"
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
            bg={selectedHabit == 1 ? 'ciano.40' : 'white'}
            w={180}
            h={210}
            rounded="2xl"
            alignItems="center"
            borderWidth={selectedHabit == 1 ? 4 : 0}
            borderColor="gray.30"
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
              color={selectedHabit == 1 ? 'white' : 'gray.100'}
            >
              Dieta{'\n'}Balanceada
            </Text>
          </Box>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelectedHabit(2)}>
          <Box
            bg={selectedHabit == 2 ? 'ciano.40' : 'white'}
            w={180}
            h={210}
            rounded="2xl"
            alignItems="center"
            borderWidth={selectedHabit == 2 ? 4 : 0}
            borderColor="gray.30"
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
              color={selectedHabit == 2 ? 'white' : 'gray.100'}
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
            bg={selectedHabit == 3 ? 'ciano.40' : 'white'}
            w={180}
            h={210}
            rounded="2xl"
            alignItems="center"
            borderWidth={selectedHabit == 3 ? 4 : 0}
            borderColor="gray.30"
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
              color={selectedHabit == 3 ? 'white' : 'gray.100'}
            >
              Low Carb
            </Text>
          </Box>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelectedHabit(4)}>
          <Box
            bg={selectedHabit == 4 ? 'ciano.40' : 'white'}
            w={180}
            h={210}
            rounded="2xl"
            alignItems="center"
            borderWidth={selectedHabit == 4 ? 4 : 0}
            borderColor="gray.30"
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
              color={selectedHabit == 4 ? 'white' : 'gray.100'}
            >
              Gluten Free
            </Text>
          </Box>
        </TouchableOpacity>
      </HStack>

      <Button
        position="absolute"
        bottom={10}
        variant="primary"
        size="full"
        title="Continuar"
        onPress={handleNextStep}
        icon={<ArrowIcon />}
      />
    </VStack>
  );
}
