import { useRef, useState, useEffect, useCallback } from 'react';
import { VStack, Text, ScrollView, IScrollViewProps, View, StatusBar, HStack, Box } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Linking, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OneSignal } from 'react-native-onesignal';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { Header } from '../components/header/header';
import { Card } from '../components/card/card';
import { useCustomToast } from 'src/hooks/useCustomToast';

const NOTIFICATION_PREFS_KEY = '@examinus:notification_prefs';

export function ConfigNotifications() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { showSuccess, showError } = useCustomToast();

  // Estado dos switches de notificação
  const [dailyReminders, setDailyReminders] = useState(true);
  const [healthInsights, setHealthInsights] = useState(true);
  const [examInfo, setExamInfo] = useState(true);
  const [chatbotNotifications, setChatbotNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  async function checkPushPermission() {
    const granted = await OneSignal.Notifications.getPermissionAsync();
    setPushEnabled(granted);
  }

  // Checar ao ganhar foco na navegação
  useFocusEffect(
    useCallback(() => {
      checkPushPermission();
    }, [])
  );

  // Checar ao voltar do background (ex: retorno das Settings do sistema)
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        checkPushPermission();
      }
    });
    return () => sub.remove();
  }, []);

  // Carregar preferências ao montar o componente
  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(NOTIFICATION_PREFS_KEY);

      if (stored) {
        const prefs = JSON.parse(stored);
        setDailyReminders(prefs.dailyReminders ?? true);
        setHealthInsights(prefs.healthInsights ?? true);
        setExamInfo(prefs.examInfo ?? true);
        setChatbotNotifications(prefs.chatbotNotifications ?? false);
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Função para salvar preferências automaticamente
  const savePreference = useCallback(async (key: string, value: boolean, allPrefs: Record<string, boolean>) => {
    try {
      const updatedPrefs = { ...allPrefs, [key]: value };

      // Salvar localmente (AsyncStorage)
      await AsyncStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(updatedPrefs));

      // Atualizar tag específica no OneSignal
      try {
        OneSignal.User.addTag(key, value.toString());
      } catch (oneSignalError) {
        console.warn('Erro ao atualizar tag OneSignal:', oneSignalError);
      }

      showSuccess({
        title: 'Salvo',
        description: 'Preferência atualizada.',
        duration: 1500,
      });
    } catch (error) {
      console.error('Erro ao salvar preferência:', error);
      showError({
        title: 'Erro',
        description: 'Não foi possível salvar.',
      });
    }
  }, [showSuccess, showError]);

  // Handlers para cada switch com auto-save
  const handleDailyReminders = useCallback((value: boolean) => {
    setDailyReminders(value);
    savePreference('dailyReminders', value, {
      dailyReminders: value,
      healthInsights,
      examInfo,
      chatbotNotifications,
    });
  }, [healthInsights, examInfo, chatbotNotifications, savePreference]);

  const handleHealthInsights = useCallback((value: boolean) => {
    setHealthInsights(value);
    savePreference('healthInsights', value, {
      dailyReminders,
      healthInsights: value,
      examInfo,
      chatbotNotifications,
    });
  }, [dailyReminders, examInfo, chatbotNotifications, savePreference]);

  const handleExamInfo = useCallback((value: boolean) => {
    setExamInfo(value);
    savePreference('examInfo', value, {
      dailyReminders,
      healthInsights,
      examInfo: value,
      chatbotNotifications,
    });
  }, [dailyReminders, healthInsights, chatbotNotifications, savePreference]);

  const handleChatbotNotifications = useCallback((value: boolean) => {
    setChatbotNotifications(value);
    savePreference('chatbotNotifications', value, {
      dailyReminders,
      healthInsights,
      examInfo,
      chatbotNotifications: value,
    });
  }, [dailyReminders, healthInsights, examInfo, savePreference]);

  return (
    <View testID="screen-config-notifications" flex={1}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header fixo */}
      <VStack pt={16} mx={6}>
        <Header title="Notificações" handleBackTo={() => navigation.goBack()} />
      </VStack>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack flex={1} mx={6} mb={20}>
          {/* Status da permissão de push */}
          <Card
            title="Notificações Push"
            subTitle={pushEnabled ? 'Ativadas no sistema' : 'Desativadas no sistema — toque para ativar'}
            variant="description"
            action={pushEnabled ? 'switch' : 'chevron'}
            switchValue={pushEnabled}
            onSwitchChange={() => Linking.openSettings()}
            goTo={() => Linking.openSettings()}
          />

          {!pushEnabled && (
            <Box bg="ciano.50" borderRadius={12} px={4} py={3} mt={2} mb={2} borderWidth={1} borderColor="ciano.200">
              <Text fontSize={12} fontWeight={500} color="gray.600" lineHeight={16}>
                Ative as notificações para não perder lembretes de exames e medicamentos.
              </Text>
            </Box>
          )}

          <VStack mt={4}>
          <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color={'gray.900'}>
            Configurações Gerais
          </Text>

          <VStack mt={4} space={3}>
            <Card
              title="Lembretes Diários"
              subTitle="Receba estímulos diários para concluir suas avaliações de saúde"
              variant="description"
              action="switch"
              switchValue={dailyReminders}
              onSwitchChange={handleDailyReminders}
            />
            <Card
              title="Health Insights"
              subTitle="Receba estímulos diários para concluir suas avaliações de saúde"
              variant="description"
              action="switch"
              switchValue={healthInsights}
              onSwitchChange={handleHealthInsights}
            />
            <Card
              title="Informações sobre Exames"
              subTitle="Receba estímulos diários para concluir suas avaliações de saúde"
              variant="description"
              action="switch"
              switchValue={examInfo}
              onSwitchChange={handleExamInfo}
            />
            <Card
              title="Notificações do ChatBot"
              subTitle="Receba estímulos diários para concluir suas avaliações de saúde"
              variant="description"
              action="switch"
              switchValue={chatbotNotifications}
              onSwitchChange={handleChatbotNotifications}
            />
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </View>
  );
}
