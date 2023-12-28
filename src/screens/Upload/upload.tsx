import { useEffect, useState } from 'react';
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
} from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon, EditIcon, UploadIcon } from '@assets/icons';
import Vector from '@assets/png/vector-9.png';
import XLogo from '@assets/png/x-examinus.png';

// components
import { Button } from '@components/Button/button';
import { Header } from '@components/Header';

export function Upload() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { isOpen, onOpen, onClose } = useDisclose();

  function handleNextStep() {
    navigation.navigate('upload');
  }

  function handleGoToUpload() {}

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        navigation.navigate('score');
      }, 4000);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <VStack
        flex={1}
        bg={'gray.100'}
        space={8}
        py={24}
        px={6}
        justifyContent={'center'}
      >
        <Center>
          <Image
            source={XLogo}
            defaultSource={XLogo}
            alt="X examinus Logo"
            resizeMode="stretch"
            w={212}
            h={289}
          />

          <Text
            fontSize={20}
            fontWeight={800}
            letterSpacing={-0.2}
            color={'white'}
            textAlign="center"
            mt={8}
          >
            Carregando os{'\n'}
            resultados do seu exame...
          </Text>
          <Text
            fontSize={14}
            fontWeight={500}
            lineHeight={25.6}
            color={'white'}
            textAlign="center"
          >
            Nosso time está fazendo a mágica{'\n'}
            acontecer para desvendar sua saúde!
          </Text>
        </Center>
      </VStack>
    );
  } else {
    return (
      <VStack flex={1} bg={'gray.10'} space={8} py={24} mx={6}>
        <Header progressValue={33} withBackButton />

        <Center flex={1} alignItems="center">
          <Button
            variant="primary"
            size="lg"
            title="Desvende sua saúde"
            onPress={onOpen}
            icon={<ArrowIcon />}
          />

          <Text
            fontSize={16}
            fontWeight={500}
            lineHeight={25.6}
            textAlign="center"
            mt={8}
          >
            Selecione a forma que deseja{'\n'}importar seu exame laboratorial
          </Text>
        </Center>

        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <VStack w="100%" h="100%" alignItems="center" mt={24}>
              <Image
                source={Vector}
                defaultSource={Vector}
                alt="Vetor"
                resizeMode="stretch"
                w="80%"
                h={200}
              />

              <Text
                fontSize={24}
                fontWeight={800}
                letterSpacing={-0.24}
                textAlign="center"
                mt={8}
              >
                Como você deseja{'\n'}
                importar seu exame?
              </Text>

              <Text
                fontSize={14}
                fontWeight={500}
                lineHeight={22.4}
                textAlign="center"
                mt={2}
              >
                Selecione a opção abaixo para que{'\n'}
                possamos simplificar sua saúde:
              </Text>

              <HStack space={4} mt={8}>
                <TouchableOpacity onPress={() => setLoading(true)}>
                  <Box
                    bg="ciano.40"
                    w={40}
                    h={20}
                    py={2}
                    px={4}
                    rounded="2xl"
                    alignItems="center"
                    borderWidth={4}
                    borderColor="gray.30"
                  >
                    <UploadIcon />
                    <Text
                      fontSize={18}
                      fontWeight={700}
                      letterSpacing={-0.18}
                      color="ciano.10"
                      mt={1}
                    >
                      Importar PDF
                    </Text>
                  </Box>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Box
                    bg="gray.10"
                    w={40}
                    h={20}
                    py={2}
                    px={4}
                    rounded="2xl"
                    alignItems="center"
                    borderWidth={4}
                    borderColor="gray.10"
                  >
                    <EditIcon color="#052B3B" />
                    <Text
                      fontSize={18}
                      fontWeight={700}
                      letterSpacing={-0.18}
                      color="gray.50"
                      mt={1}
                    >
                      Inserir manual
                    </Text>
                  </Box>
                </TouchableOpacity>
              </HStack>
            </VStack>
            <Center position="absolute" bottom={16}>
              <TouchableOpacity>
                <Text
                  fontSize={16}
                  fontWeight={600}
                  letterSpacing={-0.16}
                  color="gray.30"
                >
                  fazer isso mais tarde
                </Text>
              </TouchableOpacity>
            </Center>
          </Actionsheet.Content>
        </Actionsheet>
      </VStack>
    );
  }
}
