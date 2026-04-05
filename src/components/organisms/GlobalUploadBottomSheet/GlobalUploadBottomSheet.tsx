import { Actionsheet, useDisclose, Modal, VStack, Text, Image, Box, HStack } from 'native-base';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { useUploadBottomSheet } from 'src/contexts/UploadBottomSheetContext';
import { UploadType } from '@components/pages/Homepage/UploadMain/uploadType/uploadType';
import { UploadCamera } from '@components/pages/Homepage/UploadMain/uploadCamera/uploadCamera';
import { useUpload } from 'src/hooks/useUpload';
import { useTabBar } from 'src/hooks/useTabBar';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Loading } from '@components/pages/Homepage/UploadMain/loading/loading';
import { ScoreWarning } from '@components/pages/Homepage/UploadMain/ScoreWarning/scoreWarning';
import { Button } from '@components/atoms';
import Vector from '@assets/png/vector-18.png';

/**
 * Componente global que renderiza o bottomSheet de upload
 * Pode ser acionado de qualquer lugar do app através do useUploadBottomSheet
 */
export function GlobalUploadBottomSheet() {
  const { isBottomSheetOpen, closeBottomSheet } = useUploadBottomSheet();
  const { isOpen: isCameraOpen, onOpen: onCameraOpen, onClose: onCameraClose } = useDisclose();
  const { isLoadingUploadContext, withError, withSuccess, setWithError, setWithSuccess, handleUploadFile } = useUpload();
  const { hideTabBar, showTabBar } = useTabBar();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleCameraOpen() {
    closeBottomSheet(); // Fecha o BottomSheet
    onCameraOpen(); // Abre a câmera
    hideTabBar(); // Oculta tabs
  }

  function handleCameraClose() {
    onCameraClose(); // Fecha a câmera
    showTabBar(); // Mostra tabs
  }

  function handleErrorTryAgain() {
    setWithError(false);
    // O bottomSheet já está aberto, só precisa voltar para a tela de seleção
  }

  function handleBottomSheetClose() {
    if (withError) {
      setWithError(false);
    }
    closeBottomSheet();
    // Garantir StatusBar dark ao fechar
    StatusBar.setBarStyle('dark-content');
  }

  function handleSuccessClose() {
    if (__DEV__) console.log('🎉 Fechando modal de sucesso');
    setWithSuccess(false);
    showTabBar();
    // Resetar StatusBar para dark-content ao fechar o modal
    StatusBar.setBarStyle('dark-content');
  }

  // Quando entra em loading, fecha o bottomSheet e oculta tabs
  // Quando sai do loading, reseta a StatusBar para dark-content
  useEffect(() => {
    if (isLoadingUploadContext) {
      closeBottomSheet();
      hideTabBar();
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setBarStyle('dark-content');
    }
  }, [isLoadingUploadContext]);

  // Quando há erro ou sucesso, mantém tabs ocultas
  useEffect(() => {
    if (withError || withSuccess) {
      hideTabBar();
    }
  }, [withError, withSuccess]);

  return (
    <>
      {/* BottomSheet de seleção de upload ou erro */}
      <Actionsheet isOpen={isBottomSheetOpen || withError} onClose={handleBottomSheetClose}>
        <Actionsheet.Content>
          {withError ? (
            // Tela de erro dentro do bottomSheet
            <VStack w="100%" px={4} py={6} space={4}>
              <Text fontSize={20} fontWeight={800} textAlign="center" color="red.500">
                Xiii, deu ruim! :(
              </Text>

              <Text fontSize={14} fontWeight={500} textAlign="center" color="gray.600">
                Seu exame não foi processado.{'\n'}Verifique os dados enviados.
              </Text>

              <Image
                source={Vector}
                defaultSource={Vector}
                alt="Erro"
                resizeMode="contain"
                w="100%"
                h={200}
                mt={2}
              />

              <Button
                w="100%"
                variant="primary"
                size="lg"
                title="Tentar novamente"
                onPress={handleErrorTryAgain}
                bgColor="red.500"
                _pressed={{ bgColor: 'red.600' }}
                mt={4}
              />
            </VStack>
          ) : (
            // Tela normal de seleção de upload
            <UploadType onCameraOpen={handleCameraOpen} handleUploadFileProp={handleUploadFile} />
          )}
        </Actionsheet.Content>
      </Actionsheet>

      {/* Componente de câmera */}
      <UploadCamera isOpen={isCameraOpen} onClose={handleCameraClose} />

      {/* Telas de feedback - Modal full screen */}
      <Modal isOpen={isLoadingUploadContext} size="full" _backdrop={{ bg: "gray.800" }}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Modal.Content bg="gray.800" width="100%" height="100%" maxWidth="100%" maxHeight="100%" margin={0} borderRadius={0}>
          <Loading />
        </Modal.Content>
      </Modal>

      <Modal isOpen={withSuccess} size="full">
        <StatusBar barStyle="light-content" backgroundColor="#8A3FFC" />
        <Modal.Content bg="purple.500" width="100%" height="100%" maxWidth="100%" maxHeight="100%" margin={0} borderRadius={0}>
          <ScoreWarning onClose={handleSuccessClose} />
        </Modal.Content>
      </Modal>
    </>
  );
}
