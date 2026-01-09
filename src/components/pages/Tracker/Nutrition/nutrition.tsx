import { useRef, useMemo, useCallback } from 'react';
import { VStack, ScrollView, IScrollViewProps, Box, Text, HStack, Divider } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { HeaderTitle, NutritionGrid } from '@components/molecules';
import type { NutritionDayData, NutritionStatus } from '@components/molecules';
import { Button } from '@components/atoms';

// assets
import { AppleIcon } from '@assets/icons';

// hooks
import { useHome } from 'src/hooks/useHome';
import { useTabBar } from 'src/hooks/useTabBar';

export function Nutrition() {
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
  const kcalCompleted = Number(trackerData?.kcal?.[0]?.kcal_completed) || 0;

  // Dados mock de nutrição para o mês atual
  const nutritionData = useMemo<NutritionDayData[]>(() => {
    const today = new Date();
    const currentDay = today.getDate();
    const data: NutritionDayData[] = [];

    // Gera dados para os dias passados do mês
    for (let day = 1; day <= currentDay; day++) {
      const random = Math.random();
      let status: NutritionStatus;

      if (random < 0.6) {
        status = 'within'; // 60% dentro da meta
      } else if (random < 0.85) {
        status = 'above'; // 25% acima da meta
      } else {
        status = 'none'; // 15% sem dados
      }

      data.push({ day, status });
    }

    return data;
  }, []);

  return (
    <VStack flex={1} py={16}>
      <HeaderTitle withBackButton={() => navigation.navigate('tracker')} title="Nutrição" />

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <VStack flex={1} pb={32}>
          {/* Header com meta */}
          <VStack mx={6}>
            <HStack space={2} alignItems="center">
              <AppleIcon />
              <Text fontFamily="Poligon" fontSize={16} letterSpacing={-0.16} fontWeight={600}>
                Sua Nutrição
              </Text>
              <Box bg="ciano.200" px={2} py={1} borderRadius={8}>
                <Text color="white" fontFamily="Poligon" fontSize={12} fontWeight={700}>
                  META
                </Text>
              </Box>
            </HStack>

            <HStack alignItems="flex-end" mt={2}>
              <Text fontFamily="Poligon" fontSize={72} fontWeight={800} letterSpacing={-0.72} color="gray.900">
                {kcalGoal.toLocaleString('pt-BR')}
              </Text>
              <Text fontFamily="Poligon" ml={2} mb={4} fontSize={24} fontWeight={600} letterSpacing={-0.24} color="gray.400">
                kcal
              </Text>
            </HStack>
          </VStack>

          {/* Grid de nutrição - calendário do mês */}
          <Box mx={6} mt={6}>
            <NutritionGrid data={nutritionData} gap={6} />
          </Box>

          {/* Legenda */}
          <HStack mt={8} justifyContent="center" alignItems="center">
            <VStack alignItems="center" space={2}>
              <Box bg="ciano.200" size={3} borderRadius={4} />
              <Text fontFamily="Poligon" fontSize={12} fontWeight={700} color="gray.300">
                Dentro da Meta
              </Text>
            </VStack>

            <Divider bg="gray.100" orientation="vertical" mx={4} h={8} />

            <VStack alignItems="center" space={2}>
              <Box bg="red.400" size={3} borderRadius={4} />
              <Text fontFamily="Poligon" fontSize={12} fontWeight={700} color="gray.300">
                Acima da Meta
              </Text>
            </VStack>

            <Divider bg="gray.100" orientation="vertical" mx={4} h={8} />

            <VStack alignItems="center" space={2}>
              <Box bg="gray.200" size={3} borderRadius={4} />
              <Text fontFamily="Poligon" fontSize={12} fontWeight={700} color="gray.300">
                Sem Dados
              </Text>
            </VStack>
          </HStack>

          {/* Botão de ação */}
          <VStack mx={6} mt={12}>
            <Button title="Adicionar Kcal Ingeridas" variant="primary" size="full" />
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
