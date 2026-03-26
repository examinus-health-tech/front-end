import { useRef, useState, useEffect } from 'react';
import { VStack, Text, Image, Center, Modal, Box, Button as NativeButton, View, HStack } from 'native-base';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { DocumentPickerAsset } from 'expo-document-picker';

// Hooks
import { useUpload } from 'src/hooks/useUpload';

// Utils
import { validateExamPhoto } from '@utils/imageValidation';

interface UploadCameraProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadCamera({ isOpen, onClose }: UploadCameraProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [photo, setPhoto] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const { handleUploadFile } = useUpload();

  // Solicitar permissão quando o modal abrir
  useEffect(() => {
    if (isOpen && permission && !permission.granted && !modalVisible) {
      handleCameraPermission();
    }
  }, [isOpen, permission?.granted, modalVisible]);

  async function handleCameraPermission() {
    if (!permission) {
      return;
    }

    if (!permission.granted) {
      const newPermission = await requestPermission();
      if (!newPermission.granted) {
        setModalVisible(true);
        return;
      }
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
            <NativeButton onPress={handleClose} w="100%">
              Entendi
            </NativeButton>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    );
  }

  async function handleTakePhoto() {
    console.log('📸 Tentando tirar foto...');
    if (cameraRef.current) {
      try {
        const options = {
          quality: 0.85,
          base64: true,
          exif: false,
        };

        const takedPhoto = await cameraRef.current.takePictureAsync(options);
        console.log('📸 Foto capturada:', takedPhoto ? 'Sucesso' : 'Falha');
        setPhoto(takedPhoto);

        // Validar foto automaticamente
        setIsValidating(true);
        setValidationErrors([]);
        try {
          const validation = await validateExamPhoto({
            uri: takedPhoto.uri,
            base64: takedPhoto.base64,
            width: takedPhoto.width,
            height: takedPhoto.height,
          });
          if (!validation.isValid) {
            setValidationErrors(validation.errors);
          }
        } catch (validationError) {
          console.error('📸 Erro na validação:', validationError);
        } finally {
          setIsValidating(false);
        }
      } catch (error) {
        console.error('📸 Erro ao tirar foto:', error);
      }
    } else {
      console.log('📸 Camera ref não disponível');
    }
  }

  const handleRetakePhoto = () => {
    console.log('🔄 Botão Refazer clicado');
    setPhoto(null);
    setValidationErrors([]);
    setIsValidating(false);
  };

  function handleClose() {
    console.log('❌ Botão Cancelar clicado');
    setPhoto(null); // Reseta a foto
    setModalVisible(false); // Reseta modal
    onClose();
  }

  async function handleSendPhoto() {
    if (photo) {
      try {
        // Converter a foto para um formato compatível com o upload
        const photoAsset: DocumentPickerAsset = {
          uri: photo.uri,
          name: `photo_${Date.now()}.jpg`,
          size: photo.width * photo.height * 0.8,
          mimeType: 'image/jpeg',
        };

        await handleUploadFile(photoAsset);
        handleClose();
      } catch (error) {
        console.error('Erro ao enviar foto:', error);
      }
    }
  }

  // Se não está aberto, não renderiza nada
  if (!isOpen) return null;

  // Se tem permissão negada, mostra modal de permissão
  if (permission && !permission.granted && modalVisible) {
    return renderPermissionMessage();
  }

  // Se tem foto capturada, mostra preview
  if (photo) {
    return (
      <View
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          zIndex: 99999,
          elevation: 99999, // Para Android
          backgroundColor: 'black', // Para cobrir completamente
        }}
      >
        <Box backgroundColor={'gray.100'} width="full" height="full" position="relative">
          <Image
            source={{ uri: photo?.uri || `data:image/jpg;base64,${photo?.base64}` }}
            style={{ flex: 1, width: '100%', height: '100%' }}
            alt="Preview da foto capturada"
            resizeMode="cover"
          />

          <Center position="absolute" bottom={0} left={0} right={0} pb={24} bg="rgba(0,0,0,0.5)" zIndex={2}>
            {isValidating ? (
              <VStack alignItems="center" mb={4}>
                <ActivityIndicator size="small" color="white" />
                <Text color="white" fontSize={14} mt={2}>
                  Verificando qualidade da foto...
                </Text>
              </VStack>
            ) : validationErrors.length > 0 ? (
              <VStack alignItems="center" mb={4} px={4}>
                <Box bg="rgba(239,68,68,0.9)" px={4} py={3} rounded="lg" mb={2} w="100%">
                  {validationErrors.map((error, index) => (
                    <Text key={index} color="white" fontSize={14} textAlign="center" mb={index < validationErrors.length - 1 ? 1 : 0}>
                      {error}
                    </Text>
                  ))}
                </Box>
                <Text color="yellow.300" fontSize={14} fontWeight={600} textAlign="center">
                  Tire uma nova foto para continuar
                </Text>
              </VStack>
            ) : (
              <Text color="white" fontSize={18} fontWeight={600} mb={4} textAlign="center">
                Foto validada! Confirme o envio.
              </Text>
            )}

            <HStack space={8} zIndex={3}>
              <NativeButton
                onPress={handleRetakePhoto}
                rounded="2xl"
                w={28}
                h={12}
                backgroundColor={'red.500'}
                _pressed={{ bg: 'red.600' }}
                zIndex={4}
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
                backgroundColor={validationErrors.length > 0 || isValidating ? 'gray.500' : 'green.500'}
                _pressed={{ bg: validationErrors.length > 0 || isValidating ? 'gray.500' : 'green.600' }}
                isDisabled={validationErrors.length > 0 || isValidating}
                zIndex={4}
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

  // Câmera ativa - abre diretamente
  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 99999,
        elevation: 99999, // Para Android
        backgroundColor: 'black', // Para cobrir completamente
      }}
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
        <Center position="absolute" bottom={8} left={0} right={0} pb={16} bg="rgba(0,0,0,0.3)" zIndex={2}>
          <HStack space={8} alignItems="center" justifyContent="center" pt={4} zIndex={3}>
            <NativeButton 
              onPress={handleClose} 
              rounded="xl" 
              w={24} 
              h={12} 
              backgroundColor={'red.500'} 
              _pressed={{ bg: 'red.600' }}
              zIndex={4}
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
