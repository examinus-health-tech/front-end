import { ArrowIcon } from '@assets/icons';

import Vector from '@assets/png/vector-3.png';
import { Button } from '@components/Button/button';
import { Container, Text, VStack, Image } from 'native-base';
import { Header } from '../../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

export function StepThree() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleNextStep() {
    navigation.navigate('stepFour');
  }

  function handleGoToSignIn() {
    navigation.navigate('signIn');
  }

  return (
    <VStack flex={1} bg={'gray.10'} space={8} py={24}>
      <Header progressValue={66} jumpTo={handleGoToSignIn} />

      <Image
        source={Vector}
        defaultSource={Vector}
        alt="Vetor"
        resizeMode="stretch"
        position="absolute"
        bottom={0}
        w="100%"
        h="85%"
      />

      <Container mx={6}>
        <Text
          fontSize={32}
          color="gray.100"
          lineHeight={38}
          fontWeight={800}
          letterSpacing={-1.4}
        >
          Sua saúde na {'\n'}palma da sua mão!
        </Text>

        <Text
          fontSize={16}
          color="gray.70"
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
        onPress={handleNextStep}
        icon={<ArrowIcon size="32" />}
      />
    </VStack>
  );
}
