import { useRef, useState } from 'react';
import {
  VStack,
  Text,
  Image,
  Center,
  Actionsheet,
  useDisclose,
  Modal,
  Box,
  Button as NativeButton,
  View,
  HStack,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { DocumentPickerAsset } from 'expo-document-picker';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector2 from '@assets/png/vector-17.png';

// components
import { Button } from '@components/atoms';
import { UploadType } from '@components/organisms/UploadType/uploadType';
import { useAuth } from 'src/hooks/useAuth';
import { UploadContextProvider } from '@contexts/UploadContext';
import { OnboardingContextProvider } from '@contexts/OnboardingContext';
import { UploadError } from '../error/error';
import { Loading } from '../loading/loading';
import { useUpload } from 'src/hooks/useUpload';
import { useOnboarding } from 'src/hooks/useOnboarding';

export function Upload() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photo, setPhoto] = useState<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const [isManual, setManual] = useState<boolean>(false);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { isOpen, onOpen, onClose } = useDisclose();
  const { handleUploadFileFromOnboarding } = useOnboarding();

  async function handleCameraPermission() {
    if (!permission) {
      return;
    }

    if (!permission.granted) {
      const newPermission = await requestPermission();
      if (newPermission.granted) {
        setIsCameraOpen(true);
      } else {
        setModalVisible(true);
      }
    } else {
      setIsCameraOpen(true);
    }
  }

  function renderPermissionMessage() {
    return (
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        avoidKeyboard
        justifyContent="center"
        size="lg"
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Permissão da Câmera</Modal.Header>
          <Modal.Body>
            <Text textAlign="center" mb={4}>
              Para capturar fotos dos seus exames, precisamos acessar a câmera do seu dispositivo.
            </Text>
            <Text textAlign="center" fontSize={14} color="gray.500">
              Vá em Configurações → Privacidade → Câmera e permita o acesso.
            </Text>
          </Modal.Body>
          <Modal.Footer>
            <NativeButton onPress={() => setModalVisible(false)} w="100%">
              Entendi
            </NativeButton>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    );
  }

  async function handleTakePhoto() {
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };

      const takedPhoto = await cameraRef.current.takePictureAsync(options);

      setPhoto(takedPhoto);
    }
  }

  const handleRetakePhoto = () => setPhoto(null);

  async function handleSendPhoto() {
    console.log('!@# 🚀 ~ handleSendPhoto ~ photo:', photo);
    if (photo) {
      try {
        // Converter a foto para um formato compatível com o upload
        const photoAsset: DocumentPickerAsset = {
          uri: photo.uri,
          name: `photo_${Date.now()}.jpg`,
          size: photo.width * photo.height * 0.8, // Estimativa do tamanho
          file: {
            uri: photo.uri,
            type: 'image/jpeg',
            name: `photo_${Date.now()}.jpg`,
          } as any,
        };
        console.log('!@# 🚀 ~ handleSendPhoto ~ photoAsset:', photoAsset);

        await handleUploadFileFromOnboarding(photoAsset);
        setPhoto(null);
        setIsCameraOpen(false);
        onClose();
      } catch (error) {
        console.error('Erro ao enviar foto:', error);
      }
    }
  }

  if (isCameraOpen) {
    if (photo) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', position: 'absolute', width: '100%', height: '122%', bottom: 0 }}
        >
          <Box backgroundColor={'gray.100'} width="full" height="full" position="relative">
            <Image
              source={{ uri: photo?.uri || `data:image/jpg;base64,${photo?.base64}` }}
              style={{ flex: 1, width: '100%', height: '100%' }}
              alt="Preview da foto capturada"
              resizeMode="cover"
            />

            <Center position="absolute" bottom={0} left={0} right={0} pb={24} bg="rgba(0,0,0,0.3)">
              <Text color="white" fontSize={18} fontWeight={600} mb={4} textAlign="center">
                Confirme se a foto está legível
              </Text>

              <HStack space={8}>
                <NativeButton 
                  onPress={handleRetakePhoto} 
                  rounded="2xl" 
                  w={28} 
                  h={12} 
                  backgroundColor={'red.500'} 
                  _pressed={{ bg: 'red.600' }}
                >
                  <Text color="white" fontWeight={600}>
                    Refazer
                  </Text>
                </NativeButton>

                <NativeButton
                  onPress={handleSendPhoto}
                  rounded="2xl"
                  w={28}
                  h={12}
                  backgroundColor={'green.500'}
                  _pressed={{ bg: 'green.600' }}
                >
                  <Text color="white" fontWeight={600}>
                    Enviar
                  </Text>
                </NativeButton>
              </HStack>
            </Center>
          </Box>
        </View>
      );
    }
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', position: 'absolute', width: '100%', height: '122%', bottom: 0 }}
      >
        <CameraView style={{ flex: 1 }} ref={cameraRef}>
          {/* Header da câmera */}
          <Box position="absolute" top={12} left={0} right={0} zIndex={1}>
            <Center>
              <Text color="white" fontSize={18} fontWeight={600} bg="rgba(0,0,0,0.5)" px={4} py={2} rounded="lg">
                Posicione o exame na tela
              </Text>
            </Center>
          </Box>

          {/* Guia visual para enquadrar o documento */}
          <Center flex={1}>
            <Box
              borderWidth={2}
              borderColor="white"
              borderStyle="dashed"
              width="90%"
              height="70%"
              borderRadius="lg"
              bg="rgba(255,255,255,0.1)"
            >
              <Center flex={1}>
                <Text color="white" fontSize={14} textAlign="center" opacity={0.8}>
                  Enquadre o documento{'\n'}dentro desta área
                </Text>
              </Center>
            </Box>
          </Center>

          {/* Controles da câmera */}
          <Center position="absolute" bottom={8} left={0} right={0} pb={12} bg="rgba(0,0,0,0.3)">
            <HStack space={8} alignItems="center" justifyContent="center" pt={4}>
              <NativeButton 
                onPress={() => setIsCameraOpen(false)} 
                rounded="xl" 
                w={24} 
                h={12} 
                backgroundColor={'red.500'} 
                _pressed={{ bg: 'red.600' }}
              >
                <Text color="white" fontSize={14} fontWeight={600}>
                  Cancelar
                </Text>
              </NativeButton>

              <TouchableOpacity onPress={handleTakePhoto}>
                <Box
                  w={20}
                  h={20}
                  rounded="full"
                  borderWidth={4}
                  borderColor="white"
                  bg="rgba(255,255,255,0.3)"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box w={16} h={16} rounded="full" bg="white" />
                </Box>
              </TouchableOpacity>

              <TouchableOpacity>
                <Box w={20} h={12} />
              </TouchableOpacity>
            </HStack>
          </Center>
        </CameraView>
      </View>
    );
  }

  return (
    <VStack flex={1} space={8} py={24}>
      <Center flex={1} mx={6} alignItems="center">
        <Image source={Vector2} defaultSource={Vector2} alt="Vetor" resizeMode="contain" w="100%" h={300} />

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

        <Text fontSize={16} fontWeight={500} lineHeight={25.6} textAlign="center" mt={4}>
          Selecione a forma que deseja{'\n'}importar seu exame laboratorial
        </Text>
      </Center>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <UploadType
            setIsCameraOpen={setIsCameraOpen}
            navigation={navigation}
            handleUploadFileFromOnboarding={handleUploadFileFromOnboarding}
            handleCameraPermission={handleCameraPermission}
          />
        </Actionsheet.Content>
      </Actionsheet>

      {renderPermissionMessage()}
    </VStack>
  );
}
