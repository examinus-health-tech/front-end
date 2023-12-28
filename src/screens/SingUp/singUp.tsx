import {
  Divider,
  Stack,
  Text,
  Flex,
  Pressable,
  Center,
  Checkbox,
} from 'native-base';

import { Input } from '@components/Input/input';
import {
  FacebookIcon,
  GmailIcon,
  InstagramIcon,
  MailIcon,
} from '@assets/icons';
import { Button } from '@components/Button/button';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

export function SignUp() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleGoToSignIn() {
    navigation.navigate('signIn');
  }

  return (
    <Flex justify="space-between" mx={6} py={32} h="100%">
      <Text
        color="gray.100"
        fontSize={32}
        fontWeight={800}
        lineHeight={38}
        letterSpacing={-1.2}
        mb={2}
      >
        Cadastre-se
      </Text>

      <Stack mt={4} space={6}>
        <Input
          // leftIcon={<MailIcon color="#052B3B" />}
          keyboardType="email-address"
          autoCapitalize="none"
          label="Endereço de e-mail"
        />

        <Input
          // leftIcon={<MailIcon color="#052B3B" />}
          secureTextEntry
          label="Senha"
        />

        <Input
          // leftIcon={<MailIcon color="#052B3B" />}
          secureTextEntry
          label="Confirme sua senha"
        />
      </Stack>

      <Checkbox
        value="ok"
        mt={6}
        bg="gray.10"
        borderColor="ciano.40"
        _icon={{ color: 'ciano.40' }}
        _checked={{
          borderColor: 'ciano.40',
          bg: 'gray.10',
        }}
      >
        <Text
          color="gray.50"
          fontSize={12}
          fontWeight={600}
          letterSpacing={-0.12}
          ml={2}
        >
          Ao continuar você concorda com os Termos de Uso e a Politica de
          Privacidade
        </Text>
      </Checkbox>

      <Button variant="primary" size="full" title="Cadastrar" marginTop={8} />

      <Flex
        direction="row"
        justify="space-between"
        py={6}
        _ios={{
          py: 12,
        }}
      >
        <Divider my={2} mx={2} w={160} />
        <Text
          color="gray.100"
          fontSize={12}
          fontWeight={600}
          letterSpacing={-0.12}
        >
          Ou
        </Text>
        <Divider my={2} mx={2} w={160} />
      </Flex>

      <Flex
        direction="row"
        justify="space-evenly"
        alignItems="center"
        mx={16}
        mb={4}
        _ios={{
          mb: 12,
        }}
      >
        <Pressable
          w={16}
          h={16}
          p={15}
          borderRadius={12}
          borderWidth={1}
          borderColor="gray.20"
          alignItems="center"
          justifyContent="center"
          _focus={{
            bg: 'gray.100',
          }}
        >
          <FacebookIcon />
        </Pressable>

        <Pressable
          w={16}
          h={16}
          p={15}
          borderRadius={12}
          borderWidth={1}
          borderColor="gray.20"
          alignItems="center"
          justifyContent="center"
          _focus={{
            bg: 'gray.100',
          }}
        >
          <GmailIcon />
        </Pressable>

        <Pressable
          w={16}
          h={16}
          p={15}
          borderRadius={12}
          borderWidth={1}
          borderColor="gray.20"
          alignItems="center"
          justifyContent="center"
          _focus={{
            bg: 'gray.100',
          }}
        >
          <InstagramIcon />
        </Pressable>
      </Flex>

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
