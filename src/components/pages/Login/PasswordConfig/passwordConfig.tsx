import { Text, Flex, Icon, HStack, useToast, VStack, Box } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import { ArrowIcon, CheckIcon, EyeIcon, CloseIcon } from '@assets/icons';

import { HeaderTitle, Input } from '@components/molecules';
import { Button } from '@components/atoms';
import { useEffect, useState } from 'react';
import { useAuth } from 'src/hooks/useAuth';

type FormDataProps = {
  password: string;
  confirm_password: string;
};

const forgetSchema = yup.object({
  password: yup
    .string()
    .required('Informar o senha')
    .matches(/[a-z]/, 'A senha deve conter pelo menos 1 caracter minusculo')
    .matches(/[A-Z]/, 'A senha deve conter pelo menos 1 caracter maiusculo')
    .matches(/\d/, 'A senha deve conter pelo menos 1 caracter númerico')
    .matches(/[@$!%*#?&]/, 'A senha deve conter pelo menos 1 caracter especial')
    .min(8, 'A senha deve conter pelo menos 8 caracteres'),
  confirm_password: yup
    .string()
    .required('Confirme a senha')
    .oneOf([yup.ref('password')], 'A confirmação da senha não confere'),
});

export function PasswordConfig() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTakeLook, setIsTakeLook] = useState<boolean>(false);
  const [upperCaseRule, setUpperCaseRule] = useState<boolean>(false);
  const [lowerCaseRule, setLowerCaseRule] = useState<boolean>(false);
  const [numericRule, setNumericRule] = useState<boolean>(false);
  const [specialRule, setSpecialRule] = useState<boolean>(false);
  const [lengthRule, setLengthRule] = useState<boolean>(false);
  const [strength, setStrength] = useState<number>(0);
  const [strengthText, setStrengthText] = useState<string>('Muito fraca');

  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgetSchema),
  });
  const { resetPassword } = useAuth();
  const toast = useToast();

  async function handleResetPassword({ password, confirm_password }: FormDataProps) {
    try {
      setIsLoading(true);
      await resetPassword(password, confirm_password);

      navigation.navigate('successPasswordChange');
    } catch (error: any) {
      const description = error?.response?.data?.message;

      toast.show({
        borderRadius: '12',
        title: 'Não foi possivel salvar nova senha',
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

  const listError = (value: string) => {
    let tempStrength = 0;

    if (/[a-z]/.test(value)) {
      setLowerCaseRule(true);
      tempStrength += 1;
    } else setLowerCaseRule(false);

    if (/[A-Z]/.test(value)) {
      setUpperCaseRule(true);
      tempStrength += 1;
    } else setUpperCaseRule(false);

    if (/\d/.test(value)) {
      setNumericRule(true);
      tempStrength += 1;
    } else setNumericRule(false);

    if (/[@$!%*#?&]/.test(value)) {
      setSpecialRule(true);
      tempStrength += 1;
    } else {
      setSpecialRule(false);
    }

    if (value.length >= 8) {
      setLengthRule(true);
      tempStrength += 1;
    } else setLengthRule(false);

    setStrength(tempStrength);
  };

  useEffect(() => {
    if (strength <= 1) {
      setStrengthText('Muito Fraca');
    } else if (strength == 2) {
      setStrengthText('Fraca');
    } else if (strength == 3) {
      setStrengthText('Da para melhorar');
    } else if (strength == 4) {
      setStrengthText('Quase Ok');
    } else if (strength == 5) {
      setStrengthText('Maravilhosa');
    }
  }, [strength]);

  return (
    <VStack flex={1} py={24} mb={16}>
      <HeaderTitle withBackButton={() => navigation.navigate('code')} />

      <VStack mx={6}>
        <Text color="gray.900" fontSize={32} fontWeight={800} lineHeight={38} letterSpacing={-1.2}>
          Configuração de senha
        </Text>

        <VStack mt={8} space={4}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                InputRightElement={
                  <TouchableOpacity onPress={() => setIsTakeLook(!isTakeLook)}>
                    <Flex mr={4} align="center" justify="center">
                      <Icon as={<EyeIcon solid color="#818BA0" closed={isTakeLook} />} w="full" />
                    </Flex>
                  </TouchableOpacity>
                }
                h={16}
                fontSize={20}
                paddingLeft={4}
                letterSpacing={1}
                borderRadius={12}
                secureTextEntry={!isTakeLook}
                label="Nava Senha"
                onChangeText={(value) => {
                  onChange(value);
                  listError(value);
                }}
                value={value}
                type="password"
                isInvalid={!!errors.password?.message}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange, value } }) => (
              <Input
                InputRightElement={
                  <TouchableOpacity onPress={() => setIsTakeLook(!isTakeLook)}>
                    <Flex mr={4} align="center" justify="center">
                      <Icon as={<EyeIcon solid color="#818BA0" closed={isTakeLook} />} w="full" />
                    </Flex>
                  </TouchableOpacity>
                }
                h={16}
                fontSize={20}
                paddingLeft={4}
                letterSpacing={1}
                borderRadius={12}
                secureTextEntry={!isTakeLook}
                label="Confirmar Senha"
                onChangeText={(value) => {
                  onChange(value);
                  listError(value);
                }}
                value={value}
                type="password"
                isInvalid={!!errors.confirm_password?.message}
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />
        </VStack>

        <HStack flex={1} justifyContent="space-between" space={2} mt={8} mx={1}>
          <Box flex={1} h={2} bg={strength >= 1 ? 'ciano.300' : 'ciano.100'} borderRadius={2} />
          <Box flex={1} h={2} bg={strength >= 2 ? 'ciano.300' : 'ciano.100'} borderRadius={2} />
          <Box flex={1} h={2} bg={strength >= 3 ? 'ciano.300' : 'ciano.100'} borderRadius={2} />
          <Box flex={1} h={2} bg={strength >= 4 ? 'ciano.300' : 'ciano.100'} borderRadius={2} />
          <Box flex={1} h={2} bg={strength >= 5 ? 'ciano.300' : 'ciano.100'} borderRadius={2} />
        </HStack>

        <HStack justifyContent="center" mt={2}>
          <Text color="gray.600" fontSize={14} fontWeight={500} lineHeight={38}>
            Senha forte:{' '}
          </Text>
          <Text color="gray.600" fontWeight={800} fontSize={14} lineHeight={38}>
            {strengthText}!
          </Text>
        </HStack>

        <VStack space={4} mt={4}>
          <HStack space={4}>
            <Box
              bgColor={upperCaseRule ? 'ciano.50' : 'red.50'}
              borderRadius={2}
              flexDir="row"
              alignItems="center"
              p={2}
              rounded={8}
              borderColor={upperCaseRule ? 'ciano.400' : 'red.400'}
              borderWidth={1}
              flex={1}
            >
              {upperCaseRule ? <CheckIcon size="24" /> : <CloseIcon color="#FA4D5E" size="24" />}
              <Text color={upperCaseRule ? 'ciano.800' : 'red.800'} fontSize={12} fontWeight={500} ml={2}>
                Incluir letra maiúscula
              </Text>
            </Box>

            <Box
              bgColor={lowerCaseRule ? 'ciano.50' : 'red.50'}
              borderRadius={2}
              flexDir="row"
              alignItems="center"
              p={2}
              rounded={8}
              borderColor={lowerCaseRule ? 'ciano.400' : 'red.400'}
              borderWidth={1}
              flex={1}
            >
              {lowerCaseRule ? <CheckIcon size="24" /> : <CloseIcon color="#FA4D5E" size="24" />}
              <Text color={lowerCaseRule ? 'ciano.800' : 'red.800'} fontSize={12} fontWeight={500} ml={2}>
                Incluir letra minúscula
              </Text>
            </Box>
          </HStack>

          <HStack space={4}>
            <Box
              bgColor={numericRule ? 'ciano.50' : 'red.50'}
              borderRadius={2}
              flexDir="row"
              alignItems="center"
              p={2}
              rounded={8}
              borderColor={numericRule ? 'ciano.400' : 'red.400'}
              borderWidth={1}
              flex={1}
            >
              {numericRule ? <CheckIcon size="24" /> : <CloseIcon color="#FA4D5E" size="24" />}
              <Text color={numericRule ? 'ciano.800' : 'red.800'} fontSize={12} fontWeight={500} ml={2}>
                Incluir números
              </Text>
            </Box>

            <Box
              bgColor={lengthRule ? 'ciano.50' : 'red.50'}
              borderRadius={2}
              flexDir="row"
              alignItems="center"
              p={2}
              rounded={8}
              borderColor={lengthRule ? 'ciano.400' : 'red.400'}
              borderWidth={1}
              flex={1}
            >
              {lengthRule ? <CheckIcon size="24" /> : <CloseIcon color="#FA4D5E" size="24" />}
              <Text color={lengthRule ? 'ciano.800' : 'red.800'} fontSize={12} fontWeight={500} ml={2}>
                8 caracteres
              </Text>
            </Box>
          </HStack>

          <HStack space={4}>
            <Box
              bgColor={specialRule ? 'ciano.50' : 'red.50'}
              borderRadius={2}
              flexDir="row"
              alignItems="center"
              p={2}
              rounded={8}
              borderColor={specialRule ? 'ciano.400' : 'red.400'}
              borderWidth={1}
              flex={1}
            >
              {specialRule ? <CheckIcon size="24" /> : <CloseIcon color="#FA4D5E" size="24" />}
              <Text color={specialRule ? 'ciano.800' : 'red.800'} fontSize={12} fontWeight={500} ml={2}>
                Incluir Caracter Especial
              </Text>
            </Box>
          </HStack>
        </VStack>

        <HStack mt={8}>
          <Button
            variant="primary"
            size="full"
            title="Continuar"
            icon={<ArrowIcon />}
            isLoading={isLoading}
            onPress={handleSubmit(handleResetPassword)}
          />
        </HStack>
      </VStack>
    </VStack>
  );
}
