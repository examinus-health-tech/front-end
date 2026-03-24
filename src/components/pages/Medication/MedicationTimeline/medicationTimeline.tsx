import { useState, useCallback, useMemo, useEffect } from 'react';
import { TouchableOpacity, StatusBar } from 'react-native';
import { VStack, Text, Box, HStack, ScrollView, View, Progress } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CustomRefreshControl } from '@components/atoms';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { useMedication } from 'src/hooks/useMedication';
import { useAuth } from 'src/hooks/useAuth';
import { CheckCircleIcon, ChevronLeftIcon, ClockIcon, PillIcon, WarningIcon, ClockSquareIcon } from '@assets/icons';
import {
  MedicationLogDTO,
  MedicationLogStatus,
  MedicationLogRequestDTO,
} from 'src/services/medicationService';
import {
  MedicationIcon,
  getStatusColor,
  getStatusLabel,
} from '../utils/medicationUtils';
import { requestNotificationPermission } from 'src/services/medicationNotificationService';
import { format, differenceInMinutes, isPast, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function MedicationTimeline() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const {
    todayLogs,
    medications,
    dashboard,
    isLoading,
    refreshDashboard,
    registerDose,
  } = useMedication();
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [doseRegistered, setDoseRegistered] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  // Atualiza o relógio a cada minuto
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      refreshDashboard();

      if (!permissionRequested) {
        setPermissionRequested(true);
        requestNotificationPermission().catch(() => {});
      }
    }, [refreshDashboard, permissionRequested])
  );

  async function onRefresh() {
    setIsRefreshing(true);
    try {
      await refreshDashboard();
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleLogDose(log: MedicationLogDTO, status: MedicationLogStatus) {
    try {
      const request: MedicationLogRequestDTO = {
        medicationId: log.medicationId,
        scheduledTime: log.scheduledTime,
        status,
      };
      await registerDose(request);

      if (status === MedicationLogStatus.Taken) {
        setDoseRegistered(log.medicationName);
        setTimeout(() => setDoseRegistered(null), 3000);
      }
    } catch (error) {
      if (__DEV__) console.error('Erro ao registrar dose:', error);
    }
  }

  const sortedLogs = useMemo(
    () => [...todayLogs].sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime)),
    [todayLogs]
  );

  const nextPending = useMemo(
    () => sortedLogs.find(l => l.status === MedicationLogStatus.Pending),
    [sortedLogs]
  );

  // Doses esquecidas (missed) que ainda podem ser registradas
  const missedDoses = useMemo(
    () => sortedLogs.filter(l => l.status === MedicationLogStatus.Missed),
    [sortedLogs]
  );

  // Contagem de minutos até próxima dose
  const minutesUntilNext = useMemo(() => {
    if (!nextPending) return null;
    const scheduledDate = new Date(nextPending.scheduledTime);
    const diff = differenceInMinutes(scheduledDate, now);
    return diff;
  }, [nextPending, now]);

  const countdownLabel = useMemo(() => {
    if (minutesUntilNext === null) return '';
    if (minutesUntilNext <= 0) return 'agora';
    if (minutesUntilNext < 60) return `em ${minutesUntilNext} min`;
    const hours = Math.floor(minutesUntilNext / 60);
    const mins = minutesUntilNext % 60;
    if (mins === 0) return `em ${hours}h`;
    return `em ${hours}h ${mins}min`;
  }, [minutesUntilNext]);

  const hasData = medications.length > 0;
  const todayFormatted = format(now, "EEE, d 'de' MMM", { locale: ptBR });
  const currentTime = format(now, 'HH:mm');

  const adherencePercent = dashboard?.todayAdherencePercent ?? 0;
  const adherenceColor =
    adherencePercent >= 80 ? '#10B981' : adherencePercent >= 50 ? '#F59E0B' : '#EF4444';

  const totalDoses = sortedLogs.length;
  const takenCount = sortedLogs.filter(l => l.status === MedicationLogStatus.Taken).length;
  const doneCount = sortedLogs.filter(l => l.status !== MedicationLogStatus.Pending).length;

  // Saudação baseada na hora
  const greeting = useMemo(() => {
    const hour = now.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }, [now]);

  const firstName = user?.fullName?.split(' ')[0] || '';

  return (
    <View testID="screen-medication-timeline" flex={1} bg="gray.50">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<CustomRefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <VStack flex={1} pt={16} pb={36} mx={5}>
          {/* ── Header com saudação ── */}
          <Animated.View entering={FadeInDown.duration(400).delay(0)}>
            <HStack alignItems="flex-start" justifyContent="space-between" mt={2} mb={1}>
              <TouchableOpacity testID="btn-back" onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={{ marginRight: 8, marginTop: 4 }}>
                <ChevronLeftIcon size="24" color="#1E293B" />
              </TouchableOpacity>
              <VStack flex={1}>
                <HStack alignItems="center" space={2}>
                  <Text fontSize={24} fontWeight={800} letterSpacing={-0.8} color="gray.900">
                    {greeting}, {firstName}
                  </Text>
                  <Box bg="orange.100" px={2} py={0.5} borderRadius={6}>
                    <Text fontSize={12} fontWeight={700} color="orange.600">
                      BETA
                    </Text>
                  </Box>
                </HStack>
                <Text fontSize={14} fontWeight={500} color="gray.400" textTransform="capitalize" mt={0.5}>
                  {todayFormatted} · {currentTime} agora
                </Text>
              </VStack>

              {hasData && (
                <TouchableOpacity testID="btn-medication-history" onPress={() => navigation.navigate('medicationAdherence')}>
                  <HStack
                    bg="white"
                    borderRadius={12}
                    px={4}
                    py={3}
                    alignItems="center"
                    space={2}
                    shadow={1}
                    borderWidth={1}
                    borderColor="gray.100"
                  >
                    <ClockSquareIcon size="20" color="#0CC1AF" />
                    <Text fontSize={15} fontWeight={700} color="gray.700">
                      Histórico
                    </Text>
                  </HStack>
                </TouchableOpacity>
              )}
            </HStack>
          </Animated.View>

          {/* ── Progresso do dia ── */}
          {hasData && dashboard && totalDoses > 0 && (
            <Animated.View entering={FadeInDown.duration(400).delay(30)}>
              <Box bg="white" borderRadius={16} py={4} px={5} mt={4} mb={4} shadow={1}>
                <HStack justifyContent="space-between" alignItems="center" mb={2}>
                  <Text fontSize={16} fontWeight={700} color="gray.700">
                    Progresso do dia
                  </Text>
                  <Text fontSize={16} fontWeight={800} color={adherenceColor}>
                    {Math.round(adherencePercent)}%
                  </Text>
                </HStack>
                <Progress
                  value={adherencePercent}
                  colorScheme={adherencePercent >= 80 ? 'emerald' : adherencePercent >= 50 ? 'yellow' : 'red'}
                  size="md"
                  borderRadius={8}
                  bg="gray.100"
                />
                <Text fontSize={14} fontWeight={500} color="gray.500" mt={2}>
                  {takenCount} de {totalDoses} doses tomadas
                </Text>
              </Box>
            </Animated.View>
          )}

          {/* ── Alerta de dose esquecida ── */}
          {missedDoses.length > 0 && (
            <Animated.View entering={FadeInDown.duration(400).delay(45)}>
              {missedDoses.map(missed => {
                const missedTime = format(new Date(missed.scheduledTime), 'HH:mm');
                const missedDate = new Date(missed.scheduledTime);
                const isYesterday = !isToday(missedDate);

                return (
                  <Box
                    key={`missed-${missed.medicationId}-${missed.scheduledTime}`}
                    bg="orange.50"
                    borderRadius={16}
                    p={5}
                    mb={4}
                    borderWidth={1}
                    borderColor="orange.100"
                  >
                    <HStack alignItems="center" space={2} mb={2}>
                      <WarningIcon size="20" color="#F59E0B" />
                      <Text fontSize={16} fontWeight={700} color="orange.700">
                        Você esqueceu a dose das {missedTime}
                      </Text>
                    </HStack>
                    <Text fontSize={15} fontWeight={600} color="gray.700" mb={0.5}>
                      {missed.medicationName} {isYesterday ? '(ontem, ' + missedTime + ')' : ''}
                    </Text>
                    <Text fontSize={14} fontWeight={500} color="gray.500" mb={3}>
                      {missed.medicationDosage}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleLogDose(missed, MedicationLogStatus.Taken)}
                    >
                      <Box bg="#0CC1AF" py={3.5} borderRadius={12} alignItems="center">
                        <HStack alignItems="center" space={2}>
                          <CheckCircleIcon size="18" color="#FFFFFF" />
                          <Text fontSize={16} fontWeight={700} color="white">
                            Registrar dose
                          </Text>
                        </HStack>
                      </Box>
                    </TouchableOpacity>
                  </Box>
                );
              })}
            </Animated.View>
          )}

          {/* ── Empty state ── */}
          {!hasData && !isLoading && (
            <Animated.View entering={FadeInDown.duration(400).delay(100)}>
              <Box bg="white" borderRadius={16} p={8} mt={8} shadow={2} alignItems="center">
                <Box mb={5}>
                  <PillIcon size="56" color="#0CC1AF" />
                </Box>
                <Text fontSize={20} fontWeight={700} color="gray.800" textAlign="center">
                  Nenhum medicamento cadastrado
                </Text>
                <Text fontSize={16} fontWeight={400} color="gray.500" textAlign="center" mt={3} lineHeight={22}>
                  Adicione seus medicamentos para receber lembretes e acompanhar sua adesão.
                </Text>
                <TouchableOpacity testID="btn-add-medication" onPress={() => navigation.navigate('medicationForm')}>
                  <Box bg="ciano.400" px={8} py={4} borderRadius={14} mt={8}>
                    <Text fontSize={16} fontWeight={700} color="white">
                      Adicionar medicamento
                    </Text>
                  </Box>
                </TouchableOpacity>
              </Box>
            </Animated.View>
          )}

          {hasData && (
            <>
              {/* ===== Próxima dose (hero card) / Feedback dose registrada ===== */}
              <Animated.View entering={FadeInDown.duration(400).delay(60)}>
                {doseRegistered ? (
                  <Box bg="white" borderRadius={20} p={6} shadow={3} alignItems="center">
                    <Box mb={3}>
                      <CheckCircleIcon size="48" color="#10B981" />
                    </Box>
                    <Text fontSize={20} fontWeight={800} color="gray.900">
                      Dose registrada
                    </Text>
                    <Text fontSize={15} fontWeight={500} color="gray.500" mt={1}>
                      Você está indo muito bem
                    </Text>
                    {totalDoses > 0 && (
                      <Box w="100%" mt={4}>
                        <HStack justifyContent="space-between" alignItems="center" mb={2}>
                          <Text fontSize={15} fontWeight={600} color="gray.600">
                            Progresso do dia
                          </Text>
                          <Text fontSize={16} fontWeight={800} color={adherenceColor}>
                            {Math.round(adherencePercent)}%
                          </Text>
                        </HStack>
                        <Progress
                          value={adherencePercent}
                          colorScheme={adherencePercent >= 80 ? 'emerald' : adherencePercent >= 50 ? 'yellow' : 'red'}
                          size="md"
                          borderRadius={8}
                          bg="gray.100"
                        />
                        <Text fontSize={14} fontWeight={500} color="gray.400" mt={2}>
                          {takenCount} de {totalDoses} doses tomadas
                        </Text>
                      </Box>
                    )}
                  </Box>
                ) : nextPending ? (
                  <Box bg="white" borderRadius={20} p={6} shadow={3}>
                    <Text fontSize={14} fontWeight={700} color="gray.400" mb={4} letterSpacing={1.5}>
                      PRÓXIMA DOSE
                    </Text>

                    <HStack alignItems="center" mb={2}>
                      <Box
                        bg="ciano.50"
                        w={16}
                        h={16}
                        borderRadius={16}
                        alignItems="center"
                        justifyContent="center"
                        mr={4}
                      >
                        <MedicationIcon form={nextPending.medicationForm} size="32" />
                      </Box>
                      <VStack flex={1}>
                        <Text fontSize={22} fontWeight={800} color="gray.900" lineHeight={28}>
                          {nextPending.medicationName}
                        </Text>
                        <HStack alignItems="center" space={1} mt={0.5}>
                          <Text fontSize={16} fontWeight={600} color="gray.500">
                            {format(new Date(nextPending.scheduledTime), 'HH:mm')}
                          </Text>
                          {countdownLabel && (
                            <Text fontSize={14} fontWeight={700} color="orange.500">
                              ({countdownLabel})
                            </Text>
                          )}
                        </HStack>
                      </VStack>
                    </HStack>

                    <HStack space={3} mt={4}>
                      <TouchableOpacity
                        testID="btn-dose-taken"
                        style={{ flex: 1 }}
                        onPress={() => handleLogDose(nextPending, MedicationLogStatus.Taken)}
                      >
                        <Box bg="#0CC1AF" py={4} borderRadius={14} alignItems="center" shadow={2}>
                          <HStack alignItems="center" space={2}>
                            <CheckCircleIcon size="20" color="#FFFFFF" />
                            <Text fontSize={17} fontWeight={800} color="white">
                              Tomei
                            </Text>
                          </HStack>
                        </Box>
                      </TouchableOpacity>
                      <TouchableOpacity
                        testID="btn-dose-skip"
                        style={{ flex: 0.5 }}
                        onPress={() => handleLogDose(nextPending, MedicationLogStatus.Skipped)}
                      >
                        <Box
                          py={4}
                          borderRadius={14}
                          alignItems="center"
                          borderWidth={1.5}
                          borderColor="gray.200"
                        >
                          <Text fontSize={15} fontWeight={700} color="gray.400">
                            Pular
                          </Text>
                        </Box>
                      </TouchableOpacity>
                    </HStack>
                  </Box>
                ) : (
                  <Box bg="white" borderRadius={20} p={8} shadow={3} alignItems="center">
                    <Box mb={3}>
                      <CheckCircleIcon size="56" color="#10B981" />
                    </Box>
                    <Text fontSize={22} fontWeight={800} color="gray.800">
                      Tudo em dia!
                    </Text>
                    <Text fontSize={15} fontWeight={500} color="gray.500" mt={2} textAlign="center">
                      Nenhuma dose pendente para hoje
                    </Text>
                  </Box>
                )}
              </Animated.View>

              {/* ===== Checklist do dia ===== */}
              <Animated.View entering={FadeInDown.duration(400).delay(180)}>
                <Text fontSize={17} fontWeight={800} color="gray.700" mt={5} mb={3}>
                  Checklist do dia
                </Text>
                {sortedLogs.map(log => {
                  const time = format(new Date(log.scheduledTime), 'HH:mm');
                  const isPending = log.status === MedicationLogStatus.Pending;
                  const isTaken = log.status === MedicationLogStatus.Taken;
                  const isSkipped = log.status === MedicationLogStatus.Skipped;
                  const isMissed = log.status === MedicationLogStatus.Missed;
                  const statusColor = getStatusColor(log.status);

                  // Countdown para doses pendentes
                  const scheduledDate = new Date(log.scheduledTime);
                  const minDiff = differenceInMinutes(scheduledDate, now);
                  const showCountdown = isPending && minDiff > 0 && minDiff <= 60;

                  return (
                    <TouchableOpacity
                      key={`list-${log.medicationId}-${log.scheduledTime}`}
                      onPress={() =>
                        navigation.navigate('medicationDetail', { medicationId: log.medicationId })
                      }
                      activeOpacity={0.7}
                    >
                      <HStack
                        bg="white"
                        borderRadius={16}
                        py={3.5}
                        px={4}
                        mb={2.5}
                        alignItems="center"
                        shadow={1}
                      >
                        {/* Status icon */}
                        <Box w={8} h={8} alignItems="center" justifyContent="center" mr={3}>
                          {isTaken && <CheckCircleIcon size="24" color="#10B981" />}
                          {isSkipped && <ClockIcon size="24" color="#F59E0B" />}
                          {isMissed && <WarningIcon size="24" color="#EF4444" />}
                          {isPending && (
                            <Box
                              w={6}
                              h={6}
                              borderRadius={12}
                              borderWidth={2}
                              borderColor="gray.300"
                            />
                          )}
                        </Box>

                        {/* Nome do medicamento */}
                        <Text
                          flex={1}
                          fontSize={16}
                          fontWeight={700}
                          color={isTaken ? 'gray.400' : 'gray.800'}
                          numberOfLines={1}
                          strikeThrough={isTaken}
                        >
                          {log.medicationName}
                        </Text>

                        {/* Countdown ou horário */}
                        <HStack alignItems="center" space={1}>
                          {showCountdown && (
                            <Text fontSize={14} fontWeight={700} color="orange.500">
                              (em {minDiff} min)
                            </Text>
                          )}
                          <Text
                            fontSize={15}
                            fontWeight={700}
                            color={isMissed ? '#EF4444' : isTaken ? 'gray.400' : 'gray.700'}
                          >
                            {time}
                          </Text>
                        </HStack>
                      </HStack>
                    </TouchableOpacity>
                  );
                })}
              </Animated.View>

              {/* ===== Botão Adicionar medicamento ===== */}
              <Animated.View entering={FadeInDown.duration(400).delay(220)}>
                <TouchableOpacity testID="btn-add-medication" onPress={() => navigation.navigate('medicationForm')}>
                  <Box
                    bg="ciano.400"
                    borderRadius={14}
                    py={4}
                    mt={5}
                    alignItems="center"
                    shadow={2}
                  >
                    <HStack alignItems="center" space={2}>
                      <PillIcon size="20" color="#FFFFFF" />
                      <Text fontSize={16} fontWeight={700} color="white">
                        Adicionar medicamento
                      </Text>
                    </HStack>
                  </Box>
                </TouchableOpacity>
              </Animated.View>
            </>
          )}
        </VStack>
      </ScrollView>
    </View>
  );
}
