import {
  Divider,
  Flex,
  Stack,
  Text,
  VStack,
  Pressable,
  Center,
} from 'native-base';

import { Input } from '@components/Input/input';
import {
  FacebookIcon,
  GmailIcon,
  InstagramIcon,
  MailIcon,
  UserIcon,
} from '@assets/icons';
import { Button } from '@components/Button/button';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleGoToSignUp() {
    navigation.navigate('signUp');
  }

  return (
    <Flex justify="space-between" mx={6} py={32} h="100%">
      <Text
        color="gray.100"
        fontSize={32}
        fontWeight={800}
        lineHeight={38}
        letterSpacing={-1.2}
        mb={3}
      >
        Entre
      </Text>

      <Text
        color="gray.60"
        fontSize={16}
        fontWeight={500}
        lineHeight={24}
        mb={4}
      >
        Faça login e simplifique sua saúde com nossa tecnologia de Inteligência
        Artificial.
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
      </Stack>

      <Button
        variant="primary"
        size="full"
        title="Conecte-se"
        mt={10}
        icon={<UserIcon />}
      />

      <Flex
        direction="row"
        justify="space-between"
        py={12}
        _ios={{
          py: 20,
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
        mb={12}
        _ios={{
          mb: 16,
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
          Não tem uma conta?{' '}
          <Text
            fontSize={14}
            color="red.50"
            fontWeight={800}
            onPress={handleGoToSignUp}
          >
            Cadastre-se.
          </Text>
        </Text>
      </Center>
    </Flex>
  );
}
