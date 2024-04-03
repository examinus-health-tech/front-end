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
import { Button } from '@components/atoms';
import { HeaderProgress } from '@components/molecules';
import { TouchableOpacity } from 'react-native';

export function Age() {
  const [selectedAge, setSelectedAge] = useState<number>(20);

  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const manyTimes = 90;

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
              bg={selectedAge === i ? 'ciano.300' : 'gray.900'}
              rounded="xl"
              w={16}
              h={24}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Text
                color={selectedAge === i ? 'ciano.10' : 'gray.400'}
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
    <VStack bg={'gray.400'} flex={1} space={8} py={24}>
      <HeaderProgress
        progressValue={33}
        withBackButton
        jumpTo={() => navigation.navigate('upload')}
      />

      <VStack flex={1} mx={6} space={8}>
        <Text
          color="gray.900"
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
            color="gray.600"
          >
            Eu tenho {selectedAge} anos
          </Text>
        </VStack>

        <Button
          position="absolute"
          bottom={-50}
          variant="primary"
          size="full"
          title="title"
          onPress={() => navigation.navigate('physical')}
          icon={<ArrowIcon />}
        />
      </VStack>
    </VStack>
  );
}
