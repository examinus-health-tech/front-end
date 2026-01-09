import { useRef, useMemo, useCallback } from 'react';
import { VStack, ScrollView, IScrollViewProps, Box, Text, HStack, Divider, Pressable } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { HeaderTitle, CaloriesBar, ActivityCard } from '@components/molecules';
import { Button } from '@components/atoms';

// assets
import { FireIcon, ActivityRunningIcon, ActivitySnowboardingIcon, WalkingIcon } from '@assets/icons';

// hooks
import { useHome } from 'src/hooks/useHome';
import { useTabBar } from 'src/hooks/useTabBar';

export function Calories() {
  const scrollRef = useRef<IScrollViewProps>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { trackerData } = useHome();
  const { hideTabBar, showTabBar } = useTabBar();

  // Hide tab bar when screen is focused
  useFocusEffect(
    useCallback(() => {
      hideTabBar();
      return () => showTabBar();
    }, [hideTabBar, showTabBar])
  );

  // Dados do contexto
  const kcalGoal = Number(trackerData?.kcal?.[0]?.kcal_goal) || 2000;
  const kcalBurned = Number(trackerData?.kcal?.[0]?.kcal_completed) || 1542;

  // Verifica se está no caminho certo (acima de 50% da meta)
  const isOnTrack = kcalBurned >= kcalGoal * 0.5;

  // Mock de atividades
  const activities = useMemo(
    () => [
      {
        id: '1',
        title: 'Treino Cardio',
        calories: 154,
        variant: 'green' as const,
        icon: <FireIcon size="20" color="#0CC1AF" />,
      },
      {
        id: '2',
        title: 'Caminhada',
        calories: 854,
        variant: 'yellow' as const,
        icon: <WalkingIcon size="20" color="#F5C518" />,
      },
      {
        id: '3',
        title: 'Snow Boarding',
        calories: 224,
        variant: 'purple' as const,
        icon: <ActivitySnowboardingIcon size="20" color="#8B5CF6" />,
      },
    ],
    []
  );

  return (
    <VStack flex={1} py={16}>
      <HeaderTitle withBackButton={() => navigation.navigate('tracker')} title="Calorias" withMoreButton />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack flex={1} pb={32}>
          {/* Header com meta */}
          <VStack mx={6}>
            <HStack space={2} alignItems="center">
              <Text fontFamily="Poligon" fontSize={16} letterSpacing={-0.16} fontWeight={600}>
                Hoje você queimou
              </Text>
              <Box bg={isOnTrack ? '#E6F7F5' : '#FEE2E2'} px={2} py={1} borderRadius={8}>
                <Text color={isOnTrack ? '#0CC1AF' : '#EF4444'} fontFamily="Poligon" fontSize={10} fontWeight={700} textTransform="uppercase">
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
                Atividades
              </Text>
              <Pressable>
                <Text fontFamily="Poligon" fontSize={14} fontWeight={600} color="ciano.200" letterSpacing={-0.14}>
                  Ver Tudo
                </Text>
              </Pressable>
            </HStack>

            <VStack space={3}>
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  title={activity.title}
                  calories={activity.calories}
                  variant={activity.variant}
                  icon={activity.icon}
                />
              ))}
            </VStack>
          </VStack>

          {/* Botão de ação */}
          <VStack mx={6} mt={8}>
            <Button title="Adicionar Atividade" variant="primary" size="full" icon={<Text color="white" fontSize={18}>+</Text>} />
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
