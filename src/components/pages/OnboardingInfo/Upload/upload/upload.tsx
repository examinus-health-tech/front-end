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
  const [photo, setPhoto] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const [isManual, setManual] = useState<boolean>(false);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { isOpen, onOpen, onClose } = useDisclose();
  const { handleUploadFileFromOnboarding } = useOnboarding();

  function renderPermissionMessage() {
    if (!permission?.granted) {
      // Camera permissions are not granted yet.
      return (
        <Modal
          isOpen={modalVisible}
          onClose={() => setModalVisible(false)}
          avoidKeyboard
          justifyContent="flex-end"
          bottom="4"
          size="lg"
        >
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Body>Enter email address and we'll send a link to reset your password.</Modal.Body>
          </Modal.Content>
        </Modal>
      );
    }
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

  if (isCameraOpen) {
    if (photo) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', position: 'absolute', width: '100%', height: '122%', bottom: 0 }}
        >
          <Box backgroundColor={'gray.100'} width="full" height="full">
            <Image source={{ uri: 'data:image/jpg;base64,' + photo?.base64 }} />

            <Center justifyContent="flex-end" flex={1} mb={24}>
              <HStack space={24}>
                <TouchableOpacity>
                  <NativeButton rounded="2xl" w={24} h={12} backgroundColor={'cyan.700'} onPress={handleRetakePhoto}>
                    Excluir
                  </NativeButton>
                </TouchableOpacity>

                <TouchableOpacity>
                  <NativeButton rounded="2xl" w={24} h={12} backgroundColor={'ciano.400'} onPress={handleTakePhoto}>
                    Confirmar
                  </NativeButton>
                </TouchableOpacity>
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
        <CameraView style={{ flex: 1 }}>
          <Center justifyContent="flex-end" flex={1} mb={24}>
            <HStack space={8} alignItems="center">
              <TouchableOpacity>
                <NativeButton
                  rounded="sm"
                  w={24}
                  h={8}
                  backgroundColor={'cyan.700'}
                  onPress={() => setIsCameraOpen(false)}
                >
                  Cancelar
                </NativeButton>
              </TouchableOpacity>
              <TouchableOpacity>
                <NativeButton rounded="full" w={16} h={16} backgroundColor={'cyan.800'} onPress={handleTakePhoto} />
              </TouchableOpacity>

              <TouchableOpacity>
                <NativeButton rounded="sm" w={24} h={8} backgroundColor={'transparent'}></NativeButton>
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
          />
        </Actionsheet.Content>
      </Actionsheet>
    </VStack>
  );
}
