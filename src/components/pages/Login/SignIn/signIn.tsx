import { Divider, Flex, Text, VStack, Icon, HStack, Box, useToast, Spinner, Center } from 'native-base';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  EyeIcon,
  FacebookIcon,
  GmailIcon,
  InstagramIcon,
  LockIcon,
  MailIcon,
  UserIcon,
  AppleFilledIcon,
  FingerprintIcon,
  FaceIdIcon,
} from '@assets/icons';
import { Input, LegalFooter } from '@components/molecules';
import { Button } from '@components/atoms';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { TouchableOpacity, View, Platform } from 'react-native';
import { Controller, useForm } from 'react-hook-form';

import { useAuth } from '../../../../hooks/useAuth';
import { useGoogleAuth } from '../../../../hooks/useGoogleAuth';
import { useAppleAuth } from '../../../../hooks/useAppleAuth';
import { useBiometricAuth } from '../../../../hooks/useBiometricAuth';
import { AppError } from '@utils/AppErrors';
import { useState, useEffect } from 'react';
import { logger } from '@utils/debugLogger';
import NetworkDiagnosticsHelper from '@utils/networkDiagnostics';
import * as AppleAuthentication from 'expo-apple-authentication';

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
  const [canUseBiometric, setCanUseBiometric] = useState<boolean>(false);

  const toast = useToast();
  const { signIn, signInWithBiometric } = useAuth();
  const { signInWithGoogle, isLoading: isGoogleLoading, isConfigured: isGoogleConfigured } = useGoogleAuth();
  const { signInWithApple, isLoading: isAppleLoading, isAvailable: isAppleAvailable } = useAppleAuth();
  const {
    isAvailable: isBiometricAvailable,
    isEnabled: isBiometricEnabled,
    biometricType,
    authenticateWithBiometric,
    canUseBiometricLogin,
  } = useBiometricAuth();
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
    NetworkDiagnosticsHelper.runDiagnostics().then((diagnostics) => {
      logger.network('Initial network diagnostics', { diagnostics });
    });
  }, []);

  // Verifica se pode usar login biométrico
  // Precisa ter: 1) hardware biometrico disponivel 2) token valido armazenado
  useEffect(() => {
    async function checkBiometric() {
      // Primeiro verifica se o dispositivo tem biometria disponivel
      if (!isBiometricAvailable) {
        console.log('👆 [SIGNIN] Biometria nao disponivel no dispositivo');
        setCanUseBiometric(false);
        return;
      }

      // Depois verifica se tem token valido
      const hasValidToken = await canUseBiometricLogin();
      console.log('👆 [SIGNIN] Token biometrico valido:', hasValidToken);
      console.log('👆 [SIGNIN] Biometria disponivel para login:', hasValidToken);
      setCanUseBiometric(hasValidToken);
    }
    checkBiometric();
  }, [canUseBiometricLogin, isBiometricAvailable]);

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
          stack: error.stack?.substring(0, 200),
        },
      });

      // Pegar a mensagem de erro mais específica
      let errorMessage = 'Erro de conexão. Verifique sua internet.';

      if (error.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.show({
        title: 'Erro no Login',
        description: errorMessage,
        placement: 'top',
        bgColor: 'red.500',
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
      toast.show({
        title: 'Erro no Login Google',
        description: 'Não foi possível fazer login com Google.',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function handleAppleSignIn() {
    try {
      await signInWithApple();
    } catch (error: any) {
      console.log('❌ Erro no login Apple:', error);
      toast.show({
        title: 'Erro no Login Apple',
        description: 'Não foi possível fazer login com Apple.',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function handleBiometricSignIn() {
    try {
      setIsLoading(true);
      console.log('👆 [SIGNIN] Iniciando login biometrico...');

      const result = await authenticateWithBiometric();

      if (!result.success) {
        console.log('👆 [SIGNIN] Autenticacao biometrica falhou:', result.error);
        if (result.error !== 'Autenticacao cancelada') {
          toast.show({
            title: 'Erro na Biometria',
            description: result.error || 'Nao foi possivel autenticar.',
            placement: 'top',
            bgColor: 'red.500',
          });
        }
        return;
      }

      // Nova implementacao: userData vem diretamente da API
      if (result.userData) {
        console.log('👆 [SIGNIN] Dados do usuario obtidos via API biometrica');
        // Usa a funcao do AuthContext para fazer login
        await signInWithBiometric(result.userData);
        console.log('👆 [SIGNIN] Login biometrico bem-sucedido!');
      }
    } catch (error: any) {
      console.log('❌ Erro no login biometrico:', error);
      toast.show({
        title: 'Erro no Login',
        description: error.message || 'Nao foi possivel fazer login com biometria.',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Verifica se está carregando login externo (Google ou Apple)
  const isExternalAuthLoading = isGoogleLoading || isAppleLoading;

  return (
    <>
      {/* Overlay de carregamento para login externo */}
      {isExternalAuthLoading && (
        <Center
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(255,255,255,0.9)"
          zIndex={999}
        >
          <VStack space={4} alignItems="center">
            <Spinner size="lg" color="ciano.500" />
            <Text color="gray.600" fontSize={16} fontWeight={500}>
              {isGoogleLoading ? 'Conectando com Google...' : 'Conectando com Apple...'}
            </Text>
          </VStack>
        </Center>
      )}

      <VStack justifyContent="space-between" flex={1} mx={6} py={32}>

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

        <HStack mt={-2} space={3} alignItems="center">
          <Box flex={1}>
            <Button
              variant="primary"
              size="full"
              title="Conecte-se"
              isLoading={isLoading}
              icon={<UserIcon />}
              onPress={handleSubmit(handleSignIn)}
            />
          </Box>
          {canUseBiometric && (
            <TouchableOpacity onPress={handleBiometricSignIn} disabled={isLoading}>
              <Box
                h={16}
                w={16}
                borderRadius={16}
                borderWidth={2}
                borderColor={isLoading ? 'gray.300' : 'ciano.300'}
                bg={isLoading ? 'gray.50' : 'ciano.50'}
                alignItems="center"
                justifyContent="center"
                opacity={isLoading ? 0.6 : 1}
              >
                {biometricType === 'Face ID' ? (
                  <FaceIdIcon color="#0CC1AF" size="28" />
                ) : (
                  <FingerprintIcon color="#0CC1AF" size="28" />
                )}
              </Box>
            </TouchableOpacity>
          )}
        </HStack>

        <Flex direction="row" justifyContent="space-between" pt={4} pb={2}>
          <Divider my={2} mx={2} w="40%" />
          <Text color="gray.900" fontSize={12} fontWeight={600} letterSpacing={-0.12}>
            Ou
          </Text>
          <Divider my={2} mx={2} w="40%" />
        </Flex>

        <HStack justifyContent="center" alignItems="center" mb={2} space={2}>
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

        <HStack alignItems="center" justifyContent="center" mt={-6}>
          <Text fontSize={14} color="gray.400" fontWeight={600} letterSpacing={-0.14}>
            Não tem uma conta?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('signUp')}>
            <Text fontSize={14} color="purple.600" fontWeight={600} underline letterSpacing={-0.14}>
              Cadastre-se.
            </Text>
          </TouchableOpacity>
        </HStack>

        <HStack mt={-4}>
          <LegalFooter />
        </HStack>
      </VStack>
    </VStack>
    </>
  );
}
