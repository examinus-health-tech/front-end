import { TouchableOpacity } from 'react-native';
import { VStack, Text, Image, Center, Box, HStack } from 'native-base';
import { DocumentPickerAsset, getDocumentAsync } from 'expo-document-picker';

// assets
import { EditIcon, UploadIcon } from '@assets/icons';
import Vector1 from '@assets/png/vector-9.png';
import { useOnboarding } from 'src/hooks/useOnboarding';

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
  const { resetOnboardingState } = useOnboarding();

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
    } catch (error) {}
  }

  const handleSkipUpload = async () => {
    // Fechar ActionSheet primeiro
    if (onCloseActionSheet) {
      onCloseActionSheet();
    }

    // Aguardar a animação do ActionSheet fechar completamente (500ms é o padrão do Native Base)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Resetar estado do onboarding e ir para homepage
    await resetOnboardingState();
    navigation.reset({ index: 0, routes: [{ name: 'homepage' }] });
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
