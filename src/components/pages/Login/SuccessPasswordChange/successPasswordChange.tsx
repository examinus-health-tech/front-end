import { Text, Center, Image } from 'native-base';
import { useNavigation } from '@react-navigation/native';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import { ArrowIcon } from '@assets/icons';

import { Button } from '@components/atoms';

import Vector from '@assets/png/vector-43.png';

export function SuccessPasswordChange() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  return (
    <Center mx={6} h="100%">
      <Image source={Vector} alt="Vetor" w={24} resizeMode="contain" />

      <Text color="gray.900" fontSize={32} fontWeight={800} lineHeight={38} letterSpacing={-1.2} textAlign={'center'}>
        Maravilha! Sua senha foi alterada com sucesso!
      </Text>

      <Button
        variant="primary"
        size="full"
        title="Conectar"
        mt={4}
        onPress={() => navigation.navigate('signIn')}
        icon={<ArrowIcon />}
      />
    </Center>
  );
}
