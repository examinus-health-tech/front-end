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
} from 'native-base';

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

export function SignUp() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  return (
    <Flex justify="space-between" mx={6} py={32} h="100%">
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
              <Icon as={<KeyIcon solid color="black" />} w="full" />
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

        <Input
          InputLeftElement={
            <Flex ml={4} align="center" justify="center">
              <Icon as={<KeyIcon solid color="black" />} w="full" />
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
        />
      </Stack>

      <Checkbox
        value="ok"
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

      <Button variant="primary" size="full" title="Cadastrar" marginTop={8} />

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

      <HStack alignItems="center" justifyContent="center" mt={16}>
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
