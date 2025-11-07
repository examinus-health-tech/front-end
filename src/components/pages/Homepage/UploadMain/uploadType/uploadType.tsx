import { Platform, TouchableOpacity } from 'react-native';
import { VStack, Text, Image, Center, Box, HStack, useToast } from 'native-base';
import { DocumentPickerAsset, getDocumentAsync } from 'expo-document-picker';

// assets
import { EditIcon, UploadIcon } from '@assets/icons';
import Vector1 from '@assets/png/vector-9.png';
import { useUpload } from 'src/hooks/useUpload';
import { useAuth } from 'src/hooks/useAuth';
import { AppError } from '@utils/AppErrors';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';

interface UploadTypeProps {
  onCameraOpen: () => void;
  onManualOpen?: () => void;
}

export function UploadType({ onCameraOpen, onManualOpen }: UploadTypeProps) {
  const { handleUploadFile, isLoadingUploadContext } = useUpload();
  const { user } = useAuth();
  const toast = useToast();

  async function handleSelectFile() {
    try {
      const result = await getDocumentAsync({
        type: 'application/pdf',
        multiple: false,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];

      await handleUploadFile(file);
    } catch (error) {}
  }

  // async function handleSelectFile() {
  //   try {
  //     const result = await DocumentPicker.getDocumentAsync({
  //       type: 'application/pdf',
  //       multiple: false,
  //     });

  //     if (result.canceled) {
  //       return;
  //     }

  //     const tempFile = result.assets[0];

  //     await handleUploadFile(user?.email, tempFile);
  //   } catch (error) {
  //     const isAppError = error instanceof AppError;

  //     const title = isAppError
  //       ? 'Não foi possível fazer o upload'
  //       : 'Não foi possível fazer o upload.\nTente novamente mais tarde.';
  //     const description = isAppError && error.message;

  //     toast.show({
  //       borderRadius: '12',
  //       title,
  //       description,
  //       _title: {
  //         textAlign: 'center',
  //         mx: '4',
  //       },
  //       _description: {
  //         textAlign: 'center',
  //         mx: '4',
  //       },
  //       placement: 'top',
  //       color: 'gray.900',
  //       bgColor: 'red.500',
  //     });
  //   }
  // }

  return (
    <>
      <Center>
        <VStack alignItems="center" mt={12} mx={4}>
          <Image source={Vector1} defaultSource={Vector1} alt="Vetor" resizeMode="stretch" h={56} />

          <Text mt={8} fontSize={24} fontWeight={800} letterSpacing={-0.24} textAlign="center">
            Como você deseja{'\n'}importar seu exame?
          </Text>

          <Text fontSize={14} fontWeight={500} lineHeight={22.4} color="gray.300" textAlign="center" mt={2}>
            Selecione a opção abaixo para que{'\n'}
            possamos simplificar sua saúde:
          </Text>

          <HStack space={4} mt={8}>
            <TouchableOpacity onPress={handleSelectFile}>
              <Box
                bg="ciano.300"
                w={40}
                h={20}
                py={2}
                px={4}
                rounded="2xl"
                alignItems="center"
                borderWidth={4}
                borderColor="gray.200"
              >
                <UploadIcon />
                <Text fontSize={18} fontWeight={700} letterSpacing={-0.18} color="white" mt={1}>
                  PDF
                </Text>
              </Box>
            </TouchableOpacity>

            <TouchableOpacity onPress={onCameraOpen}>
              <Box w={40} h={20} py={2} px={4} rounded="2xl" alignItems="center" borderWidth={4} borderColor="gray.50">
                <EditIcon color="#052B3B" />
                <Text fontSize={18} fontWeight={700} letterSpacing={-0.18} color="gray.400" mt={1}>
                  Imagem
                </Text>
              </Box>
            </TouchableOpacity>
          </HStack>
        </VStack>
      </Center>
    </>
  );
}
