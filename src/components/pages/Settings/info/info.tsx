import { useNavigation } from '@react-navigation/native';
import { Box, IScrollViewProps, Image, ScrollView, StatusBar, VStack, Flex, Icon } from 'native-base';
import { useRef, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { CheckIcon, EditIcon, MailIcon, UserIcon } from '@assets/icons';

// components
import { Button } from '@components/atoms/Button/button';
import { Input } from '@components/molecules/Input/input';
import { SuccessSaved } from '@components/pages/Settings/components/successSaved/successSaved';
import { Header } from '../components/header/header';
import { useAuth } from 'src/hooks/useAuth';

type FormDataProps = {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  country: string;
};

const infoSchema = yup.object({
  fullName: yup.string().required('Nome completo é obrigatório').min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: yup.string().required('E-mail é obrigatório').email('E-mail inválido'),
  phone: yup.string().required('Telefone é obrigatório').min(10, 'Telefone inválido'),
  birthDate: yup.string().required('Data de nascimento é obrigatória'),
  address: yup.string().required('Endereço é obrigatório'),
  country: yup.string().required('País é obrigatório'),
});

export function Info() {
  const [isSuccess, setSuccess] = useState<boolean>(false);

  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { user } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormDataProps>({
    resolver: yupResolver(infoSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      birthDate: '',
      address: '',
      country: 'Brasil',
    },
  });

  useEffect(() => {
    if (user) {
      setValue('fullName', user.fullName || '');
      setValue('email', user.name || '');
      setValue('country', 'Brasil');
    }
  }, [user, setValue]);

  async function handleSaveInfo(data: FormDataProps) {
    console.log('Dados para salvar:', data);
    // Aqui você pode implementar a chamada da API para salvar os dados
    setSuccess(true);
  }

  if (isSuccess) {
    return <SuccessSaved />;
  }

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="default" backgroundColor="transparent" translucent />

      <Box w={'100%'} h={240} borderBottomRadius={24} position={'absolute'} bgColor={'gray.900'}>
        <Image
          source={
            {
              // uri: user.ImageUserUrl,
            }
          }
          size={28}
          borderWidth={1}
          borderColor="white"
          rounded={12}
          position={'absolute'}
          bottom={-56}
          right={'37%'}
        />
      </Box>

      <VStack flex={1} py={16} mx={6} zIndex={1}>
        <Header title="Informações Pessoais" bgMode handleBackTo={() => navigation.navigate('homepage')} />

        <VStack mt={48} space={5}>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Flex ml={4} align="center" justify="center">
                    <Icon as={<UserIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                InputRightElement={
                  <Flex mr={4} align="center" justify="center">
                    <Icon as={<EditIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                keyboardType="default"
                autoCapitalize="words"
                label="Nome Completo"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.fullName?.message}
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
                    <Icon as={<UserIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                InputRightElement={
                  <Flex mr={4} align="center" justify="center">
                    <Icon as={<EditIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                keyboardType="email-address"
                autoCapitalize="none"
                label="Endereço de E-mail"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Flex ml={4} align="center" justify="center">
                    <Icon as={<UserIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                InputRightElement={
                  <Flex mr={4} align="center" justify="center">
                    <Icon as={<EditIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                keyboardType="phone-pad"
                autoCapitalize="none"
                label="Telefone"
                value={value}
                onChangeText={onChange}
                placeholder="(11) 99999-9999"
                errorMessage={errors.phone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="birthDate"
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Flex ml={4} align="center" justify="center">
                    <Icon as={<UserIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                InputRightElement={
                  <Flex mr={4} align="center" justify="center">
                    <Icon as={<EditIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                keyboardType="default"
                autoCapitalize="none"
                label="Data de Nascimento"
                value={value}
                onChangeText={onChange}
                placeholder="DD/MM/AAAA"
                errorMessage={errors.birthDate?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Flex ml={4} align="center" justify="center">
                    <Icon as={<UserIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                InputRightElement={
                  <Flex mr={4} align="center" justify="center">
                    <Icon as={<EditIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                keyboardType="default"
                autoCapitalize="none"
                label="Endereço"
                value={value}
                onChangeText={onChange}
                placeholder="Rua, número, bairro, cidade"
                errorMessage={errors.address?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="country"
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Flex ml={4} align="center" justify="center">
                    <Icon as={<UserIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                InputRightElement={
                  <Flex mr={4} align="center" justify="center">
                    <Icon as={<EditIcon color="#052B3B" size="26" />} w="full" />
                  </Flex>
                }
                keyboardType="default"
                autoCapitalize="words"
                label="País"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.country?.message}
              />
            )}
          />

          <Button
            mt={4}
            variant="primary"
            size="full"
            title="Salvar"
            onPress={handleSubmit(handleSaveInfo)}
            icon={<CheckIcon color="#FFFFFF" size="28" />}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
