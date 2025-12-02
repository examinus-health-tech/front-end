import { useEffect, useRef, useState, useContext } from 'react';
import { Linking, RefreshControl } from 'react-native';
import { VStack, Text, HStack, ScrollView, IScrollViewProps, Box, Spinner, IconButton, Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '@contexts/AuthContext';

import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Header } from '../../components/header/header';

import { api } from '../../../../services/api';
import { Notification } from 'src/@types/notifications';
import { NotificationCard } from '../../components/nofitication-card';

export function Notifications() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Função helper para garantir que temos um array
  const ensureArray = (data: any): Notification[] => {
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === 'object') {
      // Tenta encontrar o array em diferentes propriedades comuns
      const possibleArrays = [data.data, data.notifications, data.items, data.results, data.content].filter(
        Array.isArray
      );

      if (possibleArrays.length > 0) {
        return possibleArrays[0] as Notification[];
      }
    }
    return [];
  };

  async function fetchNotifications() {
    try {
      setIsLoading(true);
      console.log('👤 UserID logado atual:', user?.userId);

      const response = await api.get('/notifications');
      console.log('📋 Resposta da API:', JSON.stringify(response.data, null, 2));

      // Usa o helper para garantir que temos um array
      const notificationsArray = ensureArray(response.data);
      console.log('📊 Notificações processadas:', notificationsArray.length, 'itens');

      // Log para verificar se as notificações pertencem ao usuário correto
      if (notificationsArray.length > 0) {
        console.log('🔍 Primeira notificação:', notificationsArray[0]);
        console.log('👤 UserID da notificação:', notificationsArray[0]?.userId);
        console.log('👤 UserID logado:', user?.userId);

        // Log de todas as notificações e seus userIds
        console.log('📊 Todas as notificações e seus userIds:');
        notificationsArray.forEach((notif, index) => {
          console.log(
            `  ${index + 1}. ID: ${notif.id}, UserID: ${notif.userId}, Título: ${notif.title?.substring(0, 30)}...`
          );
        });

        // Conta quantas notificações pertencem ao usuário logado
        const userNotifications = notificationsArray.filter((n) => n.userId === user?.userId);
        console.log(`✅ Notificações do usuário logado: ${userNotifications.length} de ${notificationsArray.length}`);
      } else {
        console.log('📊 Nenhuma notificação recebida');
      }

      setNotifications(notificationsArray);
    } catch (error) {
      console.error('❌ Erro ao buscar notificações:', error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  function handleDownloadPdf(url: string) {
    Linking.openURL(url);
  }

  const total = notifications.length;

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1, backgroundColor: '#94a3b8' }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <VStack flex={1} bg="gray.250" py={24} px={3}>
        <Header title="Notificações" handleBackTo={() => navigation.goBack()} />

        <VStack mb={4}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize={18} fontWeight={800} letterSpacing={-0.16} color="gray.900">
              Recentes
            </Text>

            {isLoading ? (
              <Spinner size="sm" color="gray.600" />
            ) : (
              <Text fontSize={16} fontWeight={600} letterSpacing={-0.14} color="gray.600">
                {total} Total
              </Text>
            )}
          </HStack>
        </VStack>

        <VStack space={4}>
          {Array.isArray(notifications) &&
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onPressDownloadPdf={handleDownloadPdf}
              />
            ))}

          {!isLoading && (!notifications || notifications.length === 0) && (
            <Box mt={8} alignItems="center">
              <Text color="gray.600">Nenhuma notificação por aqui ainda.</Text>
            </Box>
          )}
        </VStack>
      </VStack>
    </ScrollView>
  );
}
