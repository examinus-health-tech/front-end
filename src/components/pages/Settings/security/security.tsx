import { useRef } from 'react';
import { VStack, ScrollView, IScrollViewProps } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { LockIcon } from '@assets/icons';

// components
import { Header } from '../components/header/header';
import { Card } from '../components/card/card';
import { Button } from '@components/atoms/Button/button';

export function Security() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} py={24} mx={6}>
        <Header title="Segurança" handleBackTo={() => navigation.navigate('myAccount')} />

        <VStack mt={4} space={3}>
          <Card title="Lembrar Senha" variant="value" action="switch" />

          <Card
            title="Entrar com Biometria"
            subTitle="Ative essa função para entrar em sua conta através do leitor biométrico"
            variant="description"
            action="switch"
          />

          <Card title="Google Authenticator" subTitle="Google Authenticator" variant="description" action="switch" />

          <Card
            title="Meus Dispositivos"
            subTitle="Receba estímulos diários para concluir suas avaliações de saúde"
            variant="value"
            action="value"
            value="Iphone 14"
          />

          <Button
            mt={4}
            variant="primary"
            size="full"
            title="Mudar Senha"
            // onPress={handleNextStep}
            icon={<LockIcon color="#FFFFFF" size="26" />}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
