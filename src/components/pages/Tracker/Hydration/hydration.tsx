import { useEffect, useRef, useCallback } from 'react';
import { VStack, Box, Text, Image } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Animated, Easing } from 'react-native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { HeaderTitle } from '@components/molecules';

// assets
import { WaterDropFilledIcon } from '@assets/icons';
import SwimmerBg from '@assets/png/hydration-swimmer.png';
import CloudBg from '@assets/png/hydration-cloud.png';

// hooks
import { useHome } from 'src/hooks/useHome';
import { useTabBar } from 'src/hooks/useTabBar';

export function Hydration() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { trackerData } = useHome();
  const { hideTabBar, showTabBar } = useTabBar();

  // Hide tab bar when screen is focused
  useFocusEffect(
    useCallback(() => {
      hideTabBar();
      return () => showTabBar();
    }, [hideTabBar, showTabBar])
  );

  // Cloud animations
  const cloud1Anim = useRef(new Animated.Value(0)).current;
  const cloud2Anim = useRef(new Animated.Value(0)).current;
  const cloud3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createCloudAnimation = (anim: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = createCloudAnimation(cloud1Anim, 4000);
    const anim2 = createCloudAnimation(cloud2Anim, 5000);
    const anim3 = createCloudAnimation(cloud3Anim, 3500);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  // Dados do contexto ou mock
  const hydrationGoal = 2000; // ml
  const hydrationCompleted = Number(trackerData?.hydration?.[0]?.hydration_completed) || 0;
  const currentHydration = hydrationCompleted > 0 ? hydrationCompleted * 250 : 1542; // mock: 1542ml
  const remaining = Math.max(hydrationGoal - currentHydration, 0);

  return (
    <VStack flex={1} bg="#F8FAFB">
      {/* Header */}
      <Box py={16} zIndex={10}>
        <HeaderTitle withBackButton={() => navigation.navigate('tracker')} title="Hidratação" withMoreButton />
      </Box>

      {/* Content Area */}
      <VStack flex={1} position="relative">
        {/* Clouds - decorative background with animation */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 20,
            left: -20,
            transform: [
              {
                translateX: cloud1Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 30],
                }),
              },
            ],
          }}
        >
          <Image source={CloudBg} alt="Cloud" w={120} h={60} resizeMode="contain" opacity={0.8} />
        </Animated.View>
        <Animated.View
          style={{
            position: 'absolute',
            top: 60,
            right: -10,
            transform: [
              {
                translateX: cloud2Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -25],
                }),
              },
            ],
          }}
        >
          <Image source={CloudBg} alt="Cloud" w={100} h={50} resizeMode="contain" opacity={0.6} />
        </Animated.View>
        <Animated.View
          style={{
            position: 'absolute',
            top: 100,
            left: 40,
            transform: [
              {
                translateX: cloud3Anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 20],
                }),
              },
            ],
          }}
        >
          <Image source={CloudBg} alt="Cloud" w={80} h={40} resizeMode="contain" opacity={0.4} />
        </Animated.View>

        {/* Stats Section */}
        <VStack alignItems="center" zIndex={5}>
          {/* Water Drop Icon + Label */}
          <Box flexDirection="row" alignItems="center">
            <WaterDropFilledIcon size="20" color="#052B3B" />
            <Text fontFamily="Poligon" fontSize={16} fontWeight={600} color="#052B3B" letterSpacing={-0.16} ml={2}>
              Você bebeu
            </Text>
          </Box>

          {/* Main Value */}
          <Box flexDirection="row" alignItems="flex-end" mt={2}>
            <Text fontFamily="Poligon" fontSize={72} fontWeight={800} color="gray.900" letterSpacing={-0.72}>
              {currentHydration.toLocaleString('pt-BR')}
            </Text>
            <Text fontFamily="Poligon" fontSize={24} fontWeight={600} color="#5D6A85" mb={3}>
              ml
            </Text>
          </Box>

          {/* Remaining */}
          <Text fontFamily="Poligon" fontSize={16} fontWeight={600} color="#5D6A85" letterSpacing={-0.16}>
            {remaining.toLocaleString('pt-BR')}ml faltantes
          </Text>
        </VStack>

        {/* Swimmer Background - fits to sides and bottom */}
        <Image
          source={SwimmerBg}
          alt="Swimmer"
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          w="100%"
          h="74%"
          resizeMode="cover"
        />
      </VStack>
    </VStack>
  );
}
