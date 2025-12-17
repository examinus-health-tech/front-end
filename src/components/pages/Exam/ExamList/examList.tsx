import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VStack, Text, Box, HStack, ScrollView, IScrollViewProps, View, Circle, Modal, Button as NativeBaseButton, Actionsheet, useDisclose } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ChevronRightIcon, FilterIcon, FlaskIcon, MoreIcon, RotateRightIcon, TrashIcon, UploadIcon } from '@assets/icons';

// components
import { HeaderTitle, Input } from '@components/molecules';
import { TouchableOpacity, useWindowDimensions, Keyboard, Pressable, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { CustomRefreshControl } from '@components/atoms';
import { Button } from '@components/atoms';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from 'src/hooks/useAuth';
import { useExam } from 'src/hooks/useExam';
import { useCustomToast } from 'src/hooks/useCustomToast';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { formatDateToBrazilian } from '@utils/dateFormatter';

type FormDataProps = {
  search: string;
  start_date: string;
  final_date: string;
  status: string;
};

type FilterState = {
  search: string;
  startDate: string;
  endDate: string;
  status: string;
};

// Função para mapear status do exame para mensagens amigáveis
function getStatusMessage(status: string) {
  const statusMap = {
    Received: 'Recebido',
    Extracted: 'Extraído',
    ExtractedFailed: 'Erro extração',
    Analyzed: 'Analisado',
    AnalyzedFailed: 'Erro análise',
    ScoreComputed: 'Concluído',
    ScoreComputedFailed: 'Erro processamento',
    ProcessingTimeout: 'Tempo excedido',
  };

  return statusMap[status as keyof typeof statusMap] || status;
}

// Função para obter a cor do status
function getStatusColor(status: string) {
  const colorMap = {
    Received: 'blue.500',
    Extracted: 'blue.600',
    ExtractedFailed: 'red.500',
    Analyzed: 'orange.500',
    AnalyzedFailed: 'red.500',
    ScoreComputed: 'ciano.500',
    ScoreComputedFailed: 'red.500',
    ProcessingTimeout: 'orange.600',
  };

  return colorMap[status as keyof typeof colorMap] || 'gray.500';
}

// Função para verificar se é um status de erro
function isErrorStatus(status: string) {
  return status.includes('Failed');
}

// Função para verificar se é status de processamento
function isProcessingStatus(status: string) {
  return ['Received', 'Extracted', 'Analyzed', 'ProcessingTimeout'].includes(status);
}

const uploadFormSchema = yup.object({
  search: yup.string(),
  start_date: yup.string(),
  final_date: yup.string(),
  status: yup.string(),
});

// Opções simplificadas de status para o filtro (chips)
const statusFilterOptions = [
  { label: 'Todos', value: '', color: 'gray.500', bgColor: 'gray.100', activeBg: 'gray.600' },
  { label: 'Processando', value: 'processing', color: 'blue.600', bgColor: 'blue.50', activeBg: 'blue.500' },
  { label: 'Concluídos', value: 'completed', color: 'green.600', bgColor: 'green.50', activeBg: 'green.500' },
  { label: 'Com erro', value: 'error', color: 'red.600', bgColor: 'red.50', activeBg: 'red.500' },
];

// Mapeamento de filtro simplificado para status reais
const statusFilterMap: Record<string, string[]> = {
  '': [], // Todos
  processing: ['Received', 'Extracted', 'Analyzed', 'ProcessingTimeout'],
  completed: ['ScoreComputed'],
  error: ['ExtractedFailed', 'AnalyzedFailed', 'ScoreComputedFailed'],
};

type ExamDataProps = {
  identifier: string;
  doctor_name: string;
  labor_name: string;
  exam_date: string;
};

export function ExamList() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollRef = useRef<IScrollViewProps>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { showExtractionError, showAnalysisError, showExamProcessing, showFiltersApplied, showFiltersCleared, showError, showSuccess, showInfo } = useCustomToast();
  const { user } = useAuth();
  const { getExamList, examData, setExamSelected, deleteExam, reprocessExam } = useExam();
  const { width, height } = useWindowDimensions();

  // Estados para exclusão de exame
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estados para menu de ações (reprocessar/excluir)
  const { isOpen: isActionSheetOpen, onOpen: onActionSheetOpen, onClose: onActionSheetClose } = useDisclose();
  const [selectedExamForAction, setSelectedExamForAction] = useState<any>(null);
  const [isReprocessing, setIsReprocessing] = useState(false);

  // Estados dos filtros
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    startDate: '',
    endDate: '',
    status: '',
  });
  const [filteredExams, setFilteredExams] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const snapPoints = useMemo(() => ['55%', '55%'], []);

  const {
    control,
    getValues,
    handleSubmit,
    setValue,
    reset,
    resetField,
    formState: { errors },
  } = useForm({
    defaultValues: {
      search: '',
      start_date: '',
      final_date: '',
      status: '',
    },
    resolver: yupResolver(uploadFormSchema),
  });

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // Backdrop animado para o BottomSheet
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.6}
      />
    ),
    []
  );

  async function handleExamList() {
    try {
      setIsLoading(true);
      await getExamList();
      setIsLoading(false);
    } catch (error) {
    } finally {
    }
  }

  // Função para pull-to-refresh
  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      await getExamList();
    } catch (error) {
      console.error('Erro ao atualizar lista de exames:', error);
    } finally {
      setIsRefreshing(false);
    }
  }

  // Função para aplicar filtros
  function applyFilters() {
    if (!examData || examData.length === 0) {
      setFilteredExams([]);
      return;
    }

    let filtered = [...examData];

    // Filtro por status (usando mapeamento simplificado)
    if (filters.status && statusFilterMap[filters.status]) {
      const allowedStatuses = statusFilterMap[filters.status];
      if (allowedStatuses.length > 0) {
        filtered = filtered.filter((exam) => allowedStatuses.includes(exam.medicalExamStatus));
      }
    }

    // Filtro por pesquisa (título/laboratório)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (exam) =>
          exam.laboratoryName?.toLowerCase().includes(searchTerm) || exam.doctorName?.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por data
    if (filters.startDate) {
      filtered = filtered.filter((exam) => new Date(exam.createdDate) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter((exam) => new Date(exam.createdDate) <= new Date(filters.endDate));
    }

    // Ordenação: primeiro por status (ScoreComputed primeiro), depois por data (mais recentes primeiro)
    filtered.sort((a, b) => {
      // Primeiro priorizar status ScoreComputed (concluídos)
      const priorityStatuses = ['ScoreComputed', 'Analyzed'];
      const aIsPriority = priorityStatuses.includes(a.medicalExamStatus);
      const bIsPriority = priorityStatuses.includes(b.medicalExamStatus);

      if (aIsPriority && !bIsPriority) return -1;
      if (!aIsPriority && bIsPriority) return 1;

      // Dentro do mesmo grupo de prioridade, ordenar por data (mais recente primeiro)
      const dateA = new Date(a.createdDate).getTime();
      const dateB = new Date(b.createdDate).getTime();
      return dateB - dateA;
    });

    console.log(
      '📋 Exames ordenados:',
      filtered.map((e) => ({
        date: e.createdDate,
        status: e.medicalExamStatus,
      }))
    );

    setFilteredExams(filtered);
  }

  // Função para aplicar máscara de data brasileira
  function applyDateMask(value: string): string {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '');

    // Aplica a máscara DD/MM/AAAA
    let maskedValue: string;
    if (digits.length <= 2) {
      maskedValue = digits;
    } else if (digits.length <= 4) {
      maskedValue = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      maskedValue = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }

    // Fechar teclado quando a data estiver completa (10 caracteres: DD/MM/AAAA)
    if (maskedValue.length === 10) {
      setTimeout(() => {
        Keyboard.dismiss();
      }, 100);
    }

    return maskedValue;
  }

  // Função para converter data brasileira para formato ISO
  function convertBrazilianToISO(brazilianDate: string): string {
    if (!brazilianDate || brazilianDate.length !== 10) return '';

    const [day, month, year] = brazilianDate.split('/');
    return `${year}-${month}-${day}`;
  }

  // Função para aplicar filtros do formulário
  function handleApplyFilters(data: FormDataProps) {
    const newFilters = {
      search: data.search || '',
      startDate: data.start_date ? convertBrazilianToISO(data.start_date) : '',
      endDate: data.final_date ? convertBrazilianToISO(data.final_date) : '',
      status: data.status || '',
    };

    setFilters(newFilters);
    bottomSheetModalRef.current?.close();

    showFiltersApplied();
  }

  // Função para limpar filtros
  function handleClearFilters() {
    setFilters({
      search: '',
      startDate: '',
      endDate: '',
      status: '',
    });

    reset();

    showFiltersCleared();
  }

  // Aplicar filtros quando examData ou filters mudarem
  useEffect(() => {
    applyFilters();
  }, [examData, filters]);

  // Função para abrir modal de exclusão
  function handleOpenDeleteModal(exam: any) {
    setExamToDelete(exam);
    setIsDeleteModalOpen(true);
  }

  // Função para abrir menu de ações (reprocessar/excluir)
  function handleOpenActionSheet(exam: any) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Feedback tátil ao abrir opções
    setSelectedExamForAction(exam);
    onActionSheetOpen();
  }

  // Função para reprocessar exame
  async function handleReprocessExam() {
    if (!selectedExamForAction?.medicalExamId) return;

    setIsReprocessing(true);
    try {
      await reprocessExam(selectedExamForAction.medicalExamId);
      onActionSheetClose();
      setSelectedExamForAction(null);
      showSuccess({
        title: 'Reprocessando',
        description: 'O exame foi enviado para reprocessamento.',
      });
    } catch (error) {
      showError({
        title: 'Erro ao reprocessar',
        description: 'Não foi possível reprocessar o exame. Tente novamente.',
      });
    } finally {
      setIsReprocessing(false);
    }
  }

  // Função para excluir do action sheet
  function handleDeleteFromActionSheet() {
    if (!selectedExamForAction) return;
    onActionSheetClose();
    setExamToDelete(selectedExamForAction);
    setSelectedExamForAction(null);
    setIsDeleteModalOpen(true);
  }

  // Função para excluir exame
  async function handleDeleteExam() {
    if (!examToDelete?.medicalExamId) return;

    setIsDeleting(true);
    try {
      await deleteExam(examToDelete.medicalExamId);
      setIsDeleteModalOpen(false);
      setExamToDelete(null);
      showSuccess({
        title: 'Exame excluído',
        description: 'O exame foi removido com sucesso.',
      });
    } catch (error) {
      showError({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o exame. Tente novamente.',
      });
    } finally {
      setIsDeleting(false);
    }
  }

  function renderExam(exam: any) {
    const isScoreComputed = exam.medicalExamStatus === 'ScoreComputed';
    const isError = isErrorStatus(exam.medicalExamStatus);
    const isProcessing = isProcessingStatus(exam.medicalExamStatus);
    const statusMessage = getStatusMessage(exam.medicalExamStatus);
    const statusColor = getStatusColor(exam.medicalExamStatus);

    const handlePress = () => {
      // Exames concluídos (ScoreComputed) abrem detalhes
      if (isScoreComputed) {
        setExamSelected(exam);
        navigation.navigate('exam');
      } else {
        // Exames com erro/processando abrem menu de opções
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        handleOpenActionSheet(exam);
      }
    };

    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <HStack
          justifyContent="space-between"
          alignItems="flex-start"
          space={3}
          flex={1}
          opacity={isScoreComputed ? 1 : 0.7}
        >
          {/* Ícone com indicador de status */}
          <Box position="relative" mt={1}>
            <Box bg="gray.100" borderRadius={16} w={16} h={14} alignItems="center" justifyContent="center">
              <FlaskIcon size="32" variant="duotone" color={isScoreComputed ? undefined : 'gray.400'} />
            </Box>
            {/* Bolinha de status no canto */}
            <Circle
              size={4}
              bg={statusColor}
              position="absolute"
              bottom={-1}
              right={-1}
              borderWidth={2}
              borderColor="white"
            >
              {isProcessing && <Circle size={1.5} bg="white" />}
            </Circle>
          </Box>

          {/* Conteúdo central */}
          <VStack flex={1} space={0}>
            {/* Linha 1: Título */}
            <Text fontSize={17} fontWeight={700} letterSpacing={-0.16} numberOfLines={1}>
              {exam.laboratoryName || 'Laboratório'}
            </Text>

            {/* Linha 2: Data do exame */}
            <HStack alignItems="center" space={1} mt={1}>
              <Text fontSize={12} fontWeight={600} color="gray.500">Exame</Text>
              <Text fontSize={13} fontWeight={600} color={exam.examDate ? "gray.700" : "gray.400"}>
                {exam.examDate ? formatDateToBrazilian(exam.examDate) : 'Não identificada'}
              </Text>
            </HStack>

            {/* Linha 3: Data de envio + Badge de status */}
            <HStack alignItems="center" space={1} mt={1}>
              <Text fontSize={11} fontWeight={500} color="gray.400">Enviado</Text>
              <Text fontSize={12} fontWeight={500} color="gray.500">
                {formatDateToBrazilian(exam.createdDate)}
              </Text>
            </HStack>
          </VStack>

          {/* Lado direito: Badge + Ícone */}
          <VStack alignItems="flex-end" justifyContent="center" space={2}>
            {/* Badge de status */}
            <Box bg={statusColor} borderRadius={6} px={2} py={0.5}>
              <Text fontSize={10} fontWeight={700} color="white" textAlign="center">
                {statusMessage}
              </Text>
            </Box>

            {/* Exames concluídos: apenas chevron */}
            {isScoreComputed && (
              <ChevronRightIcon color="#0CC1AF" size="28" />
            )}

            {/* Exames com erro/processando: 3 pontos como indicador visual */}
            {!isScoreComputed && (
              <Box p={1}>
                <MoreIcon color="#9CA3AF" size="24" />
              </Box>
            )}
          </VStack>
        </HStack>
      </Pressable>
    );
  }

  useEffect(() => {
    handleExamList();
  }, []);

  return (
    <VStack flex={1}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <VStack py={16} flex={1}>
        <HeaderTitle
          title="Exames Realizados"
          withBackButton={() => navigation.navigate('homepage')}
          withFilterButton
          filterButtonAction={handlePresentModalPress}
        />

        {isLoading ? (
          <View maxW="100%" w="100%">
            <ContentLoader viewBox={`0 0 ${width} ${height}`} backgroundColor="#d5d5d5" foregroundColor="#ebebeb">
              <Rect key="rect-1" y="20" rx="12" ry="12" width="85%" height={100} />
              <Rect key="rect-2" y="140" rx="12" ry="12" width="85%" height={100} />
              <Rect key="rect-3" y="260" rx="12" ry="12" width="85%" height={100} />
              <Rect key="rect-4" y="380" rx="12" ry="12" width="85%" height={100} />
              <Rect key="rect-5" y="500" rx="12" ry="12" width="85%" height={100} />
              <Rect key="rect-6" y="620" rx="12" ry="12" width="85%" height={100} />
              <Rect key="rect-7" y="740" rx="12" ry="12" width="85%" height={100} />
              <Rect key="rect-8" y="860" rx="12" ry="12" width="85%" height={100} />
            </ContentLoader>
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <CustomRefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
            }
          >
            <VStack flex={1} space={8} pt={2} pb={32}>
              <VStack mx={6} mt={4} space={8}>
                {filteredExams && Array.isArray(filteredExams) && filteredExams.length > 0 ? (
                  filteredExams.map((exam, index) => <Box key={index}>{renderExam(exam)}</Box>)
                ) : examData && Array.isArray(examData) && examData.length > 0 ? (
                  <VStack alignItems="center" justifyContent="center" py={20} space={4}>
                    <Box bg="gray.100" borderRadius={16} w={20} h={16} alignItems="center" justifyContent="center">
                      <FlaskIcon size="36" variant="duotone" color="gray.400" />
                    </Box>
                    <Text fontSize={18} fontWeight={600} letterSpacing={-0.16} color="gray.600" textAlign="center">
                      Nenhum exame encontrado
                    </Text>
                    <Text
                      fontSize={14}
                      fontWeight={400}
                      letterSpacing={-0.16}
                      color="gray.400"
                      textAlign="center"
                      px={4}
                    >
                      Tente ajustar os filtros para encontrar outros exames.
                    </Text>
                  </VStack>
                ) : (
                  <VStack alignItems="center" justifyContent="center" py={20} space={4}>
                    <Box bg="gray.100" borderRadius={16} w={20} h={16} alignItems="center" justifyContent="center">
                      <FlaskIcon size="36" variant="duotone" color="gray.400" />
                    </Box>
                    <Text fontSize={18} fontWeight={600} letterSpacing={-0.16} color="gray.600" textAlign="center">
                      Nenhum exame processado ainda
                    </Text>
                    <Text
                      fontSize={14}
                      fontWeight={400}
                      letterSpacing={-0.16}
                      color="gray.400"
                      textAlign="center"
                      px={4}
                    >
                      Quando você fizer upload de exames, eles aparecerão aqui. Apenas exames com status "Processamento
                      completo" podem ser visualizados.
                    </Text>
                  </VStack>
                )}
              </VStack>
            </VStack>
          </ScrollView>
        )}
      </VStack>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <VStack flex={1}>
              {/* Scrollable Content */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                flex={1}
                keyboardShouldPersistTaps="handled"
              >
              <VStack mx={6} pb={4}>
                {/* Header */}
                <VStack mb={6}>
                  <HStack justifyContent="space-between" alignItems="center" width="100%" mt={4} mb={2}>
                    <Text fontSize={24} fontWeight={700} letterSpacing={-0.24} color="gray.900">
                      Filtrar Exames
                    </Text>
                    <Box bg="gray.100" p={2} borderRadius={10}>
                      <FilterIcon size="20" color="#374151" />
                    </Box>
                  </HStack>

                  <Text fontSize={14} fontWeight={400} letterSpacing={-0.14} color="gray.500" width="100%">
                    Configure os filtros para encontrar exames específicos
                  </Text>
                </VStack>

                {/* Form Fields */}
                <VStack width="100%" space={5}>
                  {/* Período de datas */}
                  <HStack space={3}>
                    <Box flex={1}>
                      <Controller
                        control={control}
                        name="start_date"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            label="Data Início"
                            placeholder="DD/MM/AAAA"
                            onChangeText={(text) => {
                              const maskedValue = applyDateMask(text);
                              onChange(maskedValue);
                            }}
                            value={value}
                            keyboardType="numeric"
                            maxLength={10}
                          />
                        )}
                      />
                    </Box>

                    <Box flex={1}>
                      <Controller
                        control={control}
                        name="final_date"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            label="Data Final"
                            placeholder="DD/MM/AAAA"
                            onChangeText={(text) => {
                              const maskedValue = applyDateMask(text);
                              onChange(maskedValue);
                            }}
                            value={value}
                            keyboardType="numeric"
                            maxLength={10}
                          />
                        )}
                      />
                    </Box>
                  </HStack>

                  {/* Filtro por status - Dropdown */}
                  <Controller
                    control={control}
                    name="status"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        label="Status"
                        selectType
                        selectedValue={value}
                        onValueChange={onChange}
                        placeholder="Todos os status"
                        options={statusFilterOptions.map((option) => ({
                          label: option.label,
                          value: option.value,
                        }))}
                      />
                    )}
                  />
                </VStack>
              </VStack>
            </ScrollView>

            {/* Fixed Action Buttons */}
            <VStack borderTopWidth={1} borderTopColor="gray.200" bg="white" px={6} pt={4} pb={12}>
              <HStack width="100%" space={4}>
                <Button
                  flex={1}
                  title="Limpar Filtros"
                  size="md"
                  variant="secondary"
                  fontSize={16}
                  h={12}
                  borderRadius={12}
                  onPress={handleClearFilters}
                  _text={{
                    color: 'red.500',
                  }}
                />
                <Button
                  flex={1}
                  title="Aplicar Filtros"
                  size="md"
                  variant="primary"
                  fontSize={16}
                  h={12}
                  borderRadius={12}
                  onPress={handleSubmit(handleApplyFilters)}
                />
              </HStack>
            </VStack>
          </VStack>
          </KeyboardAvoidingView>
        </BottomSheetView>
      </BottomSheetModal>

      {/* Modal de confirmação de exclusão */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <Modal.Content maxWidth="340" borderRadius={16}>
          <Modal.Body p={6}>
            <VStack space={4} alignItems="center">
              <Box p={3} bg="red.100" borderRadius={12}>
                <TrashIcon color="#EF4444" size="32" />
              </Box>

              <VStack space={2} alignItems="center">
                <Text fontSize={18} fontWeight={700} color="gray.900" textAlign="center">
                  Excluir exame?
                </Text>
                <Text fontSize={14} fontWeight={400} color="gray.500" textAlign="center" lineHeight={20}>
                  Esta ação é irreversível. O exame será removido permanentemente.
                </Text>
                {examToDelete?.laboratoryName && (
                  <Text fontSize={12} fontWeight={600} color="gray.600" textAlign="center" mt={1}>
                    {examToDelete.laboratoryName}
                  </Text>
                )}
              </VStack>

              <HStack space={3} w="100%" mt={2}>
                <NativeBaseButton
                  flex={1}
                  variant="outline"
                  borderColor="gray.300"
                  _text={{ color: 'gray.600', fontWeight: 600 }}
                  onPress={() => {
                    setIsDeleteModalOpen(false);
                    setExamToDelete(null);
                  }}
                  isDisabled={isDeleting}
                  borderRadius={10}
                >
                  Cancelar
                </NativeBaseButton>
                <NativeBaseButton
                  flex={1}
                  bg="red.500"
                  _pressed={{ bg: 'red.600' }}
                  _text={{ fontWeight: 600 }}
                  onPress={handleDeleteExam}
                  isLoading={isDeleting}
                  isDisabled={isDeleting}
                  borderRadius={10}
                >
                  Excluir
                </NativeBaseButton>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      {/* ActionSheet de opções (Reprocessar/Excluir) */}
      <Actionsheet isOpen={isActionSheetOpen} onClose={onActionSheetClose}>
        <Actionsheet.Content>
          <Box w="100%" px={4} py={2}>
            <Text fontSize={16} fontWeight={700} color="gray.700" textAlign="center">
              {selectedExamForAction?.laboratoryName || 'Exame'}
            </Text>
            <Text fontSize={12} fontWeight={400} color="gray.400" textAlign="center" mt={1}>
              O que deseja fazer com este exame?
            </Text>
          </Box>

          <Actionsheet.Item
            onPress={handleReprocessExam}
            isDisabled={isReprocessing}
            _pressed={{ bg: 'blue.50' }}
          >
            <HStack space={3} alignItems="center">
              <RotateRightIcon color="#3B82F6" size="22" />
              <VStack>
                <Text fontSize={16} fontWeight={600} color="blue.600">
                  {isReprocessing ? 'Reprocessando...' : 'Reprocessar'}
                </Text>
                <Text fontSize={12} fontWeight={400} color="gray.500">
                  Enviar novamente para processamento
                </Text>
              </VStack>
            </HStack>
          </Actionsheet.Item>

          <Actionsheet.Item
            onPress={handleDeleteFromActionSheet}
            isDisabled={isReprocessing}
            _pressed={{ bg: 'red.50' }}
          >
            <HStack space={3} alignItems="center">
              <TrashIcon color="#EF4444" size="22" />
              <VStack>
                <Text fontSize={16} fontWeight={600} color="red.500">
                  Excluir
                </Text>
                <Text fontSize={12} fontWeight={400} color="gray.500">
                  Remover exame permanentemente
                </Text>
              </VStack>
            </HStack>
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </VStack>
  );
}
