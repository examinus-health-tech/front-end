import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { VStack, Text, HStack, ScrollView, IScrollViewProps, Badge, Divider, Box, Modal, Button as NativeBaseButton, useDisclose } from 'native-base';

// routes

// assets
import { AddSquareIcon, ChartIcon, TrashIcon } from '@assets/icons';

// components
import { BottomSheetModal, BottomSheetView, BottomSheetScrollView, BottomSheetBackdrop, TouchableOpacity } from '@gorhom/bottom-sheet';
import { HeaderDescription, HistoryChart } from '@components/molecules';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useExam } from 'src/hooks/useExam';
import { useCustomToast } from 'src/hooks/useCustomToast';
import { formatDateToBrazilian, formatDateToBrazilianNoTime } from '@utils/dateFormatter';
import { formatExamValue } from '@utils/numberFormatter';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AppNavigatorRoutesProps, AppRoutes } from '@routes/app.routes';
import { Alert, Linking } from 'react-native';
import { shouldShowReviewPromptOnPositiveAction } from '@services/reviewService';
import { ReviewBottomSheet } from '@components/molecules';

type HistoryDataPoint = {
  value: number;
  date: string;
  label: string;
};

type QualitativeHistoryPoint = {
  value: string;
  date: string;
  color: string;
};

type ExamScreenRouteProp = RouteProp<AppRoutes, 'exam'>;

export function Exam() {
  const route = useRoute<ExamScreenRouteProp>();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const examIdFromParams = route.params?.examId;
  const { examSelected, selectExamById, examData, deleteExam } = useExam();
  const { showSuccess, showError, showInfo } = useCustomToast();

  // Estado para modal de confirmação de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estado para loading quando vem de push notification
  const [isLoadingExam, setIsLoadingExam] = useState(false);

  // Estado para prompt de avaliação
  const { isOpen: isReviewOpen, onOpen: onReviewOpen, onClose: onReviewClose } = useDisclose();

  // Se vier examId por parâmetro (ex: via push notification), seleciona o exame
  useEffect(() => {
    async function loadExamFromParams() {
      if (examIdFromParams) {
        if (__DEV__) console.log('[Exam] Carregando exame via parâmetro:', examIdFromParams);
        setIsLoadingExam(true);

        try {
          const found = await selectExamById(examIdFromParams);

          if (!found) {
            if (__DEV__) console.warn('[Exam] Exame não encontrado:', examIdFromParams);
            showInfo({
              title: 'Exame não encontrado',
              description: 'O exame pode ainda estar sendo processado. Verifique a lista de exames.',
            });
            navigation.navigate('examList');
          }
        } catch (error) {
          if (__DEV__) console.error('[Exam] Erro ao carregar exame:', error);
          showError({
            title: 'Erro ao carregar',
            description: 'Não foi possível carregar o exame. Tente novamente.',
          });
          navigation.navigate('examList');
        } finally {
          setIsLoadingExam(false);
        }
      }
    }

    loadExamFromParams();
  }, [examIdFromParams]);

  // Verifica se deve mostrar prompt de avaliação após visualizar exame (ação positiva)
  useEffect(() => {
    async function checkReviewPrompt() {
      // Só verifica se o exame foi carregado com sucesso e tem itens
      if (!examSelected?.medicalExamId || !examSelected?.medicalExamItems?.length) return;

      const shouldShow = await shouldShowReviewPromptOnPositiveAction();
      if (shouldShow) {
        // Delay para o usuário ter tempo de ver o conteúdo
        setTimeout(() => {
          onReviewOpen();
        }, 3000);
      }
    }

    checkReviewPrompt();
  }, [examSelected?.medicalExamId]);

  const [bottomSheetText, setBottomSheetText] = useState<string>('');
  const [bottomSheetTitle, setBottomSheetTitle] = useState<string>('');
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const historyBottomSheetRef = useRef<BottomSheetModal>(null);

  // Estado para o gráfico de histórico
  const [historyData, setHistoryData] = useState<HistoryDataPoint[]>([]);
  const [qualitativeHistoryData, setQualitativeHistoryData] = useState<QualitativeHistoryPoint[]>([]);
  const [historyItemDescription, setHistoryItemDescription] = useState<string>('');
  const [historyItemUnit, setHistoryItemUnit] = useState<string>('');
  const [isQualitativeHistory, setIsQualitativeHistory] = useState(false);

  const snapPoints = useMemo(() => ['40%', '60%', '80%'], []);
  const historySnapPoints = useMemo(() => ['70%', '90%'], []);

  const scrollRef = useRef<IScrollViewProps>(null);

  // Backdrop animado para os BottomSheets
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

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handlePresentHistoryModal = useCallback(() => {
    historyBottomSheetRef.current?.present();
  }, []);

  // Função para construir o histórico de um item específico
  const buildHistoryData = useCallback(
    (itemDescription: string, itemUnit: string) => {
      if (!examData || examData.length === 0) {
        return [];
      }

      const history: HistoryDataPoint[] = [];

      // Percorrer todos os exames em ordem cronológica
      const sortedExams = [...examData].sort(
        (a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      );

      sortedExams.forEach((exam) => {
        if (exam.medicalExamItems && Array.isArray(exam.medicalExamItems)) {
          const matchingItem = exam.medicalExamItems.find(
            (item: any) => item.examItemDescription.toLowerCase() === itemDescription.toLowerCase()
          );

          if (matchingItem) {
            const value = parseFloat(matchingItem.medicalExamItemReferenceValue);
            if (!isNaN(value)) {
              const date = new Date(exam.createdDate);
              const day = date.getDate().toString().padStart(2, '0');
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              history.push({
                value,
                date: formatDateToBrazilian(exam.createdDate),
                label: `${day}/${month}`,
              });
            }
          }
        }
      });

      return history;
    },
    [examData]
  );

  // Função para construir o histórico qualitativo de um item
  const buildQualitativeHistoryData = useCallback(
    (itemDescription: string) => {
      if (!examData || examData.length === 0) return [];

      const history: QualitativeHistoryPoint[] = [];
      const sortedExams = [...examData].sort(
        (a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      );

      sortedExams.forEach((exam) => {
        if (exam.medicalExamItems && Array.isArray(exam.medicalExamItems)) {
          const matchingItem = exam.medicalExamItems.find(
            (item: any) => item.examItemDescription.toLowerCase() === itemDescription.toLowerCase()
          );

          if (matchingItem && matchingItem.medicalExamItemReferenceValue) {
            history.push({
              value: matchingItem.medicalExamItemReferenceValue,
              date: formatDateToBrazilian(exam.createdDate),
              color: matchingItem.medicalExamItemWeightColor,
            });
          }
        }
      });

      return history;
    },
    [examData]
  );

  // Handler para abrir o gráfico de histórico
  const handleOpenHistory = useCallback(
    (itemDescription: string, itemUnit: string, currentValue: string) => {
      const isQualitative = isNaN(parseFloat(currentValue));

      if (isQualitative) {
        const qualHistory = buildQualitativeHistoryData(itemDescription);
        setQualitativeHistoryData(qualHistory);
        setIsQualitativeHistory(true);
        setHistoryData([]);
      } else {
        const history = buildHistoryData(itemDescription, itemUnit);
        setHistoryData(history);
        setIsQualitativeHistory(false);
        setQualitativeHistoryData([]);
      }

      setHistoryItemDescription(itemDescription);
      setHistoryItemUnit(itemUnit);
      handlePresentHistoryModal();
    },
    [buildHistoryData, buildQualitativeHistoryData, handlePresentHistoryModal]
  );

  /**
   * Verifica se o valor está dentro da faixa de referência
   * Retorna a cor corrigida baseada na posição do valor em relação à referência
   */
  function getCorrectedColor(
    value: string,
    referenceMin: number | null | undefined,
    referenceMax: number | null | undefined,
    backendColor: string
  ): string {
    const numericValue = parseFloat(value);

    // Se não for numérico (Negativo, Positivo, etc), usa a cor do backend
    if (isNaN(numericValue)) {
      return backendColor;
    }

    // Verifica se está dentro da referência
    const hasMin = referenceMin != null;
    const hasMax = referenceMax != null;

    if (hasMin && hasMax) {
      // Tem min e max: verifica se está na faixa
      if (numericValue >= referenceMin && numericValue <= referenceMax) {
        return 'Green'; // Dentro da referência = Verde
      }
    } else if (hasMin && !hasMax) {
      // Só tem min (ex: > 40)
      if (numericValue >= referenceMin) {
        return 'Green';
      }
    } else if (!hasMin && hasMax) {
      // Só tem max (ex: até 100)
      if (numericValue <= referenceMax) {
        return 'Green';
      }
    }

    // Se não está dentro da referência, usa a cor do backend
    return backendColor;
  }

  function getColor(color: string) {
    if (color === 'Green') {
      return '#0CC1AF'; // Ciano Examinus
    } else if (color === 'Yellow') {
      return '#F59E0B'; // Amarelo para atenção
    } else if (color === 'Red') {
      return '#FA4D5E'; // Vermelho para risco
    }
    return '#0CC1AF';
  }

  function formatReferenceValue(
    referenceMin: number | null | undefined,
    referenceMax: number | null | undefined,
    unit: string
  ): string {
    // Formata número com separador de milhar pt-BR
    const formatNum = (n: number) => n.toLocaleString('pt-BR');

    // Se tem min e max, mostra a faixa
    if (referenceMin != null && referenceMax != null) {
      return `${formatNum(referenceMin)} - ${formatNum(referenceMax)} ${unit}`;
    }
    // Se só tem max
    if (referenceMax != null) {
      return `< ${formatNum(referenceMax)} ${unit}`;
    }
    // Se só tem min
    if (referenceMin != null) {
      return `> ${formatNum(referenceMin)} ${unit}`;
    }
    // Exames qualitativos não possuem faixa de referência numérica
    // A unidade pode vir como "Qualitativo" ou vazia (quando o PDF não traz unidade)
    if (!unit || unit.trim() === '' || unit.toLowerCase() === 'qualitativo') {
      return 'Qualitativo';
    }
    // Sem referência
    return `-- ${unit}`;
  }

  /**
   * Calcula a porcentagem de preenchimento do círculo baseado na cor/classificação
   *
   * Lógica visual:
   * - Verde (normal): 100% preenchido - indica resultado ideal
   * - Amarelo (atenção): 65% preenchido - indica que precisa de atenção
   * - Vermelho (risco): 100% preenchido - indica alerta máximo
   * - Qualitativos (Negativo/Positivo): 100%
   */
  function getFillPercentage(
    value: string,
    referenceMin: number | null | undefined,
    referenceMax: number | null | undefined,
    color: string
  ): number {
    const numericValue = parseFloat(value);

    // Qualitativos (Negativo, Positivo, Reagente, etc) - sempre 100%
    if (isNaN(numericValue)) {
      return 100;
    }

    // Verde: dentro da referência - sempre 100%
    if (color === 'Green') {
      return 100;
    }

    // Vermelho: acima/abaixo crítico - sempre 100% (alerta máximo)
    if (color === 'Red') {
      return 100;
    }

    // Amarelo: atenção - preenchimento parcial fixo para indicar visualmente
    if (color === 'Yellow') {
      return 65;
    }

    // Fallback geral
    return 100;
  }

  function renderExamItem() {
    // Validação segura do array
    if (!examSelected?.medicalExamItems || !Array.isArray(examSelected.medicalExamItems)) {
      return (
        <VStack flex={1} alignItems="center" mt={8}>
          <Text fontSize={16} color="gray.500">
            Nenhum item de exame disponível
          </Text>
        </VStack>
      );
    }

    return examSelected.medicalExamItems.map((item: any, index: number) => {
      // Log para identificar referências problemáticas
      const hasValidReference = item.referenceMin != null && item.referenceMax != null;
      const isInvalidPercentRef = item.referenceMax === 100 && item.medicalExamItemMeasureUnit === '%' && item.referenceMin == null;

      if (!hasValidReference || isInvalidPercentRef) {
        if (__DEV__) console.warn(`⚠️ [REFERÊNCIA FALTANDO] ${item.examItemDescription}:`, {
          valor: item.medicalExamItemReferenceValue,
          unidade: item.medicalExamItemMeasureUnit,
          referenceMin: item.referenceMin,
          referenceMax: item.referenceMax,
          corBackend: item.medicalExamItemWeightColor,
        });
      }

      // Corrige a cor baseado nos valores de referência
      const correctedColor = getCorrectedColor(
        item.medicalExamItemReferenceValue,
        item.referenceMin,
        item.referenceMax,
        item.medicalExamItemWeightColor
      );

      return (
        <>
          <VStack flex={1}>
            <Text fontSize={30} fontWeight={800} letterSpacing={-0.16}>
              {item.examItemDescription}
            </Text>

            <HStack space={6} mt={2}>
              <VStack alignItems="center">
                <Box w={144} h={144} alignItems="center" justifyContent="center">
                  <AnimatedCircularProgress
                    size={144}
                    lineCap="round"
                    width={20}
                    fill={getFillPercentage(
                      item.medicalExamItemReferenceValue,
                      item.referenceMin,
                      item.referenceMax,
                      correctedColor
                    )}
                    rotation={90}
                    tintColor={getColor(correctedColor) || '#0CC1AF'}
                    backgroundColor="#DCE1E8"
                    delay={10}
                  />
                  {/* Inset shadow effect - thin dark border on outer edge */}
                  <Box
                    position="absolute"
                    w={144}
                    h={144}
                    borderRadius={999}
                    borderWidth={1}
                    borderColor="rgba(0,0,0,0.08)"
                    pointerEvents="none"
                  />
                  {/* Inner circle with shadow - positioned absolutely over the progress */}
                  <Box
                    position="absolute"
                    bg="white"
                    borderRadius={999}
                    w={100}
                    h={100}
                    alignItems="center"
                    justifyContent="center"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.35,
                      shadowRadius: 10,
                      elevation: 10,
                    }}
                  >
                    <Text
                      color={getColor(correctedColor)}
                      fontSize={(() => {
                        const formatted = formatExamValue(item.medicalExamItemReferenceValue);
                        const len = formatted?.length || 0;
                        if (len > 6) return 24;
                        if (len > 4) return 30;
                        return 36;
                      })()}
                      fontWeight={800}
                      letterSpacing={-1}
                    >
                      {formatExamValue(item.medicalExamItemReferenceValue)}
                    </Text>
                  </Box>
                </Box>
                {(item.referenceMin != null || item.referenceMax != null) && (
                  <Text
                    mt={2}
                    color="gray.500"
                    fontSize={16}
                    fontWeight={600}
                    textAlign="center"
                    maxW={144}
                  >
                    Ref: {formatReferenceValue(item.referenceMin, item.referenceMax, item.medicalExamItemMeasureUnit)}
                  </Text>
                )}
              </VStack>

              <VStack flex={1} space={2} justifyContent="center">
                <TouchableOpacity
                  onPress={() => {
                    const explanation = item.examItemExplanation || 'Informação ainda não disponível para este exame.';
                    setBottomSheetText(explanation.replace(/\n/g, ' '));
                    setBottomSheetTitle('Desmistificando');
                    handlePresentModalPress();
                  }}
                >
                  <HStack space={2} alignItems="center">
                    <AddSquareIcon size="28" />
                    <Text fontSize={16} fontWeight={800} letterSpacing={-0.16}>
                      Desmistificando
                    </Text>
                  </HStack>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setBottomSheetText(item.medicalExamItemWeightSummaryExplanation.replace(/\n/g, ' '));
                    setBottomSheetTitle('Sobre o resultado');
                    handlePresentModalPress();
                  }}
                >
                  <HStack space={2} alignItems="center">
                    <AddSquareIcon size="28" />

                    <Text fontSize={16} fontWeight={800} letterSpacing={-0.16}>
                      Sobre o resultado
                    </Text>
                  </HStack>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setBottomSheetText(item.medicalExamItemWeightActionRecommendation.replace(/\n/g, ' '));
                    setBottomSheetTitle('O que fazer?');
                    handlePresentModalPress();
                  }}
                >
                  <HStack space={2} alignItems="center">
                    <AddSquareIcon size="28" />

                    <Text fontSize={16} fontWeight={800} letterSpacing={-0.16}>
                      O que fazer?
                    </Text>
                  </HStack>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleOpenHistory(item.examItemDescription, item.medicalExamItemMeasureUnit, item.medicalExamItemReferenceValue)}
                >
                  <HStack space={2} alignItems="center">
                    <ChartIcon size="28" duotone />
                    <Text fontSize={14} fontWeight={600} letterSpacing={-0.16} color="ciano.300">
                      Ver histórico de resultados
                    </Text>
                  </HStack>
                </TouchableOpacity>
              </VStack>
            </HStack>
          </VStack>

          {examSelected.medicalExamItems.length > 1 && <Divider my={6} />}
        </>
      );
    });
  }

  const openExternalLink = useCallback(async (url: string) => {
    try {
      if (!url) {
        Alert.alert('Link inválido', 'Nenhuma URL foi fornecida.');
        return;
      }

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Não foi possível abrir o link', 'O formato do link não é suportado neste dispositivo.');
      }
    } catch (e) {
      if (__DEV__) console.warn('Falha ao abrir link externo', e);
      Alert.alert('Erro ao abrir link', 'Ocorreu um problema ao abrir o link. Tente novamente.');
    }
  }, []);

  const handleDeleteExam = useCallback(async () => {
    if (!examSelected?.medicalExamId) return;

    setIsDeleting(true);
    try {
      await deleteExam(examSelected.medicalExamId);
      setIsDeleteModalOpen(false);
      showSuccess({
        title: 'Exame excluído',
        description: 'O exame foi removido com sucesso.',
      });
      navigation.navigate('examList');
    } catch (error) {
      showError({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o exame. Tente novamente.',
      });
    } finally {
      setIsDeleting(false);
    }
  }, [examSelected, deleteExam, navigation, showSuccess, showError]);

  // Mostrar loading enquanto carrega exame via parâmetro
  if (isLoadingExam) {
    return (
      <VStack flex={1} alignItems="center" justifyContent="center" bg="white">
        <Text fontSize={16} color="gray.500">Carregando exame...</Text>
      </VStack>
    );
  }

  // Verificar se há exame selecionado (evita tela vazia)
  if (!examSelected?.medicalExamId && !examIdFromParams) {
    return (
      <VStack flex={1} alignItems="center" justifyContent="center" bg="white" px={6}>
        <Text fontSize={18} fontWeight={600} color="gray.700" textAlign="center">
          Nenhum exame selecionado
        </Text>
        <Text fontSize={14} color="gray.500" textAlign="center" mt={2}>
          Selecione um exame na lista para visualizar os detalhes.
        </Text>
      </VStack>
    );
  }

  return (
    <>
      <VStack my={16}>
        <HeaderDescription
          title={examSelected.laboratoryName || 'Laboratório'}
          withBackButton={() => navigation.navigate('examList')}
          position="fixed"
          onDeletePress={() => setIsDeleteModalOpen(true)}
        />

        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
          <VStack flex={1} mx={6} mt={4} mb={20} space={4}>
            {/* Informações do exame */}
            <VStack space={1} pb={3} borderBottomWidth={1} borderBottomColor="gray.200">
              <HStack flexWrap="wrap" alignItems="center">
                {examSelected.examDate && (
                  <Text fontSize={14} fontWeight={600} color="gray.700">
                    Exame: {formatDateToBrazilianNoTime(examSelected.examDate)}
                  </Text>
                )}
                {examSelected.examDate && examSelected.createdDate && (
                  <Text fontSize={14} color="gray.400" mx={2}>·</Text>
                )}
                <Text fontSize={14} fontWeight={500} color="gray.500">
                  Enviado: {formatDateToBrazilian(examSelected.createdDate)}
                </Text>
              </HStack>

              {/* Médicos */}
              {examSelected.requestingDoctorName && (
                <Text fontSize={13} fontWeight={500} color="gray.600" mt={1} numberOfLines={2} ellipsizeMode="tail">
                  Solicitante: {examSelected.requestingDoctorName}
                </Text>
              )}
              {examSelected.responsibleDoctorName && (
                <Text fontSize={13} fontWeight={500} color="gray.600" numberOfLines={2} ellipsizeMode="tail">
                  Responsável: {examSelected.responsibleDoctorName}
                </Text>
              )}
              {/* Fallback para o campo legado se não tiver os novos */}
              {!examSelected.requestingDoctorName && !examSelected.responsibleDoctorName && examSelected.doctorName && (
                <Text fontSize={13} fontWeight={500} color="gray.600" mt={1} numberOfLines={2} ellipsizeMode="tail">
                  Médico: {examSelected.doctorName}
                </Text>
              )}

              {/* Convênio */}
              {examSelected.healthInsuranceName && (
                <Text fontSize={13} fontWeight={500} color="gray.500">
                  Convênio: {examSelected.healthInsuranceName}
                </Text>
              )}

              <Text fontSize={12} fontWeight={400} color="gray.400" mt={2} lineHeight={16}>
                Dados extraídos e analisados automaticamente pela inteligência Examinus a partir do documento enviado.
              </Text>
            </VStack>
            {/* <Badge
            borderRadius={12}
            bg="gray.200"
            pl={0}
            _text={{
              color: 'gray.600',
              fontSize: 18,
              textAlign: 'center',
            }}
            w={140}
          >
            Eritograma
          </Badge> */}

            {renderExamItem()}

            {/* Medical Information Sources */}
            <VStack space={3} mt={1}>
              <Box p={4} bg="white" borderRadius={12} borderWidth={1} borderColor="gray.200">
                <Text fontSize={12} fontWeight={600} color="gray.600" mb={3}>
                  Fontes e Referências
                </Text>
                <VStack space={2}>
                  <TouchableOpacity onPress={() => openExternalLink('https://www.who.int/health-topics')}>
                    <Text fontSize={12} fontWeight={500} color="ciano.600">
                      ↗ Organização Mundial da Saúde (OMS)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openExternalLink('https://www.gov.br/saude')}>
                    <Text fontSize={12} fontWeight={500} color="ciano.600">
                      ↗ Ministério da Saúde (Brasil)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openExternalLink('https://www.mayocliniclabs.com')}>
                    <Text fontSize={12} fontWeight={500} color="ciano.600">
                      ↗ Mayo Clinic Laboratories
                    </Text>
                  </TouchableOpacity>
                </VStack>
              </Box>

              <Box p={4} bg="orange.50" borderRadius={12}>
                <HStack alignItems="flex-start" space={2}>
                  <Text fontSize={14}>⚠️</Text>
                  <Text fontSize={12} fontWeight={500} color="gray.700" lineHeight={16} flex={1}>
                    As informações fornecidas têm caráter informativo e não substituem orientação médica. Consulte um profissional de saúde.
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </VStack>
        </ScrollView>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          keyboardBehavior="fillParent"
          backdropComponent={renderBackdrop}
        >
          <BottomSheetScrollView>
            <VStack px={6} pb={8}>
              <HStack justifyContent="space-between" alignItems="center" width="100%" mt={4}>
                <Text fontSize={24} fontWeight={500} letterSpacing={-0.16} color="gray.600">
                  {bottomSheetTitle}
                </Text>
              </HStack>

              <Text
                fontSize={16}
                fontWeight={400}
                letterSpacing={-0.16}
                color="gray.600"
                mt={4}
                textAlign="left"
              >
                {bottomSheetText}
              </Text>
            </VStack>
          </BottomSheetScrollView>
        </BottomSheetModal>

        {/* BottomSheet para o gráfico de histórico */}
        <BottomSheetModal
          ref={historyBottomSheetRef}
          index={0}
          snapPoints={historySnapPoints}
          keyboardBehavior="fillParent"
          backdropComponent={renderBackdrop}
        >
          <BottomSheetScrollView>
            <VStack mx={6} pb={8}>
              <HStack justifyContent="space-between" alignItems="center" width="100%" mt={2} mb={4}>
                <Text fontSize={20} fontWeight={700} letterSpacing={-0.16} color="gray.800">
                  {isQualitativeHistory ? 'Histórico de Resultados' : 'Gráfico Evolutivo'}
                </Text>
              </HStack>

              {isQualitativeHistory ? (
                qualitativeHistoryData.length === 0 ? (
                  <VStack flex={1} alignItems="center" justifyContent="center" py={8}>
                    <Text fontSize={14} color="gray.500" textAlign="center">
                      Nenhum dado disponível para{'\n'}mostrar o histórico
                    </Text>
                  </VStack>
                ) : (
                  <VStack space={0}>
                    <Text fontSize={18} fontWeight={700} color="gray.800" mb={4}>
                      {historyItemDescription}
                    </Text>
                    {[...qualitativeHistoryData].reverse().map((point, index, arr) => (
                      <HStack key={index} alignItems="stretch" space={3}>
                        {/* Linha vertical da timeline */}
                        <VStack alignItems="center" w={4}>
                          {index > 0 && <Box w={2} flex={1} bg="gray.200" />}
                          <Box w={4} h={4} borderRadius={999} bg={getColor(point.color)} borderWidth={2} borderColor="white" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 2, elevation: 2 }} />
                          {index < arr.length - 1 && <Box w={2} flex={1} bg="gray.200" />}
                        </VStack>
                        <VStack flex={1} py={3}>
                          <HStack alignItems="center" space={2}>
                            <Text fontSize={16} fontWeight={700} color={getColor(point.color)}>
                              {point.value}
                            </Text>
                            {index === 0 && (
                              <Badge borderRadius={8} bg="gray.100" _text={{ fontSize: 10, color: 'gray.500', fontWeight: 600 }} px={2} py={0}>
                                Mais recente
                              </Badge>
                            )}
                          </HStack>
                          <Text fontSize={13} color="gray.400" mt={1}>
                            {point.date}
                          </Text>
                        </VStack>
                      </HStack>
                    ))}
                  </VStack>
                )
              ) : (
                <HistoryChart
                  examItemDescription={historyItemDescription}
                  historyData={historyData}
                  unit={historyItemUnit}
                  color="#0CC1AF"
                />
              )}
            </VStack>
          </BottomSheetScrollView>
        </BottomSheetModal>
      </VStack>

      {/* Modal de confirmação de exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        closeOnOverlayClick={!isDeleting}
      >
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
              </VStack>

              <HStack space={3} w="100%" mt={2}>
                <NativeBaseButton
                  flex={1}
                  variant="outline"
                  borderColor="gray.300"
                  _text={{ color: 'gray.600', fontWeight: 600 }}
                  onPress={() => setIsDeleteModalOpen(false)}
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

      {/* Bottom Sheet de Avaliação */}
      <ReviewBottomSheet isOpen={isReviewOpen} onClose={onReviewClose} />
    </>
  );
}
