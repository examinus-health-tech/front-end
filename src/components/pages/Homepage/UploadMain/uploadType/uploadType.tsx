import { Platform, TouchableOpacity } from 'react-native';
import { VStack, Text, Image, Center, Box, HStack } from 'native-base';
import { DocumentPickerAsset, getDocumentAsync } from 'expo-document-picker';
import { useRef, useEffect } from 'react';

// assets
import { EditIcon, UploadIcon } from '@assets/icons';
import Vector1 from '@assets/png/vector-9.png';
import { useUpload } from 'src/hooks/useUpload';
import { useAuth } from 'src/hooks/useAuth';
import { useCustomToast } from 'src/hooks/useCustomToast';
import { AppError } from '@utils/AppErrors';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';

interface UploadTypeProps {
  onCameraOpen: () => void;
  onManualOpen?: () => void;
  handleUploadFileProp?: (file: DocumentPickerAsset) => Promise<void>;
}

export function UploadType({ onCameraOpen, onManualOpen, handleUploadFileProp }: UploadTypeProps) {
  const uploadContext = useUpload();
  const { user } = useAuth();
  const { showError } = useCustomToast();

  // Usar a prop se fornecida, senão usar do contexto
  const handleUploadFile = handleUploadFileProp || uploadContext.handleUploadFile;

  console.log('🎯 UploadType renderizado:', {
    hasProp: !!handleUploadFileProp,
    hasContextFunction: !!uploadContext?.handleUploadFile,
    hasFinalFunction: !!handleUploadFile,
  });

  const { isLoadingUploadContext } = uploadContext;

  async function handleSelectFile() {
    try {
      console.log('📁 Abrindo seletor de documentos...');
      const result = await getDocumentAsync({
        type: 'application/pdf',
        multiple: false,
      });

      console.log('📄 Resultado do seletor:', result);

      if (result.canceled) {
        console.log('❌ Usuário cancelou a seleção');
        return;
      }

      const file = result.assets[0];
      console.log('✅ Arquivo selecionado:', file);

      console.log('📤 Chamando handleUploadFile...');
      if (!handleUploadFile) {
        throw new Error('handleUploadFile não está disponível');
      }

      await handleUploadFile(file);
      console.log('🎉 Upload concluído com sucesso!');
    } catch (error) {
      console.error('💥 Erro ao selecionar/fazer upload do arquivo:', error);

      showError({
        title: 'Erro no upload',
        description: error instanceof Error ? error.message : 'Erro desconhecido ao fazer upload',
      });
    }
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
        <VStack alignItems="center" mt={12} mx={4} pb={Platform.OS === 'android' ? 8 : 4}>
          <Image source={Vector1} defaultSource={Vector1} alt="Vetor" resizeMode="stretch" h={56} />

          <Text mt={8} fontSize={24} fontWeight={800} letterSpacing={-0.24} textAlign="center">
            Como você deseja{'\n'}importar seu exame?
          </Text>

          <Text fontSize={14} fontWeight={500} lineHeight={22.4} color="gray.300" textAlign="center" mt={2}>
            Selecione a opção abaixo para que{'\n'}
            possamos simplificar sua saúde:
          </Text>

          <HStack space={4} mt={8} mb={4}>
            <TouchableOpacity testID="btn-upload-pdf" onPress={handleSelectFile}>
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

            <TouchableOpacity testID="btn-upload-image" onPress={onCameraOpen}>
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
