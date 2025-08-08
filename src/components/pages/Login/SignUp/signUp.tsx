import {
  Divider,
  Stack,
  Text,
  Flex,
  Checkbox,
  Icon,
  HStack,
  Box,
  FormControl,
  WarningOutlineIcon,
  useToast,
  ScrollView,
  KeyboardAvoidingView,
} from 'native-base';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { EyeIcon, FacebookIcon, GmailIcon, InstagramIcon, KeyIcon, MailIcon } from '@assets/icons';
import { Input } from '@components/molecules';
import { Button } from '@components/atoms';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { TouchableOpacity } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { AppError } from '@utils/AppErrors';
import { useState, useRef } from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { useGoogleAuth } from 'src/hooks/useGoogleAuth';
import Toast from 'react-native-toast-message';

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  confirm_rules?: boolean;
};

const signUpSchema = yup.object({
  name: yup.string().required('Informar o nome'),
  email: yup.string().required('Informar o e-mail.').email('E-mail inválido.'),
  password: yup.string().required('Informar a senha.').min(8, 'Senha deve ter pelo menos 8 caracteres.'),
  confirm_password: yup
    .string()
    .required('Confirme a senha.')
    .oneOf([yup.ref('password')], 'A confirmação da senha não confere'),
  confirm_rules: yup
    .boolean()
    .required('Confirme que concorda com os termos.')
    .isTrue('Confirme que concorda com os termos.'),
});

export function SignUp() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTakeLook, setIsTakeLook] = useState<boolean>(false);
  const [isTakeLookConfirm, setIsTakeLookConfirm] = useState<boolean>(false);
  const scrollRef = useRef<IScrollViewProps>(null);
  const { signUp } = useAuth();
  const { signUpWithGoogle, isLoading: isGoogleLoading, isConfigured: isGoogleConfigured } = useGoogleAuth();
  const toast = useToast();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  async function handleSignUp({ name, email, password, confirm_password }: FormDataProps) {
    try {
      setIsLoading(true);
      await signUp(name, email, password, confirm_password);

      toast.show({
        borderRadius: '12',
        title: 'Conta criada com sucesso',
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
      navigation.navigate('signIn');
    } catch (error: any) {
      const description = error?.response?.data?.message;

      toast.show({
        borderRadius: '12',
        title: 'Não foi possível criar sua conta',
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

  async function handleGoogleSignUp() {
    try {
      await signUpWithGoogle();
    } catch (error: any) {
      console.log('❌ Erro no cadastro Google:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro no Cadastro Google',
        text2: 'Não foi possível cadastrar com Google.',
        topOffset: 60,
      });
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <Flex
          justify="space-between"
          mx={6}
          py={32}
          h="100%"
          _android={{
            py: 16,
          }}
        >
          <Toast />

          <Text color="gray.900" fontSize={32} fontWeight={800} lineHeight={38} letterSpacing={-1.2} mb={2}>
            Cadastre-se
          </Text>

          <Stack mt={2} space={6}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  autoCapitalize="none"
                  label="Nome"
                  onChangeText={onChange}
                  value={value}
                  isInvalid={!!errors.name?.message}
                  errorMessage={errors.name?.message}
                />
              )}
            />

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
                      <Icon as={<KeyIcon solid color={!!errors.password?.message ? 'red' : 'black'} />} w="full" />
                    </Flex>
                  }
                  InputRightElement={
                    <TouchableOpacity onPress={() => setIsTakeLook(!isTakeLook)}>
                      <Flex mr={4} align="center" justify="center">
                        <Icon as={<EyeIcon solid color="#818BA0" closed={isTakeLook} />} w="full" />
                      </Flex>
                    </TouchableOpacity>
                  }
                  secureTextEntry={!isTakeLook}
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
                        as={<KeyIcon solid color={!!errors.confirm_password?.message ? 'red' : 'black'} />}
                        w="full"
                      />
                    </Flex>
                  }
                  InputRightElement={
                    <TouchableOpacity onPress={() => setIsTakeLookConfirm(!isTakeLookConfirm)}>
                      <Flex mr={4} align="center" justify="center">
                        <Icon as={<EyeIcon solid color="#818BA0" closed={isTakeLookConfirm} />} w="full" />
                      </Flex>
                    </TouchableOpacity>
                  }
                  secureTextEntry={!isTakeLookConfirm}
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
                  _icon={{ color: 'ciano.500', margin: 0.8 }}
                  _checked={{
                    borderColor: 'ciano.800',
                    bgColor: 'white',
                    _invalid: {
                      borderColor: 'ciano.800',
                      bgColor: 'white',
                    },
                  }}
                >
                  <Text color="gray.400" fontSize={14} fontWeight={600} letterSpacing={-0.12} ml={2} mr={8}>
                    Ao continuar você concorda com os Termos de Uso e a Politica de Privacidade
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
            marginTop={4}
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />

          <Flex direction="row" justifyContent="space-between" py={4}>
            <Divider my={2} mx={2} w="40%" />
            <Text color="gray.900" fontSize={12} fontWeight={600} letterSpacing={-0.12}>
              Ou
            </Text>
            <Divider my={2} mx={2} w="40%" />
          </Flex>

          <HStack justifyContent="center" alignItems="center" space={2}>
            {/* Facebook - Comentado temporariamente */}
            {/* <TouchableOpacity>
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
            </TouchableOpacity> */}

            <TouchableOpacity onPress={handleGoogleSignUp} disabled={isGoogleLoading || !isGoogleConfigured}>
              <Box
                size={16}
                borderRadius={12}
                borderWidth={1}
                borderColor={!isGoogleConfigured ? 'red.200' : isGoogleLoading ? 'gray.300' : 'gray.100'}
                alignItems="center"
                justifyContent="center"
                opacity={!isGoogleConfigured ? 0.4 : isGoogleLoading ? 0.6 : 1}
              >
                <GmailIcon />
              </Box>
            </TouchableOpacity>

            {/* Instagram - Comentado temporariamente */}
            {/* <TouchableOpacity>
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
            </TouchableOpacity> */}
          </HStack>

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
