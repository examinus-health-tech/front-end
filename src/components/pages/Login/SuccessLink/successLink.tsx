import { Text, Center, Image } from 'native-base';
import { useNavigation } from '@react-navigation/native';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import { ArrowIcon } from '@assets/icons';

import { Button } from '@components/atoms';

import Vector from '@assets/png/vector-43.png';

export function SuccessLink() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  return (
    <Center mx={6} h="100%">
      <Image source={Vector} alt="Vetor" w={24} resizeMode="contain" />

      <Text color="gray.900" fontSize={32} fontWeight={800} lineHeight={38} letterSpacing={-1.2} textAlign={'center'}>
        Enviamos um link para o seu e-mail cadastrado.
      </Text>

      <Text color="gray.500" fontSize={14} fontWeight={500} lineHeight={24} m={8}>
        Cheque sua caixa de entrada ;)
      </Text>

      <Button
        variant="primary"
        size="full"
        title="Tenho o código"
        mt={4}
        onPress={() => navigation.navigate('code')}
        icon={<ArrowIcon />}
      />
    </Center>
  );
}
