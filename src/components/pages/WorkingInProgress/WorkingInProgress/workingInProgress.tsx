import { VStack, Image, Text } from 'native-base';

import Vector from '@assets/png/vector-36.png';

export function WorkingInProgress() {
  return (
    <VStack flex={1} height="100%" alignItems="center" justifyContent="center">
      <Image source={Vector} alt="Vetor" resizeMode="stretch" h="45%" />

      <Text fontSize={26} fontWeight={800} letterSpacing={-1.2} lineHeight={28} color={'gray.900'} textAlign="center">
        Essa funcionalidade{'\n'}está em desenvolvimento{'\n'}
      </Text>
      <Text fontSize={16} fontWeight={600} lineHeight={22} color={'gray.900'}>
        Novidades em breve! ⚒️
      </Text>
    </VStack>
  );
}
