import { useEffect, useRef, useMemo } from 'react';
import { VStack, Text, useDisclose, Box, HStack, ScrollView, Image } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { BarbellIcon, ChevronRightIcon, HeadHealtthIcon, PillIcon, StethoscopeIcon } from '@assets/icons';
import Vector2 from '@assets/png/vector-33.png';
import Vector3 from '@assets/png/vector-46.png';
import VectorMale from '@assets/png/vector-46.png'; // Imagem para homem (saúde boa)
import VectorFemale from '@assets/png/vector-33.png'; // Imagem para mulher (saúde boa)
import VectorRiskMale from '@assets/png/vector-47.png'; // Imagem para homem (em risco)
import VectorRiskFemale from '@assets/png/vector-23.png'; // Imagem para mulher (em risco)

// components
import { HeaderTitle } from '@components/molecules';
import { useHome } from 'src/hooks/useHome';
import { useOnboarding } from 'src/hooks/useOnboarding';

export function HeartScore() {
  const scrollRef = useRef<any>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { currentSystem, setCurrentSystem } = useHome();
  const { personalData } = useOnboarding();

  // Determina a imagem baseada no gênero do usuário (saúde boa)
  const genderImage = useMemo(() => {
    if (personalData) {
      const gender = (personalData as any).gender?.toLowerCase();
      if (gender === 'f') {
        return VectorFemale;
      }
    }
    return VectorMale;
  }, [personalData]);

  // Determina a imagem baseada no gênero do usuário (em risco)
  const genderRiskImage = useMemo(() => {
    console.log('!@# personalData', personalData);
    if (personalData) {
      const gender = (personalData as any).gender?.toLowerCase();
      if (gender === 'f') {
        return VectorRiskFemale;
      }
    }
    return VectorRiskMale;
  }, [personalData]);

  useEffect(() => {
    return () => {
      setCurrentSystem(null);
    };
  }, []);

  if (currentSystem) {
    return (
      <VStack py={16}>
        <HeaderTitle
          title={`Score ${currentSystem.sistema}`}
          withBackButton={() => {
            navigation.navigate('healthWallet');
          }}
          badgeVariant={currentSystem.nivel as 'risco alto' | 'risco normal' | 'excelente'}
        />

        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
          <VStack flex={1} space={8} pt={2} pb={32}>
            <VStack flex={1} mx={6}>
              {currentSystem.nivel == 'excelente' || currentSystem.nivel == 'risco normal' ? (
                <TouchableOpacity onPress={() => navigation.navigate('examList')}>
                  <Box bg="ciano.300" pl={4} borderRadius={12} shadow={2} overflow="hidden">
                    <HStack>
                      <VStack flex={1} justifyContent="center" py={4}>
                        <Text fontSize={18} fontWeight={800} letterSpacing={-0.16} color="white" lineHeight={22}>
                          Woooow! {'\n'}Sua saúde está Top!
                        </Text>
                        <Text fontSize={14} fontWeight={500} letterSpacing={-0.16} color="white" mt={1}>
                          Continue melhorando seu score através desses benefícios exclusivos:
                        </Text>

                        <Text fontSize={14} fontWeight={700} letterSpacing={-0.16} color="white">
                          Ver detalhes {'>'}
                        </Text>
                      </VStack>

                      <Image
                        flex={1}
                        height="100%"
                        source={genderImage}
                        defaultSource={genderImage}
                        alt="Vetor"
                        resizeMode="stretch"
                        alignSelf="stretch"
                      />
                    </HStack>
                  </Box>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => navigation.navigate('examList')}>
                  <Box bg="red.100" pl={4} borderRadius={12} shadow={2} overflow="hidden">
                    <HStack>
                      <VStack flex={1} justifyContent="center" py={4}>
                        <Text fontSize={18} fontWeight={800} letterSpacing={-0.16} color="red.600" lineHeight={22}>
                          Sua saúde{'\n'}está em risco!
                        </Text>
                        <Text fontSize={14} fontWeight={500} letterSpacing={-0.16} color="gray.500" mt={2}>
                          Mas fique tranquilo e{'\n'}conta com a Examinus!
                        </Text>
                        <Text fontSize={14} fontWeight={500} letterSpacing={-0.16} color="red.700">
                          Ver detalhes {'>'}
                        </Text>
                      </VStack>

                      <Image
                        flex={1}
                        height="100%"
                        source={genderRiskImage}
                        defaultSource={genderRiskImage}
                        alt="Vetor"
                        resizeMode="stretch"
                        alignSelf="stretch"
                      />
                    </HStack>
                  </Box>
                </TouchableOpacity>
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
                      <PillIcon />
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
