import { useNavigation } from '@react-navigation/native';
import {
  Box,
  HStack,
  IScrollViewProps,
  Image,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import { useRef, useState } from 'react';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector from '@assets/png/vector-7.png';

// components
import { Button } from '@components/Button/button';
import { Header } from '@components/Header';
import { TouchableOpacity } from 'react-native';

export function Age() {
  const [selectedAge, setSelectedAge] = useState<number>(20);
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const manyTimes = 90;

  function handleNextStep() {
    navigation.navigate('physical');
  }

  function handleGoToUpload() {
    navigation.navigate('upload');
  }

  function handleRulerAge() {
    const agesComponents: JSX.Element[] = [];

    const handleAges = () => {
      for (let i = 1; i <= manyTimes; i++) {
        agesComponents.push(
          <TouchableOpacity
            key={i}
            onPress={() => {
              setSelectedAge(i);
              // scrollRef.current?.scrollTo({
              //   y: selectedAge * 10,
              //   animated: true,
              // });
            }}
          >
            <Box
              bg={selectedAge === i ? 'ciano.40' : 'gray.20'}
              rounded="xl"
              w={16}
              h={24}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Text
                color={selectedAge === i ? 'ciano.10' : 'gray.50'}
                fontSize={36}
                fontWeight={800}
                lineHeight={44}
                letterSpacing={-1.44}
              >
                {i}
              </Text>
            </Box>
          </TouchableOpacity>
        );
      }

      return agesComponents;
    };

    return (
      <ScrollView
        horizontal
        ref={scrollRef}
        mx={-6}
        showsHorizontalScrollIndicator={false}
      >
        <HStack space={4} mx={4} alignItems="center">
          {handleAges()}
        </HStack>
      </ScrollView>
    );
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
        Qual é sua idade?
      </Text>

      <VStack mt={16} alignItems="center" space={16}>
        <Image
          source={Vector}
          defaultSource={Vector}
          alt="Vetor"
          resizeMode="stretch"
          w={340}
          h={250}
        />

        {handleRulerAge()}

        <Text
          fontSize={16}
          fontWeight={500}
          lineHeight={25.6}
          mt={-12}
          color="gray.70"
        >
          Eu tenho {selectedAge} anos
        </Text>
      </VStack>

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
