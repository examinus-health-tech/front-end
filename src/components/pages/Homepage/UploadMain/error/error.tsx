import { VStack, Text, Image, Center, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector from '@assets/png/vector-18.png';

// components
import { Button } from '@components/atoms';

// hooks
import { useUpload } from 'src/hooks/useUpload';
import { useTabBar } from 'src/hooks/useTabBar';
import { useUploadBottomSheet } from 'src/contexts/UploadBottomSheetContext';
import { useEffect } from 'react';

export function UploadError() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  // Hooks com fallback seguro para funcionar tanto no onboarding quanto na homepage
  let setWithError: ((value: boolean) => void) | undefined;
  let showTabBar: (() => void) | undefined;
  let openBottomSheet: (() => void) | undefined;

  try {
    const uploadContext = useUpload();
    setWithError = uploadContext?.setWithError;
  } catch (error) {
    console.log('Upload context não disponível (pode estar no onboarding)');
  }

  try {
    const tabBarContext = useTabBar();
    showTabBar = tabBarContext?.showTabBar;
  } catch (error) {
    console.log('TabBar context não disponível (pode estar no onboarding)');
  }

  try {
    const uploadBottomSheetContext = useUploadBottomSheet();
    openBottomSheet = uploadBottomSheetContext?.openBottomSheet;
  } catch (error) {
    console.log('UploadBottomSheet context não disponível (pode estar no onboarding)');
  }

  useEffect(() => {
    return () => {
      if (setWithError) {
        setWithError(false);
      }
    };
  }, []);

  function handleCancel() {
    try {
      if (setWithError) {
        setWithError(false);
      }
      if (showTabBar) {
        showTabBar();
      }
      navigation.navigate('homepage');
    } catch (error) {
      console.error('Erro ao cancelar:', error);
      if (setWithError) {
        setWithError(false);
      }
      if (showTabBar) {
        showTabBar();
      }
    }
  }

  function handleTryAgain() {
    try {
      if (setWithError) {
        setWithError(false);
      }
      if (showTabBar) {
        showTabBar();
      }
      // Se openBottomSheet está disponível (homepage), usa ele
      // Senão, não faz nada (no onboarding, o usuário vai clicar no botão de upload novamente)
      if (openBottomSheet) {
        openBottomSheet();
      }
    } catch (error) {
      console.error('Erro ao tentar novamente:', error);
      if (setWithError) {
        setWithError(false);
      }
      if (showTabBar) {
        showTabBar();
      }
    }
  }

  return (
    <VStack flex={1} space={8} py={24} bg="white">
      <Center flex={1} mx={6} mt={-32} alignItems="center">
        <Text fontSize={24} fontWeight={800} lineHeight={25.6} textAlign="center" mt={40} color={'orange.500'}>
          Não foi possível processar
        </Text>

        <Text fontSize={14} fontWeight={500} lineHeight={22} textAlign="center" color={'gray.500'} mt={2} px={4}>
          Alguns tipos de exames ainda não são suportados pelo Examinus, como laudos de imagem, ECG, ou exames sem valores numéricos.
        </Text>

        <Text fontSize={13} fontWeight={400} lineHeight={20} textAlign="center" color={'gray.400'} mt={3} px={6}>
          Estamos trabalhando para suportar mais tipos em breve! Por enquanto, tente enviar exames laboratoriais como hemograma, glicemia, colesterol, etc.
        </Text>

        <Image source={Vector} defaultSource={Vector} alt="Vetor" resizeMode="contain" w="100%" h={260} mt={6} />

        <HStack space={3} w="100%" mt={8} px={6}>
          <Button
            flex={1}
            variant="primary"
            size="lg"
            title="Voltar"
            onPress={handleCancel}
            bgColor="white"
            borderWidth={1}
            borderColor="gray.300"
            _text={{ color: 'gray.700' }}
            _pressed={{ bgColor: 'gray.100' }}
          />
          <Button
            flex={1}
            variant="primary"
            size="lg"
            title="Enviar outro"
            icon={<ArrowIcon />}
            onPress={handleTryAgain}
            bgColor="ciano.500"
            _pressed={{ bgColor: 'ciano.600' }}
          />
        </HStack>
      </Center>
    </VStack>
  );
}
