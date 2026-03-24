import { useEffect, useRef, useState, useMemo } from 'react';
import { Linking, useWindowDimensions, TouchableOpacity } from 'react-native';
import { CustomRefreshControl } from '@components/atoms';
import { VStack, Text, HStack, ScrollView, IScrollViewProps, Box, StatusBar, View } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import ContentLoader, { Rect } from 'react-content-loader/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { NotificationCard } from './components/NotificationCard/notificationCard';
import { GearIcon, ChevronLeftIcon } from '@assets/icons';

import { api } from 'src/services/api';
import { Notification } from 'src/@types/notifications';
import { useAuth } from 'src/hooks/useAuth';

// Tipo para grupos de notificações
type NotificationGroup = {
  title: string;
  notifications: Notification[];
};

// Função auxiliar para parsear datas de forma segura
function parseNotificationDate(dateString: string | undefined): Date | null {
  if (!dateString) return null;

  try {
    // Tenta parsear a data diretamente
    let date = new Date(dateString);

    // Se for inválida, tenta outros formatos
    if (isNaN(date.getTime())) {
      // Tenta formato DD/MM/YYYY
      const parts = dateString.split('/');
      if (parts.length === 3) {
        date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
    }

    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

// Função para agrupar notificações por período
function groupNotificationsByPeriod(notifications: Notification[]): NotificationGroup[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const groups: { [key: string]: Notification[] } = {
    today: [],
    yesterday: [],
    lastWeek: [],
    thisMonth: [],
    older: [],
  };

  // Ordenar notificações por data (mais recentes primeiro)
  const sortedNotifications = [...notifications].sort((a, b) => {
    const dateA = parseNotificationDate(a.createdAt);
    const dateB = parseNotificationDate(b.createdAt);
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dateB.getTime() - dateA.getTime();
  });

  sortedNotifications.forEach((notification) => {
    const notifDate = parseNotificationDate(notification.createdAt);

    // Se não conseguiu parsear a data, coloca em "Recentes"
    if (!notifDate) {
      groups.today.push(notification);
      return;
    }

    const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

    if (notifDay.getTime() === today.getTime()) {
      groups.today.push(notification);
    } else if (notifDay.getTime() === yesterday.getTime()) {
      groups.yesterday.push(notification);
    } else if (notifDay > lastWeek) {
      groups.lastWeek.push(notification);
    } else if (notifDay >= thisMonth) {
      groups.thisMonth.push(notification);
    } else {
      groups.older.push(notification);
    }
  });

  const result: NotificationGroup[] = [];

  if (groups.today.length > 0) {
    result.push({ title: 'Hoje', notifications: groups.today });
  }
  if (groups.yesterday.length > 0) {
    result.push({ title: 'Ontem', notifications: groups.yesterday });
  }
  if (groups.lastWeek.length > 0) {
    result.push({ title: 'Última Semana', notifications: groups.lastWeek });
  }
  if (groups.thisMonth.length > 0) {
    result.push({ title: 'Este Mês', notifications: groups.thisMonth });
  }
  if (groups.older.length > 0) {
    result.push({ title: 'Anteriores', notifications: groups.older });
  }

  return result;
}

export function Notifications() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { user } = useAuth();
  const { width, height } = useWindowDimensions();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

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
      // Limpa notificações antigas antes de buscar novas
      setNotifications([]);

      // Timestamp para forçar bypass de cache no iOS
      // withCredentials: false para não enviar cookies antigos
      const response = await api.get(`notifications?_t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        withCredentials: false,
      });
      const notificationsArray = ensureArray(response.data);
      console.log('📬 Notificações recebidas:', notificationsArray.length, 'para userId:', user?.userId);
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
      const response = await api.get(`notifications?_t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        withCredentials: false,
      });
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

  // Agrupar notificações por período
  const groupedNotifications = useMemo(() => {
    return groupNotificationsByPeriod(notifications);
  }, [notifications]);

  const NotificationSkeleton = () => (
    <ContentLoader
      viewBox={`0 0 ${width - 48} 100`}
      backgroundColor="#d5d5d5"
      foregroundColor="#ebebeb"
      style={{ width: width - 48, height: 100 }}
    >
      <Rect x="0" y="0" rx="12" ry="12" width={width - 48} height={100} />
    </ContentLoader>
  );

  // Header customizado com ícone de configurações
  const CustomHeader = () => (
    <HStack space={4} alignItems="center" mb={6}>
      <TouchableOpacity testID="btn-back" onPress={() => navigation.goBack()}>
        <ChevronLeftIcon size="30" color="#052B3B" />
      </TouchableOpacity>

      <Text flex={1} color="gray.900" fontWeight={800} fontSize={20} letterSpacing={-0.2}>
        Notificações
      </Text>

      <TouchableOpacity testID="btn-notification-settings" onPress={() => navigation.navigate('configNotifications')}>
        <GearIcon size="24" color="#052B3B" />
      </TouchableOpacity>
    </HStack>
  );

  return (
    <View testID="screen-notifications" flex={1}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header fixo */}
      <VStack pt={16} mx={6}>
        <CustomHeader />
      </VStack>

      {isLoading ? (
        <VStack flex={1} mx={6}>
          <HStack justifyContent="space-between" alignItems="center" mb={4}>
            <ContentLoader
              viewBox="0 0 100 24"
              backgroundColor="#d5d5d5"
              foregroundColor="#ebebeb"
              style={{ width: 100, height: 24 }}
            >
              <Rect x="0" y="0" rx="6" ry="6" width={100} height={24} />
            </ContentLoader>
            <ContentLoader
              viewBox="0 0 60 20"
              backgroundColor="#d5d5d5"
              foregroundColor="#ebebeb"
              style={{ width: 60, height: 20 }}
            >
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
          <VStack flex={1} mx={6} mb={20}>
            {groupedNotifications.length > 0 ? (
              groupedNotifications.map((group, groupIndex) => {
                // Calcular índice global para animações
                let globalIndex = 0;
                for (let i = 0; i < groupIndex; i++) {
                  globalIndex += groupedNotifications[i].notifications.length;
                }

                const groupUnreadCount = group.notifications.filter((n) => !n.read).length;

                return (
                  <VStack key={group.title} mb={6}>
                    {/* Header do grupo */}
                    <HStack justifyContent="space-between" alignItems="center" mb={4}>
                      <HStack alignItems="center" space={2}>
                        <Text fontSize={16} fontWeight={800} letterSpacing={-0.16} color="gray.900">
                          {group.title}
                        </Text>
                        {groupUnreadCount > 0 && (
                          <Box bg="ciano.300" borderRadius="full" px={2} py={0.5}>
                            <Text fontSize={12} fontWeight={700} color="white">
                              {groupUnreadCount} {groupUnreadCount === 1 ? 'nova' : 'novas'}
                            </Text>
                          </Box>
                        )}
                      </HStack>
                      <Text fontSize={14} fontWeight={600} letterSpacing={-0.14} color="gray.500">
                        {group.notifications.length} Total
                      </Text>
                    </HStack>

                    {/* Notificações do grupo */}
                    <VStack space={3}>
                      {group.notifications.map((notification, index) => {
                        const animIndex = globalIndex + index;
                        const isLastItem =
                          groupIndex === groupedNotifications.length - 1 &&
                          index === group.notifications.length - 1;

                        return (
                          <Animated.View
                            key={notification.id}
                            entering={!hasAnimated ? FadeInDown.duration(400).delay(animIndex * 80) : undefined}
                            onLayout={() => isLastItem && !hasAnimated && setHasAnimated(true)}
                          >
                            <NotificationCard
                              notification={notification}
                              onPressDownloadPdf={handleDownloadPdf}
                              onPress={handleNotificationPress}
                            />
                          </Animated.View>
                        );
                      })}
                    </VStack>
                  </VStack>
                );
              })
            ) : (
              <Box mt={8} alignItems="center">
                <Text color="gray.500" fontSize={14}>
                  Nenhuma notificação por aqui ainda.
                </Text>
              </Box>
            )}
          </VStack>
        </ScrollView>
      )}
    </View>
  );
}
