import { useRef, useState } from 'react';
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

  // Estado dos switches de notificação
  const [dailyReminders, setDailyReminders] = useState(true);
  const [healthInsights, setHealthInsights] = useState(true);
  const [examInfo, setExamInfo] = useState(false);
  const [chatbotNotifications, setChatbotNotifications] = useState(false);

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <VStack flex={1} py={16} mx={6}>
        <Header title="Notificações" handleBackTo={() => navigation.goBack()} />

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
              switchValue={dailyReminders}
              onSwitchChange={setDailyReminders}
            />
            <Card
              title="Health Insights"
              subTitle="Receba estímulos diários para concluir suas avaliações de saúde"
              variant="description"
              action="switch"
              switchValue={healthInsights}
              onSwitchChange={setHealthInsights}
            />
            <Card
              title="Informações sobre Exames"
              subTitle="Receba estímulos diários para concluir suas avaliações de saúde"
              variant="description"
              action="switch"
              switchValue={examInfo}
              onSwitchChange={setExamInfo}
            />
            <Card
              title="Notificações do ChatBot"
              subTitle="Receba estímulos diários para concluir suas avaliações de saúde"
              variant="description"
              action="switch"
              switchValue={chatbotNotifications}
              onSwitchChange={setChatbotNotifications}
            />
          </VStack>
        </VStack>

        {/* TODO: Habilitar quando a API de configurações estiver pronta
        <VStack mt={8}>
          <Button variant="primary" size="full" title="Salvar" icon={<CheckIcon color="white" />} />
        </VStack>
        */}
      </VStack>
    </ScrollView>
  );
}
