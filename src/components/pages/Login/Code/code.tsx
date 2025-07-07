import { Text, Center, VStack, HStack, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import { ArrowIcon } from '@assets/icons';

import { Button } from '@components/atoms';
import { HeaderTitle } from '@components/molecules';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InputStyled } from './styles';
import { TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from 'src/hooks/useAuth';
import { AppError } from '@utils/AppErrors';

type FormDataProps = {
  one: string;
  two: string;
  three: string;
  four: string;
  five: string;
  six: string;
};

const codeSchema = yup.object({
  one: yup.string().required().max(1),
  two: yup.string().required().max(1),
  three: yup.string().required().max(1),
  four: yup.string().required().max(1),
  five: yup.string().required().max(1),
  six: yup.string().required().max(1),
});

export function Code() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(codeSchema),
    mode: 'onTouched',
  });
  const refOne = useRef<TextInput | null>(null);
  const refTwo = useRef<TextInput | null>(null);
  const refThree = useRef<TextInput | null>(null);
  const refFour = useRef<TextInput | null>(null);
  const refFive = useRef<TextInput | null>(null);
  const refSix = useRef<TextInput | null>(null);
  const [focusInput, setFocusInput] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const { verifyCode } = useAuth();

  async function handleConfirmationCode({ one, two, three, four, five, six }: FormDataProps) {
    try {
      setIsLoading(true);
      const code = one + two + three + four + five + six;

      await verifyCode(code);

      navigation.navigate('passwordConfig');
    } catch (error: any) {
      const description = error?.response?.data?.message;

      toast.show({
        borderRadius: '12',
        title: 'Não foi verificar o código',
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

  async function handleResendConfirmationCode() {
    try {
      setIsLoading(true);

      await resendConfirmationCode(emailTemp);

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
    <VStack flex={1} py={20} mb={16}>
      <HeaderTitle title="Esqueci minha senha" withBackButton={() => navigation.navigate('forgotPassword')} />

      <Center>
        <Text
          color="gray.500"
          fontSize={16}
          fontWeight={500}
          lineHeight={24}
          m={8}
          mt={32}
          textAlign={'center'}
          width={80}
        >
          Por favor, digite o código de 6 dígitos que você recebeu no seu e-mail! 🙏
        </Text>
      </Center>

      <HStack space={2} w="100%" justifyContent="center" pointerEvents="auto">
        <Controller
          control={control}
          name="one"
          render={({ field: { onChange, value }, fieldState: {} }) => (
            <InputStyled
              placeholder="0"
              ref={refOne}
              maxLength={1}
              onFocus={() => {
                setFocusInput(1);
                onChange('');
              }}
              keyboardType="numeric"
              onBlur={() => setFocusInput(null)}
              autoFocus={focusInput == 1}
              value={value}
              onChangeText={(value) => {
                onChange(value);

                if (!value) return;
                refTwo.current?.focus();
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="two"
          render={({ field: { onChange, value } }) => (
            <InputStyled
              placeholder="0"
              clearTextOnFocus={true}
              maxLength={1}
              onFocus={() => {
                setFocusInput(2);
                onChange('');
              }}
              keyboardType="numeric"
              onBlur={() => setFocusInput(null)}
              autoFocus={focusInput == 2}
              ref={refTwo}
              value={value}
              onChangeText={(value) => {
                onChange(value);

                if (!value) return;
                refThree.current?.focus();
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="three"
          render={({ field: { onChange, value } }) => (
            <InputStyled
              placeholder="0"
              selectTextOnFocus={true}
              maxLength={1}
              onFocus={() => {
                setFocusInput(3);
                onChange('');
              }}
              keyboardType="numeric"
              onBlur={() => setFocusInput(null)}
              autoFocus={focusInput == 3}
              ref={refThree}
              value={value}
              onChangeText={(value) => {
                onChange(value);

                if (!value) return;
                refFour.current?.focus();
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="four"
          render={({ field: { onChange, value } }) => (
            <InputStyled
              placeholder="0"
              selectTextOnFocus={true}
              maxLength={1}
              onFocus={() => {
                setFocusInput(4);
                onChange('');
              }}
              keyboardType="numeric"
              onBlur={() => setFocusInput(null)}
              autoFocus={focusInput == 4}
              ref={refFour}
              value={value}
              onChangeText={(value) => {
                onChange(value);

                if (!value) return;
                refFive.current?.focus();
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="five"
          render={({ field: { onChange, value } }) => (
            <InputStyled
              placeholder="0"
              maxLength={1}
              onFocus={() => {
                setFocusInput(5);
                onChange('');
              }}
              keyboardType="numeric"
              onBlur={() => setFocusInput(null)}
              autoFocus={focusInput == 5}
              ref={refFive}
              value={value}
              onChangeText={(value) => {
                onChange(value);

                if (!value) return;
                refSix.current?.focus();
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="six"
          render={({ field: { onChange, value, onBlur } }) => (
            <InputStyled
              placeholder="0"
              selectTextOnFocus={true}
              maxLength={1}
              onFocus={() => {
                setFocusInput(6);
                onChange('');
              }}
              keyboardType="numeric"
              onBlur={() => setFocusInput(null)}
              autoFocus={focusInput == 6}
              ref={refSix}
              value={value}
              onChangeText={(value) => {
                onChange(value);

                if (!value) return;
                refSix.current?.blur();
              }}
            />
          )}
        />
      </HStack>

      <Center mx={6}>
        <Button
          variant="primary"
          size="full"
          title="Continuar"
          mt={4}
          onPress={handleSubmit(handleConfirmationCode)}
          icon={<ArrowIcon />}
          isLoading={isLoading}
        />

        <HStack mt={8} space={1}>
          <Text color="gray.500" fontSize={14} fontWeight={500} lineHeight={24}>
            Não recebeu nenhum código?
          </Text>
          <TouchableOpacity onPress={() => handleResendConfirmationCode()}>
            <Text color="ciano.500" fontSize={14} fontWeight={600} lineHeight={24}>
              Reenviar.
            </Text>
          </TouchableOpacity>
        </HStack>
      </Center>
    </VStack>
  );
}
