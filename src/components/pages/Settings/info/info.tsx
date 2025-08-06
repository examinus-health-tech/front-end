import { useNavigation } from '@react-navigation/native';
import { Box, IScrollViewProps, Image, ScrollView, StatusBar, VStack } from 'native-base';
import { useRef, useState } from 'react';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { CheckIcon, EditIcon, UserIcon } from '@assets/icons';

// components
import { Button } from '@components/atoms/Button/button';
import { Input } from '@components/molecules/Input/input';
import { SuccessSaved } from '@components/pages/Settings/components/successSaved/successSaved';
import { Header } from '../components/header/header';
import { useAuth } from 'src/hooks/useAuth';

export function Info() {
  const [isSuccess, setSuccess] = useState<boolean>(false);

  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { user } = useAuth();

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
          <Input
            leftIcon={<UserIcon color="#052B3B" size="26" />}
            rightIcon={<EditIcon color="#052B3B" size="26" />}
            keyboardType="email-address"
            autoCapitalize="none"
            label="Nome Completo"
          />

          <Input
            leftIcon={<UserIcon color="#052B3B" size="26" />}
            rightIcon={<EditIcon color="#052B3B" size="26" />}
            keyboardType="email-address"
            autoCapitalize="none"
            label="Endereço de E-mail"
          />

          <Input
            leftIcon={<UserIcon color="#052B3B" size="26" />}
            rightIcon={<EditIcon color="#052B3B" size="26" />}
            keyboardType="email-address"
            autoCapitalize="none"
            label="Telefone"
          />

          <Input
            leftIcon={<UserIcon color="#052B3B" size="26" />}
            rightIcon={<EditIcon color="#052B3B" size="26" />}
            keyboardType="email-address"
            autoCapitalize="none"
            label="Data de Nascimento"
          />

          <Input
            leftIcon={<UserIcon color="#052B3B" size="26" />}
            rightIcon={<EditIcon color="#052B3B" size="26" />}
            keyboardType="email-address"
            autoCapitalize="none"
            label="Endereço"
          />

          <Input
            leftIcon={<UserIcon color="#052B3B" size="26" />}
            rightIcon={<EditIcon color="#052B3B" size="26" />}
            keyboardType="email-address"
            autoCapitalize="none"
            label="País"
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
