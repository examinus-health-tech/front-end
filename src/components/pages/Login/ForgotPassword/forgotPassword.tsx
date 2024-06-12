import { Stack, Text, Flex, Center, Icon, HStack, useToast } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import { MailIcon } from '@assets/icons';

import { Input } from '@components/molecules';
import { Button } from '@components/atoms';
import { useState } from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { AppError } from '@utils/AppErrors';

type FormDataProps = {
  email: string;
};

const forgetSchema = yup.object({
  email: yup.string().required('Informar o e-mail.').email('E-mail inválido.'),
});

export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(forgetSchema),
  });
  const { forgotPassword } = useAuth();
  const toast = useToast();

  async function handleForgotPassword({ email }: FormDataProps) {
    try {
      setIsLoading(true);
      await forgotPassword(email);

      navigation.navigate('successLink');
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? 'Não foi possível encontrar sua conta.'
        : 'Não foi possível encontrar sua conta.\nTente novamente mais tarde.';
      const description = isAppError && error.message;

      toast.show({
        borderRadius: '12',
        title,
        description,
        _title: {
          textAlign: 'center',
          mx: '4',
        },
        _description: {
          textAlign: 'center',
          mx: '4',
        },
        placement: 'top',
        color: 'gray.900',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

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
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              InputLeftElement={
                <Flex ml={4} align="center" justify="center">
                  <Icon
                    as={
                      <MailIcon
                        solid
                        color={!!errors.email?.message ? 'red' : 'black'}
                      />
                    }
                    w="full"
                  />
                </Flex>
              }
              keyboardType="email-address"
              autoCapitalize="none"
              label="Endereço de e-mail"
              onChangeText={onChange}
              value={value}
              isInvalid={!!errors.email?.message}
              errorMessage={errors.email?.message}
            />
          )}
        />
      </Stack>

      <Button
        variant="primary"
        size="full"
        title="Enviar"
        marginTop={8}
        onPress={handleSubmit(handleForgotPassword)}
        isLoading={isLoading}
      />

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
