import { useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  VStack,
  Text,
  Image,
  Center,
  Actionsheet,
  useDisclose,
  Box,
  View,
  HStack,
  ScrollView,
  IScrollViewProps,
  Flex,
  Checkbox,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import {
  ArrowIcon,
  BarbellIcon,
  BellIcon,
  CalendarIcon,
  EditIcon,
  MoreIcon,
  UploadIcon,
} from '@assets/icons';
import Vector from '@assets/png/vector-9.png';
import XLogo from '@assets/png/x-examinus.png';

// components
import { Button } from '@components/Button/button';
import { Header } from '@components/Header';
import { StatusCards } from './components/statusCards';

export function Homepage() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { isOpen, onOpen, onClose } = useDisclose();

  function handleNextStep() {
    navigation.navigate('upload');
  }

  function handleGoToUpload() {}

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} bg={'gray.10'} py={24} mx={6}>
        <HStack justifyContent={'space-between'} alignItems={'center'}>
          <VStack>
            <HStack alignItems={'center'} mb={4}>
              <CalendarIcon />
              <Text
                fontSize={12}
                fontWeight={600}
                letterSpacing={-0.12}
                color={'gray.50'}
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
              color={'gray.100'}
              mb={2}
            >
              Olá, Ariene! 👋
            </Text>

            <Text
              fontSize={12}
              fontWeight={400}
              letterSpacing={-0.12}
              color={'gray.50'}
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
                da média{'\n'}Monitorar saúde `{'>'}`
              </Text>
            </VStack>
          </HStack>
        </Box>

        <HStack mt={12} justifyContent={'space-between'}>
          <Text
            fontSize={16}
            fontWeight={800}
            letterSpacing={-0.16}
            color={'gray.100'}
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
                  bg={'ciano.40'}
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
                      Teste
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
                      Teste
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
                      Teste
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
            color={'gray.100'}
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
