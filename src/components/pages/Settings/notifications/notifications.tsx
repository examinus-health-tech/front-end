import { useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { VStack, Text, HStack, ScrollView, IScrollViewProps } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { CheckIcon, MoreIcon } from '@assets/icons';

// components
import { Header } from '../components/header/header';
import { Card } from '../components/card/card';
import { Button } from '@components/atoms/Button/button';

export function ConfigNotifications() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} py={24} mx={6}>
        <Header title="Notificações" handleBackTo={() => navigation.navigate('myAccount')} />

        <VStack>
          <HStack justifyContent={'space-between'}>
            <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
              Configurações Gerais
            </Text>

            <TouchableOpacity>
              <MoreIcon />
            </TouchableOpacity>
          </HStack>

          <VStack mt={4} space={3}>
            <Card
              title="Lembretes Diários"
              subTitle="Receba estímulos diários para concluir suas avaliações de saúde"
              variant="description"
              action="switch"
            />
            <Card
              title="Health Insights"
              subTitle="Receba estímulos diários para concluir suas avaliações de saúde"
              variant="description"
              action="switch"
            />
            <Card
              title="Informações sobre Exames"
              subTitle="Receba estímulos diários para concluir suas avaliações de saúde"
              variant="description"
              action="switch"
            />
            <Card
              title="Notificações do ChatBot"
              subTitle="Receba estímulos diários para concluir suas avaliações de saúde"
              variant="description"
              action="switch"
            />
          </VStack>
        </VStack>

        <VStack>
          <HStack mt={8} justifyContent={'space-between'}>
            <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
              Som da Notificação
            </Text>

            <TouchableOpacity>
              <MoreIcon />
            </TouchableOpacity>
          </HStack>

          <VStack mt={4} mb={8} space={3}>
            <Card title="Qualidade de Aúdio" variant="value" action="value" value="Alta" />
            <Card
              title="Aviso sonoro de alerta saúde"
              subTitle="Receba estímulos diários para concluir suas avaliações de saúde"
              variant="description"
              action="switch"
            />
          </VStack>
        </VStack>

        <Button variant="primary" size="full" title="Salvar" icon={<CheckIcon color="white" />} />
      </VStack>
    </ScrollView>
  );
}
