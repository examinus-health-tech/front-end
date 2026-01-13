import { useState, useEffect, useCallback } from 'react';
import { Box, Text, VStack, HStack, Pressable, Skeleton } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

// assets
import { AnalyticsIcon, LightBulbIcon, RotateRightIcon } from '@assets/icons';

// services
import { getDailyAnalysis, clearAnalysisCache, DailyFitnessData, DailyAnalysisResponse } from 'src/services/dailyAnalysisService';

type DailyAnalysisCardProps = {
  fitnessData: DailyFitnessData;
  onRefresh?: () => void;
};

const getMoodGradient = (mood: DailyAnalysisResponse['mood']): [string, string] => {
  switch (mood) {
    case 'excellent':
      return ['#10B981', '#059669']; // Verde
    case 'good':
      return ['#3B82F6', '#0EA5E9']; // Azul
    case 'moderate':
      return ['#F59E0B', '#D97706']; // Amarelo/Laranja
    case 'needs_attention':
      return ['#EF4444', '#DC2626']; // Vermelho
    default:
      return ['#6366F1', '#4F46E5']; // Roxo padrão
  }
};


export function DailyAnalysisCard({ fitnessData, onRefresh }: DailyAnalysisCardProps) {
  const [analysis, setAnalysis] = useState<DailyAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const fetchAnalysis = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
        await clearAnalysisCache();
      } else {
        setIsLoading(true);
      }

      const result = await getDailyAnalysis(fitnessData);
      setAnalysis(result);
    } catch (error) {
      console.error('[DailyAnalysisCard] Erro ao buscar análise:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [fitnessData]);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const handleRefresh = async () => {
    await fetchAnalysis(true);
    onRefresh?.();
  };

  if (isLoading) {
    return (
      <Box bg="white" rounded="2xl" p={4} shadow={1}>
        <HStack alignItems="center" space={3} mb={3}>
          <Skeleton size="10" rounded="full" />
          <Skeleton.Text lines={1} w="40%" />
        </HStack>
        <Skeleton.Text lines={3} />
        <Skeleton h={8} mt={3} rounded="lg" />
      </Box>
    );
  }

  if (!analysis) {
    return null;
  }

  const gradientColors = getMoodGradient(analysis.mood);

  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <Box overflow="hidden" rounded="2xl" shadow={2}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 16 }}
        >
          {/* Header */}
          <HStack justifyContent="space-between" alignItems="center" mb={3}>
            <HStack alignItems="center" space={2}>
              <Box bg="rgba(255,255,255,0.2)" p={2} rounded="full">
                <AnalyticsIcon size="20" color="#FFFFFF" />
              </Box>
              <Text color="white" fontSize={16} fontWeight={700} letterSpacing={-0.16}>
                Análise do Dia
              </Text>
            </HStack>

            <Pressable
              onPress={handleRefresh}
              disabled={isRefreshing}
              opacity={isRefreshing ? 0.5 : 1}
              bg="rgba(255,255,255,0.2)"
              p={2}
              rounded="full"
            >
              <RotateRightIcon size="18" color="#FFFFFF" />
            </Pressable>
          </HStack>

          {/* Análise principal */}
          <Text
            color="white"
            fontSize={15}
            fontWeight={500}
            lineHeight={22}
            letterSpacing={-0.15}
            mb={3}
          >
            {analysis.analysis}
          </Text>

          {/* Dicas */}
          {analysis.tips && analysis.tips.length > 0 && (
            <VStack>
              <Pressable onPress={() => setShowTips(!showTips)}>
                <HStack
                  alignItems="center"
                  space={2}
                  bg="rgba(255,255,255,0.15)"
                  px={3}
                  py={2}
                  rounded="lg"
                >
                  <LightBulbIcon size="16" color="#FFFFFF" />
                  <Text color="white" fontSize={13} fontWeight={600} flex={1}>
                    {showTips ? 'Ocultar dicas' : `Ver ${analysis.tips.length} dica${analysis.tips.length > 1 ? 's' : ''}`}
                  </Text>
                  <Text color="rgba(255,255,255,0.7)" fontSize={12}>
                    {showTips ? '▲' : '▼'}
                  </Text>
                </HStack>
              </Pressable>

              {showTips && (
                <VStack space={2} mt={3}>
                  {analysis.tips.map((tip, index) => (
                    <HStack
                      key={index}
                      alignItems="flex-start"
                      space={2}
                      bg="rgba(255,255,255,0.1)"
                      px={3}
                      py={2}
                      rounded="lg"
                    >
                      <Text color="rgba(255,255,255,0.8)" fontSize={12} mt={0.5}>
                        •
                      </Text>
                      <Text
                        color="rgba(255,255,255,0.9)"
                        fontSize={13}
                        fontWeight={500}
                        flex={1}
                        lineHeight={18}
                      >
                        {tip}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              )}
            </VStack>
          )}
        </LinearGradient>
      </Box>
    </Animated.View>
  );
}
