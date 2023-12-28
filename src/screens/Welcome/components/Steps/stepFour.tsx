import Vector from '@assets/png/vector-4.png';
import { Container, Image, Text, VStack } from 'native-base';
import { Header } from '../../../../components/Header';
import { Button } from '@components/Button/button';
import { ArrowIcon } from '@assets/icons';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

export function StepFour() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleNextStep() {
    navigation.navigate('signIn');
  }

  return (
    <VStack flex={1} bg={'gray.10'} space={8} py={24}>
      <Header progressValue={100} jumpTo={handleNextStep} />

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
          Fique tranquilo: seus {'\n'}dados estão seguros!
        </Text>

        <Text
          fontSize={16}
          color="gray.70"
          lineHeight={24}
          fontWeight={500}
          pt={4}
        >
          Na Examinus garantimos a privacidade e {'\n'}segurança dos seus dados
          pessoais.
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
