import { VStack, Text, Image, Center, Actionsheet, useDisclose } from 'native-base';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector2 from '@assets/png/vector-17.png';

// components
import { Button } from '@components/atoms';
import { UploadType } from '@components/pages/Homepage/UploadMain';
import { UploadCamera } from '@components/pages/Homepage/UploadMain';
import { useUpload } from 'src/hooks/useUpload';
import { useTabBar } from 'src/hooks/useTabBar';
import { UploadError } from '../error/error';
import { Loading } from '../loading/loading';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { ScoreWarning } from '../ScoreWarning/scoreWarning';

export function UploadMain() {
  const { isOpen, onOpen, onClose } = useDisclose();
  const { isOpen: isCameraOpen, onOpen: onCameraOpen, onClose: onCameraClose } = useDisclose();
  const { isLoadingUploadContext, withError, withSuccess, setWithSuccess } = useUpload();
  const { hideTabBar, showTabBar } = useTabBar();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleCameraOpen() {
    onClose(); // Fecha o BottomSheet
    onCameraOpen(); // Abre a câmera
    hideTabBar(); // Oculta tabs usando contexto
  }

  function handleCameraClose() {
    onCameraClose(); // Fecha a câmera
    onOpen(); // Reabre o BottomSheet
    showTabBar(); // Mostra tabs usando contexto
  }

  useEffect(() => {
    if (withSuccess) {
      showTabBar(); // Restaurar tabs antes de navegar
      navigation.navigate('homepage');
    }
  }, [withSuccess]);

  useEffect(() => {
    // Cleanup - garantir que as tabs sejam restauradas quando o componente for desmontado
    return () => {
      setWithSuccess(false);
      showTabBar();
    };
  }, []);

  // Efeito para controlar as tabs baseado no estado da câmera
  useEffect(() => {
    if (isCameraOpen) {
      hideTabBar(); // Ocultar tabs quando câmera estiver aberta
    } else {
      showTabBar(); // Mostrar tabs quando câmera estiver fechada
    }
  }, [isCameraOpen]);

  if (isLoadingUploadContext) {
    return <Loading />;
  } else if (withError) {
    return <UploadError />;
  } else if (withSuccess) {
    return <ScoreWarning />;
  }
  return (
    <>
      <VStack flex={1} space={8} py={24}>
        <Center flex={1} mx={6} alignItems="center">
          <Image source={Vector2} alt="Vector" resizeMode="contain" w="100%" h={300} />

          <Button
            mt={4}
            variant="primary"
            size="lg"
            title="Desvende sua saúde"
            onPress={() => {
              onOpen();
            }}
            icon={<ArrowIcon />}
          />

          <Text fontSize={16} fontWeight={500} lineHeight={25.6} textAlign="center" mt={4}>
            Selecione a forma que deseja{'\n'}importar seu exame laboratorial
          </Text>
        </Center>

        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <UploadType onCameraOpen={handleCameraOpen} />
          </Actionsheet.Content>
        </Actionsheet>
      </VStack>
      
      {/* Componente de câmera - renderizado fora de todos os containers */}
      <UploadCamera isOpen={isCameraOpen} onClose={handleCameraClose} />
    </>
  );
}
