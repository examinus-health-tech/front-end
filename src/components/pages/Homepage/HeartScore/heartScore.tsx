import { useEffect, useRef } from 'react';
import { VStack, Text, useDisclose, Box, HStack, ScrollView, IScrollViewProps, Image } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { BarbellIcon, ChevronRightIcon, HeadHealtthIcon, PIllIcon, StethoscopeIcon } from '@assets/icons';
import Vector from '@assets/png/vector-23.png';
import Vector2 from '@assets/png/vector-33.png';

// components
import { HeaderTitle } from '@components/molecules';
import { useHome } from 'src/hooks/useHome';

export function HeartScore() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { currentSystem, setCurrentSystem } = useHome();

  useEffect(() => {
    return () => {
      setCurrentSystem(null);
    };
  }, []);

  if (currentSystem) {
    return (
      <VStack my={16}>
        <HeaderTitle
          title={`Score ${currentSystem.sistema}`}
          withBackButton={() => {
            navigation.navigate('healthWallet');
          }}
          position="fixed"
          badgeVariant={currentSystem.nivel}
        />

        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
          <VStack flex={1} space={8} pt={2} pb={32}>
            <VStack flex={1} mx={6}>
              {currentSystem.nivel == 'excelente' || currentSystem.nivel == 'risco normal' ? (
                <Box bg="ciano.200" pl={4} borderRadius={12} shadow={2}>
                  <HStack>
                    <VStack flex={1} justifyContent="center" py={4}>
                      <Text fontSize={18} fontWeight={800} letterSpacing={-0.16} color="white">
                        Woooow! {'\n'}Sua saúde está Top!
                      </Text>
                      <Text fontSize={14} fontWeight={500} letterSpacing={-0.16} color="white">
                        Continue melhorando seu score através desses benefícios exclusivos:
                      </Text>
                    </VStack>

                    <Image flex={1} source={Vector2} defaultSource={Vector2} alt="Vetor" resizeMode="stretch" h={150} />
                  </HStack>
                </Box>
              ) : (
                <Box bg="red.100" pl={4} py={4} borderRadius={12} shadow={2}>
                  <HStack>
                    <VStack flex={1} justifyContent="center">
                      <Text fontSize={18} fontWeight={800} letterSpacing={-0.16} color="red.600">
                        Sua saúde{'\n'}está em risco!
                      </Text>
                      <Text fontSize={14} fontWeight={500} letterSpacing={-0.16} color="gray.500">
                        Mas fique tranquilo e{'\n'}conta com a Examinus!
                      </Text>
                      <Text fontSize={14} fontWeight={500} letterSpacing={-0.16} color="red.700">
                        Escolha a solução abaixo:
                      </Text>
                    </VStack>

                    <Image flex={1} source={Vector} defaultSource={Vector} alt="Vetor" resizeMode="stretch" h={130} />
                  </HStack>
                </Box>
              )}

              <HStack justifyContent={'space-between'} mt={2} space={4}>
                <Box mt={4} bg={'white'} p={4} shadow={1} borderRadius={16} minH={200} flex={1} position="relative">
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0,0,0,0.4)"
                    borderRadius={16}
                    alignItems="center"
                    justifyContent="center"
                    zIndex={10}
                  >
                    <Text fontSize={18} fontWeight={700} color="white" textAlign="center">
                      Em breve
                    </Text>
                  </Box>

                  <HStack justifyContent="space-between">
                    <Box bg="gray.50" borderRadius={16} size={12} alignItems="center" justifyContent="center">
                      <StethoscopeIcon />
                    </Box>
                    <ChevronRightIcon color="#0CC1AF" size="32" />
                  </HStack>

                  <Text mt={1} fontSize={20} fontWeight={500} letterSpacing={-0.16} lineHeight={22}>
                    Agendar Consulta Cardio
                  </Text>

                  <Text mt={1} fontSize={14} fontWeight={400} letterSpacing={-0.16} color="gray.600">
                    Dê um UP na sua saúde com um de nossos especialistas!
                  </Text>
                </Box>

                <Box mt={4} bg={'white'} p={4} shadow={1} borderRadius={16} minH={200} flex={1} position="relative">
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0,0,0,0.4)"
                    borderRadius={16}
                    alignItems="center"
                    justifyContent="center"
                    zIndex={10}
                  >
                    <Text fontSize={18} fontWeight={700} color="white" textAlign="center">
                      Em breve
                    </Text>
                  </Box>

                  <HStack justifyContent="space-between">
                    <Box bg="gray.50" borderRadius={16} size={12} alignItems="center" justifyContent="center">
                      <BarbellIcon />
                    </Box>
                    <ChevronRightIcon color="#0CC1AF" size="32" />
                  </HStack>

                  <Text mt={1} fontSize={20} fontWeight={500} letterSpacing={-0.16} lineHeight={22}>
                    Programa Queima Diária
                  </Text>

                  <Text mt={1} fontSize={14} fontWeight={400} letterSpacing={-0.16} color="gray.600">
                    Fique em forma e melhore seu sistema cardiorespiratório
                  </Text>
                </Box>
              </HStack>

              <HStack justifyContent={'space-between'} space={4}>
                <Box mt={4} bg={'white'} p={4} shadow={1} borderRadius={16} minH={200} flex={1} position="relative">
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0,0,0,0.4)"
                    borderRadius={16}
                    alignItems="center"
                    justifyContent="center"
                    zIndex={10}
                  >
                    <Text fontSize={18} fontWeight={700} color="white" textAlign="center">
                      Em breve
                    </Text>
                  </Box>

                  <HStack justifyContent="space-between">
                    <Box bg="gray.50" borderRadius={16} size={12} alignItems="center" justifyContent="center">
                      <HeadHealtthIcon />
                    </Box>
                    <ChevronRightIcon color="#0CC1AF" size="32" />
                  </HStack>

                  <Text mt={1} fontSize={20} fontWeight={500} letterSpacing={-0.16} lineHeight={22}>
                    Terapia Online
                  </Text>

                  <Text mt={1} fontSize={14} fontWeight={400} letterSpacing={-0.16} color="gray.600">
                    Tá sofrendo do coração? Isso pode ser ansiedade! Fale com nossa Terapêuta!
                  </Text>
                </Box>

                <Box mt={4} bg={'white'} p={4} shadow={1} borderRadius={16} minH={200} flex={1} position="relative">
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0,0,0,0.4)"
                    borderRadius={16}
                    alignItems="center"
                    justifyContent="center"
                    zIndex={10}
                  >
                    <Text fontSize={18} fontWeight={700} color="white" textAlign="center">
                      Em breve
                    </Text>
                  </Box>

                  <HStack justifyContent="space-between">
                    <Box bg="gray.50" borderRadius={16} size={12} alignItems="center" justifyContent="center">
                      <PIllIcon />
                    </Box>
                    <ChevronRightIcon color="#0CC1AF" size="32" />
                  </HStack>

                  <Text mt={1} fontSize={20} fontWeight={500} letterSpacing={-0.16} lineHeight={22}>
                    Farmácia de Manipulação
                  </Text>

                  <Text mt={1} fontSize={14} fontWeight={400} letterSpacing={-0.16} color="gray.600">
                    Aqui você tem 20% de desconto em qualquer remédio manipulado.
                  </Text>
                </Box>
              </HStack>
            </VStack>
          </VStack>
        </ScrollView>
      </VStack>
    );
  }
}
