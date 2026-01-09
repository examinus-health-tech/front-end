import { useEffect, useRef } from 'react';
import { Animated, Easing, StatusBar } from 'react-native';
import { VStack, Text, Image, Center } from 'native-base';

// assets
import Vector1 from '@assets/png/x-examinus.png';

export function Loading() {
  // Animação de pulse (escala)
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // Animação de glow (opacidade) - variação muito sutil
  const glowAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    // Animação de pulse contínua
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Animação de glow - variação muito sutil (0.85 a 1) e lenta
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.85,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
    glowAnimation.start();

    return () => {
      pulseAnimation.stop();
      glowAnimation.stop();
    };
  }, []);

  return (
    <VStack flex={1} bg={'gray.800'} space={8} py={24} px={6} justifyContent={'center'}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Center>
        {/* Container para X e fog centralizados juntos */}
        <Center style={{ position: 'relative' }}>
          {/* Fog gradiente ultra suave - opacidade uniforme e baixa */}
          {Array.from({ length: 30 }, (_, i) => 450 - (i * 10)).map((size, index) => (
            <Animated.View
              key={index}
              style={{
                position: 'absolute',
                width: size,
                height: size * 1.15,
                borderRadius: size,
                backgroundColor: '#0CC1AF',
                opacity: Animated.multiply(glowAnim, 0.008),
                transform: [{ scale: pulseAnim }],
              }}
            />
          ))}

          {/* X animado */}
          <Animated.View
            style={{
              transform: [{ scale: pulseAnim }],
            }}
          >
            <Image source={Vector1} alt="X examinus Logo" resizeMode="stretch" w={200} h={289} />
          </Animated.View>
        </Center>

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
}
