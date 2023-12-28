import { VStack, Image, Text, Center, Flex } from 'native-base';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import Vector from '@assets/png/vector.png';
import RobotSvg from '@assets/svg/robot.svg';
import LogoSvg from '@assets/svg/logo.svg';
import { ArrowIcon } from '@assets/icons';
import { Button } from '@components/Button/button';
import { useNavigation } from '@react-navigation/native';

export function StepOne() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleNextStep() {
    navigation.navigate('stepTwo');
  }

  function handleGoToSignIn() {
    navigation.navigate('signIn');
  }

  return (
    <Flex justify="space-evenly" h="100%" mt={10}>
      <Image
        source={Vector}
        defaultSource={Vector}
        alt="Vetor"
        resizeMode="stretch"
        position="absolute"
        bottom={140}
        w="100%"
        h="70%"
      />

      <Center>
        <LogoSvg />

        <Text
          textAlign="center"
          fontSize={30}
          color="gray.100"
          lineHeight={38}
          fontWeight={800}
          letterSpacing={-1.2}
          paddingTop={4}
        >
          Olá, eu sou a{'\n'}
          <Text color="ciano.40">examinus.</Text>
        </Text>

        <Text
          textAlign="center"
          fontSize={16}
          color="gray.70"
          lineHeight={24}
          fontWeight={500}
          paddingTop={6}
        >
          A 1ª IA que cuida da sua saúde e{'\n'}interpreta seus exames
          laboratoriais!
        </Text>
      </Center>

      <Center>
        <RobotSvg />
        <Button
          title="Iniciar"
          icon={<ArrowIcon size="32" />}
          variant="primary"
          size="md"
          marginTop={8}
          onPress={handleNextStep}
        />
      </Center>

      <Center>
        <Text
          fontSize={14}
          color="gray.50"
          lineHeight={38}
          fontWeight={600}
          letterSpacing={-0.14}
        >
          Já tem uma conta?{' '}
          <Text
            fontSize={14}
            color="red.50"
            fontWeight={800}
            onPress={handleGoToSignIn}
          >
            Conecte-se.
          </Text>
        </Text>
      </Center>
    </Flex>
  );
}
