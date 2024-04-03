import { Stack, Text, Flex, Center, Icon, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import { MailIcon } from '@assets/icons';

import { Input } from '@components/molecules';
import { Button } from '@components/atoms';
import { TouchableOpacity } from 'react-native';

export function ForgetPassword() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  return (
    <Flex mx={6} py={32} h="100%">
      <Text
        color="gray.900"
        fontSize={32}
        fontWeight={800}
        lineHeight={38}
        letterSpacing={-1.2}
        mb={2}
      >
        Esqueci minha senha
      </Text>

      <Stack mt={6} space={6}>
        <Input
          InputLeftElement={
            <Flex ml={4} align="center" justify="center">
              <Icon as={<MailIcon solid color="black" />} w="full" />
            </Flex>
          }
          keyboardType="email-address"
          autoCapitalize="none"
          label="Confirme seu e-mail para continuar"
        />
      </Stack>

      <Button variant="primary" size="full" title="Enviar" marginTop={8} />

      <HStack alignItems="center" justifyContent="center" mt={4}>
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
            fontWeight={600}
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
