import { Divider, Flex, Text, VStack, Icon, HStack, Box, useToast } from 'native-base';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { EyeIcon, FacebookIcon, GmailIcon, InstagramIcon, LockIcon, MailIcon, UserIcon, AppleFilledIcon } from '@assets/icons';
import { Input } from '@components/molecules';
import { Button } from '@components/atoms';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { TouchableOpacity } from 'react-native';
import { Controller, useForm } from 'react-hook-form';

import { useAuth } from '../../../../hooks/useAuth';
import { useGoogleAuth } from '../../../../hooks/useGoogleAuth';
import { useAppleAuth } from '../../../../hooks/useAppleAuth';
import { AppError } from '@utils/AppErrors';
import { useState, useEffect } from 'react';
import { logger } from '@utils/debugLogger';
import NetworkDiagnosticsHelper from '@utils/networkDiagnostics';

type FormDataProps = {
  email: string;
  password: string;
};

const signInSchema = yup.object({
  email: yup.string().required('Informar o e-mail').email('E-mail inválido'),
  password: yup.string().required('Informar a senha').min(8, 'Senha inválida'),
});

export function SignIn() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTakeLook, setIsTakeLook] = useState<boolean>(false);

  const toast = useToast();
  const { signIn } = useAuth();
  const { signInWithGoogle, isLoading: isGoogleLoading, isConfigured: isGoogleConfigured } = useGoogleAuth();
  const { signInWithApple, isLoading: isAppleLoading, isAvailable: isAppleAvailable } = useAppleAuth();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  useEffect(() => {
    // Log environment info and run network diagnostics on component mount
    logger.info('SignIn screen mounted');
    NetworkDiagnosticsHelper.logEnvironmentInfo();
    
    // Run network diagnostics in background
    NetworkDiagnosticsHelper.runDiagnostics().then(diagnostics => {
      logger.network('Initial network diagnostics', { diagnostics });
    });
  }, []);

  async function handleSignIn(data: FormDataProps) {
    try {
      setIsLoading(true);
      logger.auth('Starting sign in from UI', { email: data.email, screen: 'SignIn' });

      // Run network diagnostics before attempting login
      const diagnostics = await NetworkDiagnosticsHelper.runDiagnostics();
      logger.network('Pre-login diagnostics', { diagnostics });

      if (!diagnostics.isConnected) {
        throw new Error('Sem conexão com a internet. Verifique sua rede.');
      }

      if (!diagnostics.apiReachable) {
        throw new Error('Servidor indisponível. Tente novamente em alguns instantes.');
      }

      await signIn(data.email, data.password);
      logger.auth('Sign in successful from UI', { email: data.email });
    } catch (error: any) {
      logger.error('Sign in failed from UI', {
        screen: 'SignIn',
        email: data.email,
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack?.substring(0, 200)
        }
      });

      // Pegar a mensagem de erro mais específica
      let errorMessage = 'Erro de conexão. Verifique sua internet.';

      if (error.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Toast.show({
        type: 'error',
        text1: 'Erro no Login',
        text2: errorMessage,
        topOffset: 60,
        text1Style: {
          fontSize: 14,
          paddingBottom: 2,
        },
        text2Style: {
          fontSize: 13,
          fontWeight: 600,
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.log('❌ Erro no login Google:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro no Login Google',
        text2: 'Não foi possível fazer login com Google.',
        topOffset: 60,
      });
    }
  }

  async function handleAppleSignIn() {
    try {
      await signInWithApple();
    } catch (error: any) {
      console.log('❌ Erro no login Apple:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro no Login Apple',
        text2: 'Não foi possível fazer login com Apple.',
        topOffset: 60,
      });
    }
  }

  return (
    <VStack justifyContent="space-between" flex={1} mx={6} py={32}>
      <Toast />

      <Text color="gray.900" fontSize={32} fontWeight={800} lineHeight={38} letterSpacing={-1.2} mb={3}>
        Entre
      </Text>

      <Text color="gray.500" fontSize={16} fontWeight={500} lineHeight={24} mb={4}>
        Faça login e simplifique sua saúde com nossa tecnologia de Inteligência Artificial.
      </Text>

      <VStack flex={1} space={6} mt={4}>
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
                  <Icon as={<LockIcon solid color={!!errors.password?.message ? 'red' : 'black'} />} w="full" />
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

        <TouchableOpacity onPress={() => navigation.navigate('forgotPassword')}>
          <Text fontSize={14} color="ciano.300" fontWeight={800} mt={4}>
            Esqueceu a senha?
          </Text>
        </TouchableOpacity>

        <Button
          variant="primary"
          size="full"
          title="Conecte-se"
          isLoading={isLoading}
          icon={<UserIcon />}
          onPress={handleSubmit(handleSignIn)}
        />

        <Flex direction="row" justifyContent="space-between" py={4}>
          <Divider my={2} mx={2} w="40%" />
          <Text color="gray.900" fontSize={12} fontWeight={600} letterSpacing={-0.12}>
            Ou
          </Text>
          <Divider my={2} mx={2} w="40%" />
        </Flex>

        <HStack justifyContent="center" alignItems="center" my={2} space={2}>
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

          <TouchableOpacity onPress={handleGoogleSignIn} disabled={isGoogleLoading || !isGoogleConfigured}>
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

          {isAppleAvailable && (
            <TouchableOpacity onPress={handleAppleSignIn} disabled={isAppleLoading}>
              <Box
                size={16}
                borderRadius={12}
                borderWidth={1}
                borderColor={isAppleLoading ? 'gray.300' : 'gray.100'}
                alignItems="center"
                justifyContent="center"
                opacity={isAppleLoading ? 0.6 : 1}
              >
                <AppleFilledIcon />
              </Box>
            </TouchableOpacity>
          )}

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

        <HStack alignItems="center" justifyContent="center">
          <Text fontSize={14} color="gray.400" fontWeight={600} letterSpacing={-0.14}>
            Não tem uma conta?{' '}
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate('signUp')}>
            <Text fontSize={16} color="purple.600" fontWeight={600} lineHeight={38} underline letterSpacing={-0.14}>
              Cadastre-se.
            </Text>
          </TouchableOpacity>
        </HStack>
      </VStack>
    </VStack>
  );
}
