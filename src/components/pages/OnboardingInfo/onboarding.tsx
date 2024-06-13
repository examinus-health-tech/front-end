import { Center, Flex, Image, Text, VStack } from 'native-base';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

// routes

// assets
import XLogo from '@assets/png/x-examinus.png';

// components
import { HeaderProgress } from '@components/molecules';
import { Gender, Weight, Age, Physical, Habits, Upload, UploadError } from '@components/pages/OnboardingInfo';
import { useOnboarding } from 'src/hooks/useOnboarding';
import { useUpload } from 'src/hooks/useUpload';
import { ScoreWarning } from './ScoreWarning/scoreWarning';
import { useEffect } from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';

export function OnboardingSteps() {
  const { step, handlePreviousStep, jumpToUpload, stepsMap, onboardingData } = useOnboarding();
  const { isLoading, scoreWarning } = useUpload();
  const shake = useSharedValue(0);
  const { userData, getUserData, isLoadingUserData } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const shakeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shake.value }],
    };
  });

  function handleSteps() {
    const selectedStep = stepsMap[step];

    switch (selectedStep.currentStep) {
      case 'gender': {
        return <Gender />;
      }
      case 'weight': {
        return <Weight />;
      }
      case 'age': {
        return <Age />;
      }
      case 'physical': {
        return <Physical />;
      }
      case 'habits': {
        return <Habits />;
      }
      case 'upload': {
        return <Upload />;
      }
      case 'error': {
        return <UploadError />;
      }
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (userData.gender) {
      navigation.navigate('homepage');
    }
  }, [userData]);

  if (isLoadingUserData) {
    return (
      <Flex align="center" justify="center" h="100%">
        <ActivityIndicator size="large" color="#00B39D" />
      </Flex>
    );
  } else if (isLoading) {
    return (
      <VStack flex={1} bg={'gray.800'} space={8} py={24} px={6} justifyContent={'center'}>
        <Center>
          <Animated.View style={shakeStyle}>
            <Image source={XLogo} defaultSource={XLogo} alt="X examinus Logo" resizeMode="stretch" w={200} h={289} />
          </Animated.View>

          <Text fontSize={20} fontWeight={800} letterSpacing={-0.2} color={'white'} textAlign="center" mt={8}>
            Carregando os{'\n'}
            resultados do seu exame...
          </Text>
          <Text fontSize={14} fontWeight={500} lineHeight={25.6} color={'white'} textAlign="center">
            Nosso time está fazendo a mágica{'\n'}
            acontecer para desvendar sua saúde!
          </Text>
        </Center>
      </VStack>
    );
  } else if (scoreWarning) {
    return <ScoreWarning />;
  } else {
    return (
      <VStack flex={1} space={8} py={24}>
        <HeaderProgress
          {...(stepsMap[step].progress && {
            progressValue: stepsMap[step].progress,
          })}
          {...(stepsMap[step].nextStep && {
            jumpTo: () => jumpToUpload(),
          })}
          {...(stepsMap[step].previousStep && {
            withBackButton: () => handlePreviousStep(),
          })}
        />

        {handleSteps()}
      </VStack>
    );
  }
}
