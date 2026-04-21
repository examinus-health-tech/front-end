import { useEffect, useRef } from 'react';
import { Animated as RNAnimated, Easing, StatusBar } from 'react-native';
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

  // Animações de entrada
  const bgOpacity = useRef(new RNAnimated.Value(0)).current;
  const imageTranslateY = useRef(new RNAnimated.Value(40)).current;
  const imageOpacity = useRef(new RNAnimated.Value(0)).current;
  const titleTranslateY = useRef(new RNAnimated.Value(30)).current;
  const titleOpacity = useRef(new RNAnimated.Value(0)).current;
  const subtitleTranslateY = useRef(new RNAnimated.Value(30)).current;
  const subtitleOpacity = useRef(new RNAnimated.Value(0)).current;
  const buttonTranslateY = useRef(new RNAnimated.Value(30)).current;
  const buttonOpacity = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    // Fundo aparece com fade
    RNAnimated.timing(bgOpacity, {
      toValue: 1, duration: 600, useNativeDriver: true,
    }).start();

    // Imagem (delay 200ms)
    RNAnimated.sequence([
      RNAnimated.delay(200),
      RNAnimated.parallel([
        RNAnimated.timing(imageOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        RNAnimated.timing(imageTranslateY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();

    // Título (delay 500ms)
    RNAnimated.sequence([
      RNAnimated.delay(500),
      RNAnimated.parallel([
        RNAnimated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        RNAnimated.timing(titleTranslateY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();

    // Subtítulo (delay 800ms)
    RNAnimated.sequence([
      RNAnimated.delay(800),
      RNAnimated.parallel([
        RNAnimated.timing(subtitleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        RNAnimated.timing(subtitleTranslateY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();

    // Botão (delay 1100ms)
    RNAnimated.sequence([
      RNAnimated.delay(1100),
      RNAnimated.parallel([
        RNAnimated.timing(buttonOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        RNAnimated.timing(buttonTranslateY, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();

    // Haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  function handleGoToHomepage() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    if (onClose) {
      onClose();
    } else {
      if (setWithSuccess) setWithSuccess(false);
      if (showTabBar) showTabBar();
    }
    navigation.navigate('examList');
  }

  return (
    <RNAnimated.View testID="screen-score-warning" style={{ flex: 1, opacity: bgOpacity, backgroundColor: '#8B5CF6' }}>
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
      <VStack flex={1} space={8} py={24}>
        {/* Imagem */}
        <RNAnimated.View style={{ opacity: imageOpacity, transform: [{ translateY: imageTranslateY }] }}>
          <Image source={Vector} defaultSource={Vector} alt="X examinus Logo" resizeMode="stretch" w="100%" h={400} />
        </RNAnimated.View>

        <Center flex={1} alignItems="center">
          {/* Título */}
          <RNAnimated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] }}>
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
          </RNAnimated.View>

          {/* Subtítulo */}
          <RNAnimated.View style={{ opacity: subtitleOpacity, transform: [{ translateY: subtitleTranslateY }] }}>
            <Text fontSize={14} fontWeight={500} lineHeight={22.4} color={'white'} textAlign="center" mt={4}>
              Fique tranquilo! Você receberá uma notificação{'\n'}
              assim que estiver pronto. Enquanto cuidamos de{'\n'}
              você, aproveite o melhor app de saúde!
            </Text>
          </RNAnimated.View>

          {/* Botão */}
          <RNAnimated.View style={{ opacity: buttonOpacity, transform: [{ translateY: buttonTranslateY }] }}>
            <Button
              testID="btn-score-continue"
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
          </RNAnimated.View>
        </Center>
      </VStack>
    </RNAnimated.View>
  );
}
