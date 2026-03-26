import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { VStack, ScrollView, IScrollViewProps, Box, Text, HStack, Divider, Skeleton } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { HeaderTitle, CaloriesBar, ActivityCard } from '@components/molecules';

// assets
import {
  FireIcon,
  WalkingIcon,
  BarbellIcon,
  BedIcon,
  BicycleIcon,
  HeartIcon,
} from '@assets/icons';

// hooks
import { useHome } from 'src/hooks/useHome';
import { useTabBar } from 'src/hooks/useTabBar';

// services
import { getActivities, FitnessActivity } from 'src/services/fitnessService';

// Mapeamento de tipos de atividade para configuração visual
const activityTypeConfig: Record<number, { name: string; icon: React.ReactNode; variant: 'green' | 'yellow' | 'purple' | 'blue' | 'red' }> = {
  0: { name: 'Caminhada', icon: <WalkingIcon size="20" color="#0CC1AF" />, variant: 'green' },
  1: { name: 'Corrida', icon: <WalkingIcon size="20" color="#F59E0B" />, variant: 'yellow' },
  2: { name: 'Ciclismo', icon: <BicycleIcon size="20" color="#8B5CF6" />, variant: 'purple' },
  3: { name: 'Musculação', icon: <BarbellIcon size="20" color="#EF4444" />, variant: 'red' },
  4: { name: 'Natação', icon: <HeartIcon size="20" color="#3B82F6" />, variant: 'blue' },
  5: { name: 'Yoga', icon: <HeartIcon size="20" color="#0CC1AF" />, variant: 'green' },
  6: { name: 'Treino Cardio', icon: <FireIcon size="20" color="#EF4444" />, variant: 'red' },
  7: { name: 'Esportes', icon: <BarbellIcon size="20" color="#8B5CF6" />, variant: 'purple' },
};

const getActivityConfig = (activityType: number, activityName?: string) => {
  const config = activityTypeConfig[activityType] || {
    name: 'Atividade',
    icon: <FireIcon size="20" color="#0CC1AF" />,
    variant: 'green' as const,
  };
  return {
    ...config,
    name: activityName || config.name,
  };
};

export function Calories() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { trackerData } = useHome();
  const { hideTabBar, showTabBar } = useTabBar();

  const [activities, setActivities] = useState<FitnessActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // Hide tab bar and fetch activities when screen is focused
  useFocusEffect(
    useCallback(() => {
      hideTabBar();
      fetchActivities();
      return () => showTabBar();
    }, [hideTabBar, showTabBar])
  );

  // Buscar atividades do dia
  async function fetchActivities() {
    try {
      setIsLoadingActivities(true);
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString();

      const data = await getActivities(startOfDay, endOfDay);
      setActivities(data);
    } catch (error) {
      if (__DEV__) console.error('Erro ao buscar atividades:', error);
      setActivities([]);
    } finally {
      setIsLoadingActivities(false);
    }
  }

  // Dados do contexto
  const kcalGoal = Number(trackerData?.kcal?.[0]?.kcal_goal) || 2000;
  const kcalBurned = Number(trackerData?.kcal?.[0]?.kcal_completed) || 0;

  // Verifica se está no caminho certo (acima de 50% da meta)
  const isOnTrack = kcalBurned >= kcalGoal * 0.5;

  // Calcular total de calorias das atividades
  const totalCaloriesFromActivities = useMemo(() => {
    return activities.reduce((total, activity) => total + (activity.caloriesBurned || 0), 0);
  }, [activities]);

  return (
    <VStack flex={1} pt={16}>
      <HeaderTitle withBackButton={() => navigation.navigate('tracker')} title="Calorias Gastas" withMoreButton />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack flex={1} pb={48}>
          {/* Header com meta */}
          <VStack mx={6}>
            <HStack space={2} alignItems="center">
              <Text fontFamily="Poligon" fontSize={16} letterSpacing={-0.16} fontWeight={600}>
                Hoje você queimou
              </Text>
              <Box bg={isOnTrack ? '#E6F7F5' : '#FEE2E2'} px={2} py={1} borderRadius={8}>
                <Text color={isOnTrack ? '#0CC1AF' : '#EF4444'} fontFamily="Poligon" fontSize={12} fontWeight={700} textTransform="uppercase">
                  {isOnTrack ? 'No caminho certo' : 'Abaixo da meta'}
                </Text>
              </Box>
            </HStack>

            <HStack alignItems="flex-end" mt={2}>
              <Text fontFamily="Poligon" fontSize={72} fontWeight={800} letterSpacing={-0.72} color="gray.900">
                {kcalBurned.toLocaleString('pt-BR')}
              </Text>
              <Text fontFamily="Poligon" ml={2} mb={4} fontSize={24} fontWeight={600} letterSpacing={-0.24} color="gray.400">
                kcal
              </Text>
            </HStack>
          </VStack>

          {/* Barra de calorias */}
          <Box mx={6} mt={4}>
            <CaloriesBar burned={kcalBurned} target={kcalGoal} />
          </Box>

          {/* Legenda */}
          <HStack mt={6} justifyContent="center" alignItems="center">
            <VStack alignItems="center" space={2}>
              <Box bg="#6FD3C6" size={3} borderRadius={4} />
              <Text fontFamily="Poligon" fontSize={12} fontWeight={700} color="gray.300">
                Gastas
              </Text>
            </VStack>

            <Divider bg="gray.100" orientation="vertical" mx={4} h={8} />

            <VStack alignItems="center" space={2}>
              <Box bg="#0CC1AF" size={3} borderRadius={4} />
              <Text fontFamily="Poligon" fontSize={12} fontWeight={700} color="gray.300">
                Alvo
              </Text>
            </VStack>

            <Divider bg="gray.100" orientation="vertical" mx={4} h={8} />

            <VStack alignItems="center" space={2}>
              <Box bg="#8A3FFC" size={3} borderRadius={4} />
              <Text fontFamily="Poligon" fontSize={12} fontWeight={700} color="gray.300">
                Faltam
              </Text>
            </VStack>
          </HStack>

          {/* Seção de Atividades */}
          <VStack mx={6} mt={10}>
            <HStack justifyContent="space-between" alignItems="center" mb={4}>
              <Text fontFamily="Poligon" fontSize={18} fontWeight={700} color="gray.900" letterSpacing={-0.18}>
                Atividades de Hoje
              </Text>
              {activities.length > 0 && (
                <Text fontFamily="Poligon" fontSize={14} fontWeight={600} color="gray.400">
                  {activities.length} {activities.length === 1 ? 'atividade' : 'atividades'}
                </Text>
              )}
            </HStack>

            {isLoadingActivities ? (
              <VStack space={3}>
                <Skeleton h={16} rounded="xl" />
                <Skeleton h={16} rounded="xl" />
                <Skeleton h={16} rounded="xl" />
              </VStack>
            ) : activities.length > 0 ? (
              <VStack space={3}>
                {activities.map((activity) => {
                  const config = getActivityConfig(activity.activityType, activity.activityName);
                  return (
                    <ActivityCard
                      key={activity.id}
                      title={config.name}
                      calories={activity.caloriesBurned || 0}
                      variant={config.variant}
                      icon={config.icon}
                    />
                  );
                })}
              </VStack>
            ) : (
              <Box bg="gray.50" p={6} borderRadius={16} alignItems="center">
                <FireIcon size="32" color="#9CA3AF" />
                <Text fontFamily="Poligon" fontSize={14} fontWeight={600} color="gray.400" mt={3} textAlign="center">
                  Nenhuma atividade registrada hoje
                </Text>
                <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="gray.300" mt={1} textAlign="center">
                  As atividades do Apple Health ou Google Fit aparecerão aqui
                </Text>
              </Box>
            )}
          </VStack>

          {/* Info sobre atividades */}
          <Box mx={6} mt={8} bg="gray.50" p={4} borderRadius={16}>
            <HStack alignItems="center" space={2} mb={2}>
              <FireIcon size="20" color="#0CC1AF" />
              <Text fontFamily="Poligon" fontSize={14} fontWeight={700} color="gray.700">
                Sobre as Atividades
              </Text>
            </HStack>
            <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="gray.500">
              As atividades são sincronizadas automaticamente do Apple Watch ou Samsung Health.
              Continue se exercitando para atingir sua meta diária!
            </Text>
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
