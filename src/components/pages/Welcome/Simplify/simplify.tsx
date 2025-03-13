import { VStack, Text, Container, Image } from 'native-base';
import { useNavigation } from '@react-navigation/native';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import Vector from '@assets/png/vector-2.png';
import { ArrowIcon } from '@assets/icons';

import { Button } from '@components/atoms';
import { HeaderProgress } from '@components/molecules';

export function Simplify() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  return (
    <VStack flex={1} space={8} py={24}>
      <HeaderProgress
        progressValue={33}
        jumpTo={() => navigation.navigate('signIn')}
      />

      <Image
        source={Vector}
        alt="Vector"
        resizeMode="stretch"
        position="absolute"
        bottom={0}
        w="100%"
        h="75%"
      />

      <Container mx={6}>
        <Text
          fontSize={32}
          color="gray.900"
          lineHeight={38}
          fontWeight={800}
          letterSpacing={-1.4}
        >
          Simplifique seu{'\n'}exame laboratorial!
        </Text>

        <Text
          fontSize={16}
          color="gray.600"
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
        onPress={() => navigation.navigate('health')}
        icon={<ArrowIcon size="32" />}
      />
    </VStack>
  );
}
