import { VStack, Text, Image, Center } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector from '@assets/png/vector-10.png';

// components
import { Button } from '@components/atoms';
import { useTabBar } from 'src/hooks/useTabBar';
import { useUpload } from 'src/hooks/useUpload';

interface ScoreWarningProps {
  onClose?: () => void;
}

export function ScoreWarning({ onClose }: ScoreWarningProps = {}) {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  // Hooks com fallback seguro
  let showTabBar: (() => void) | undefined;
  let setWithSuccess: ((value: boolean) => void) | undefined;

  try {
    const tabBarContext = useTabBar();
    showTabBar = tabBarContext?.showTabBar;
  } catch (error) {
    console.log('TabBar context não disponível (pode estar no onboarding)');
  }

  try {
    const uploadContext = useUpload();
    setWithSuccess = uploadContext?.setWithSuccess;
  } catch (error) {
    console.log('Upload context não disponível (pode estar no onboarding)');
  }

  function handleGoToHomepage() {
    console.log('🏠 Fechando modal de sucesso');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(err =>
      console.log('Haptics não disponível:', err)
    );

    // Se tem onClose prop (GlobalUploadBottomSheet), usa ela
    if (onClose) {
      onClose();
    } else {
      // Senão, usa o comportamento antigo (UploadMain do onboarding)
      if (setWithSuccess) {
        setWithSuccess(false);
      }
      if (showTabBar) {
        showTabBar();
      }
      navigation.navigate('homepage');
    }
  }

  return (
    <VStack flex={1} space={8} py={24} bg={'purple.500'}>
      <Image source={Vector} defaultSource={Vector} alt="X examinus Logo" resizeMode="stretch" w="100%" h={400} />

      <Center flex={1} alignItems="center">
        <Text
          fontSize={24}
          fontWeight={800}
          lineHeight={32}
          letterSpacing={-0.96}
          color={'white'}
          textAlign="center"
          mt={8}
        >
          Yeaaaah! Seu Score X{'\n'}
          está sendo processado!
        </Text>

        <Text fontSize={14} fontWeight={500} lineHeight={22.4} color={'white'} textAlign="center" mt={4}>
          Fique tranquilo! Você receberá uma notificação{'\n'}
          assim que estiver pronto. Enquanto cuidamos de{'\n'}
          você, aproveite o melhor app de saúde!
        </Text>

        <Button
          variant="outline"
          size="md"
          title="Bora ficar saudável"
          icon={<ArrowIcon />}
          mt={6}
          onPress={handleGoToHomepage}
          _pressed={{
            bgColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'white',
          }}
        />
      </Center>
    </VStack>
  );
}
