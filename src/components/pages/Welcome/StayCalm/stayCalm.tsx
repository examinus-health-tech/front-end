import { useNavigation } from '@react-navigation/native';
import { Container, Image, Text, VStack } from 'native-base';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import Vector from '@assets/png/vector-4.png';
import { ArrowIcon } from '@assets/icons';

import { Button } from '@components/atoms';
import { HeaderProgress, LegalFooter } from '@components/molecules';

export function StayCalm() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  return (
    <VStack flex={1} space={8} py={24}>
      <HeaderProgress progressValue={100} jumpTo={() => navigation.navigate('signIn')} />

      <Image
        source={Vector}
        defaultSource={Vector}
        alt="Vetor"
        resizeMode="stretch"
        position="absolute"
        bottom={0}
        w="100%"
        h="75%"
      />

      <Container mx={6}>
        <Text fontSize={32} color="gray.900" lineHeight={38} fontWeight={800} letterSpacing={-1.4}>
          Fique tranquilo: seus {'\n'}dados estão seguros!
        </Text>

        <Text fontSize={16} color="gray.600" lineHeight={24} fontWeight={500} pt={4}>
          A Examinus utiliza padrões avançados de segurança para garantir a privacidade das suas informações.
        </Text>
      </Container>

      <LegalFooter />

      <Button
        position="absolute"
        bottom={8}
        right={8}
        variant="fabDark"
        size="fab"
        marginTop={8}
        onPress={() => navigation.navigate('signIn')}
        icon={<ArrowIcon size="32" />}
      />
    </VStack>
  );
}
