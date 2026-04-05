import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Keyboard } from 'react-native';
import { VStack, Box, Text, HStack, Pressable, Skeleton } from 'native-base';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  FadeIn,
} from 'react-native-reanimated';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// components
import { HeaderTitle, TimeRangePicker, WeightStepChart } from '@components/molecules';
import type { TimeRange, WeightDataPoint } from '@components/molecules';
import { Button } from '@components/atoms';

// assets
import { WeightScaleIcon, WeightTargetIcon } from '@assets/icons';

// hooks
import { useHome } from 'src/hooks/useHome';
import { useTabBar } from 'src/hooks/useTabBar';

// services
import { createWeight, setWeightGoal, getWeightGoal, getWeightHistory } from 'src/services/fitnessService';

// utils
import Toast from 'react-native-toast-message';

type EditMode = 'current' | 'goal' | null;

// Constantes para animação do header
const HEADER_EXPANDED_HEIGHT = 320;
const HEADER_COLLAPSED_HEIGHT = 180;
const SCROLL_THRESHOLD = 120;

export function Weight() {
  const [rangeSelected, setRangeSelected] = useState<TimeRange>('1w');
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [weightInput, setWeightInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [localWeightGoal, setLocalWeightGoal] = useState<number>(70.0);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [chartData, setChartData] = useState<WeightDataPoint[]>([]);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { trackerData, refreshFitnessData } = useHome();
  const { hideTabBar, showTabBar } = useTabBar();
  const insets = useSafeAreaInsets();

  // Bottom sheet ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  // Animated scroll value
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated style for header container
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
      Extrapolation.CLAMP
    );

    return {
      height,
    };
  });

  // Animated style for expanded content (fades out)
  const expandedContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD * 0.5],
      [1, 0],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_THRESHOLD],
      [0, -20],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Animated style for collapsed content (fades in)
  const collapsedContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_THRESHOLD * 0.3, SCROLL_THRESHOLD * 0.7],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  // Hide tab bar, set status bar style and load weight goal when screen is focused
  useFocusEffect(
    useCallback(() => {
      hideTabBar();
      setStatusBarStyle('light');

      // Carregar meta de peso salva
      async function loadWeightGoal() {
        const savedGoal = await getWeightGoal();
        if (savedGoal !== null) {
          setLocalWeightGoal(savedGoal);
        }
      }
      loadWeightGoal();

      return () => {
        showTabBar();
        setStatusBarStyle('dark');
      };
    }, [hideTabBar, showTabBar])
  );

  // Dados do contexto
  const weightCompleted = Number(trackerData?.weight?.[0]?.weight_completed) || 0;

  // Calcular diferença para meta
  const weightDiff = weightCompleted - localWeightGoal;
  const isAboveGoal = weightDiff > 0;
  const progressToGoal = localWeightGoal > 0 ? Math.min((localWeightGoal / weightCompleted) * 100, 100) : 0;

  // Handlers do bottom sheet
  const handleOpenSheet = useCallback((mode: EditMode) => {
    setEditMode(mode);
    if (mode === 'current') {
      setWeightInput(weightCompleted.toFixed(1));
    } else if (mode === 'goal') {
      setWeightInput(localWeightGoal.toFixed(1));
    }
    bottomSheetRef.current?.expand();
  }, [weightCompleted, localWeightGoal]);

  const handleCloseSheet = useCallback(() => {
    Keyboard.dismiss();
    setEditMode(null);
    setWeightInput('');
    bottomSheetRef.current?.close();
  }, []);

  // Helper para converter range em meses
  const getMonthsForRange = (range: TimeRange): number => {
    switch (range) {
      case '1d': return 1;
      case '1w': return 1;
      case '1m': return 1;
      case '1y': return 12;
      case 'all': return 24;
      default: return 6;
    }
  };

  // Busca dados do gráfico da API
  useEffect(() => {
    async function fetchChartData() {
      setIsLoadingChart(true);
      try {
        const months = getMonthsForRange(rangeSelected);
        const history = await getWeightHistory(months);

        if (history.length > 0) {
          // Converte histórico para formato do gráfico
          const data = history.map(record => ({
            value: record.weightKg || 0,
          }));
          setChartData(data);
        } else {
          // Se não há dados, mostra apenas o valor atual
          setChartData(weightCompleted > 0 ? [{ value: weightCompleted }] : []);
        }
      } catch (error) {
        if (__DEV__) console.error('Erro ao buscar histórico de peso:', error);
        setChartData(weightCompleted > 0 ? [{ value: weightCompleted }] : []);
      } finally {
        setIsLoadingChart(false);
      }
    }

    fetchChartData();
  }, [rangeSelected, weightCompleted]);

  const handleSaveWeight = async () => {
    if (!weightInput || !editMode) return;

    const value = parseFloat(weightInput);
    if (isNaN(value) || value <= 0) return;

    // Captura valores antes de fechar (handleCloseSheet reseta editMode e weightInput)
    const currentMode = editMode;

    // Fechar bottom sheet
    Keyboard.dismiss();
    bottomSheetRef.current?.close();
    setEditMode(null);
    setWeightInput('');

    if (currentMode === 'current') {
      setIsSaving(true);
      try {
        await createWeight({
          weightKg: value,
          recordedAt: new Date().toISOString(),
        });

        Toast.show({
          type: 'success',
          text1: 'Peso registrado!',
          text2: `${value.toFixed(1)} kg salvo com sucesso`,
        });

        // Atualiza os dados do contexto
        await refreshFitnessData();
      } catch (error: any) {
        if (__DEV__) console.error('Erro ao salvar peso:', error);
        Toast.show({
          type: 'error',
          text1: 'Erro ao salvar',
          text2: error.message || 'Tente novamente mais tarde',
        });
      } finally {
        setIsSaving(false);
      }
    } else if (currentMode === 'goal') {
      setIsSaving(true);
      try {
        await setWeightGoal(value);
        setLocalWeightGoal(value);

        Toast.show({
          type: 'success',
          text1: 'Meta definida!',
          text2: `Meta de ${value.toFixed(1)} kg salva com sucesso`,
        });
      } catch (error: any) {
        if (__DEV__) console.error('Erro ao salvar meta:', error);
        Toast.show({
          type: 'error',
          text1: 'Erro ao salvar',
          text2: error.message || 'Tente novamente mais tarde',
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const getModalTitle = () => {
    if (editMode === 'current') return 'Registrar Peso';
    if (editMode === 'goal') return 'Definir Meta';
    return '';
  };

  const getModalSubtitle = () => {
    if (editMode === 'current') return 'Informe seu peso atual';
    if (editMode === 'goal') return 'Defina seu peso desejado';
    return '';
  };

  return (
    <VStack testID="screen-weight" flex={1} bg="#F5F5F5">
      <StatusBar style="light" />
      {/* Header animado com fundo ciano - posição absoluta */}
      <Animated.View style={[headerAnimatedStyle, { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }]}>
        <Box w="100%" h="100%" bg="ciano.300" borderBottomRadius={36} pt={16} pb={6} overflow="hidden">
          <HeaderTitle
            withBackButton={() => navigation.navigate('tracker')}
            title="Peso"
            color="white"
          />

          {/* Conteúdo expandido (some ao scrollar) */}
          <Animated.View style={[expandedContentStyle, { position: 'absolute', top: 120, left: 24, right: 24 }]}>
            <HStack alignItems="center" space={2} mb={3}>
              <WeightScaleIcon size="20" color="#5EEAD4" />
              <Text color="ciano.100" fontFamily="Poligon" fontSize={16} fontWeight={500} letterSpacing={-0.16}>
                Peso Atual
              </Text>
            </HStack>

            <HStack alignItems="flex-end">
              <Text color="white" fontFamily="Poligon" fontSize={72} fontWeight={800} letterSpacing={-0.72}>
                {weightCompleted.toFixed(1)}
              </Text>
              <Text fontFamily="Poligon" fontSize={36} letterSpacing={-0.36} color="ciano.200" mb={3}>
                kg
              </Text>
            </HStack>

            <HStack alignItems="center" mt={2}>
              <Text color="ciano.100" fontFamily="Poligon" fontSize={14} fontWeight={500}>
                {isAboveGoal ? (
                  `${Math.abs(weightDiff).toFixed(1)}kg acima da meta`
                ) : weightDiff < 0 ? (
                  `${Math.abs(weightDiff).toFixed(1)}kg abaixo da meta`
                ) : (
                  'Meta atingida!'
                )}
              </Text>
            </HStack>
          </Animated.View>

          {/* Conteúdo colapsado (aparece ao scrollar) */}
          <Animated.View style={[collapsedContentStyle, { position: 'absolute', top: 100, left: 24, right: 24 }]}>
            <HStack alignItems="center" justifyContent="space-between">
              <HStack alignItems="center" space={3}>
                <WeightScaleIcon size="20" color="#5EEAD4" />
                <VStack>
                  <Text color="white" fontFamily="Poligon" fontSize={28} fontWeight={800} letterSpacing={-0.28}>
                    {weightCompleted.toFixed(1)} kg
                  </Text>
                  <Text color="ciano.100" fontFamily="Poligon" fontSize={12} fontWeight={500}>
                    Meta: {localWeightGoal.toFixed(1)} kg
                  </Text>
                </VStack>
              </HStack>
            </HStack>
          </Animated.View>
        </Box>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: HEADER_EXPANDED_HEIGHT, flexGrow: 1 }}
        style={{ flex: 1 }}
      >
        {/* Conteúdo principal */}
        <VStack flex={1} mx={6} mt={4} pb={32} bg="#F5F5F5">
          {/* Seletor de período */}
          <Box mt={2}>
            <HStack justifyContent="space-between" alignItems="center" mb={4}>
              <Text fontFamily="Poligon" fontSize={16} fontWeight={800} letterSpacing={-0.16} color="gray.900">
                Evolução
              </Text>
            </HStack>
            <TimeRangePicker selected={rangeSelected} onSelect={setRangeSelected} />
          </Box>

          {/* Área do gráfico */}
          <Box mt={4}>
            {isLoadingChart ? (
              <Box bg="white" rounded="2xl" p={4} h={200}>
                <Skeleton h={4} w="30%" mb={4} rounded="md" />
                <Skeleton h={120} w="100%" rounded="md" />
                <Skeleton h={4} w="50%" mt={4} rounded="md" alignSelf="center" />
              </Box>
            ) : chartData.length > 0 ? (
              <Animated.View entering={FadeIn.duration(400)}>
                <WeightStepChart data={chartData} goalValue={localWeightGoal} goalLineColor="#9CA3AF" />
              </Animated.View>
            ) : (
              <Box bg="white" rounded="2xl" p={6} alignItems="center">
                <WeightScaleIcon size="48" color="#D1D5DB" />
                <Text fontFamily="Poligon" fontSize={14} fontWeight={500} color="gray.400" mt={3} textAlign="center">
                  Nenhum registro de peso ainda.{'\n'}Comece registrando seu peso atual.
                </Text>
              </Box>
            )}
          </Box>

          {/* Legenda do gráfico */}
          <HStack mt={4} justifyContent="center" space={6}>
            <HStack alignItems="center" space={2}>
              <Box w={3} h={3} bg="ciano.300" borderRadius={2} />
              <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="gray.500">
                Peso
              </Text>
            </HStack>
            <HStack alignItems="center" space={2}>
              <Box w={3} h={3} bg="gray.300" borderRadius={2} borderWidth={1} borderColor="gray.400" borderStyle="dashed" />
              <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="gray.500">
                Meta ({localWeightGoal.toFixed(1)}kg)
              </Text>
            </HStack>
          </HStack>

          {/* Cards de Peso Atual e Meta - Editáveis */}
          <HStack mt={6} justifyContent="space-between" space={4}>
            <Pressable flex={1} onPress={() => handleOpenSheet('current')}>
              <Box bg="white" rounded="2xl" p={4} borderWidth={2} borderColor="transparent" _pressed={{ borderColor: 'ciano.200' }}>
                <Box size={12} background="#E6FFFA" rounded={12} alignItems="center" justifyContent="center">
                  <WeightScaleIcon size="24" color="#0CC1AF" />
                </Box>
                <Text fontFamily="Poligon" fontSize={28} letterSpacing={-0.28} fontWeight={800} mt={4} color="gray.900">
                  {weightCompleted.toFixed(1)}{' '}
                  <Text color="gray.300" fontFamily="Poligon" fontSize={16} letterSpacing={-0.16} fontWeight={800}>
                    kg
                  </Text>
                </Text>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text color="gray.300" fontFamily="Poligon" fontSize={14} letterSpacing={-0.14} fontWeight={500}>
                    Peso Atual
                  </Text>
                  <Text color="ciano.300" fontFamily="Poligon" fontSize={12} fontWeight={700}>
                    Editar
                  </Text>
                </HStack>
              </Box>
            </Pressable>

            <Pressable flex={1} onPress={() => handleOpenSheet('goal')}>
              <Box bg="white" rounded="2xl" p={4} borderWidth={2} borderColor="transparent" _pressed={{ borderColor: 'red.200' }}>
                <Box size={12} background="#FEF2F2" rounded={12} alignItems="center" justifyContent="center">
                  <WeightTargetIcon size="24" color="#EF4444" />
                </Box>
                <Text fontFamily="Poligon" fontSize={28} letterSpacing={-0.28} fontWeight={800} mt={4} color="gray.900">
                  {localWeightGoal.toFixed(1)}{' '}
                  <Text color="gray.300" fontFamily="Poligon" fontSize={16} letterSpacing={-0.16} fontWeight={800}>
                    kg
                  </Text>
                </Text>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text color="gray.300" fontFamily="Poligon" fontSize={14} letterSpacing={-0.14} fontWeight={500}>
                    Peso Meta
                  </Text>
                  <Text color="red.400" fontFamily="Poligon" fontSize={12} fontWeight={700}>
                    Editar
                  </Text>
                </HStack>
              </Box>
            </Pressable>
          </HStack>

          {/* Botão de registrar */}
          <Box mt={6}>
            <Button
              title="Registrar Novo Peso"
              variant="primary"
              size="full"
              onPress={() => handleOpenSheet('current')}
            />
          </Box>

          {/* Dicas */}
          <Box mt={6} bg="ciano.50" p={4} borderRadius={16}>
            <HStack alignItems="center" space={2} mb={2}>
              <WeightScaleIcon size="20" color="#0CC1AF" />
              <Text fontFamily="Poligon" fontSize={14} fontWeight={700} color="ciano.700">
                Dica
              </Text>
            </HStack>
            <Text fontFamily="Poligon" fontSize={12} fontWeight={500} color="ciano.600">
              Pese-se sempre no mesmo horário, preferencialmente pela manhã em jejum, para ter medições mais consistentes.
            </Text>
          </Box>
        </VStack>
      </Animated.ScrollView>

      {/* Modal de edição */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        topInset={insets.top + 50}
        handleIndicatorStyle={{ backgroundColor: '#D1D5DB', width: 40 }}
        backgroundStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
      >
        <BottomSheetView style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
          <Box w="100%" py={4}>
            <Text fontFamily="Poligon" fontSize={20} fontWeight={800} color="gray.900" textAlign="center">
              {getModalTitle()}
            </Text>
            <Text fontFamily="Poligon" fontSize={14} fontWeight={500} color="gray.400" textAlign="center" mt={1}>
              {getModalSubtitle()}
            </Text>
          </Box>

          {/* Input de peso */}
          <VStack w="100%" mt={4}>
            <HStack
              alignItems="center"
              bg="#F9FAFB"
              borderRadius={16}
              borderWidth={1}
              borderColor="#E5E7EB"
              px={4}
              py={4}
            >
              <BottomSheetTextInput
                value={weightInput}
                onChangeText={(text) => {
                  // Permite apenas números e ponto decimal
                  const filtered = text.replace(/[^0-9.]/g, '');
                  // Evita múltiplos pontos
                  const parts = filtered.split('.');
                  if (parts.length > 2) {
                    setWeightInput(parts[0] + '.' + parts.slice(1).join(''));
                  } else {
                    setWeightInput(filtered);
                  }
                }}
                placeholder="Ex: 75.5"
                keyboardType="decimal-pad"
                inputMode="decimal"
                style={{
                  flex: 1,
                  fontFamily: 'Poligon',
                  fontSize: 32,
                  fontWeight: '800',
                  textAlign: 'center',
                  color: '#111827',
                }}
                placeholderTextColor="#9CA3AF"
              />
              <Text fontFamily="Poligon" fontSize={20} fontWeight={600} color="gray.400">
                kg
              </Text>
            </HStack>
          </VStack>

          {/* Botões de ajuste +/- 1kg */}
          <HStack w="100%" justifyContent="center" mt={4} space={4}>
            <Pressable
              onPress={() => {
                const current = parseFloat(weightInput) || 0;
                if (current > 1) {
                  setWeightInput((current - 1).toFixed(1));
                }
              }}
              w={16}
              h={16}
              bg="gray.100"
              borderRadius={16}
              alignItems="center"
              justifyContent="center"
              _pressed={{ bg: 'gray.200' }}
            >
              <Text fontFamily="Poligon" fontSize={28} fontWeight={700} color="gray.600">
                -
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                const current = parseFloat(weightInput) || 0;
                setWeightInput((current + 1).toFixed(1));
              }}
              w={16}
              h={16}
              bg={editMode === 'goal' ? 'red.100' : 'ciano.100'}
              borderRadius={16}
              alignItems="center"
              justifyContent="center"
              _pressed={{ bg: editMode === 'goal' ? 'red.200' : 'ciano.200' }}
            >
              <Text fontFamily="Poligon" fontSize={28} fontWeight={700} color={editMode === 'goal' ? 'red.500' : 'ciano.400'}>
                +
              </Text>
            </Pressable>
          </HStack>

          {/* Botões de ação */}
          <HStack w="100%" mt={6} space={4}>
            <Button
              title="Cancelar"
              variant="secondary"
              size="full"
              flex={1}
              onPress={handleCloseSheet}
            />
            <Button
              title={isSaving ? "Salvando..." : "Salvar"}
              variant="primary"
              size="full"
              flex={1}
              onPress={handleSaveWeight}
              isDisabled={!weightInput || parseFloat(weightInput) <= 0 || isSaving}
              isLoading={isSaving}
              _loading={{ bg: 'ciano.300' }}
            />
          </HStack>
        </BottomSheetView>
      </BottomSheet>
    </VStack>
  );
}
