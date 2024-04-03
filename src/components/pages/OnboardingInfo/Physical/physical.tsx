import { useState } from 'react';
import {
  Image,
  VStack,
  Text,
  Box,
  HStack,
  Divider,
  ZStack,
  Center,
} from 'native-base';
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

export type ISelectedPhysical = 0 | 1 | 2 | 3 | 4;

export const enumPhysicalLabel = {
  1: 'ruim',
  2: 'regular',
  3: 'moderado',
  4: 'bom',
};

export function Physical() {
  const [selectedPhysical, setSelectedPhysical] =
    useState<ISelectedPhysical>(0);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <VStack bg={'gray.400'} flex={1} space={8} py={24}>
      <HeaderProgress
        progressValue={33}
        withBackButton
        jumpTo={() => navigation.navigate('123')}
      />

      <VStack flex={1} mx={6} space={8}>
        <Text
          color="gray.900"
          fontSize={32}
          fontWeight={800}
          lineHeight={38}
          letterSpacing={-1.2}
          mt={4}
        >
          Qual é o seu nível de atividade física atual?
        </Text>

        <ZStack alignItems="center" justifyContent="center" mt={16}>
          <Divider h={4} w="90%" bg="gray.300" borderRadius={10} />

          <HStack alignItems="center" space={8}>
            <TouchableOpacity onPress={() => setSelectedPhysical(1)}>
              <Box
                bg={selectedPhysical >= 1 ? 'gray.900' : 'gray.900'}
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
            <TouchableOpacity onPress={() => setSelectedPhysical(2)}>
              <Box
                bg={selectedPhysical >= 2 ? 'gray.900' : 'gray.900'}
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
            <TouchableOpacity onPress={() => setSelectedPhysical(3)}>
              <Box
                bg={selectedPhysical >= 3 ? 'gray.900' : 'gray.900'}
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
            <TouchableOpacity onPress={() => setSelectedPhysical(4)}>
              <Box
                bg={selectedPhysical >= 4 ? 'gray.900' : 'gray.900'}
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
        </ZStack>

        <Center>
          <Text fontSize={16} fontWeight={500} lineHeight={25.6} mt={5} h={10}>
            {!!selectedPhysical &&
              `${selectedPhysical} (${enumPhysicalLabel[selectedPhysical]})`}
          </Text>
        </Center>

        <Image
          source={Vector}
          defaultSource={Vector}
          alt="Vetor"
          resizeMode="stretch"
          w={96}
          h={72}
        />

        <Button
          position="absolute"
          bottom={-50}
          variant="primary"
          size="full"
          title="Continuar"
          onPress={() => navigation.navigate('humour')}
          icon={<ArrowIcon />}
        />
      </VStack>
    </VStack>
  );
}
