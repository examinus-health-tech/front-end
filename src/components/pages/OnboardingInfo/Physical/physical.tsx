import { useState, useEffect } from 'react';
import { Image, VStack, Text, Box, HStack, Divider, ZStack, Center } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ArrowIcon } from '@assets/icons';
import Vector from '@assets/png/vector-8.png';

// components
import { Button } from '@components/atoms';
import { HeaderProgress } from '@components/molecules';
import { TouchableOpacity } from 'react-native';
import { useOnboarding } from 'src/hooks/useOnboarding';

export type ISelectedPhysical = 0 | 1 | 2 | 3 | 4;

export const enumPhysicalLabel = {
  1: 'ruim',
  2: 'regular',
  3: 'moderado',
  4: 'bom',
};

export function Physical() {
  const [selectedPhysical, setSelectedPhysical] = useState<ISelectedPhysical>(0);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { onboardingData, setOnboardingData, handleNextStep } = useOnboarding();

  useEffect(() => {
    // Verificar ambos os campos para compatibilidade
    const level = onboardingData.workoutLevel || onboardingData.physicalLevel;
    console.log('🏃 [PHYSICAL] Carregando dados:', {
      workoutLevel: onboardingData.workoutLevel,
      physicalLevel: onboardingData.physicalLevel,
      levelSelecionado: level
    });
    if (level) {
      setSelectedPhysical(level as ISelectedPhysical);
    }
  }, []);

  // Salvar automaticamente quando o nível físico mudar
  useEffect(() => {
    if (selectedPhysical > 0) {
      console.log('💾 [PHYSICAL] Salvando nível físico:', selectedPhysical);
      // Salvar em workoutLevel (nome esperado pela API)
      setOnboardingData({ ...onboardingData, workoutLevel: selectedPhysical, physicalLevel: selectedPhysical });
    }
  }, [selectedPhysical]);

  return (
    <VStack flex={1} mx={6} space={4}>
      <Text color="gray.900" fontSize={32} fontWeight={800} lineHeight={38} letterSpacing={-1.2} mt={4}>
        Qual é o seu nível de atividade física atual?
      </Text>

      <ZStack alignItems="center" justifyContent="center" mt={8} zIndex={1}>
        <HStack alignItems="center" space={8}>
          <TouchableOpacity onPress={() => setSelectedPhysical(1)} activeOpacity={0.8}>
            <Box
              bg={selectedPhysical >= 1 ? 'gray.900' : 'gray.100'}
              size={16}
              rounded="2xl"
              alignItems="center"
              justifyContent="center"
              borderWidth={selectedPhysical == 1 ? 4 : 0}
              borderColor="gray.200"
            >
              <Text
                fontSize={24}
                fontWeight={800}
                lineHeight={32}
                letterSpacing={-0.96}
                color={selectedPhysical >= 1 ? 'white' : 'gray.400'}
              >
                1
              </Text>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedPhysical(2)} activeOpacity={0.8}>
            <Box
              bg={selectedPhysical >= 2 ? 'gray.900' : 'gray.100'}
              size={16}
              rounded="2xl"
              alignItems="center"
              justifyContent="center"
              borderWidth={selectedPhysical == 2 ? 4 : 0}
              borderColor="gray.200"
            >
              <Text
                fontSize={24}
                fontWeight={800}
                lineHeight={32}
                letterSpacing={-0.96}
                color={selectedPhysical >= 2 ? 'white' : 'gray.400'}
              >
                2
              </Text>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedPhysical(3)} activeOpacity={0.8}>
            <Box
              bg={selectedPhysical >= 3 ? 'gray.900' : 'gray.100'}
              size={16}
              rounded="2xl"
              alignItems="center"
              justifyContent="center"
              borderWidth={selectedPhysical == 3 ? 4 : 0}
              borderColor="gray.200"
            >
              <Text
                fontSize={24}
                fontWeight={800}
                lineHeight={32}
                letterSpacing={-0.96}
                color={selectedPhysical >= 3 ? 'white' : 'gray.400'}
              >
                3
              </Text>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedPhysical(4)} activeOpacity={0.8}>
            <Box
              bg={selectedPhysical >= 4 ? 'gray.900' : 'gray.100'}
              size={16}
              rounded="2xl"
              alignItems="center"
              justifyContent="center"
              borderWidth={selectedPhysical == 4 ? 4 : 0}
              borderColor="gray.200"
            >
              <Text
                fontSize={24}
                fontWeight={800}
                lineHeight={32}
                letterSpacing={-0.96}
                color={selectedPhysical >= 4 ? 'white' : 'gray.400'}
              >
                4
              </Text>
            </Box>
          </TouchableOpacity>
        </HStack>

        <Divider h={4} w="80%" bg="gray.300" borderRadius={10} zIndex={-1} />
      </ZStack>

      <Center>
        <Text fontSize={16} fontWeight={500} lineHeight={25.6} h={10} mt={8}>
          {!!selectedPhysical && `${selectedPhysical} (${enumPhysicalLabel[selectedPhysical]})`}
        </Text>
      </Center>

      <Image source={Vector} defaultSource={Vector} alt="Vetor" resizeMode="stretch" w={96} h={72} />

      <Button
        position="absolute"
        bottom={-50}
        variant="primary"
        size="full"
        title="Continuar"
        onPress={() => {
          // Salvar em ambos os campos para compatibilidade
          const data = { ...onboardingData, workoutLevel: selectedPhysical, physicalLevel: selectedPhysical };
          setOnboardingData(data);
          handleNextStep();
        }}
        icon={<ArrowIcon />}
      />
    </VStack>
  );
}
