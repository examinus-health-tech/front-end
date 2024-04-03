import { useEffect, useState } from 'react';
import {
  VStack,
  Text,
  Image,
  Center,
  Actionsheet,
  useDisclose,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector2 from '@assets/png/vector-17.png';
import XLogo from '@assets/png/x-examinus.png';

// components
import { Button } from '@components/atoms';
import { HeaderProgress } from '@components/molecules';
import { UploadType } from '@components/organisms/UploadType/uploadType';
import { UploadTypeManual } from '@components/organisms/UploadTypeManual/uploadTypeManual';

export function Upload() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isManual, setManual] = useState<boolean>(false);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { isOpen, onOpen, onClose } = useDisclose();

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
        bg={'gray.900'}
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
      <VStack bg={'gray.400'} flex={1} space={8} py={24}>
        <HeaderProgress progressValue={33} withBackButton />

        <Center flex={1} mx={6} alignItems="center">
          <Image
            source={Vector2}
            defaultSource={Vector2}
            alt="Vetor"
            resizeMode="contain"
            w="100%"
            h={300}
          />

          <Button
            mt={4}
            variant="primary"
            size="lg"
            title="Desvende sua saúde"
            onPress={() => {
              onOpen();
              setManual(false);
            }}
            icon={<ArrowIcon />}
          />

          <Text
            fontSize={16}
            fontWeight={500}
            lineHeight={25.6}
            textAlign="center"
            mt={4}
          >
            Selecione a forma que deseja{'\n'}importar seu exame laboratorial
          </Text>
        </Center>

        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            {isManual ? (
              <UploadTypeManual setManual={setManual} />
            ) : (
              <UploadType setManual={setManual} />
            )}
          </Actionsheet.Content>
        </Actionsheet>
      </VStack>
    );
  }
}
