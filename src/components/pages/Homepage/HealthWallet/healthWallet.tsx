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
  Badge,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { BarbellIcon, BellIcon, CalendarIcon, MoreIcon } from '@assets/icons';
import Vector from '@assets/png/vector-22.png';

// components
import { HeaderTitle, Progress, StatusCards } from '@components/molecules';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export function HealthWallet() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { isOpen, onOpen, onClose } = useDisclose();

  return (
    <VStack my={16}>
      <HeaderTitle
        title="Health Wallet"
        withBackButton
        withMoreButton
        position="fixed"
      />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack bg={'gray.400'} flex={1} space={8} pt={2} pb={32}>
          <VStack flex={1} mx={6}>
            <Box
              w="100%"
              h="auto"
              bg={'white'}
              px={4}
              py={5}
              borderRadius={12}
              shadow={2}
            >
              <VStack alignItems={'center'}>
                <AnimatedCircularProgress
                  size={150}
                  lineCap="round"
                  width={20}
                  fill={80}
                  children={() => (
                    <Text fontSize={14} fontWeight={800} letterSpacing={1}>
                      35%
                    </Text>
                  )}
                  rotation={270}
                  tintColor="linear-gradient(0deg, rgba(0,179,157,1) 0%, rgba(111,211,198,1) 100%)"
                  backgroundColor="#DCE1E8"
                  arcSweepAngle={180}
                />

                <Box
                  mt={4}
                  size={12}
                  bg={'gray.500'}
                  opacity={20}
                  borderRadius={100}
                  alignItems={'center'}
                  justifyContent={'center'}
                ></Box>

                <Text
                  mt={2}
                  fontSize={40}
                  fontWeight={800}
                  letterSpacing={-1.44}
                  lineHeight={44}
                >
                  88
                </Text>

                <Text fontSize={16} fontWeight={800} letterSpacing={-0.16}>
                  Score X
                </Text>

                <Text
                  mt={2}
                  color="gray.600"
                  fontSize={12}
                  fontWeight={500}
                  lineHeight={19.2}
                  textAlign="center"
                >
                  Com base nos seus exames, o seu Score{'\n'} de saúde está
                  acima da média. Continue assim!
                </Text>
              </VStack>
            </Box>

            <HStack justifyContent={'space-between'} mt={6}>
              <Text
                fontSize={16}
                fontWeight={800}
                letterSpacing={-0.16}
                color={'gray.900'}
              >
                Overview
              </Text>

              <TouchableOpacity>
                <MoreIcon />
              </TouchableOpacity>
            </HStack>

            <Box
              mt={4}
              bg={'white'}
              w={'100%'}
              p={4}
              shadow={1}
              borderRadius={16}
              flexDir={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Box
                bg={'red.10'}
                w={20}
                h={20}
                borderRadius={12}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <BarbellIcon size="30" />
              </Box>

              <VStack flex={1} ml={4}>
                <Text
                  fontSize={20}
                  fontWeight={800}
                  letterSpacing={-0.16}
                  mb={2}
                >
                  Coração
                </Text>

                <Text
                  color={'gray.400'}
                  fontSize={12}
                  fontWeight={600}
                  letterSpacing={-0.12}
                >
                  Você precisa se cuidar melhor. Clique aqui para saber como.
                </Text>
              </VStack>

              <Badge
                bg="red.20"
                borderRadius={6}
                _text={{
                  textTransform: 'uppercase',
                  color: 'red.50',
                  fontSize: 10,
                }}
              >
                Risco Alto
              </Badge>
            </Box>

            <Box
              mt={4}
              bg={'white'}
              w={'100%'}
              p={4}
              shadow={1}
              borderRadius={16}
              flexDir={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Box
                bg="ciano.400"
                w={20}
                h={20}
                borderRadius={12}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <BarbellIcon size="30" />
              </Box>

              <VStack flex={1} ml={4}>
                <Text
                  fontSize={20}
                  fontWeight={800}
                  letterSpacing={-0.16}
                  mb={2}
                >
                  Digestivo
                </Text>

                <Text
                  color={'gray.400'}
                  fontSize={12}
                  fontWeight={600}
                  letterSpacing={-0.12}
                >
                  Aí sim! Seu sistema digestivo está ótimo!
                </Text>
              </VStack>

              <Badge
                bg="ciano.400"
                borderRadius={6}
                _text={{
                  textTransform: 'uppercase',
                  color: 'ciano.400',
                  fontSize: 10,
                }}
              >
                Risco normal
              </Badge>
            </Box>

            <Box
              mt={4}
              bg={'white'}
              w={'100%'}
              p={4}
              shadow={1}
              borderRadius={16}
              flexDir={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Box
                bg={'purple.10'}
                w={20}
                h={20}
                borderRadius={12}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <BarbellIcon size="30" />
              </Box>

              <VStack flex={1} ml={4}>
                <Text
                  fontSize={20}
                  fontWeight={800}
                  letterSpacing={-0.16}
                  mb={2}
                >
                  Rins
                </Text>

                <Text
                  color={'gray.400'}
                  fontSize={12}
                  fontWeight={600}
                  letterSpacing={-0.12}
                >
                  Está excelente. Mantenha o bom score fazendo um check-up
                  clicando aqui.
                </Text>
              </VStack>

              <Badge
                bg="purple.20"
                borderRadius={6}
                _text={{
                  textTransform: 'uppercase',
                  color: 'purple.50',
                  fontSize: 10,
                }}
              >
                Excelente
              </Badge>
            </Box>
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
