import { Image, Text, Center, Flex, HStack } from 'native-base';
import { TouchableOpacity, TouchableOpacityBase } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import Vector from '@assets/png/vector.png';
import RobotSvg from '@assets/svg/robot.svg';
import LogoSvg from '@assets/svg/logo.svg';
import { ArrowIcon } from '@assets/icons';

import { Button } from '@components/atoms';

export function Hello() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

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
        h="60%"
      />

      <Center>
        <LogoSvg />

        <Text
          textAlign="center"
          fontSize={30}
          color="gray.900"
          lineHeight={38}
          fontWeight={800}
          letterSpacing={-1.2}
          paddingTop={4}
        >
          Olá, eu sou a{'\n'}
          <Text color="ciano.300">examinus.</Text>
        </Text>

        <Text
          textAlign="center"
          fontSize={16}
          color="gray.600"
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
          onPress={() => navigation.navigate('simplify')}
        />
      </Center>

      <HStack alignItems="center" justifyContent="center">
        <Text
          fontSize={14}
          color="gray.400"
          fontWeight={600}
          letterSpacing={-0.14}
        >
          Já tem uma conta?
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate('signIn')}>
          <Text
            fontSize={16}
            color="purple.600"
            fontWeight={800}
            lineHeight={38}
            underline
            letterSpacing={-0.14}
          >
            {' '}
            Conecte-se.
          </Text>
        </TouchableOpacity>
      </HStack>
    </Flex>
  );
}
