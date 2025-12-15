import { useEffect, useRef, useState } from 'react';
import { Linking, useWindowDimensions, TouchableOpacity } from 'react-native';
import { CustomRefreshControl } from '@components/atoms';
import { VStack, Text, HStack, ScrollView, IScrollViewProps, Box, StatusBar, View } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import ContentLoader, { Rect } from 'react-content-loader/native';

import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { NotificationCard } from './components/NotificationCard/notificationCard';
import { GearIcon, ChevronLeftIcon } from '@assets/icons';

import { api } from 'src/services/api';
import { Notification } from 'src/@types/notifications';
import { useAuth } from 'src/hooks/useAuth';

export function Notifications() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { user } = useAuth();
  const { width, height } = useWindowDimensions();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const ensureArray = (data: any): Notification[] => {
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === 'object') {
      const possibleArrays = [data.data, data.notifications, data.items, data.results, data.content].filter(
        Array.isArray
      );

      if (possibleArrays.length > 0) {
        return possibleArrays[0] as Notification[];
      }
    }
    return [];
  };

  async function fetchNotifications(showFullLoading = true) {
    try {
      if (showFullLoading) {
        setIsLoading(true);
      }
      const response = await api.get('/notifications');
      const notificationsArray = ensureArray(response.data);
      setNotifications(notificationsArray);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = async () => {
    console.log('🔄 onRefresh chamado nas notificações');
    setRefreshing(true);
    try {
      const response = await api.get('/notifications');
      const notificationsArray = ensureArray(response.data);
      setNotifications(notificationsArray);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Re-busca notificações quando o usuário mudar (login/logout/troca de conta)
    if (user?.userId) {
      fetchNotifications();
    } else {
      // Limpa notificações se não há usuário logado
      setNotifications([]);
    }
  }, [user?.userId]);

  function handleDownloadPdf(url: string) {
    Linking.openURL(url);
  }

  async function handleNotificationPress(notification: Notification) {
    // Marcar como lida localmente para feedback imediato
    if (!notification.read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );

      // Marcar como lida no backend
      try {
        await api.put(`/notifications/${notification.id}/read`);
      } catch (error) {
        console.error('Erro ao marcar notificação como lida:', error);
      }
    }
  }

  const total = notifications.length;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const NotificationSkeleton = () => (
    <ContentLoader
      viewBox={`0 0 ${width - 48} 100`}
      backgroundColor="#e5e5e5"
      foregroundColor="#f5f5f5"
      style={{ marginBottom: 12 }}
    >
      <Rect x="0" y="0" rx="12" ry="12" width={width - 48} height={100} />
    </ContentLoader>
  );

  // Header customizado com ícone de configurações
  const CustomHeader = () => (
    <HStack space={4} alignItems="center" mb={6}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ChevronLeftIcon size="30" color="#052B3B" />
      </TouchableOpacity>

      <Text flex={1} color="gray.900" fontWeight={800} fontSize={20} letterSpacing={-0.2}>
        Notificações
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate('configNotifications')}>
        <GearIcon size="24" color="#052B3B" />
      </TouchableOpacity>
    </HStack>
  );

  return (
    <View flex={1}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {isLoading ? (
        <VStack flex={1} py={16} mx={6}>
          <CustomHeader />

          <HStack justifyContent="space-between" alignItems="center" mb={4}>
            <ContentLoader viewBox="0 0 100 24" backgroundColor="#e5e5e5" foregroundColor="#f5f5f5">
              <Rect x="0" y="0" rx="6" ry="6" width={100} height={24} />
            </ContentLoader>
            <ContentLoader viewBox="0 0 60 20" backgroundColor="#e5e5e5" foregroundColor="#f5f5f5">
              <Rect x="0" y="0" rx="4" ry="4" width={60} height={20} />
            </ContentLoader>
          </HStack>

          <VStack space={3}>
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </VStack>
        </VStack>
      ) : (
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          refreshControl={<CustomRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <VStack flex={1} py={16} mx={6} mb={20}>
            <CustomHeader />

            <HStack justifyContent="space-between" alignItems="center" mb={4}>
              <HStack alignItems="center" space={2}>
                <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color="gray.900">
                  Recentes
                </Text>
                {unreadCount > 0 && (
                  <Box bg="ciano.300" borderRadius="full" px={2} py={0.5}>
                    <Text fontSize={12} fontWeight={700} color="white">
                      {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
                    </Text>
                  </Box>
                )}
              </HStack>
              <Text fontSize={14} fontWeight={600} letterSpacing={-0.14} color="gray.500">
                {total} Total
              </Text>
            </HStack>

            <VStack space={3}>
              {Array.isArray(notifications) &&
                notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onPressDownloadPdf={handleDownloadPdf}
                    onPress={handleNotificationPress}
                  />
                ))}

              {!notifications || notifications.length === 0 ? (
                <Box mt={8} alignItems="center">
                  <Text color="gray.500" fontSize={14}>
                    Nenhuma notificação por aqui ainda.
                  </Text>
                </Box>
              ) : null}
            </VStack>
          </VStack>
        </ScrollView>
      )}
    </View>
  );
}
