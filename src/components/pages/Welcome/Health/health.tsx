import { useNavigation } from '@react-navigation/native';
import { Container, Text, VStack, Image } from 'native-base';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import Vector from '@assets/png/vector-3.png';
import { ArrowIcon } from '@assets/icons';

import { Button } from '@components/atoms';
import { HeaderProgress } from '@components/molecules';

export function Health() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  return (
    <VStack flex={1} space={8} py={24}>
      <HeaderProgress
        progressValue={66}
        jumpTo={() => navigation.navigate('signIn')}
      />

      <Image
        source={Vector}
        defaultSource={Vector}
        alt="Vetor"
        resizeMode="stretch"
        position="absolute"
        bottom={0}
        w="100%"
        h="70%"
      />

      <Container mx={6}>
        <Text
          fontSize={32}
          color="gray.900"
          lineHeight={38}
          fontWeight={800}
          letterSpacing={-1.4}
        >
          Sua saúde na {'\n'}palma da sua mão!
        </Text>

        <Text
          fontSize={16}
          color="gray.600"
          lineHeight={24}
          fontWeight={500}
          pt={4}
        >
          Você monitora em tempo real o status da sua {'\n'}saúde, e o melhor:
          tudo em um só lugar.
        </Text>
      </Container>

      <Button
        position="absolute"
        bottom={8}
        right={8}
        variant="fabDark"
        size="fab"
        marginTop={8}
        onPress={() => navigation.navigate('stayCalm')}
        icon={<ArrowIcon size="32" />}
      />
    </VStack>
  );
}
