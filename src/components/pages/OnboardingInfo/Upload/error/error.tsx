import { VStack, Text, Image, Center, useDisclose, View } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector from '@assets/png/vector-18.png';

// components
import { Button } from '@components/atoms';
import { TouchableOpacity } from 'react-native';

// hooks
import { useOnboarding } from 'src/hooks/useOnboarding';

export function UploadError() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { handlePreviousStep, resetOnboardingState } = useOnboarding();

  const handleSkipUpload = async () => {
    // Resetar estado do onboarding e ir para homepage
    await resetOnboardingState();
    navigation.reset({ index: 0, routes: [{ name: 'homepage' }] });
  };

  return (
    <VStack flex={1} space={8} py={24}>
      <Center flex={1} mx={6} mt={-32} alignItems="center">
        <Text
          fontSize={24}
          fontWeight={800}
          lineHeight={25.6}
          textAlign="center"
          mt={40}
          color={'orange.500'}
        >
          Não foi possível processar
        </Text>

        <Text
          fontSize={14}
          fontWeight={500}
          lineHeight={22}
          textAlign="center"
          color={'gray.500'}
          mt={2}
          px={4}
        >
          Alguns tipos de exames ainda não são suportados pelo Examinus, como laudos de imagem, ECG, ou exames sem valores numéricos.
        </Text>

        <Text
          fontSize={13}
          fontWeight={400}
          lineHeight={20}
          textAlign="center"
          color={'gray.400'}
          mt={3}
          px={6}
        >
          Tente enviar exames laboratoriais como hemograma, glicemia, colesterol, etc.
        </Text>

        <Image
          source={Vector}
          defaultSource={Vector}
          alt="Vetor"
          resizeMode="contain"
          w="100%"
          h={260}
          mt={6}
        />

        <Button
          mt={12}
          variant="primary"
          size="lg"
          title="Tentar outro exame"
          icon={<ArrowIcon />}
          onPress={handlePreviousStep}
        />

        <TouchableOpacity onPress={handleSkipUpload}>
          <Text
            bottom={-30}
            fontSize={16}
            fontWeight={600}
            letterSpacing={-0.16}
            color="gray.400"
          >
            fazer isso mais tarde
          </Text>
        </TouchableOpacity>
      </Center>
    </VStack>
  );
}
