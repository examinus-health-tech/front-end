import Vector from '@assets/png/vector-2.png';
import { Image, VStack, Text, Container } from 'native-base';
import { Button } from '@components/Button/button';
import { ArrowIcon } from '@assets/icons';
import { Header } from '../../../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

export function StepTwo() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleNextStep() {
    navigation.navigate('stepThree');
  }

  function handleGoToSignIn() {
    navigation.navigate('signIn');
  }

  return (
    <VStack flex={1} bg={'gray.10'} space={8} py={24}>
      <Header progressValue={33} jumpTo={handleGoToSignIn} />

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
          Simplifique seu{'\n'}exame laboratorial!
        </Text>

        <Text
          fontSize={16}
          color="gray.70"
          lineHeight={24}
          fontWeight={500}
          pt={4}
        >
          Desvendamos os resultados do seu exame de {'\n'}maneira encantadora,
          tornando tudo mais {'\n'}claro e compreensível para você!
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
