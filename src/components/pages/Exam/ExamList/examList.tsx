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
} from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ChevronRightIcon, FilterIcon } from '@assets/icons';

// components
import { HeaderTitle, Input } from '@components/molecules';
import { TouchableOpacity } from 'react-native';
import { Button } from '@components/atoms';

export function ExamList() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { isOpen, onOpen, onClose } = useDisclose();

  return (
    <VStack my={16}>
      <HeaderTitle
        title="Exames Realizados"
        withBackButton
        withFilterButton
        filterButtonAction={onOpen}
        position="fixed"
      />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack bg={'gray.400'} flex={1} space={8} pt={2} pb={32}>
          <VStack flex={1} mx={6} mt={4} space={8}>
            <TouchableOpacity>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                space={6}
                flex={1}
              >
                <Box bg="gray.900" borderRadius={16} w={20} h={16} />

                <VStack flex={1}>
                  <Text
                    mt={1}
                    fontSize={22}
                    fontWeight={800}
                    letterSpacing={-0.16}
                    lineHeight={22}
                  >
                    Lavoisier
                  </Text>

                  <Text
                    mt={1}
                    fontSize={16}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    23/04/2023 - 09h34
                  </Text>

                  <Text
                    mt={1}
                    fontSize={14}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    Exames de Imagem
                  </Text>
                </VStack>

                <ChevronRightIcon color="#0CC1AF" size="36" />
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                space={6}
                flex={1}
              >
                <Box bg="gray.900" borderRadius={16} w={20} h={16} />

                <VStack flex={1}>
                  <Text
                    mt={1}
                    fontSize={22}
                    fontWeight={800}
                    letterSpacing={-0.16}
                    lineHeight={22}
                  >
                    Lavoisier
                  </Text>

                  <Text
                    mt={1}
                    fontSize={16}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    23/04/2023 - 09h34
                  </Text>

                  <Text
                    mt={1}
                    fontSize={14}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    Exames de Imagem
                  </Text>
                </VStack>

                <ChevronRightIcon color="#0CC1AF" size="36" />
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                space={6}
                flex={1}
              >
                <Box bg="gray.900" borderRadius={16} w={20} h={16} />

                <VStack flex={1}>
                  <Text
                    mt={1}
                    fontSize={22}
                    fontWeight={800}
                    letterSpacing={-0.16}
                    lineHeight={22}
                  >
                    Lavoisier
                  </Text>

                  <Text
                    mt={1}
                    fontSize={16}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    23/04/2023 - 09h34
                  </Text>

                  <Text
                    mt={1}
                    fontSize={14}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    Exames de Imagem
                  </Text>
                </VStack>

                <ChevronRightIcon color="#0CC1AF" size="36" />
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                space={6}
                flex={1}
              >
                <Box bg="gray.900" borderRadius={16} w={20} h={16} />

                <VStack flex={1}>
                  <Text
                    mt={1}
                    fontSize={22}
                    fontWeight={800}
                    letterSpacing={-0.16}
                    lineHeight={22}
                  >
                    Lavoisier
                  </Text>

                  <Text
                    mt={1}
                    fontSize={16}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    23/04/2023 - 09h34
                  </Text>

                  <Text
                    mt={1}
                    fontSize={14}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    Exames de Imagem
                  </Text>
                </VStack>

                <ChevronRightIcon color="#0CC1AF" size="36" />
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                space={6}
                flex={1}
              >
                <Box bg="gray.900" borderRadius={16} w={20} h={16} />

                <VStack flex={1}>
                  <Text
                    mt={1}
                    fontSize={22}
                    fontWeight={800}
                    letterSpacing={-0.16}
                    lineHeight={22}
                  >
                    Lavoisier
                  </Text>

                  <Text
                    mt={1}
                    fontSize={16}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    23/04/2023 - 09h34
                  </Text>

                  <Text
                    mt={1}
                    fontSize={14}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    Exames de Imagem
                  </Text>
                </VStack>

                <ChevronRightIcon color="#0CC1AF" size="36" />
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                space={6}
                flex={1}
              >
                <Box bg="gray.900" borderRadius={16} w={20} h={16} />

                <VStack flex={1}>
                  <Text
                    mt={1}
                    fontSize={22}
                    fontWeight={800}
                    letterSpacing={-0.16}
                    lineHeight={22}
                  >
                    Lavoisier
                  </Text>

                  <Text
                    mt={1}
                    fontSize={16}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    23/04/2023 - 09h34
                  </Text>

                  <Text
                    mt={1}
                    fontSize={14}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    Exames de Imagem
                  </Text>
                </VStack>

                <ChevronRightIcon color="#0CC1AF" size="36" />
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                space={6}
                flex={1}
              >
                <Box bg="gray.900" borderRadius={16} w={20} h={16} />

                <VStack flex={1}>
                  <Text
                    mt={1}
                    fontSize={22}
                    fontWeight={800}
                    letterSpacing={-0.16}
                    lineHeight={22}
                  >
                    Lavoisier
                  </Text>

                  <Text
                    mt={1}
                    fontSize={16}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    23/04/2023 - 09h34
                  </Text>

                  <Text
                    mt={1}
                    fontSize={14}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    Exames de Imagem
                  </Text>
                </VStack>

                <ChevronRightIcon color="#0CC1AF" size="36" />
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                space={6}
                flex={1}
              >
                <Box bg="gray.900" borderRadius={16} w={20} h={16} />

                <VStack flex={1}>
                  <Text
                    mt={1}
                    fontSize={22}
                    fontWeight={800}
                    letterSpacing={-0.16}
                    lineHeight={22}
                  >
                    Lavoisier
                  </Text>

                  <Text
                    mt={1}
                    fontSize={16}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    23/04/2023 - 09h34
                  </Text>

                  <Text
                    mt={1}
                    fontSize={14}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    Exames de Imagem
                  </Text>
                </VStack>

                <ChevronRightIcon color="#0CC1AF" size="36" />
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                space={6}
                flex={1}
              >
                <Box bg="gray.900" borderRadius={16} w={20} h={16} />

                <VStack flex={1}>
                  <Text
                    mt={1}
                    fontSize={22}
                    fontWeight={800}
                    letterSpacing={-0.16}
                    lineHeight={22}
                  >
                    Lavoisier
                  </Text>

                  <Text
                    mt={1}
                    fontSize={16}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    23/04/2023 - 09h34
                  </Text>

                  <Text
                    mt={1}
                    fontSize={14}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    Exames de Imagem
                  </Text>
                </VStack>

                <ChevronRightIcon color="#0CC1AF" size="36" />
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                space={6}
                flex={1}
              >
                <Box bg="gray.900" borderRadius={16} w={20} h={16} />

                <VStack flex={1}>
                  <Text
                    mt={1}
                    fontSize={22}
                    fontWeight={800}
                    letterSpacing={-0.16}
                    lineHeight={22}
                  >
                    Lavoisier
                  </Text>

                  <Text
                    mt={1}
                    fontSize={16}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    23/04/2023 - 09h34
                  </Text>

                  <Text
                    mt={1}
                    fontSize={14}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    Exames de Imagem
                  </Text>
                </VStack>

                <ChevronRightIcon color="#0CC1AF" size="36" />
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity>
              <HStack
                justifyContent="space-between"
                alignItems="center"
                space={6}
                flex={1}
              >
                <Box bg="gray.900" borderRadius={16} w={20} h={16} />

                <VStack flex={1}>
                  <Text
                    mt={1}
                    fontSize={22}
                    fontWeight={800}
                    letterSpacing={-0.16}
                    lineHeight={22}
                  >
                    Lavoisier
                  </Text>

                  <Text
                    mt={1}
                    fontSize={16}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    23/04/2023 - 09h34
                  </Text>

                  <Text
                    mt={1}
                    fontSize={14}
                    fontWeight={400}
                    letterSpacing={-0.16}
                    color="gray.600"
                  >
                    Exames de Imagem
                  </Text>
                </VStack>

                <ChevronRightIcon color="#0CC1AF" size="36" />
              </HStack>
            </TouchableOpacity>
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
