import { VStack, Text, Image, Center } from 'native-base';

// assets
import Vector1 from '@assets/png/x-examinus.png';

export function Loading() {
  return (
    <VStack flex={1} bg={'gray.800'} space={8} py={24} px={6} justifyContent={'center'}>
      <Center>
        <Image source={Vector1} alt="X examinus Logo" resizeMode="stretch" w={200} h={289} />

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
