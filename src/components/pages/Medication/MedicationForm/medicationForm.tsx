import { useState } from 'react';
import { TouchableOpacity, StatusBar, Alert, Platform, Modal, Pressable, TextInput, StyleSheet } from 'react-native';
import { VStack, Text, Box, HStack, ScrollView, View } from 'native-base';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppNavigatorRoutesProps, AppRoutes } from '@routes/app.routes';
import { useMedication } from 'src/hooks/useMedication';
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
} from '@assets/icons';
import { getFormIcon } from '../utils/medicationUtils';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  MedicationForm as MedicationFormEnum,
  MedicationFrequencyType,
  MedicationFormLabels,
  MedicationRequestDTO,
} from 'src/services/medicationService';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const FORM_OPTIONS = Object.values(MedicationFormEnum)
  .filter((v): v is MedicationFormEnum => typeof v === 'number')
  .map(value => ({
    value,
    label: MedicationFormLabels[value],
  }));

export function MedicationForm() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute<RouteProp<AppRoutes, 'medicationForm'>>();
  const { addMedication, editMedication, medications } = useMedication();

  const editId = route.params?.medicationId;
  const existingMed = editId ? medications.find(m => m.id === editId) : null;

  const [name, setName] = useState(existingMed?.name || '');
  const [dosage, setDosage] = useState(existingMed?.dosage || '');
  const [form, setForm] = useState<MedicationFormEnum>(existingMed?.form || MedicationFormEnum.Comprimido);
  const [frequencyType, setFrequencyType] = useState<MedicationFrequencyType>(
    existingMed?.frequencyType || MedicationFrequencyType.Daily
  );
  const [frequencyDays, setFrequencyDays] = useState<number[]>(existingMed?.frequencyDays || []);
  const [scheduleTimes, setScheduleTimes] = useState<string[]>(existingMed?.scheduleTimes || ['08:00']);
  const [instructions, setInstructions] = useState(existingMed?.instructions || '');
  const totalQuantity = existingMed?.totalQuantity?.toString() || '';
  const refillThreshold = existingMed?.refillAlertThreshold?.toString() || '';
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingTimeIndex, setEditingTimeIndex] = useState<number | null>(null);
  const [tempTimeDate, setTempTimeDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFormPicker, setShowFormPicker] = useState(false);

  const hasMoreOptions = existingMed && (
    existingMed.frequencyType === MedicationFrequencyType.SpecificDays ||
    existingMed.scheduleTimes.length > 1 ||
    !!existingMed.instructions
  );
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(!!hasMoreOptions);

  function toggleDay(day: number) {
    setFrequencyDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  }

  function addTime() {
    setScheduleTimes(prev => [...prev, '12:00']);
  }

  function removeTime(index: number) {
    if (scheduleTimes.length <= 1) return;
    setScheduleTimes(prev => prev.filter((_, i) => i !== index));
  }

  function handleTimeChange(_: any, selectedDate?: Date) {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
      if (selectedDate && editingTimeIndex !== null) {
        const hours = selectedDate.getHours().toString().padStart(2, '0');
        const mins = selectedDate.getMinutes().toString().padStart(2, '0');
        setScheduleTimes(prev =>
          prev.map((t, i) => (i === editingTimeIndex ? `${hours}:${mins}` : t))
        );
      }
    } else if (selectedDate) {
      setTempTimeDate(selectedDate);
    }
  }

  function confirmTime() {
    if (editingTimeIndex !== null) {
      const hours = tempTimeDate.getHours().toString().padStart(2, '0');
      const mins = tempTimeDate.getMinutes().toString().padStart(2, '0');
      setScheduleTimes(prev =>
        prev.map((t, i) => (i === editingTimeIndex ? `${hours}:${mins}` : t))
      );
    }
    setShowTimePicker(false);
  }

  function openTimePicker(index: number) {
    setEditingTimeIndex(index);
    const [h, m] = scheduleTimes[index].split(':');
    const d = new Date();
    d.setHours(parseInt(h), parseInt(m), 0, 0);
    setTempTimeDate(d);
    setShowTimePicker(true);
  }

  async function handleSubmit() {
    if (!name.trim() || !dosage.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha o nome e a dosagem do medicamento.');
      return;
    }

    if (frequencyType === MedicationFrequencyType.SpecificDays && frequencyDays.length === 0) {
      Alert.alert('Selecione os dias', 'Escolha pelo menos um dia da semana.');
      return;
    }

    setIsSubmitting(true);
    try {
      const request: MedicationRequestDTO = {
        name: name.trim(),
        dosage: dosage.trim(),
        form,
        frequencyType,
        frequencyDays: frequencyType === MedicationFrequencyType.SpecificDays ? frequencyDays : undefined,
        scheduleTimes,
        instructions: instructions.trim() || undefined,
        totalQuantity: totalQuantity ? parseInt(totalQuantity) : undefined,
        refillAlertThreshold: refillThreshold ? parseInt(refillThreshold) : undefined,
      };

      if (editId) {
        await editMedication(editId, request);
      } else {
        await addMedication(request);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o medicamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const moreOptionsHint = (() => {
    const parts: string[] = [];
    if (frequencyType === MedicationFrequencyType.SpecificDays && frequencyDays.length > 0) {
      parts.push(`${frequencyDays.length} dias`);
    }
    if (scheduleTimes.length > 1) parts.push(`${scheduleTimes.length} horários`);
    if (instructions) parts.push('com instruções');
    return parts.length > 0 ? parts.join(' · ') : 'Frequência, horários extras, instruções';
  })();

  return (
    <View testID="screen-medication-form" flex={1} bg="gray.50">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <VStack flex={1} pt={16} pb={24} mx={6}>
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(400).delay(0)}>
            <HStack alignItems="center" mt={2} mb={6}>
              <TouchableOpacity testID="btn-back" onPress={() => navigation.goBack()}>
                <Box w={10} h={10} alignItems="center" justifyContent="center">
                  <ChevronLeftIcon size="24" color="#1E293B" />
                </Box>
              </TouchableOpacity>
              <Text fontSize={24} fontWeight={800} letterSpacing={-0.8} color="gray.900" ml={2}>
                {editId ? 'Editar medicamento' : 'Novo medicamento'}
              </Text>
            </HStack>
          </Animated.View>

          {/* Nome */}
          <Box mb={4}>
            <Text fontSize={15} fontWeight={600} color="gray.700" mb={2}>
              Nome do medicamento *
            </Text>
            <TextInput
              testID="input-medication-name"
              value={name}
              onChangeText={setName}
              placeholder="Ex: Losartana"
              placeholderTextColor="#A0AEC0"
              style={styles.input}
            />
          </Box>

          {/* Dosagem */}
          <Box mb={4}>
            <Text fontSize={15} fontWeight={600} color="gray.700" mb={2}>
              Dosagem *
            </Text>
            <TextInput
              testID="input-medication-dosage"
              value={dosage}
              onChangeText={setDosage}
              placeholder="Ex: 50mg"
              placeholderTextColor="#A0AEC0"
              style={styles.input}
            />
          </Box>

          {/* Forma — select */}
          <Box>
            <Text fontSize={15} fontWeight={600} color="gray.700" mb={2}>
              Forma
            </Text>
            <TouchableOpacity onPress={() => setShowFormPicker(!showFormPicker)}>
              <HStack
                bg="white"
                borderRadius={14}
                py={3.5}
                px={4}
                mb={showFormPicker ? 0 : 4}
                alignItems="center"
                borderWidth={1}
                borderColor={showFormPicker ? 'ciano.400' : 'gray.200'}
                borderBottomRadius={showFormPicker ? 0 : 14}
              >
                <Box mr={3}>
                  {getFormIcon(form, '#0CC1AF', '24')}
                </Box>
                <Text fontSize={16} fontWeight={700} color="gray.800" flex={1}>
                  {MedicationFormLabels[form]}
                </Text>
                {showFormPicker ? (
                  <ChevronUpIcon size="20" color="#0CC1AF" />
                ) : (
                  <ChevronDownIcon size="20" color="#9CA3AF" />
                )}
              </HStack>
            </TouchableOpacity>

            {showFormPicker && (
              <Box
                bg="white"
                borderBottomLeftRadius={14}
                borderBottomRightRadius={14}
                borderWidth={1}
                borderTopWidth={0}
                borderColor="ciano.400"
                mb={4}
              >
                {FORM_OPTIONS.map((option, index) => {
                  const isLast = index === FORM_OPTIONS.length - 1;
                  const isSelected = form === option.value;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => {
                        setForm(option.value);
                        setShowFormPicker(false);
                      }}
                    >
                      <HStack
                        py={3.5}
                        px={4}
                        alignItems="center"
                        bg={isSelected ? 'ciano.50' : 'white'}
                        borderTopWidth={index > 0 ? 1 : 0}
                        borderTopColor="gray.100"
                        borderBottomLeftRadius={isLast ? 14 : 0}
                        borderBottomRightRadius={isLast ? 14 : 0}
                      >
                        <Box mr={3}>
                          {getFormIcon(option.value, isSelected ? '#0CC1AF' : '#9CA3AF', '24')}
                        </Box>
                        <Text
                          fontSize={16}
                          fontWeight={isSelected ? 700 : 500}
                          color={isSelected ? 'ciano.700' : 'gray.700'}
                          flex={1}
                        >
                          {option.label}
                        </Text>
                        {isSelected && (
                          <Box w={5} h={5} borderRadius={10} bg="ciano.400" alignItems="center" justifyContent="center">
                            <Text fontSize={12} color="white" fontWeight={800}>✓</Text>
                          </Box>
                        )}
                      </HStack>
                    </TouchableOpacity>
                  );
                })}
              </Box>
            )}
          </Box>

          {/* Horário principal */}
          <Box>
            <Text fontSize={15} fontWeight={600} color="gray.700" mb={2}>
              Horário principal
            </Text>
            <TouchableOpacity onPress={() => openTimePicker(0)}>
              <HStack
                bg="white"
                borderRadius={14}
                py={4}
                px={4}
                mb={4}
                alignItems="center"
                borderWidth={1}
                borderColor="gray.200"
              >
                <Box
                  bg="ciano.50"
                  w={10}
                  h={10}
                  borderRadius={10}
                  alignItems="center"
                  justifyContent="center"
                  mr={3}
                >
                  <ClockIcon size="20" color="#0CC1AF" />
                </Box>
                <Text fontSize={22} fontWeight={800} color="gray.800" flex={1}>
                  {scheduleTimes[0]}
                </Text>
                <Text fontSize={14} fontWeight={500} color="gray.400">
                  Toque para alterar
                </Text>
              </HStack>
            </TouchableOpacity>
          </Box>

          {/* Mais opções (colapsável) */}
          <Box>
            <TouchableOpacity onPress={() => setMoreOptionsOpen(!moreOptionsOpen)}>
              <HStack
                bg="white"
                borderRadius={14}
                py={4}
                px={4}
                mb={moreOptionsOpen ? 0 : 4}
                alignItems="center"
                borderWidth={1}
                borderColor={moreOptionsOpen ? 'ciano.200' : 'gray.200'}
                borderBottomRadius={moreOptionsOpen ? 0 : 14}
              >
                {moreOptionsOpen ? (
                  <ChevronUpIcon size="20" color="#0CC1AF" />
                ) : (
                  <ChevronDownIcon size="20" color="#9CA3AF" />
                )}
                <VStack flex={1} ml={3}>
                  <Text fontSize={15} fontWeight={600} color={moreOptionsOpen ? 'ciano.600' : 'gray.700'}>
                    Mais opções
                  </Text>
                  {!moreOptionsOpen && (
                    <Text fontSize={14} fontWeight={400} color="gray.400" numberOfLines={1}>
                      {moreOptionsHint}
                    </Text>
                  )}
                </VStack>
              </HStack>
            </TouchableOpacity>

            {moreOptionsOpen && (
              <Box
                bg="white"
                borderRadius={14}
                borderTopRadius={0}
                px={4}
                pb={5}
                mb={4}
                borderWidth={1}
                borderTopWidth={0}
                borderColor="ciano.200"
              >
                {/* Frequência */}
                <Text fontSize={15} fontWeight={600} color="gray.700" mt={4} mb={2}>
                  Frequência
                </Text>
                <HStack space={3} mb={3}>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => setFrequencyType(MedicationFrequencyType.Daily)}
                  >
                    <Box
                      bg={frequencyType === MedicationFrequencyType.Daily ? 'ciano.400' : 'gray.50'}
                      borderRadius={12}
                      py={3.5}
                      alignItems="center"
                      borderWidth={1}
                      borderColor={frequencyType === MedicationFrequencyType.Daily ? 'ciano.400' : 'gray.200'}
                    >
                      <Text
                        fontSize={15}
                        fontWeight={700}
                        color={frequencyType === MedicationFrequencyType.Daily ? 'white' : 'gray.600'}
                      >
                        Diário
                      </Text>
                    </Box>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => setFrequencyType(MedicationFrequencyType.SpecificDays)}
                  >
                    <Box
                      bg={frequencyType === MedicationFrequencyType.SpecificDays ? 'ciano.400' : 'gray.50'}
                      borderRadius={12}
                      py={3.5}
                      alignItems="center"
                      borderWidth={1}
                      borderColor={frequencyType === MedicationFrequencyType.SpecificDays ? 'ciano.400' : 'gray.200'}
                    >
                      <Text
                        fontSize={15}
                        fontWeight={700}
                        color={frequencyType === MedicationFrequencyType.SpecificDays ? 'white' : 'gray.600'}
                      >
                        Dias específicos
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </HStack>

                {/* Chips de dia — maiores e com label mais legível */}
                {frequencyType === MedicationFrequencyType.SpecificDays && (
                  <HStack space={2} mb={4} justifyContent="space-between">
                    {WEEKDAYS.map((day, index) => (
                      <TouchableOpacity key={index} onPress={() => toggleDay(index)} style={{ flex: 1 }}>
                        <Box
                          py={2.5}
                          borderRadius={12}
                          bg={frequencyDays.includes(index) ? 'ciano.400' : 'gray.50'}
                          borderWidth={1.5}
                          borderColor={frequencyDays.includes(index) ? 'ciano.400' : 'gray.300'}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text
                            fontSize={14}
                            fontWeight={700}
                            color={frequencyDays.includes(index) ? 'white' : 'gray.500'}
                          >
                            {day}
                          </Text>
                        </Box>
                      </TouchableOpacity>
                    ))}
                  </HStack>
                )}

                {/* Horários adicionais */}
                <Text fontSize={15} fontWeight={600} color="gray.700" mt={1} mb={2}>
                  Horários adicionais
                </Text>
                {scheduleTimes.slice(1).map((time, index) => {
                  const realIndex = index + 1;
                  return (
                    <HStack key={realIndex} mb={2} alignItems="center">
                      <TouchableOpacity style={{ flex: 1 }} onPress={() => openTimePicker(realIndex)}>
                        <HStack
                          bg="gray.50"
                          borderRadius={12}
                          py={3}
                          px={4}
                          alignItems="center"
                          borderWidth={1}
                          borderColor="gray.200"
                        >
                          <Box
                            bg="white"
                            w={9}
                            h={9}
                            borderRadius={9}
                            alignItems="center"
                            justifyContent="center"
                            mr={3}
                          >
                            <ClockIcon size="18" color="#9CA3AF" />
                          </Box>
                          <Text fontSize={20} fontWeight={800} color="gray.800" flex={1}>
                            {time}
                          </Text>
                        </HStack>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => removeTime(realIndex)}>
                        <Box
                          w={10}
                          h={10}
                          ml={2}
                          bg="red.50"
                          borderRadius={10}
                          alignItems="center"
                          justifyContent="center"
                          borderWidth={1}
                          borderColor="red.100"
                        >
                          <Text fontSize={18} color="red.400" fontWeight={700}>✕</Text>
                        </Box>
                      </TouchableOpacity>
                    </HStack>
                  );
                })}
                <TouchableOpacity onPress={addTime}>
                  <HStack bg="ciano.50" borderRadius={12} py={3} alignItems="center" justifyContent="center" mt={1}>
                    <ClockIcon size="16" color="#0CC1AF" />
                    <Text fontSize={15} fontWeight={600} color="ciano.600" ml={2}>
                      Adicionar horário
                    </Text>
                  </HStack>
                </TouchableOpacity>

                {/* Instruções */}
                <Text fontSize={15} fontWeight={600} color="gray.700" mt={5} mb={2}>
                  Instruções (opcional)
                </Text>
                <TextInput
                  value={instructions}
                  onChangeText={setInstructions}
                  placeholder="Ex: Tomar em jejum, antes das refeições..."
                  placeholderTextColor="#A0AEC0"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={styles.textArea}
                />
              </Box>
            )}
          </Box>
        </VStack>
      </ScrollView>

      {/* Botão salvar fixo */}
      <Box bg="gray.50" px={6} pb={8} pt={3} shadow={5}>
        <TouchableOpacity testID="btn-save-medication" onPress={handleSubmit} disabled={isSubmitting}>
          <Box
            bg={isSubmitting ? 'gray.400' : 'ciano.400'}
            py={4}
            borderRadius={14}
            alignItems="center"
            shadow={3}
          >
            <Text fontSize={16} fontWeight={800} color="white">
              {isSubmitting ? 'Salvando...' : editId ? 'Salvar alterações' : 'Cadastrar medicamento'}
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>

      {showTimePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={tempTimeDate}
          mode="time"
          is24Hour={true}
          locale="pt-BR"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {showTimePicker && Platform.OS === 'ios' && (
        <Modal transparent animationType="slide" visible>
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
            onPress={() => setShowTimePicker(false)}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'white',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingBottom: 40,
              }}
            >
              <HStack justifyContent="space-between" alignItems="center" px={5} pt={4} pb={2}>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Text fontSize={16} fontWeight={600} color="gray.400">
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <Text fontSize={17} fontWeight={700} color="gray.800">
                  Selecionar horário
                </Text>
                <TouchableOpacity onPress={confirmTime}>
                  <Text fontSize={16} fontWeight={700} color="ciano.500">
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </HStack>
              <Box alignItems="center" py={2}>
                <DateTimePicker
                  value={tempTimeDate}
                  mode="time"
                  is24Hour={true}
                  locale="pt-BR"
                  display="spinner"
                  onChange={handleTimeChange}
                  style={{ height: 200, width: 300 }}
                />
              </Box>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#1A202C',
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#1A202C',
    height: 96,
  },
});
