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
  Badge,
  Image,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { BarbellIcon, ChevronRightIcon, MoreIcon } from '@assets/icons';
import Vector from '@assets/png/vector-23.png';

// components
import { HeaderTitle, Progress } from '@components/molecules';

export function HeartScore() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { isOpen, onOpen, onClose } = useDisclose();

  return (
    <VStack my={16}>
      <HeaderTitle
        title="Score Coração"
        withBackButton
        position="fixed"
        badgeVariant="warning"
      />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack bg={'gray.400'} flex={1} space={8} pt={2} pb={32}>
          <VStack flex={1} mx={6}>
            <Box
              w="100%"
              bg="red.20"
              pl={4}
              py={4}
              borderRadius={12}
              shadow={2}
            >
              <HStack>
                <VStack flex={1} justifyContent="center">
                  <Text
                    fontSize={18}
                    fontWeight={800}
                    letterSpacing={-0.16}
                    color="red.70"
                  >
                    Sua saúde{'\n'}está em risco!
                  </Text>
                  <Text
                    fontSize={14}
                    fontWeight={500}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    Mas fique tranquilo e{'\n'}conta com a Examinus!
                  </Text>
                  <Text
                    fontSize={14}
                    fontWeight={500}
                    letterSpacing={-0.16}
                    color="red.80"
                  >
                    Escolha a solução abaixo:
                  </Text>
                </VStack>

                <Image
                  flex={1}
                  source={Vector}
                  defaultSource={Vector}
                  alt="Vetor"
                  resizeMode="stretch"
                  h={130}
                />
              </HStack>
            </Box>

            <HStack justifyContent={'space-between'} mt={2}>
              <Box
                mt={4}
                bg={'white'}
                p={4}
                shadow={1}
                borderRadius={16}
                w={180}
                h={200}
              >
                <HStack justifyContent="space-between">
                  <Box bg="gray.400" borderRadius={16} size={12}></Box>
                  <ChevronRightIcon color="#0CC1AF" size="32" />
                </HStack>

                <Text
                  mt={1}
                  fontSize={20}
                  fontWeight={500}
                  letterSpacing={-0.16}
                  lineHeight={22}
                >
                  Agendar Consulta Cardio
                </Text>

                <Text
                  mt={1}
                  fontSize={14}
                  fontWeight={400}
                  letterSpacing={-0.16}
                  color="gray.600"
                >
                  Dê um UP na sua saúde com um de nossos especialistas!
                </Text>
              </Box>

              <Box
                mt={4}
                bg={'white'}
                p={4}
                shadow={1}
                borderRadius={16}
                w={180}
                h={200}
              >
                <HStack justifyContent="space-between">
                  <Box bg="gray.400" borderRadius={16} size={12}></Box>
                  <ChevronRightIcon color="#0CC1AF" size="32" />
                </HStack>

                <Text
                  mt={1}
                  fontSize={20}
                  fontWeight={500}
                  letterSpacing={-0.16}
                  lineHeight={22}
                >
                  Programa Queima Diária
                </Text>

                <Text
                  mt={1}
                  fontSize={14}
                  fontWeight={400}
                  letterSpacing={-0.16}
                  color="gray.600"
                >
                  Fique em forma e melhore seu sistema cardiorespiratório
                </Text>
              </Box>
            </HStack>

            <HStack justifyContent={'space-between'} mt={1}>
              <Box
                mt={4}
                bg={'white'}
                p={4}
                shadow={1}
                borderRadius={16}
                w={180}
                h={200}
              >
                <HStack justifyContent="space-between">
                  <Box bg="gray.400" borderRadius={16} size={12}></Box>
                  <ChevronRightIcon color="#0CC1AF" size="32" />
                </HStack>

                <Text
                  mt={1}
                  fontSize={20}
                  fontWeight={500}
                  letterSpacing={-0.16}
                  lineHeight={22}
                >
                  Terapia Online
                </Text>

                <Text
                  mt={1}
                  fontSize={14}
                  fontWeight={400}
                  letterSpacing={-0.16}
                  color="gray.600"
                >
                  Tá sofrendo do coração? Isso pode ser ansiedade! Fale com
                  nossa Terapêuta!
                </Text>
              </Box>

              <Box
                mt={4}
                bg={'white'}
                p={4}
                shadow={1}
                borderRadius={16}
                w={180}
                h={200}
              >
                <HStack justifyContent="space-between">
                  <Box bg="gray.400" borderRadius={16} size={12}></Box>
                  <ChevronRightIcon color="#0CC1AF" size="32" />
                </HStack>

                <Text
                  mt={1}
                  fontSize={20}
                  fontWeight={500}
                  letterSpacing={-0.16}
                  lineHeight={22}
                >
                  Farmácia de Manipulação
                </Text>

                <Text
                  mt={1}
                  fontSize={14}
                  fontWeight={400}
                  letterSpacing={-0.16}
                  color="gray.600"
                >
                  Aqui você tem 20% de desconto em qualquer remédio manipulado.
                </Text>
              </Box>
            </HStack>
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
