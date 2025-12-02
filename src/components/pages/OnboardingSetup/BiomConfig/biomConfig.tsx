import { useRef, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Center,
  IScrollViewProps,
  Image,
  ScrollView,
  Text,
  VStack,
  Spinner,
} from 'native-base';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import Vector from '@assets/png/vector-14.png';
import { ArrowIcon, FingerprintIcon } from '@assets/icons';

import { Button } from '@components/atoms/Button/button';
import { HeaderTitle } from '@components/molecules';
import { useBiometricAuth } from 'src/hooks/useBiometricAuth';

export function BiomConfig() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const scrollRef = useRef<IScrollViewProps>(null);
  const [isEnabling, setIsEnabling] = useState(false);

  const {
    isAvailable,
    isLoading,
    biometricType,
    isEnabled,
  } = useBiometricAuth();

  const handleSkip = () => {
    navigation.navigate('otpConfig');
  };

  const handleContinue = () => {
    // Por enquanto, apenas continua para a próxima tela
    // A configuração real da biometria será feita na tela de Segurança
    // após o usuário fazer login com email/senha
    navigation.navigate('otpConfig');
  };

  if (isLoading) {
    return (
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="lg" color="ciano.300" />
        <Text mt={4} color="gray.600">Verificando biometria...</Text>
      </VStack>
    );
  }

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} space={8} py={24}>
        <HeaderTitle title="Configuração de Biometria" withBackButton={() => navigation.goBack()} />

        <VStack flex={1} mx={6} space={8} h="100%">
          {isAvailable ? (
            <>
              <Center mt={12} mb={4}>
                <FingerprintIcon size="120" color="#0CC1AF" />
              </Center>

              <Center>
                <Text color="gray.900" fontWeight={800} fontSize={24}>
                  {biometricType || 'Biometria'} disponível! 👆
                </Text>
                <Text
                  color="gray.600"
                  fontSize={16}
                  textAlign={'center'}
                  w={300}
                  mt={4}
                >
                  Seu dispositivo suporta {biometricType?.toLowerCase() || 'autenticação biométrica'}.
                  Você pode habilitar o login biométrico nas configurações de segurança depois de fazer login.
                </Text>
              </Center>
            </>
          ) : (
            <>
              <Image
                source={Vector}
                defaultSource={Vector}
                alt="X examinus Logo"
                resizeMode="contain"
                h={280}
                mt={12}
                mb={4}
              />

              <Center>
                <Text color="gray.900" fontWeight={800} fontSize={24}>
                  Biometria não disponível
                </Text>
                <Text
                  color="gray.600"
                  fontSize={16}
                  textAlign={'center'}
                  w={300}
                  mt={4}
                >
                  Seu dispositivo não possui biometria configurada.
                  Você ainda pode usar o login tradicional com e-mail e senha.
                </Text>
              </Center>
            </>
          )}

          <Button
            position="absolute"
            bottom={-90}
            variant="secondary"
            size="full"
            title="Pular"
            onPress={handleSkip}
          />
          <Button
            position="absolute"
            bottom={-160}
            variant="primary"
            size="full"
            title="Continuar"
            onPress={handleContinue}
            icon={<ArrowIcon />}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
