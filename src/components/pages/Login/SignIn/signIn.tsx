import {
  Divider,
  Flex,
  Stack,
  Text,
  VStack,
  Pressable,
  Center,
  Icon,
  HStack,
  Box,
  FormControl,
  WarningOutlineIcon,
} from 'native-base';
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
} from '@assets/icons';
import { Input } from '@components/molecules';
import { Button } from '@components/atoms';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { TouchableOpacity } from 'react-native';
import { Controller, useForm } from 'react-hook-form';

type FormDataProps = {
  email: string;
  password: string;
};

const signInSchema = yup.object({
  email: yup.string().required('Informar o e-mail').email('E-mail inválido'),
  password: yup.string().required('Informar a senha').min(8, 'Senha inválida'),
});

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
  });

  function handleSignIn(data: FormDataProps) {
    console.log(data);
  }

  return (
    <VStack
      justifyContent="space-between"
      flex={1}
      mx={6}
      py={32}
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
        mb={3}
      >
        Entre
      </Text>

      <Text
        color="gray.500"
        fontSize={16}
        fontWeight={500}
        lineHeight={24}
        mb={4}
      >
        Faça login e simplifique sua saúde com nossa tecnologia de Inteligência
        Artificial.
      </Text>

      <VStack flex={1} space={2} mt={4}>
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
                      <LockIcon
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

        <TouchableOpacity onPress={() => navigation.navigate('forgetPassword')}>
          <Text fontSize={14} color="ciano.300" fontWeight={800} mt={4}>
            Esqueceu a senha?
          </Text>
        </TouchableOpacity>

        <Button
          variant="primary"
          size="full"
          title="Conecte-se"
          mt={2}
          icon={<UserIcon />}
          onPress={handleSubmit(handleSignIn)}
        />

        <Flex
          direction="row"
          justifyContent="space-between"
          py={4}
          _ios={{
            py: 4,
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

        <HStack justifyContent="center" alignItems="center" my={12} space={2}>
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

        <HStack alignItems="center" justifyContent="center">
          <Text
            fontSize={14}
            color="gray.400"
            fontWeight={600}
            letterSpacing={-0.14}
          >
            Não tem uma conta?
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate('signUp')}>
            <Text
              fontSize={16}
              color="purple.600"
              fontWeight={600}
              lineHeight={38}
              underline
              letterSpacing={-0.14}
            >
              {' '}
              Cadastre-se.
            </Text>
          </TouchableOpacity>
        </HStack>
      </VStack>
    </VStack>
  );
}
