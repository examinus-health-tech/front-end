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
} from 'native-base';

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

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  return (
    <VStack justifyContent="space-between" flex={1} mx={6} py={32}>
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
        <Input
          InputLeftElement={
            <Flex ml={4} align="center" justify="center">
              <Icon as={<MailIcon solid color="black" />} w="full" />
            </Flex>
          }
          keyboardType="email-address"
          autoCapitalize="none"
          label="Endereço de e-mail"
        />

        <Input
          InputLeftElement={
            <Flex ml={4} align="center" justify="center">
              <Icon as={<LockIcon solid color="black" />} w="full" />
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
