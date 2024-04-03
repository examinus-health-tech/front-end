import { useRef, useState } from 'react';
import {
  VStack,
  Text,
  useDisclose,
  Box,
  HStack,
  ScrollView,
  IScrollViewProps,
  Actionsheet,
  Badge,
  Divider,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { AddSquareIcon, ChartIcon, EmailIcon, FilterIcon } from '@assets/icons';

// components
import { HeaderDescription, Input } from '@components/molecules';
import { Button } from '@components/atoms';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export function Exam() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { isOpen, onOpen, onClose } = useDisclose();

  return (
    <VStack my={16}>
      <HeaderDescription
        title="Hemograma Completo"
        withBackButton
        position="fixed"
      />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack flex={1} mx={6} mt={4} space={4}>
          <Badge
            borderRadius={12}
            bg="gray.900"
            pl={0}
            _text={{
              color: 'gray.600',
              fontSize: 18,
              textAlign: 'center',
            }}
            w={140}
          >
            Eritograma
          </Badge>

          <VStack flex={1}>
            <Text fontSize={30} fontWeight={800} letterSpacing={-0.16}>
              Hemácias
            </Text>

            <HStack space={6} mt={2}>
              <AnimatedCircularProgress
                size={144}
                lineCap="round"
                width={20}
                fill={50}
                children={() => (
                  <VStack alignItems="center">
                    <Text
                      color="ciano.400"
                      fontSize={42}
                      fontWeight={800}
                      letterSpacing={-1}
                    >
                      4.7
                    </Text>

                    <Text
                      mt={-4}
                      mx={2}
                      color="gray.400"
                      fontSize={10}
                      fontWeight={800}
                      letterSpacing={1}
                      textAlign="center"
                    >
                      Ref: 4.0 a 5.20 milhões/m3
                    </Text>
                  </VStack>
                )}
                rotation={90}
                tintColor="#00B39D"
                backgroundColor="#DCE1E8"
                delay={10}
              />

              <VStack flex={1} space={2} justifyContent="center">
                <HStack space={3} alignItems="center">
                  <AddSquareIcon size="28" />
                  <Text fontSize={16} fontWeight={800} letterSpacing={-0.16}>
                    Desmistificando
                  </Text>
                </HStack>

                <HStack space={3} alignItems="center">
                  <AddSquareIcon size="28" />

                  <Text fontSize={16} fontWeight={800} letterSpacing={-0.16}>
                    Sobre o resultado
                  </Text>
                </HStack>

                <HStack space={3} alignItems="center">
                  <AddSquareIcon size="28" />

                  <Text fontSize={16} fontWeight={800} letterSpacing={-0.16}>
                    O que fazer?
                  </Text>
                </HStack>

                <HStack space={3} alignItems="center">
                  <ChartIcon size="28" duotone />
                  <Text
                    fontSize={14}
                    fontWeight={500}
                    letterSpacing={-0.16}
                    color="ciano.300"
                  >
                    Ver histórico de resultados
                  </Text>
                </HStack>
              </VStack>
            </HStack>
          </VStack>

          <Divider my={6} />

          <VStack flex={1}>
            <Text fontSize={30} fontWeight={800} letterSpacing={-0.16}>
              Hemácias
            </Text>

            <HStack space={6} mt={2}>
              <AnimatedCircularProgress
                size={144}
                lineCap="round"
                width={20}
                fill={80}
                children={() => (
                  <VStack alignItems="center">
                    <Text
                      color="red.50"
                      fontSize={42}
                      fontWeight={800}
                      letterSpacing={-1}
                    >
                      9.47
                    </Text>

                    <Text
                      mt={-4}
                      mx={2}
                      color="gray.400"
                      fontSize={10}
                      fontWeight={800}
                      letterSpacing={1}
                      textAlign="center"
                    >
                      Ref: 11.7 a 15.7 gl
                    </Text>
                  </VStack>
                )}
                rotation={90}
                tintColor="#FA4D5E"
                backgroundColor="#DCE1E8"
                delay={10}
              />

              <VStack flex={1} space={2} justifyContent="center">
                <HStack space={3} alignItems="center">
                  <AddSquareIcon size="28" />
                  <Text fontSize={16} fontWeight={800} letterSpacing={-0.16}>
                    Desmistificando
                  </Text>
                </HStack>

                <HStack space={3} alignItems="center">
                  <AddSquareIcon size="28" />

                  <Text fontSize={16} fontWeight={800} letterSpacing={-0.16}>
                    Sobre o resultado
                  </Text>
                </HStack>

                <HStack space={3} alignItems="center">
                  <AddSquareIcon size="28" />

                  <Text fontSize={16} fontWeight={800} letterSpacing={-0.16}>
                    O que fazer?
                  </Text>
                </HStack>

                <HStack space={3} alignItems="center">
                  <ChartIcon size="28" duotone />
                  <Text
                    fontSize={14}
                    fontWeight={500}
                    letterSpacing={-0.16}
                    color="ciano.300"
                  >
                    Ver histórico de resultados
                  </Text>
                </HStack>
              </VStack>
            </HStack>
          </VStack>
        </VStack>

        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content h={400} px={6}>
            <HStack
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Text
                mt={1}
                fontSize={30}
                fontWeight={500}
                letterSpacing={-0.16}
                color="gray.600"
              >
                Filter Exames
              </Text>
              <FilterIcon size="26" />
            </HStack>

            <VStack>
              <Text
                mt={1}
                fontSize={20}
                fontWeight={500}
                letterSpacing={-0.16}
                color="gray.300"
                width="100%"
              >
                Selecione o filtro
              </Text>

              <HStack
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                space={8}
              >
                <Input h={10} placeholder="Data Inicial" />
                <Input h={10} placeholder="Data Inicial" />
              </HStack>
            </VStack>

            <VStack mt={6}>
              <Text
                mt={1}
                fontSize={20}
                fontWeight={500}
                letterSpacing={-0.16}
                color="gray.300"
                width="100%"
              >
                Selecione o filtro
              </Text>

              <HStack
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                space={8}
              >
                <Input select h={10} />
              </HStack>
            </VStack>

            <Button
              mt={8}
              title="Filtrar"
              size="sm"
              variant="primary"
              fontSize={18}
            />
          </Actionsheet.Content>
        </Actionsheet>
      </ScrollView>
    </VStack>
  );
}
