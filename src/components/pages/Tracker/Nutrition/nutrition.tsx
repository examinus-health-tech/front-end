import { useRef, useState } from 'react';
import { VStack, ScrollView, IScrollViewProps, Box, Text, HStack, Flex, Badge, Divider } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components

// assets
import { HeaderTitle } from '@components/molecules';
import { AppleIcon } from '@assets/icons';
import { Button } from '@components/atoms';

export function Nutrition() {
  const [rangeSelected, setRangeSelected] = useState<1 | 2 | 3 | 4 | 5>(1);
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const data = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 },
  ];

  function handleContribuitionChart() {
    const boxComponents: JSX.Element[] = [];

    const box = () => {
      for (let i = 1; i <= 35; i++) {
        boxComponents.push(
          <Box bg="gray.100" rounded={8} size={10} alignItems={'center'} justifyContent={'center'} mb={2}></Box>
        );
      }

      return boxComponents;
    };

    return (
      <Flex align="center" mx={6} mt={8} justify="center">
        <HStack flex={1} flexWrap="wrap" flexDir="row" space={2} w="100%" ml={8}>
          {box()}
        </HStack>
      </Flex>
    );
  }

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} py={12} mb={16} width="100%">
        <HeaderTitle withBackButton={() => navigation.navigate('homepage')} title="Nutrição" withMoreButton />

        <VStack flex={1} mx={6} mt={2}>
          <HStack space={2} alignItems="center">
            <AppleIcon />
            <Text fontSize={16} letterSpacing={-0.16} fontWeight={600}>
              Sua Nutrição
            </Text>

            <Badge background="ciano.200" _text={{ color: 'white', fontSize: 12 }} borderRadius={8} py={1}>
              META
            </Badge>
          </HStack>

          <HStack alignItems="flex-end">
            <Text fontSize={72} fontWeight={800} letterSpacing={-0.16}>
              2.000
            </Text>
            <Text ml={2} mb={4} fontSize={24} fontWeight={600} letterSpacing={-0.64} color={'gray.400'}>
              kcal
            </Text>
          </HStack>
        </VStack>

        {handleContribuitionChart()}

        <HStack mt={12} justifyContent="center">
          <VStack alignItems="center" space={2}>
            <Box background="ciano.200" size={3} rounded={4} />
            <Text fontSize={12} fontWeight={700} color="gray.300">
              Dentro da Meta
            </Text>
          </VStack>

          <Divider bg="gray.100" orientation="vertical" mx={4} />

          <VStack alignItems="center" space={2}>
            <Box background="red.400" size={3} rounded={4} />
            <Text fontSize={12} fontWeight={700} color="gray.300">
              Acima da Meta
            </Text>
          </VStack>

          <Divider bg="gray.100" orientation="vertical" mx={4} />

          <VStack alignItems="center" space={2}>
            <Box background="gray.100" size={3} rounded={4} />
            <Text fontSize={12} fontWeight={700} color="gray.300">
              Sem Dados
            </Text>
          </VStack>
        </HStack>

        <VStack mx={6}>
          <Button title="Adicionar Kcal Ingeridas" variant="primary" size="full" mt={20} />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
