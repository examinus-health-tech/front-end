import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StatusBar, Dimensions } from 'react-native';
import { VStack, Text, Center, Box, HStack, Image } from 'native-base';
import Svg, { Rect, Circle as SvgCircle } from 'react-native-svg';

import Vector1 from '@assets/png/x-examinus.png';

const { width: SCREEN_W } = Dimensions.get('window');

const CHECKLIST = [
  'Documento recebido',
  'Dados extraídos',
  'Biomarcadores identificados',
  'Resultados analisados',
  'Score calculado',
];

// Partícula flutuante
function Particle({ delay, startX, startY, color }: { delay: number; startX: number; startY: number; color: string }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: -40 - Math.random() * 30, duration: 2500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(translateX, { toValue: (Math.random() - 0.5) * 40, duration: 2500, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 0.3, duration: 600, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(translateY, { toValue: 0, duration: 0, useNativeDriver: true }),
            Animated.timing(translateX, { toValue: 0, duration: 0, useNativeDriver: true }),
          ]),
        ])
      ).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute', left: startX, top: startY,
        width: 6, height: 6, borderRadius: 3, backgroundColor: color,
        opacity, transform: [{ translateY }, { translateX }, { scale }],
      }}
    />
  );
}

// Dados saindo do documento
function DataPoint({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: -25, duration: 1200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(translateX, { toValue: (Math.random() - 0.5) * 30, duration: 1200, useNativeDriver: true }),
          ]),
          Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.parallel([
            Animated.timing(translateY, { toValue: 0, duration: 0, useNativeDriver: true }),
            Animated.timing(translateX, { toValue: 0, duration: 0, useNativeDriver: true }),
          ]),
          Animated.delay(Math.random() * 800),
        ])
      ).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: 4, height: 4, borderRadius: 2, backgroundColor: '#0CC1AF',
        opacity, transform: [{ translateY }, { translateX }],
      }}
    />
  );
}

// Check item
function CheckItem({ text, delay }: { text: string; delay: number }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], marginVertical: 3, alignItems: 'center' }}>
      <Text fontSize={13} fontWeight={600} color="ciano.300" letterSpacing={-0.13}>
        {text}
      </Text>
    </Animated.View>
  );
}

export function Loading() {
  const [checkCount, setCheckCount] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.85)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const scanAreaOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.8)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // Glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.85, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // Ring pulse (anel expandindo ao redor do logo)
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale, { toValue: 1.4, duration: 2000, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ]),
        Animated.timing(ringOpacity, { toValue: 0, duration: 1600, useNativeDriver: true }),
        Animated.timing(ringScale, { toValue: 0.8, duration: 0, useNativeDriver: true }),
      ])
    ).start();

    // Progresso — sincronizado com porcentagem (~25s)
    Animated.timing(progressAnim, { toValue: 1, duration: 25000, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();

    // Percentage counter — sincronizado com a barra via listener
    const pctId = progressAnim.addListener(({ value }: { value: number }) => {
      setPercentage(Math.round(value * 100));
    });

    // Após 2s: transição
    const transTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoTranslateY, { toValue: -30, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(logoScale, { toValue: 0.6, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(scanAreaOpacity, { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
          Animated.timing(scanLineAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        ])
      ).start();
    }, 2000);

    // Checklist — items a cada 4s, começando em 4s (último aparece em ~24s)
    let checkIdx = 0;
    const checkInterval = setInterval(() => {
      checkIdx++;
      setCheckCount(checkIdx);
      if (checkIdx >= CHECKLIST.length) clearInterval(checkInterval);
    }, 4500);

    return () => {
      clearTimeout(transTimer);
      clearInterval(checkInterval);
      progressAnim.removeListener(pctId);
    };
  }, []);

  const scanLineY = scanLineAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 110] });
  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <VStack flex={1} bg={'gray.800'} justifyContent={'center'} px={6}>
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />

      <Center>
        {/* Logo X com anel pulsante e partículas */}
        <Animated.View style={{ transform: [{ translateY: logoTranslateY }, { scale: Animated.multiply(pulseAnim, logoScale) }] }}>
          <Center style={{ position: 'relative' }}>
            {/* Glow suave */}
            {Array.from({ length: 12 }, (_, i) => 220 - (i * 14)).map((size, index) => (
              <Animated.View
                key={index}
                style={{
                  position: 'absolute', width: size, height: size * 1.15, borderRadius: size,
                  backgroundColor: '#0CC1AF', opacity: Animated.multiply(glowAnim, 0.005),
                }}
              />
            ))}

            {/* Anel expandindo */}
            <Animated.View
              style={{
                position: 'absolute', width: 160, height: 160, borderRadius: 80,
                borderWidth: 2, borderColor: '#0CC1AF',
                opacity: ringOpacity, transform: [{ scale: ringScale }],
              }}
            />

            {/* Partículas flutuantes */}
            <Particle delay={0} startX={-25} startY={40} color="#0CC1AF" />
            <Particle delay={400} startX={120} startY={60} color="#0CC1AF" />
            <Particle delay={800} startX={100} startY={15} color="rgba(12,193,175,0.7)" />
            <Particle delay={1200} startX={60} startY={-10} color="rgba(12,193,175,0.6)" />
            <Particle delay={1600} startX={-15} startY={-20} color="rgba(12,193,175,0.5)" />
            <Particle delay={2000} startX={30} startY={85} color="#0CC1AF" />
            <Particle delay={300} startX={140} startY={45} color="rgba(12,193,175,0.4)" />
            <Particle delay={700} startX={-30} startY={70} color="rgba(12,193,175,0.6)" />
            <Particle delay={1100} startX={80} startY={-15} color="#0CC1AF" />
            <Particle delay={1500} startX={-5} startY={10} color="rgba(12,193,175,0.5)" />
            <Particle delay={1900} startX={110} startY={80} color="rgba(12,193,175,0.7)" />
            <Particle delay={500} startX={50} startY={95} color="#0CC1AF" />
            <Particle delay={1000} startX={130} startY={-5} color="rgba(12,193,175,0.4)" />
            <Particle delay={1400} startX={-20} startY={55} color="rgba(12,193,175,0.6)" />

            <Image source={Vector1} alt="X" resizeMode="stretch" w={120} h={170} />
          </Center>
        </Animated.View>

        {/* Documento com scan + data points */}
        <Animated.View style={{ opacity: scanAreaOpacity, alignItems: 'center', marginTop: -10 }}>
          <Box position="relative">
            <Box w={200} h={120} bg="gray.700" borderRadius={10} borderWidth={1} borderColor="gray.600" overflow="hidden" p={3}>
              <Svg width="100%" height="100%">
                {[0, 16, 32, 48, 64, 80, 96].map((y, i) => (
                  <Rect key={i} x={0} y={y} width={i % 3 === 0 ? '100%' : i % 2 === 0 ? '65%' : '50%'} height={6} rx={3} fill="rgba(255,255,255,0.06)" />
                ))}
              </Svg>

              {/* Scan line */}
              <Animated.View
                style={{ position: 'absolute', left: 0, right: 0, top: scanLineY, height: 2, backgroundColor: '#0CC1AF', shadowColor: '#0CC1AF', shadowOpacity: 0.8, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } }}
              />
              <Animated.View
                style={{ position: 'absolute', left: 0, right: 0, top: Animated.subtract(scanLineY, 6), height: 16, backgroundColor: 'rgba(12, 193, 175, 0.06)' }}
              />
            </Box>

            {/* Data points saindo do documento */}
            <Box position="absolute" top={-5} left={20} right={20} height={30}>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <DataPoint key={i} delay={2500 + i * 500} />
              ))}
            </Box>
          </Box>

          {/* Checklist */}
          <Box mt={4} alignItems="center" w="100%">
            {CHECKLIST.slice(0, checkCount).map((item, i) => (
              <CheckItem key={i} text={item} delay={0} />
            ))}
          </Box>
        </Animated.View>

        {/* Progresso com porcentagem */}
        <Box w="75%" mt={6}>
          <Text fontSize={12} fontWeight={700} color="ciano.300" textAlign="center" mb={2}>{percentage}%</Text>
          <Box w="100%" h={3} bg="gray.600" borderRadius={4} overflow="hidden">
            <Animated.View style={{ height: '100%', width: progressWidth, backgroundColor: '#0CC1AF', borderRadius: 4 }} />
          </Box>
        </Box>
      </Center>
    </VStack>
  );
}
