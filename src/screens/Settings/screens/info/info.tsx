import { useNavigation } from '@react-navigation/native';
import { Box, IScrollViewProps, ScrollView, VStack } from 'native-base';
import { useRef, useState } from 'react';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { CheckIcon, EditIcon, UserIcon } from '@assets/icons';

// components
import { Button } from '@components/Button/button';
import { Input } from '@components/Input/input';
import { SuccessSaved } from '@screens/Settings/components/successSaved/successSaved';
import { Header } from '../../components/header/header';

export function Info() {
  const [isSuccess, setSuccess] = useState<boolean>(false);

  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  if (isSuccess) {
    return <SuccessSaved />;
  }

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <Box
        w={'100%'}
        h={240}
        bg={'gray.100'}
        borderBottomRadius={24}
        position={'absolute'}
      >
        <Box
          bg={'gray.30'}
          w={28}
          h={28}
          borderRadius={12}
          borderColor={'white'}
          borderWidth={1}
          position={'absolute'}
          bottom={-56}
          right={'37%'}
        />
      </Box>
      <VStack flex={1} py={24} mx={6} zIndex={1}>
        <Header
          title="Informações Pessoais"
          bgMode
          handleBackTo={() => navigation.navigate('myAccount')}
        />

        <VStack mt={48} space={5}>
          <Input
            leftIcon={<UserIcon color="#052B3B" size="26" />}
            rightIcon={<EditIcon color="#052B3B" size="26" />}
            keyboardType="email-address"
            autoCapitalize="none"
            label="Nome Completo"
            isDisabled={true}
          />

          <Input
            leftIcon={<UserIcon color="#052B3B" size="26" />}
            rightIcon={<EditIcon color="#052B3B" size="26" />}
            keyboardType="email-address"
            autoCapitalize="none"
            label="Endereço de E-mail"
            isDisabled={true}
          />

          <Input
            leftIcon={<UserIcon color="#052B3B" size="26" />}
            rightIcon={<EditIcon color="#052B3B" size="26" />}
            keyboardType="email-address"
            autoCapitalize="none"
            label="Telefone"
            isDisabled={true}
          />

          <Input
            leftIcon={<UserIcon color="#052B3B" size="26" />}
            rightIcon={<EditIcon color="#052B3B" size="26" />}
            keyboardType="email-address"
            autoCapitalize="none"
            label="Data de Nascimento"
            isDisabled={true}
          />

          <Input
            leftIcon={<UserIcon color="#052B3B" size="26" />}
            rightIcon={<EditIcon color="#052B3B" size="26" />}
            keyboardType="email-address"
            autoCapitalize="none"
            label="Endereço"
            isDisabled={true}
          />

          <Input
            leftIcon={<UserIcon color="#052B3B" size="26" />}
            rightIcon={<EditIcon color="#052B3B" size="26" />}
            keyboardType="email-address"
            autoCapitalize="none"
            label="País"
            isDisabled={true}
          />

          <Button
            mt={4}
            variant="primary"
            size="full"
            title="Salvar"
            onPress={() => setSuccess(true)}
            icon={<CheckIcon color="#FFFFFF" size="28" />}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
