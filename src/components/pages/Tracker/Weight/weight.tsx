import { useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { VStack, ScrollView, IScrollViewProps, Box, Text, HStack, Flex } from 'native-base';
import { useNavigation } from '@react-navigation/native';
// import { VictoryLine, VictoryChart, VictoryTheme, VictoryBar } from 'victory-native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components

// assets
import { HeaderTitle } from '@components/molecules';
import { MoreIcon } from '@assets/icons';

export function Weight() {
  const [rangeSelected, setRangeSelected] = useState<1 | 2 | 3 | 4 | 5>(1);
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const data = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 },
  ];

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} py={12} mb={16}>
        <Box w={'100%'} h={300} bg={'ciano.300'} borderBottomRadius={36} py={16} position={'absolute'}>
          <HeaderTitle
            withBackButton={() => navigation.navigate('homepage')}
            title="Peso"
            withMoreButton
            color={'white'}
          />

          <VStack flex={1} mx={6} mt={2}>
            <Text color="white" fontSize={16} mb={3} letterSpacing={-0.16}>
              Peso Atual
            </Text>
            <Text color="white" fontSize={72} fontWeight={800} mb={3} letterSpacing={-0.16}>
              75.22
              <Text fontSize={36} letterSpacing={-0.64} color={'ciano.200'}>
                Kg
              </Text>
            </Text>
          </VStack>
        </Box>

        <VStack flex={1} mx={6} mt={64}>
          <HStack flex={1} mt={4} justifyContent="space-between">
            <TouchableOpacity onPress={() => setRangeSelected(1)}>
              <Box
                borderColor={rangeSelected === 1 ? 'gray.900' : 'gray.100'}
                borderWidth={2}
                borderRadius={8}
                px={4}
                py={2}
                background={rangeSelected === 1 ? 'gray.900' : 'transparent'}
              >
                <Text color={rangeSelected === 1 ? 'white' : 'gray.400'} fontSize={12}>
                  1 dia
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRangeSelected(2)}>
              <Box
                borderColor={rangeSelected === 2 ? 'gray.900' : 'gray.100'}
                borderWidth={2}
                borderRadius={8}
                px={4}
                py={2}
                background={rangeSelected === 2 ? 'gray.900' : 'transparent'}
              >
                <Text color={rangeSelected === 2 ? 'white' : 'gray.400'} fontSize={12}>
                  1 Semana
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRangeSelected(3)}>
              <Box
                borderColor={rangeSelected === 3 ? 'gray.900' : 'gray.100'}
                borderWidth={2}
                borderRadius={8}
                px={4}
                py={2}
                background={rangeSelected === 3 ? 'gray.900' : 'transparent'}
              >
                <Text color={rangeSelected === 3 ? 'white' : 'gray.400'} fontSize={12}>
                  1 Mês
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRangeSelected(4)}>
              <Box
                borderColor={rangeSelected === 4 ? 'gray.900' : 'gray.100'}
                borderWidth={2}
                borderRadius={8}
                px={4}
                py={2}
                background={rangeSelected === 4 ? 'gray.900' : 'transparent'}
              >
                <Text color={rangeSelected === 4 ? 'white' : 'gray.400'} fontSize={12}>
                  1 Ano
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRangeSelected(5)}>
              <Box
                borderColor={rangeSelected === 5 ? 'gray.900' : 'gray.100'}
                borderWidth={2}
                borderRadius={8}
                px={4}
                py={2}
                background={rangeSelected === 5 ? 'gray.900' : 'transparent'}
              >
                <Text color={rangeSelected === 5 ? 'white' : 'gray.400'} fontSize={12}>
                  Tudo
                </Text>
              </Box>
            </TouchableOpacity>
          </HStack>

          <Flex align="center">
            <Box h={200} w="100%" bg="gray.100" borderRadius={12} justifyContent="center" alignItems="center">
              <Text color="gray.500" fontSize={16}>
                Gráfico temporariamente desabilitado
              </Text>
              <Text color="gray.400" fontSize={12} mt={2}>
                (Será substituído por solução compatível)
              </Text>
            </Box>
          </Flex>

          <HStack mt={4} justifyContent={'space-between'}>
            <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
              Metas
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate('tracker')}>
              <Text fontSize={12} fontWeight={800} letterSpacing={-0.16} color={'ciano.200'}>
                Ver todas
              </Text>
            </TouchableOpacity>
          </HStack>

          <HStack mt={4} justifyContent={'space-between'} space={4}>
            <Box bg="white" rounded="2xl" flex={1} p={4}>
              <Box size={12} background="purple.50" rounded={12}></Box>
              <Text fontSize={28} letterSpacing={-0.16} fontWeight={800} mt={4}>
                78.54{' '}
                <Text color="gray.200" fontSize={16} ml={4} letterSpacing={-0.16} fontWeight={800} mt={4}>
                  kg
                </Text>
              </Text>
              <Text color="gray.200" fontSize={14} letterSpacing={-0.16} fontWeight={800}>
                Peso Inicial
              </Text>
            </Box>
            <Box bg="white" rounded="2xl" flex={1} p={4}>
              <Box size={12} background="purple.50" rounded={12}></Box>
              <Text fontSize={28} letterSpacing={-0.16} fontWeight={800} mt={4}>
                78.54{' '}
                <Text color="gray.200" fontSize={16} ml={4} letterSpacing={-0.16} fontWeight={800} mt={4}>
                  kg
                </Text>
              </Text>
              <Text color="gray.200" fontSize={14} letterSpacing={-0.16} fontWeight={800}>
                Peso Alvo
              </Text>
            </Box>
          </HStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
