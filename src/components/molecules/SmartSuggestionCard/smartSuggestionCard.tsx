import { useRef, useEffect } from 'react';
import { Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Box, Text, HStack, VStack, ScrollView, Pressable } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';

// assets
import { WaterDropFilledIcon, FireIcon, StepsIcon, GearIcon, CompassTargetIcon } from '@assets/icons';

// types
import type { GoalSuggestion } from 'src/services/goalCalculatorService';

// Habilita LayoutAnimation no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 24;
const CARD_GAP = 12;
const CONFIG_CARD_WIDTH = 100;
const CARD_WIDTH = SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - 40;
const CARD_HEIGHT = 195;

type SmartSuggestionCardProps = {
  suggestions: GoalSuggestion[];
  onApply: (suggestion: GoalSuggestion) => void;
  onConfigure?: () => void;
  showEmptyState?: boolean;
};

const getIcon = (type: GoalSuggestion['icon'], color: string) => {
  switch (type) {
    case 'water':
      return <WaterDropFilledIcon size="24" color={color} />;
    case 'fire':
      return <FireIcon size="24" color={color} />;
    case 'steps':
      return <StepsIcon size="24" color={color} />;
    default:
      return <WaterDropFilledIcon size="24" color={color} />;
  }
};

const getGradientColors = (type: GoalSuggestion['type']): [string, string] => {
  switch (type) {
    case 'hydration':
      return ['#3B82F6', '#0EA5E9'];
    case 'calories':
      return ['#F97316', '#EF4444'];
    case 'steps':
      return ['#0CC1AF', '#14B8A6'];
    default:
      return ['#3B82F6', '#0CC1AF'];
  }
};

export function SmartSuggestionCard({ suggestions, onApply, onConfigure, showEmptyState }: SmartSuggestionCardProps) {
  const scrollRef = useRef<typeof ScrollView>(null);
  const prevSuggestionsLength = useRef(suggestions?.length || 0);

  // Anima quando sugestões mudam
  useEffect(() => {
    if (prevSuggestionsLength.current !== suggestions?.length) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      prevSuggestionsLength.current = suggestions?.length || 0;
    }
  }, [suggestions?.length]);

  const formatValue = (value: number, unit: string) => {
    if (unit === 'ml' && value >= 1000) {
      return `${(value / 1000).toFixed(1)}L`;
    }
    return `${value.toLocaleString('pt-BR')} ${unit}`;
  };

  // Calcula os offsets de snap para cada card
  const getSnapOffsets = () => {
    const offsets = [0];
    if (onConfigure) {
      let currentOffset = CONFIG_CARD_WIDTH + CARD_GAP;
      suggestions.forEach(() => {
        offsets.push(currentOffset);
        currentOffset += CARD_WIDTH + CARD_GAP;
      });
    } else {
      let currentOffset = 0;
      suggestions.forEach(() => {
        offsets.push(currentOffset);
        currentOffset += CARD_WIDTH + CARD_GAP;
      });
    }
    return offsets;
  };

  // Estado vazio - todas as metas otimizadas
  if (!suggestions || suggestions.length === 0) {
    if (!showEmptyState) return null;

    return (
      <Box
        mx={0}
        bg="ciano.50"
        borderRadius={16}
        p={5}
        borderWidth={1}
        borderColor="ciano.200"
        flexDirection="row"
        alignItems="center"
      >
        <Box bg="ciano.400" p={2.5} borderRadius={12} mr={4}>
          <CompassTargetIcon size="24" color="#FFFFFF" />
        </Box>
        <VStack flex={1}>
          <Text fontFamily="Poligon" fontSize={14} fontWeight={700} color="ciano.700">
            Metas Otimizadas
          </Text>
          <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="ciano.600">
            Suas metas estão alinhadas com seu perfil
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <VStack mx={-6}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToOffsets={getSnapOffsets()}
        snapToAlignment="start"
        contentContainerStyle={{ paddingHorizontal: HORIZONTAL_PADDING }}
      >
        <HStack space={3} alignItems="flex-start">
          {/* Card de Configurar Metas */}
          {onConfigure && (
            <Pressable onPress={onConfigure}>
              {({ isPressed }) => (
                <Box
                  width={CONFIG_CARD_WIDTH}
                  height={CARD_HEIGHT}
                  bg={isPressed ? 'gray.200' : 'gray.100'}
                  borderRadius={16}
                  p={4}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box bg="ciano.100" p={2.5} borderRadius={12} mb={2}>
                    <GearIcon size="24" color="#0CC1AF" />
                  </Box>
                  <Text fontFamily="Poligon" fontSize={11} fontWeight={700} color="gray.700" textAlign="center">
                    Configurar{'\n'}Metas
                  </Text>
                </Box>
              )}
            </Pressable>
          )}

          {/* Cards de Sugestões */}
          {suggestions.map((suggestion, index) => (
            <Box key={`${suggestion.type}-${index}`} width={CARD_WIDTH} height={CARD_HEIGHT}>
              <LinearGradient
                colors={getGradientColors(suggestion.type)}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 16, padding: 16, height: '100%' }}
              >
                {/* Header */}
                <HStack alignItems="center" space={2} mb={2}>
                  <Box bg="rgba(255,255,255,0.2)" p={1.5} borderRadius={10}>
                    {getIcon(suggestion.icon, '#FFFFFF')}
                  </Box>
                  <VStack>
                    <Text fontFamily="Poligon" fontSize={11} fontWeight={600} color="white" opacity={0.8}>
                      Meta Sugerida
                    </Text>
                    <Text fontFamily="Poligon" fontSize={14} fontWeight={700} color="white">
                      {suggestion.type === 'hydration' ? 'Hidratação' :
                       suggestion.type === 'calories' ? 'Calorias' : 'Passos'}
                    </Text>
                  </VStack>
                </HStack>

                {/* Valores */}
                <HStack alignItems="flex-end" space={2} mb={1}>
                  <Text fontFamily="Poligon" fontSize={28} fontWeight={800} color="white">
                    {formatValue(suggestion.suggestedGoal, suggestion.unit)}
                  </Text>
                </HStack>

                {/* Motivo */}
                <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="white" opacity={0.9} mb={3} numberOfLines={2}>
                  {suggestion.reason}
                </Text>

                {/* Botão Aplicar */}
                <Pressable onPress={() => onApply(suggestion)}>
                  {({ isPressed }) => (
                    <Box
                      bg={isPressed ? 'rgba(255,255,255,0.9)' : 'white'}
                      py={2.5}
                      borderRadius={10}
                      alignItems="center"
                    >
                      <Text fontFamily="Poligon" fontSize={13} fontWeight={700} color={getGradientColors(suggestion.type)[0]}>
                        Aplicar Meta
                      </Text>
                    </Box>
                  )}
                </Pressable>
              </LinearGradient>
            </Box>
          ))}
        </HStack>
      </ScrollView>
    </VStack>
  );
}
