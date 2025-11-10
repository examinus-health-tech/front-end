import { TouchableOpacity } from 'react-native';
import { VStack, Text, Image, Center, Box, HStack } from 'native-base';
import { DocumentPickerAsset, getDocumentAsync } from 'expo-document-picker';

// assets
import { EditIcon, UploadIcon } from '@assets/icons';
import Vector1 from '@assets/png/vector-9.png';

export function UploadType({
  setIsCameraOpen,
  navigation,
  handleUploadFileFromOnboarding,
  handleCameraPermission,
  onCloseActionSheet,
}: {
  setIsCameraOpen?: (data: boolean) => void;
  handleUploadFileFromOnboarding: (file: DocumentPickerAsset) => void;
  navigation: any;
  handleCameraPermission?: () => void;
  onCloseActionSheet?: () => void;
}) {

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

      await handleUploadFileFromOnboarding(file);

      // Fechar o actionsheet após upload bem-sucedido
      if (onCloseActionSheet) {
        onCloseActionSheet();
      }
    } catch (error) {
      console.error('❌ Erro ao fazer upload do arquivo:', error);
    }
  }

  const handleSkipUpload = async () => {
    console.log('🔄 [Skip Upload] Iniciando skip do upload...');

    // Fechar ActionSheet primeiro
    if (onCloseActionSheet) {
      console.log('📤 [Skip Upload] Fechando ActionSheet...');
      onCloseActionSheet();
    }

    // Aguardar a animação do ActionSheet fechar completamente
    await new Promise(resolve => setTimeout(resolve, 600));

    console.log('🏠 [Skip Upload] Navegando para homepage...');

    try {
      // Apenas navegar - NÃO resetar estado pois usuário pode ter dados
      navigation.reset({
        index: 0,
        routes: [{ name: 'homepage' }],
      });
      console.log('✅ [Skip Upload] Navegação completada - usuário pulou upload mas mantém dados');
    } catch (error) {
      console.error('❌ [Skip Upload] Erro ao navegar:', error);
      // Fallback: tentar navigate direto
      navigation.navigate('homepage');
    }
  };

  return (
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

          <TouchableOpacity onPress={handleCameraPermission ? handleCameraPermission : () => setIsCameraOpen?.(true)}>
            <Box w={40} h={20} py={2} px={4} rounded="2xl" alignItems="center" borderWidth={4} borderColor="gray.50">
              <EditIcon color="#052B3B" />
              <Text fontSize={17} fontWeight={700} letterSpacing={-0.18} color="gray.400" mt={1}>
                Imagem
              </Text>
            </Box>
          </TouchableOpacity>
        </HStack>
        <TouchableOpacity onPress={handleSkipUpload}>
          <Text fontSize={16} fontWeight={600} letterSpacing={-0.16} color="gray.200" my={12}>
            fazer isso mais tarde
          </Text>
        </TouchableOpacity>
      </VStack>
    </Center>
  );
}
