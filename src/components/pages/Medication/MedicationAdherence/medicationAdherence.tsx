import { useState, useCallback } from 'react';
import { TouchableOpacity, StatusBar } from 'react-native';
import { VStack, Text, Box, HStack, ScrollView, View } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { useMedication } from 'src/hooks/useMedication';
import { ChevronLeftIcon, WarningIcon } from '@assets/icons';
import { MedicationIcon } from '../utils/medicationUtils';
import { format, getDaysInMonth, startOfMonth, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const WEEKDAY_HEADERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function getColorForPercent(percent: number): string {
  if (percent >= 80) return '#10B981';
  if (percent >= 50) return '#F59E0B';
  if (percent > 0) return '#EF4444';
  return '#E5E7EB';
}

function getBgForPercent(percent: number): string {
  if (percent >= 80) return '#ECFDF5';
  if (percent >= 50) return '#FFFBEB';
  if (percent > 0) return '#FEF2F2';
  return '#F9FAFB';
}

function getAdherenceMessage(percent: number): { label: string; description: string } {
  if (percent >= 80) return {
    label: 'Excelente',
    description: 'Você tomou seus medicamentos na maioria dos dias este mês',
  };
  if (percent >= 50) return {
    label: 'Bom',
    description: 'Você está no caminho certo, continue assim!',
  };
  if (percent > 0) return {
    label: 'Precisa melhorar',
    description: 'Tente não esquecer suas doses para cuidar melhor da sua saúde',
  };
  return {
    label: 'Sem dados',
    description: 'Registre suas doses para acompanhar sua adesão',
  };
}

export function MedicationAdherence() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { adherence, loadAdherence, medications } = useMedication();

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      setIsLoading(true);
      loadAdherence(selectedMonth, selectedYear).finally(() => setIsLoading(false));
    }, [selectedMonth, selectedYear, loadAdherence])
  );

  function prevMonth() {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(y => y - 1);
    } else {
      setSelectedMonth(m => m - 1);
    }
  }

  function nextMonth() {
    const now = new Date();
    if (selectedYear === now.getFullYear() && selectedMonth === now.getMonth() + 1) return;

    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(y => y + 1);
    } else {
      setSelectedMonth(m => m + 1);
    }
  }

  const daysInMonth = getDaysInMonth(new Date(selectedYear, selectedMonth - 1));
  const firstDay = getDay(startOfMonth(new Date(selectedYear, selectedMonth - 1)));
  const monthLabel = format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy', { locale: ptBR });
  const isCurrentMonth = selectedYear === today.getFullYear() && selectedMonth === today.getMonth() + 1;

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  const dailyData = adherence?.dailyAdherence || {};
  const monthlyAvg = adherence?.monthlyAverage || 0;
  const adherenceMsg = getAdherenceMessage(monthlyAvg);

  // Ordenar medicamentos por adesão (melhor primeiro)
  const sortedMedications = [...(adherence?.byMedication || [])].sort(
    (a, b) => b.adherencePercent - a.adherencePercent
  );

  // Encontrar o form de cada medicamento para mostrar o ícone
  const getMedicationForm = (medId: string) => {
    const med = medications.find(m => m.id === medId);
    return med?.form;
  };

  return (
    <View testID="screen-medication-adherence" flex={1} bg="gray.50">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header fixo */}
      <Box bg="gray.50" pt={16} pb={3} mx={5} zIndex={1}>
        <HStack alignItems="center" mt={2}>
          <TouchableOpacity testID="btn-back" onPress={() => navigation.goBack()}>
            <Box w={10} h={10} alignItems="center" justifyContent="center">
              <ChevronLeftIcon size="24" color="#1E293B" />
            </Box>
          </TouchableOpacity>
          <VStack flex={1} ml={2}>
            <Text fontSize={24} fontWeight={800} letterSpacing={-0.8} color="gray.900">
              Seu histórico
            </Text>
            <Text fontSize={14} fontWeight={500} color="gray.400" mt={0.5}>
              Veja como você tem cuidado da sua saúde
            </Text>
          </VStack>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack flex={1} pb={32} mx={5}>

          {/* Adesão média */}
          <Animated.View entering={FadeInDown.duration(400).delay(50)}>
            <Box bg="white" borderRadius={20} p={6} shadow={2} mt={4} mb={5}>
              {isLoading ? (
                <VStack space={3}>
                  <Box bg="gray.100" borderRadius={8} h={4} w="40%" />
                  <Box bg="gray.100" borderRadius={8} h={12} w="30%" />
                  <Box bg="gray.100" borderRadius={8} h={4} w="50%" />
                  <Box bg="gray.100" borderRadius={8} h={3} w="100%" mt={2} />
                </VStack>
              ) : (
                <>
                  <Text fontSize={15} fontWeight={600} color="gray.500" mb={1}>
                    Adesão média
                  </Text>
                  <Text
                    fontSize={48}
                    fontWeight={800}
                    color={getColorForPercent(monthlyAvg)}
                    lineHeight={52}
                  >
                    {Math.round(monthlyAvg)}%
                  </Text>
                  <Text fontSize={18} fontWeight={700} color={getColorForPercent(monthlyAvg)} mt={1}>
                    {adherenceMsg.label}
                  </Text>
                  <Text fontSize={14} fontWeight={400} color="gray.500" mt={1} lineHeight={20}>
                    {adherenceMsg.description}
                  </Text>
                  <Box bg="gray.100" borderRadius={8} h={3} overflow="hidden" mt={4}>
                    <Box bg={getColorForPercent(monthlyAvg)} h="100%" borderRadius={8} w={`${monthlyAvg}%`} />
                  </Box>
                </>
              )}
            </Box>
          </Animated.View>

          {/* Calendário */}
          <Animated.View entering={FadeInDown.duration(400).delay(100)}>
            <Box bg="white" borderRadius={20} p={5} shadow={2} mb={5}>
              {/* Navegação do mês */}
              <HStack justifyContent="space-between" alignItems="center" mb={5}>
                <TouchableOpacity onPress={prevMonth}>
                  <Box
                    w={12}
                    h={12}
                    borderRadius={12}
                    bg="ciano.50"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={22} fontWeight={800} color="ciano.600">{'‹'}</Text>
                  </Box>
                </TouchableOpacity>
                <Text fontSize={18} fontWeight={700} color="gray.800" textTransform="capitalize">
                  {monthLabel}
                </Text>
                <TouchableOpacity onPress={nextMonth} disabled={isCurrentMonth}>
                  <Box
                    w={12}
                    h={12}
                    borderRadius={12}
                    bg={isCurrentMonth ? 'gray.50' : 'ciano.50'}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={22} fontWeight={800} color={isCurrentMonth ? 'gray.300' : 'ciano.600'}>{'›'}</Text>
                  </Box>
                </TouchableOpacity>
              </HStack>

              {/* Cabeçalho dias da semana */}
              <HStack mb={3}>
                {WEEKDAY_HEADERS.map((day, i) => (
                  <Box key={i} flex={1} alignItems="center">
                    <Text fontSize={14} fontWeight={700} color="gray.400">
                      {day}
                    </Text>
                  </Box>
                ))}
              </HStack>

              {/* Grid do calendário */}
              <HStack flexWrap="wrap" opacity={isLoading ? 0.4 : 1}>
                {calendarCells.map((day, index) => {
                  if (day === null) {
                    return <Box key={`empty-${index}`} w="14.28%" h={12} />;
                  }

                  const dateKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const percent = dailyData[dateKey];
                  const hasData = percent !== undefined;
                  const isToday =
                    day === today.getDate() &&
                    selectedMonth === today.getMonth() + 1 &&
                    selectedYear === today.getFullYear();

                  return (
                    <Box key={day} w="14.28%" h={12} alignItems="center" justifyContent="center">
                      <Box
                        w={10}
                        h={10}
                        borderRadius={10}
                        bg={hasData ? getBgForPercent(percent) : 'transparent'}
                        borderWidth={isToday ? 2.5 : 0}
                        borderColor={isToday ? 'ciano.400' : 'transparent'}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text
                          fontSize={15}
                          fontWeight={hasData ? 700 : 500}
                          color={hasData ? getColorForPercent(percent) : 'gray.400'}
                        >
                          {day}
                        </Text>
                      </Box>
                    </Box>
                  );
                })}
              </HStack>

              {/* Legenda com descrições */}
              <VStack mt={5} py={3} px={3} bg="gray.50" borderRadius={12} space={2}>
                <HStack alignItems="center" space={2}>
                  <Box w={4} h={4} borderRadius={8} bg="#10B981" />
                  <Text fontSize={14} fontWeight={600} color="gray.700">
                    Dias perfeitos
                  </Text>
                </HStack>
                <HStack alignItems="center" space={2}>
                  <Box w={4} h={4} borderRadius={8} bg="#F59E0B" />
                  <Text fontSize={14} fontWeight={600} color="gray.700">
                    Algumas doses esquecidas
                  </Text>
                </HStack>
                <HStack alignItems="center" space={2}>
                  <Box w={4} h={4} borderRadius={8} bg="#EF4444" />
                  <Text fontSize={14} fontWeight={600} color="gray.700">
                    Muitas doses esquecidas
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </Animated.View>

          {/* Melhor adesão por medicamento */}
          {sortedMedications.length > 0 && (
            <Animated.View entering={FadeInDown.duration(400).delay(150)}>
              <Text fontSize={18} fontWeight={800} color="gray.800" mb={4}>
                Melhor adesão
              </Text>
              {sortedMedications.map((med) => {
                const missedDoses = med.totalDoses - med.takenDoses;
                const medForm = getMedicationForm(med.medicationId);
                const medColor = getColorForPercent(med.adherencePercent);

                return (
                  <Box key={med.medicationId} bg="white" borderRadius={16} p={5} mb={3} shadow={1}>
                    <HStack alignItems="center" mb={3}>
                      {/* Ícone do medicamento */}
                      <Box
                        bg={getBgForPercent(med.adherencePercent)}
                        w={12}
                        h={12}
                        borderRadius={12}
                        alignItems="center"
                        justifyContent="center"
                        mr={3}
                      >
                        {medForm !== undefined ? (
                          <MedicationIcon form={medForm} size="24" color={medColor} />
                        ) : (
                          <Box w={6} h={6} borderRadius={12} bg={medColor + '30'} />
                        )}
                      </Box>

                      <VStack flex={1}>
                        <Text fontSize={17} fontWeight={700} color="gray.800">
                          {med.medicationName}
                        </Text>
                        <Text fontSize={14} fontWeight={500} color="gray.400">
                          Adesão
                        </Text>
                      </VStack>

                      <Text fontSize={20} fontWeight={800} color={medColor}>
                        {Math.round(med.adherencePercent)}%
                      </Text>
                    </HStack>

                    <Box bg="gray.100" borderRadius={8} h={3} overflow="hidden">
                      <Box bg={medColor} h="100%" borderRadius={8} w={`${med.adherencePercent}%`} />
                    </Box>

                    <HStack justifyContent="space-between" alignItems="center" mt={2}>
                      <Text fontSize={14} fontWeight={500} color="gray.400">
                        {med.takenDoses} de {med.totalDoses} doses tomadas
                      </Text>
                      {missedDoses > 0 && (
                        <HStack alignItems="center" space={1}>
                          <WarningIcon size="16" color="#F59E0B" />
                          <Text fontSize={14} fontWeight={600} color="orange.500">
                            {missedDoses} esquecidas
                          </Text>
                        </HStack>
                      )}
                    </HStack>
                  </Box>
                );
              })}
            </Animated.View>
          )}
        </VStack>
      </ScrollView>
    </View>
  );
}
