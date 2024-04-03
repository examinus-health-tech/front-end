import { useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  VStack,
  Text,
  useDisclose,
  Box,
  HStack,
  ScrollView,
  IScrollViewProps,
  Flex,
  Image,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { BellIcon, CalendarIcon, MoreIcon } from '@assets/icons';
import Vector from '@assets/png/vector-22.png';

// components
import { StatusCards } from '@components/molecules';

export type ISelectedHabit = 0 | 1 | 2 | 3 | 4;

export function Homepage() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { isOpen, onOpen, onClose } = useDisclose();

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} bg={'gray.400'} py={24} mx={6} mb={16}>
        <HStack justifyContent={'space-between'} alignItems={'center'}>
          <VStack>
            <HStack alignItems={'center'} mb={4}>
              <CalendarIcon />
              <Text
                fontSize={12}
                fontWeight={600}
                letterSpacing={-0.12}
                color={'gray.400'}
                ml={2}
              >
                Seg, 10 Ago 2023
              </Text>
            </HStack>

            <Text
              fontSize={30}
              fontWeight={800}
              letterSpacing={-1.2}
              lineHeight={38}
              color={'gray.900'}
              mb={2}
            >
              Olá, Ariene! 👋
            </Text>

            <Text
              fontSize={12}
              fontWeight={400}
              letterSpacing={-0.12}
              color={'gray.400'}
            >
              Hoje é um belo dia para{'\n'}
              cuidar da sua saúde! :)
            </Text>
          </VStack>

          <TouchableOpacity
            onPress={() => navigation.navigate('notifications')}
          >
            <Box
              bg={'red.50'}
              w={5}
              h={5}
              borderRadius={3}
              alignItems={'center'}
              justifyContent={'center'}
              position={'absolute'}
              zIndex={1}
              right={4}
              top={4}
            >
              <Text
                color={'red.10'}
                fontSize={16}
                fontWeight={800}
                letterSpacing={1}
              >
                2
              </Text>
            </Box>
            <Box
              w={20}
              h={20}
              bg={'white'}
              borderRadius={16}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <BellIcon size={'40'} />
            </Box>
          </TouchableOpacity>
        </HStack>

        <Box
          w="100%"
          h="auto"
          bg={'white'}
          px={4}
          py={5}
          mt={12}
          borderRadius={12}
        >
          <HStack space={4} alignItems={'center'}>
            <Box
              size={24}
              bg={'purple.60'}
              borderRadius={12}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Image
                source={Vector}
                defaultSource={Vector}
                alt="Vetor"
                resizeMode="cover"
                size={24}
                opacity={70}
                borderRadius={12}
                position="absolute"
              />

              <Text
                color={'white'}
                fontSize={44}
                fontWeight={800}
                letterSpacing={-1.44}
                lineHeight={44}
              >
                88
              </Text>
            </Box>

            <VStack>
              <Text fontSize={16} fontWeight={800} letterSpacing={-0.16}>
                Score X
              </Text>

              <Text fontSize={12} fontWeight={500} lineHeight={19.2} mt={3}>
                Com base nos seus exames, o seu{'\n'}Score de saúde está acima
                da média
              </Text>

              <Text
                fontSize={12}
                fontWeight={500}
                lineHeight={19.2}
                mt={1}
                color="purple.70"
              >
                Monitorar saúde {'>'}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <HStack mt={12} justifyContent={'space-between'}>
          <Text
            fontSize={16}
            fontWeight={800}
            letterSpacing={-0.16}
            color={'gray.900'}
          >
            Health Wallet
          </Text>

          <TouchableOpacity>
            <MoreIcon />
          </TouchableOpacity>
        </HStack>

        <HStack mt={2} h={265}>
          <ScrollView
            horizontal
            ref={scrollRef}
            mx={-6}
            showsHorizontalScrollIndicator={false}
          >
            <HStack space={3} mx={6} alignItems="center">
              <TouchableOpacity>
                <Box
                  bg={'ciano.300'}
                  rounded="xl"
                  w={170}
                  h={240}
                  shadow={8}
                  p={4}
                >
                  <Flex direction="row">
                    <Text
                      color="white"
                      fontSize={16}
                      fontWeight={600}
                      letterSpacing={-0.16}
                    >
                      Hormônios
                    </Text>
                  </Flex>
                </Box>
              </TouchableOpacity>

              <TouchableOpacity>
                <Box
                  bg={'red.50'}
                  rounded="xl"
                  w={170}
                  h={240}
                  shadow={8}
                  p={4}
                >
                  <Flex direction="row">
                    <Text
                      color="white"
                      fontSize={16}
                      fontWeight={600}
                      letterSpacing={-0.16}
                    >
                      Imunidade
                    </Text>
                  </Flex>
                </Box>
              </TouchableOpacity>

              <TouchableOpacity>
                <Box
                  bg={'dark_blue.30'}
                  rounded="xl"
                  w={170}
                  h={240}
                  shadow={8}
                  p={4}
                >
                  <Flex direction="row">
                    <Text
                      color="white"
                      fontSize={16}
                      fontWeight={600}
                      letterSpacing={-0.16}
                    >
                      Coração
                    </Text>
                  </Flex>
                </Box>
              </TouchableOpacity>
            </HStack>
          </ScrollView>
        </HStack>

        <HStack mt={4} justifyContent={'space-between'}>
          <Text
            fontSize={16}
            fontWeight={800}
            letterSpacing={-0.16}
            color={'gray.900'}
          >
            Rastreador Fitness
          </Text>

          <TouchableOpacity>
            <MoreIcon />
          </TouchableOpacity>
        </HStack>

        <StatusCards />
      </VStack>
    </ScrollView>
  );
}
