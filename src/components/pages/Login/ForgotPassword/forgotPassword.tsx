import {
  Stack,
  Text,
  Flex,
  Center,
  Icon,
  HStack,
  useToast,
  VStack,
  Image,
  ScrollView,
  IScrollViewProps,
} from 'native-base';
import { TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import { MailIcon } from '@assets/icons';

import { HeaderTitle, Input } from '@components/molecules';
import { Button } from '@components/atoms';
import { useRef, useState } from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { AppError } from '@utils/AppErrors';

import Vector from '@assets/png/vector-42.png';

type FormDataProps = {
  email: string;
};

const forgetSchema = yup.object({
  email: yup.string().required('Informar o e-mail.').email('E-mail inválido.'),
});

export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollRef = useRef<IScrollViewProps>(null);

  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgetSchema),
  });
  const { forgotPassword } = useAuth();
  const toast = useToast();

  async function handleForgotPassword({ email }: FormDataProps) {
    try {
      setIsLoading(true);
      await forgotPassword(email);

      navigation.navigate('successLink');
    } catch (error: any) {
      const description = error?.response?.data?.message;

      toast.show({
        borderRadius: '12',
        title: 'Não foi possível encontrar seu email',
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
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} keyboardVerticalOffset={0} enabled>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack flex={1} py={20} pb={16}>
          <HeaderTitle title="Esqueci minha senha" withBackButton={() => navigation.navigate('signIn')} />

          <Image source={Vector} alt="Vetor" resizeMode="stretch" h={80} mt={4} />

          <Flex mx={6}>
            <Stack mt={6} space={6}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    InputLeftElement={
                      <Flex ml={4} align="center" justify="center">
                        <Icon as={<MailIcon solid color={!!errors.email?.message ? 'red' : 'black'} />} w="full" />
                      </Flex>
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                    label="Confirme seu e-mail para continuar"
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
              mt={6}
              onPress={handleSubmit(handleForgotPassword)}
              isLoading={isLoading}
            />

            <HStack alignItems="center" justifyContent="center" mt={2}>
              <Text fontSize={14} color="gray.400" fontWeight={600} letterSpacing={-0.14}>
                Já tem uma conta?
              </Text>

              <TouchableOpacity onPress={() => navigation.navigate('signIn')}>
                <Text fontSize={16} color="purple.600" fontWeight={600} lineHeight={38} underline letterSpacing={-0.14}>
                  {' '}
                  Conecte-se.
                </Text>
              </TouchableOpacity>
            </HStack>
          </Flex>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
