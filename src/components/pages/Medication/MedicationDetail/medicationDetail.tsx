import { useCallback } from 'react';
import { TouchableOpacity, StatusBar, Alert } from 'react-native';
import { VStack, Text, Box, HStack, ScrollView, View } from 'native-base';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppNavigatorRoutesProps, AppRoutes } from '@routes/app.routes';
import { useMedication } from 'src/hooks/useMedication';
import { ChevronLeftIcon } from '@assets/icons';
import {
  MedicationFormLabels,
  MedicationFrequencyType,
  MedicationLogStatus,
} from 'src/services/medicationService';
import { MedicationIcon, getStatusColor, getStatusLabel } from '../utils/medicationUtils';
import { format } from 'date-fns';

const WEEKDAYS_FULL = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];

export function MedicationDetail() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute<RouteProp<AppRoutes, 'medicationDetail'>>();
  const { medications, todayLogs, removeMedication, refreshDashboard } = useMedication();

  const medicationId = route.params?.medicationId;
  const medication = medications.find(m => m.id === medicationId);

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

  async function handleDeactivate() {
    Alert.alert(
      'Desativar medicamento',
      `Deseja realmente desativar ${medication!.name}? Você poderá reativá-lo depois.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desativar',
          style: 'destructive',
          onPress: async () => {
            const success = await removeMedication(medication!.id);
            if (success) {
              navigation.goBack();
            } else {
              Alert.alert('Erro', 'Não foi possível desativar o medicamento.');
            }
          },
        },
      ]
    );
  }

  return (
    <View testID="screen-medication-detail" flex={1} bg="gray.50">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack flex={1} pt={16} pb={32} mx={6}>
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(400).delay(0)}>
            <HStack alignItems="center" mt={2} mb={6}>
              <TouchableOpacity testID="btn-back" onPress={() => navigation.goBack()}>
                <Box w={10} h={10} alignItems="center" justifyContent="center">
                  <ChevronLeftIcon size="24" color="#1E293B" />
                </Box>
              </TouchableOpacity>
              <Text fontSize={24} fontWeight={800} letterSpacing={-0.8} color="gray.900" ml={2} flex={1}>
                Detalhes
              </Text>
            </HStack>
          </Animated.View>

          {/* Main card */}
          <Animated.View entering={FadeInDown.duration(400).delay(50)}>
            <Box bg="white" borderRadius={16} p={5} shadow={2}>
              <HStack alignItems="center" mb={4}>
                <Box bg="ciano.50" w={14} h={14} borderRadius={14} alignItems="center" justifyContent="center" mr={3}>
                  <MedicationIcon form={medication.form} size="28" />
                </Box>
                <VStack flex={1}>
                  <Text fontSize={20} fontWeight={800} color="gray.900">
                    {medication.name}
                  </Text>
                  <Text fontSize={14} fontWeight={500} color="gray.500">
                    {medication.dosage} - {MedicationFormLabels[medication.form]}
                  </Text>
                </VStack>
              </HStack>

              {/* Frequency */}
              <Box bg="gray.50" borderRadius={12} p={3} mb={3}>
                <Text fontSize={14} fontWeight={600} color="gray.400" mb={1}>
                  FREQUÊNCIA
                </Text>
                <Text fontSize={14} fontWeight={600} color="gray.700">
                  {medication.frequencyType === MedicationFrequencyType.Daily
                    ? 'Todos os dias'
                    : medication.frequencyDays?.map(d => WEEKDAYS_FULL[d]).join(', ') || '-'}
                </Text>
              </Box>

              {/* Schedule times */}
              <Box bg="gray.50" borderRadius={12} p={3} mb={3}>
                <Text fontSize={14} fontWeight={600} color="gray.400" mb={1}>
                  HORÁRIOS
                </Text>
                <HStack flexWrap="wrap" space={2}>
                  {medication.scheduleTimes.map((time, i) => (
                    <Box key={i} bg="ciano.50" px={3} py={1.5} borderRadius={8} mb={1}>
                      <Text fontSize={16} fontWeight={700} color="ciano.600">
                        {time}
                      </Text>
                    </Box>
                  ))}
                </HStack>
              </Box>

              {/* Instructions */}
              {medication.instructions && (
                <Box bg="gray.50" borderRadius={12} p={3} mb={3}>
                  <Text fontSize={14} fontWeight={600} color="gray.400" mb={1}>
                    INSTRUÇÕES
                  </Text>
                  <Text fontSize={14} fontWeight={500} color="gray.700">
                    {medication.instructions}
                  </Text>
                </Box>
              )}
            </Box>
          </Animated.View>

          {/* Recent logs today */}
          {recentLogs.length > 0 && (
            <Animated.View entering={FadeInDown.duration(400).delay(150)}>
              <Text fontSize={16} fontWeight={800} color="gray.800" mt={6} mb={3}>
                Doses de hoje
              </Text>
              {recentLogs.map((log, i) => (
                <Box key={i} bg="white" borderRadius={12} p={3} mb={2} shadow={1}>
                  <HStack alignItems="center" justifyContent="space-between">
                    <Text fontSize={14} fontWeight={600} color="gray.700">
                      {format(new Date(log.scheduledTime), 'HH:mm')}
                    </Text>
                    <Box
                      px={3}
                      py={1}
                      borderRadius={8}
                      bg={getStatusColor(log.status) + '18'}
                    >
                      <Text
                        fontSize={14}
                        fontWeight={700}
                        color={getStatusColor(log.status)}
                      >
                        {getStatusLabel(log.status)}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              ))}
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

              <TouchableOpacity testID="btn-deactivate-medication" style={{ flex: 1 }} onPress={handleDeactivate}>
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
    </View>
  );
}
