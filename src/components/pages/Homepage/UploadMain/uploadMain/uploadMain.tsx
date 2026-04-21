import { VStack, Text, Image, Center, Actionsheet, useDisclose } from 'native-base';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector2 from '@assets/png/vector-17.png';

// components
import { Button } from '@components/atoms';
import { UploadType } from '../uploadType/uploadType';
import { UploadCamera } from '../uploadCamera/uploadCamera';
import { useUpload } from 'src/hooks/useUpload';
import { useTabBar } from 'src/hooks/useTabBar';
import { UploadError } from '../error/error';
import { Loading } from '../loading/loading';
import { useEffect, useState, useRef } from 'react';
import { ScoreWarning } from '../ScoreWarning/scoreWarning';

const MIN_LOADING_TIME = 25000; // Tempo mínimo da animação de loading (25s)

export function UploadMain() {
  const { isOpen, onOpen, onClose } = useDisclose();
  const { isOpen: isCameraOpen, onOpen: onCameraOpen, onClose: onCameraClose } = useDisclose();
  const { isLoadingUploadContext, withError, withSuccess, setWithSuccess, handleUploadFile } = useUpload();
  const { hideTabBar, showTabBar } = useTabBar();

  // Garantir tempo mínimo de loading pra animação completa
  const [showLoading, setShowLoading] = useState(false);
  const loadingStartTime = useRef<number>(0);

  useEffect(() => {
    if (isLoadingUploadContext && !showLoading) {
      // Começou o loading
      setShowLoading(true);
      loadingStartTime.current = Date.now();
    } else if (!isLoadingUploadContext && showLoading) {
      // API terminou — esperar o tempo mínimo
      const elapsed = Date.now() - loadingStartTime.current;
      const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);
      const timer = setTimeout(() => setShowLoading(false), remaining);
      return () => clearTimeout(timer);
    }
  }, [isLoadingUploadContext]);

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

  // Esconder tab bar durante loading e ScoreWarning
  useEffect(() => {
    if (isLoadingUploadContext || withSuccess) {
      hideTabBar();
    }
  }, [isLoadingUploadContext, withSuccess]);

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
      hideTabBar();
    } else if (!isLoadingUploadContext && !withSuccess) {
      // Só mostra tabs se não estiver em loading nem em success
      showTabBar();
    }
  }, [isCameraOpen, isLoadingUploadContext, withSuccess]);

  if (showLoading || isLoadingUploadContext) {
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
            <UploadType onCameraOpen={handleCameraOpen} handleUploadFileProp={handleUploadFile} />
          </Actionsheet.Content>
        </Actionsheet>
      </VStack>
      
      {/* Componente de câmera - renderizado fora de todos os containers */}
      <UploadCamera isOpen={isCameraOpen} onClose={handleCameraClose} />
    </>
  );
}
