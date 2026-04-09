import { useCallback, useState } from 'react';
import { TouchableOpacity, StatusBar, Modal, Pressable } from 'react-native';
import { VStack, Text, Box, HStack, ScrollView, View } from 'native-base';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppNavigatorRoutesProps, AppRoutes } from '@routes/app.routes';
import { useMedication } from 'src/hooks/useMedication';
import { ChevronLeftIcon, ClockIcon, CheckCircleIcon } from '@assets/icons';
import {
  MedicationFormLabels,
  MedicationFrequencyType,
  MedicationLogStatus,
} from 'src/services/medicationService';
import { MedicationIcon, getStatusColor, getStatusLabel } from '../utils/medicationUtils';
import { format } from 'date-fns';

const WEEKDAYS_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

function generateIntervalTimes(firstTime: string, intervalHours: number): string[] {
  const [h, m] = firstTime.split(':').map(Number);
  const times: string[] = [];
  let totalMin = h * 60 + m;
  while (totalMin < 24 * 60) {
    const hh = Math.floor(totalMin / 60).toString().padStart(2, '0');
    const mm = (totalMin % 60).toString().padStart(2, '0');
    times.push(`${hh}:${mm}`);
    totalMin += intervalHours * 60;
  }
  return times;
}

export function MedicationDetail() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute<RouteProp<AppRoutes, 'medicationDetail'>>();
  const { medications, todayLogs, removeMedication, refreshDashboard, registerDose } = useMedication();

  const medicationId = route.params?.medicationId;
  const medication = medications.find(m => m.id === medicationId);

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [deactivateError, setDeactivateError] = useState(false);
  const [editingLog, setEditingLog] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
    }, [])
  );

  if (!medication) {
    return (
      <View flex={1} bg="gray.50" alignItems="center" justifyContent="center">
        <Text fontSize={16} color="gray.500">Medicamento não encontrado</Text>
      </View>
    );
  }

  const recentLogs = todayLogs.filter(l => l.medicationId === medication.id);

  async function handleChangeStatus(log: typeof recentLogs[0], newStatus: MedicationLogStatus) {
    try {
      await registerDose({
        medicationId: log.medicationId,
        scheduledTime: log.scheduledTime,
        status: newStatus,
      });
      setEditingLog(null);
    } catch (error) {
      if (__DEV__) console.error('Erro ao alterar status:', error);
    }
  }

  async function handleConfirmDeactivate() {
    setIsDeactivating(true);
    setDeactivateError(false);
    const success = await removeMedication(medication!.id);
    setIsDeactivating(false);
    if (success) {
      setShowDeactivateModal(false);
      navigation.goBack();
    } else {
      setDeactivateError(true);
    }
  }

  return (
    <View testID="screen-medication-detail" flex={1} bg="gray.50">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header fixo */}
      <Box bg="gray.50" pt={16} pb={3} mx={6} zIndex={1}>
        <HStack alignItems="center" mt={2}>
          <TouchableOpacity testID="btn-back" onPress={() => navigation.goBack()}>
            <Box w={10} h={10} alignItems="center" justifyContent="center">
              <ChevronLeftIcon size="24" color="#1E293B" />
            </Box>
          </TouchableOpacity>
          <Text fontSize={24} fontWeight={800} letterSpacing={-0.8} color="gray.900" ml={2} flex={1}>
            Detalhes
          </Text>
        </HStack>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack flex={1} pb={32} mx={6}>

          {/* Hero card */}
          <Animated.View entering={FadeInDown.duration(400).delay(50)}>
            <Box bg="white" borderRadius={16} p={4} shadow={2}>
              <HStack alignItems="center" space={3}>
                <Box bg="ciano.50" w={14} h={14} borderRadius={14} alignItems="center" justifyContent="center">
                  <MedicationIcon form={medication.form} size="28" />
                </Box>
                <VStack flex={1}>
                  <Text fontSize={20} fontWeight={800} color="gray.900">
                    {medication.name}
                  </Text>
                  <Text fontSize={14} fontWeight={500} color="gray.500" mt={0.5}>
                    {medication.dosage} · {MedicationFormLabels[medication.form]}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </Animated.View>

          {/* Info cards */}
          <Animated.View entering={FadeInDown.duration(400).delay(100)}>
            {/* Frequência + Horários (unificado) */}
            <Box bg="white" borderRadius={16} p={4} mt={3} shadow={1}>
              <HStack alignItems="center" space={3} mb={3}>
                <Box bg="emerald.50" w={10} h={10} borderRadius={10} alignItems="center" justifyContent="center">
                  <ClockIcon size="20" color="#10B981" />
                </Box>
                <VStack flex={1}>
                  <Text fontSize={12} fontWeight={600} color="gray.400" letterSpacing={0.5}>
                    FREQUÊNCIA
                  </Text>
                  <Text fontSize={15} fontWeight={700} color="gray.800" mt={0.5}>
                    {medication.frequencyType === MedicationFrequencyType.Daily
                      ? 'Todos os dias'
                      : medication.frequencyType === MedicationFrequencyType.IntervalHours
                        ? `A cada ${medication.intervalHours}h por ${medication.durationDays} dias`
                        : medication.frequencyDays?.map(d => WEEKDAYS_FULL[d]).join(', ') || '-'}
                  </Text>
                </VStack>
              </HStack>
              <HStack flexWrap="wrap" space={2}>
                {(medication.frequencyType === MedicationFrequencyType.IntervalHours && medication.intervalHours
                  ? generateIntervalTimes(medication.scheduleTimes[0], medication.intervalHours)
                  : medication.scheduleTimes
                ).map((time, i) => (
                  <Box key={i} bg="ciano.50" px={3} py={1.5} borderRadius={8} mb={1}>
                    <Text fontSize={16} fontWeight={700} color="ciano.600">
                      {time}
                    </Text>
                  </Box>
                ))}
              </HStack>
            </Box>

            {/* Instruções */}
            {medication.instructions && (
              <Box bg="white" borderRadius={16} p={4} mt={3} shadow={1}>
                <Text fontSize={12} fontWeight={600} color="gray.400" letterSpacing={0.5} mb={1}>
                  INSTRUÇÕES
                </Text>
                <Text fontSize={15} fontWeight={500} color="gray.700" lineHeight={22}>
                  {medication.instructions}
                </Text>
              </Box>
            )}
          </Animated.View>

          {/* Doses de hoje */}
          {recentLogs.length > 0 && (
            <Animated.View entering={FadeInDown.duration(400).delay(150)}>
              <Text fontSize={16} fontWeight={800} color="gray.800" mt={5} mb={3}>
                Doses de hoje
              </Text>
              {recentLogs.map((log, i) => {
                const isTaken = log.status === MedicationLogStatus.Taken;
                const statusColor = getStatusColor(log.status);
                return (
                  <TouchableOpacity key={i} onPress={() => setEditingLog(log)} activeOpacity={0.7}>
                    <Box bg="white" borderRadius={14} px={4} py={3.5} mb={2} shadow={1}>
                      <HStack alignItems="center" space={3}>
                        <Box w={8} h={8} alignItems="center" justifyContent="center">
                          {isTaken ? (
                            <CheckCircleIcon size="24" color="#10B981" />
                          ) : (
                            <Box w="22px" h="22px" borderRadius={11} borderWidth={2} borderColor="gray.300" />
                          )}
                        </Box>
                        <Text fontSize={16} fontWeight={700} color={isTaken ? 'gray.400' : 'gray.800'} flex={1} strikeThrough={isTaken}>
                          {format(new Date(log.scheduledTime), 'HH:mm')}
                        </Text>
                        <Box px={3} py={1} borderRadius={8} bg={statusColor + '18'}>
                          <Text fontSize={13} fontWeight={700} color={statusColor}>
                            {getStatusLabel(log.status)}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  </TouchableOpacity>
                );
              })}
            </Animated.View>
          )}

          {/* Action buttons */}
          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <HStack space={3} mt={6}>
              <TouchableOpacity
                testID="btn-edit-medication"
                style={{ flex: 1 }}
                onPress={() => navigation.navigate('medicationForm', { medicationId: medication.id })}
              >
                <Box bg="ciano.400" py={3.5} borderRadius={14} alignItems="center">
                  <Text fontSize={14} fontWeight={700} color="white">
                    Editar
                  </Text>
                </Box>
              </TouchableOpacity>

              <TouchableOpacity testID="btn-deactivate-medication" style={{ flex: 1 }} onPress={() => setShowDeactivateModal(true)}>
                <Box bg="red.50" py={3.5} borderRadius={14} alignItems="center" borderWidth={1} borderColor="red.200">
                  <Text fontSize={14} fontWeight={700} color="red.500">
                    Desativar
                  </Text>
                </Box>
              </TouchableOpacity>
            </HStack>
          </Animated.View>
        </VStack>
      </ScrollView>

      {/* Modal de alteração de status */}
      <Modal transparent animationType="fade" visible={!!editingLog} onRequestClose={() => setEditingLog(null)}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
          onPress={() => setEditingLog(null)}
        >
          <Pressable onPress={e => e.stopPropagation()}>
            <Box bg="white" borderTopLeftRadius={20} borderTopRightRadius={20} px={6} pt={5} pb={10}>
              <Text fontSize={18} fontWeight={800} color="gray.900" textAlign="center" mb={1}>
                Alterar status
              </Text>
              {editingLog && (
                <Text fontSize={14} fontWeight={500} color="gray.500" textAlign="center" mb={4}>
                  {medication.name} · {format(new Date(editingLog.scheduledTime), 'HH:mm')}
                </Text>
              )}
              <VStack space={2}>
                {([
                  { status: MedicationLogStatus.Taken, label: 'Tomei', color: '#10B981', bg: 'emerald.50' },
                  { status: MedicationLogStatus.Skipped, label: 'Pulei', color: '#F59E0B', bg: 'orange.50' },
                  { status: MedicationLogStatus.Pending, label: 'Pendente', color: '#9CA3AF', bg: 'gray.50' },
                ] as const).map(({ status, label, color, bg }) => {
                  const isActive = editingLog?.status === status;
                  return (
                    <TouchableOpacity key={status} onPress={() => editingLog && handleChangeStatus(editingLog, status)}>
                      <HStack
                        bg={isActive ? bg : 'white'}
                        borderRadius={14}
                        py={4}
                        px={4}
                        alignItems="center"
                        borderWidth={isActive ? 2 : 1}
                        borderColor={isActive ? color : 'gray.200'}
                      >
                        <Box w={6} h={6} borderRadius={12} bg={color} alignItems="center" justifyContent="center" mr={3}>
                          {isActive && <Text fontSize={12} color="white" fontWeight={800}>✓</Text>}
                        </Box>
                        <Text fontSize={16} fontWeight={700} color={isActive ? color : 'gray.700'} flex={1}>
                          {label}
                        </Text>
                        {isActive && (
                          <Text fontSize={12} fontWeight={600} color="gray.400">Atual</Text>
                        )}
                      </HStack>
                    </TouchableOpacity>
                  );
                })}
              </VStack>
            </Box>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal de confirmação de desativação */}
      <Modal transparent animationType="fade" visible={showDeactivateModal} onRequestClose={() => setShowDeactivateModal(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}
          onPress={() => !isDeactivating && setShowDeactivateModal(false)}
        >
          <Pressable onPress={e => e.stopPropagation()}>
            <Box bg="white" borderRadius={20} p={6} w="100%" shadow={5}>
              <Text fontSize={20} fontWeight={800} color="gray.900" textAlign="center">
                Desativar medicamento
              </Text>
              <Text fontSize={15} fontWeight={500} color="gray.500" textAlign="center" mt={2} lineHeight={22}>
                Deseja realmente desativar {medication.name}? Você poderá reativá-lo depois.
              </Text>
              {deactivateError && (
                <Text fontSize={13} fontWeight={500} color="red.500" textAlign="center" mt={2}>
                  Não foi possível desativar. Tente novamente.
                </Text>
              )}
              <HStack space={3} mt={5}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowDeactivateModal(false)} disabled={isDeactivating}>
                  <Box py={3.5} borderRadius={14} alignItems="center" borderWidth={1.5} borderColor="gray.200">
                    <Text fontSize={15} fontWeight={700} color="gray.500">
                      Cancelar
                    </Text>
                  </Box>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} onPress={handleConfirmDeactivate} disabled={isDeactivating}>
                  <Box bg={isDeactivating ? 'gray.400' : 'red.500'} py={3.5} borderRadius={14} alignItems="center">
                    <Text fontSize={15} fontWeight={700} color="white">
                      {isDeactivating ? 'Desativando...' : 'Desativar'}
                    </Text>
                  </Box>
                </TouchableOpacity>
              </HStack>
            </Box>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
