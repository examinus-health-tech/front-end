import {
  Divider,
  Stack,
  Text,
  Flex,
  Pressable,
  Center,
  Checkbox,
  Icon,
  HStack,
  Box,
  FormControl,
  WarningOutlineIcon,
  useToast,
} from 'native-base';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  EyeIcon,
  FacebookIcon,
  GmailIcon,
  InstagramIcon,
  KeyIcon,
  MailIcon,
} from '@assets/icons';
import { Input } from '@components/molecules';
import { Button } from '@components/atoms';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { TouchableOpacity } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import { api } from '../../../../services/api';
import { AppError } from '@utils/AppErrors';

type FormDataProps = {
  email: string;
  password: string;
  confirm_password: string;
  confirm_rules: boolean;
};

const signUpSchema = yup.object({
  email: yup.string().required('Informar o e-mail.').email('E-mail inválido.'),
  password: yup
    .string()
    .required('Informar a senha.')
    .min(8, 'Senha inválida.'),
  confirm_password: yup
    .string()
    .required('Confirme a senha.')
    .oneOf([yup.ref('password')], 'A confirmação da senha não confere'),
  confirm_rules: yup.boolean().isTrue('Confirme que concorda com os termos.'),
});

export function SignUp() {
  const toast = useToast();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  });

  async function handleSignUp({ email, password }: FormDataProps) {
    console.log(email, password);
    try {
      const response = await api.post('/user/auth/sign-up', {
        name: 'temp',
        email,
        password,
      });

      toast.show({
        borderRadius: '12',
        title: 'Conta crianda com sucesso',
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
        bgColor: 'green.500',
      });

      console.log(response);
    } catch (error) {
      console.log(error);

      const isAppError = error instanceof AppError;

      const title = isAppError
        ? 'Não foi possível criar sua conta'
        : 'Não foi possível criar sua conta.\nTente novamente mais tarde.';
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
    }
  }

  return (
    <Flex
      justify="space-between"
      mx={6}
      py={32}
      h="100%"
      _android={{
        py: 16,
      }}
    >
      <Text
        color="gray.900"
        fontSize={32}
        fontWeight={800}
        lineHeight={38}
        letterSpacing={-1.2}
        mb={2}
      >
        Cadastre-se
      </Text>

      <Stack mt={4} space={4}>
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

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              InputLeftElement={
                <Flex ml={4} align="center" justify="center">
                  <Icon
                    as={
                      <KeyIcon
                        solid
                        color={!!errors.password?.message ? 'red' : 'black'}
                      />
                    }
                    w="full"
                  />
                </Flex>
              }
              InputRightElement={
                <TouchableOpacity onPress={() => {}}>
                  <Flex mr={4} align="center" justify="center">
                    <Icon as={<EyeIcon solid color="#818BA0" />} w="full" />
                  </Flex>
                </TouchableOpacity>
              }
              secureTextEntry
              label="Senha"
              onChangeText={onChange}
              value={value}
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
              InputLeftElement={
                <Flex ml={4} align="center" justify="center">
                  <Icon
                    as={
                      <KeyIcon
                        solid
                        color={
                          !!errors.confirm_password?.message ? 'red' : 'black'
                        }
                      />
                    }
                    w="full"
                  />
                </Flex>
              }
              InputRightElement={
                <TouchableOpacity onPress={() => {}}>
                  <Flex mr={4} align="center" justify="center">
                    <Icon as={<EyeIcon solid color="#818BA0" />} w="full" />
                  </Flex>
                </TouchableOpacity>
              }
              secureTextEntry
              label="Confirme sua senha"
              onChangeText={onChange}
              value={value}
              isInvalid={!!errors.confirm_password?.message}
              errorMessage={errors.confirm_password?.message}
            />
          )}
        />
      </Stack>

      <Controller
        control={control}
        name="confirm_rules"
        render={({ field: { onChange, value } }) => (
          <FormControl isInvalid={!!errors.confirm_rules?.message} mb={1}>
            <Checkbox
              value="concordo"
              isChecked={value}
              onChange={onChange}
              mt={6}
              borderColor="ciano.300"
              _icon={{ color: 'ciano.300' }}
              _checked={{
                borderColor: 'ciano.00',
                bgColor: 'gray.50',
              }}
            >
              <Text
                color="gray.400"
                fontSize={14}
                fontWeight={600}
                letterSpacing={-0.12}
                ml={2}
              >
                Ao continuar você concorda com os Termos de Uso e a Politica de
                Privacidade
              </Text>
            </Checkbox>
            <FormControl.ErrorMessage
              _stack={{
                alignItems: 'center',
              }}
              leftIcon={<WarningOutlineIcon size="xs" />}
              mb={-2}
              mt={0.5}
            >
              {errors.confirm_rules?.message}
            </FormControl.ErrorMessage>
          </FormControl>
        )}
      />

      <Button
        variant="primary"
        size="full"
        title="Cadastrar"
        marginTop={8}
        onPress={handleSubmit(handleSignUp)}
      />

      <Flex
        direction="row"
        justify="space-between"
        py={6}
        _ios={{
          py: 6,
        }}
      >
        <Divider my={2} mx={2} w={160} />
        <Text
          color="gray.900"
          fontSize={12}
          fontWeight={600}
          letterSpacing={-0.12}
        >
          Ou
        </Text>
        <Divider my={2} mx={2} w={160} />
      </Flex>

      <HStack justifyContent="center" alignItems="center" space={2}>
        <TouchableOpacity>
          <Box
            size={16}
            borderRadius={12}
            borderWidth={1}
            borderColor="gray.100"
            alignItems="center"
            justifyContent="center"
          >
            <FacebookIcon />
          </Box>
        </TouchableOpacity>

        <TouchableOpacity>
          <Box
            size={16}
            borderRadius={12}
            borderWidth={1}
            borderColor="gray.100"
            alignItems="center"
            justifyContent="center"
          >
            <GmailIcon />
          </Box>
        </TouchableOpacity>

        <TouchableOpacity>
          <Box
            size={16}
            borderRadius={12}
            borderWidth={1}
            borderColor="gray.100"
            alignItems="center"
            justifyContent="center"
          >
            <InstagramIcon />
          </Box>
        </TouchableOpacity>
      </HStack>

      <HStack alignItems="center" justifyContent="center" mt={6}>
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
