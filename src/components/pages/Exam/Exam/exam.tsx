import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { VStack, Text, HStack, ScrollView, IScrollViewProps, Badge, Divider, Box, Modal, Button as NativeBaseButton } from 'native-base';

// routes

// assets
import { AddSquareIcon, ChartIcon, TrashIcon } from '@assets/icons';

// components
import { BottomSheetModal, BottomSheetView, BottomSheetScrollView, BottomSheetBackdrop, TouchableOpacity } from '@gorhom/bottom-sheet';
import { HeaderDescription, HistoryChart } from '@components/molecules';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useExam } from 'src/hooks/useExam';
import { useCustomToast } from 'src/hooks/useCustomToast';
import { formatDateToBrazilian } from '@utils/dateFormatter';
import { formatExamValue } from '@utils/numberFormatter';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AppNavigatorRoutesProps, AppRoutes } from '@routes/app.routes';
import { Alert, Linking } from 'react-native';

type HistoryDataPoint = {
  value: number;
  date: string;
  label: string;
};

type ExamScreenRouteProp = RouteProp<AppRoutes, 'exam'>;

export function Exam() {
  const route = useRoute<ExamScreenRouteProp>();
  const examIdFromParams = route.params?.examId;
  const { examSelected, selectExamById, examData, deleteExam } = useExam();
  const { showSuccess, showError } = useCustomToast();

  // Estado para modal de confirmação de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Se vier examId por parâmetro (ex: via push notification), seleciona o exame
  useEffect(() => {
    if (examIdFromParams) {
      console.log('[Exam] Carregando exame via parâmetro:', examIdFromParams);
      selectExamById(examIdFromParams);
    }
  }, [examIdFromParams]);
  const [bottomSheetText, setBottomSheetText] = useState<string>('');
  const [bottomSheetTitle, setBottomSheetTitle] = useState<string>('');
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const historyBottomSheetRef = useRef<BottomSheetModal>(null);

  // Estado para o gráfico de histórico
  const [historyData, setHistoryData] = useState<HistoryDataPoint[]>([]);
  const [historyItemDescription, setHistoryItemDescription] = useState<string>('');
  const [historyItemUnit, setHistoryItemUnit] = useState<string>('');

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
              history.push({
                value,
                date: formatDateToBrazilian(exam.createdDate),
                label: `${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`,
              });
            }
          }
        }
      });

      return history;
    },
    [examData]
  );

  // Handler para abrir o gráfico de histórico
  const handleOpenHistory = useCallback(
    (itemDescription: string, itemUnit: string) => {
      const history = buildHistoryData(itemDescription, itemUnit);

      setHistoryData(history);
      setHistoryItemDescription(itemDescription);
      setHistoryItemUnit(itemUnit);
      handlePresentHistoryModal();
    },
    [buildHistoryData, handlePresentHistoryModal]
  );

  function getColor(color: string) {
    if (color === 'Green') {
      return '#00B39D';
    } else if (color === 'Yellow') {
      return '#F59E0B'; // Amarelo para valores abaixo da referência
    } else if (color === 'Red') {
      return '#FA4D5E';
    }
    return '#00B39D';
  }

  function formatReferenceValue(
    referenceMin: number | null | undefined,
    referenceMax: number | null | undefined,
    unit: string
  ): string {
    // Se tem min e max, mostra a faixa
    if (referenceMin != null && referenceMax != null) {
      return `${referenceMin} - ${referenceMax} ${unit}`;
    }
    // Se só tem max (ex: "até 100")
    if (referenceMax != null) {
      return `até ${referenceMax} ${unit}`;
    }
    // Se só tem min (ex: "> 40")
    if (referenceMin != null) {
      return `> ${referenceMin} ${unit}`;
    }
    // Fallback: retorna apenas a unidade
    return unit;
  }

  /**
   * Calcula a porcentagem de preenchimento do círculo baseado nos valores de referência
   *
   * Lógica:
   * - Verde (dentro da ref): 100% preenchido
   * - Amarelo (abaixo da ref): proporcional - valor/referênciaMin
   * - Vermelho (acima da ref): 100% preenchido
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

    // Vermelho: acima da referência - sempre 100%
    if (color === 'Red') {
      return 100;
    }

    // Amarelo: abaixo da referência - preenchimento proporcional
    if (color === 'Yellow') {
      // Usa referenceMin como alvo (o valor que deveria atingir)
      const target = referenceMin ?? referenceMax;
      if (target != null && target > 0) {
        const percentage = (numericValue / target) * 100;
        // Mínimo de 20% para não ficar visualmente estranho, máximo 95%
        return Math.min(Math.max(percentage, 20), 95);
      }
      // Fallback: sem referência, mostra 50%
      return 50;
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
      return (
        <>
          <VStack flex={1}>
            <Text fontSize={30} fontWeight={800} letterSpacing={-0.16}>
              {item.examItemDescription}
            </Text>

            <HStack space={6} mt={2}>
              <Box w={144} h={144} alignItems="center" justifyContent="center">
                <AnimatedCircularProgress
                  size={144}
                  lineCap="round"
                  width={20}
                  fill={getFillPercentage(
                    item.medicalExamItemReferenceValue,
                    item.referenceMin,
                    item.referenceMax,
                    item.medicalExamItemWeightColor
                  )}
                  rotation={90}
                  tintColor={getColor(item.medicalExamItemWeightColor) || '#00B39D'}
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
                    color={getColor(item.medicalExamItemWeightColor)}
                    fontSize={(() => {
                      const valueLength = item.medicalExamItemReferenceValue?.toString().length || 0;
                      return valueLength > 7 ? 32 : valueLength > 6 ? 36 : 42;
                    })()}
                    fontWeight={800}
                    letterSpacing={-1}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {formatExamValue(item.medicalExamItemReferenceValue)}
                  </Text>
                  <Text
                    mt={-2}
                    mx={2}
                    color="gray.500"
                    fontSize={10}
                    fontWeight={600}
                    letterSpacing={0}
                    textAlign="center"
                  >
                    Ref: {formatReferenceValue(item.referenceMin, item.referenceMax, item.medicalExamItemMeasureUnit)}
                  </Text>
                </Box>
              </Box>

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
                  onPress={() => handleOpenHistory(item.examItemDescription, item.medicalExamItemMeasureUnit)}
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
      console.warn('Falha ao abrir link externo', e);
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
                    Exame: {formatDateToBrazilian(examSelected.examDate)}
                  </Text>
                )}
                {examSelected.examDate && examSelected.createdDate && (
                  <Text fontSize={14} color="gray.400" mx={2}>·</Text>
                )}
                <Text fontSize={14} fontWeight={500} color="gray.500">
                  Enviado: {formatDateToBrazilian(examSelected.createdDate)}
                </Text>
              </HStack>
              {examSelected.doctorName && (
                <Text fontSize={14} fontWeight={600} color="gray.700" textTransform="capitalize">
                  Dr(a). {examSelected.doctorName.toLowerCase()}
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
            <VStack space={3} mt={2}>
              <Box p={4} bg="gray.50" borderRadius={12}>
                <Text fontSize={12} fontWeight={700} color="gray.700" mb={2}>
                  📚 Fontes e Referências
                </Text>
                <VStack space={2}>
                  <TouchableOpacity onPress={() => openExternalLink('https://www.who.int/health-topics')}>
                    <Text fontSize={10} fontWeight={500} color="primary.600">
                      🔗 Organização Mundial da Saúde (OMS) — https://www.who.int/health-topics
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openExternalLink('https://www.gov.br/saude')}>
                    <Text fontSize={10} fontWeight={500} color="primary.600">
                      🔗 Ministério da Saúde (Brasil) — https://www.gov.br/saude
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openExternalLink('https://www.mayocliniclabs.com')}>
                    <Text fontSize={10} fontWeight={500} color="primary.600">
                      🔗 Mayo Clinic Laboratories — https://www.mayocliniclabs.com
                    </Text>
                  </TouchableOpacity>
                  <Text fontSize={10} fontWeight={400} color="gray.600" lineHeight={16} mt={2}>
                    As análises e recomendações são baseadas em diretrizes médicas estabelecidas. Consulte sempre seu
                    médico para interpretação personalizada.
                  </Text>
                </VStack>
              </Box>

              <Box p={4} bg="yellow.50" borderRadius={12}>
                <Text fontSize={10} fontWeight={500} color="gray.700" lineHeight={16}>
                  ⚠️ Aviso Médico: As informações fornecidas pelo aplicativo têm caráter informativo e não substituem a
                  orientação, diagnóstico ou tratamento de profissionais de saúde. Sempre busque a avaliação de um
                  médico antes de tomar qualquer decisão relacionada à sua saúde.
                </Text>
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
          <BottomSheetView>
            <VStack mx={6} alignItems="center">
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
                width="100%"
                mt={4}
                textAlign="justify"
              >
                {bottomSheetText}
              </Text>
            </VStack>
          </BottomSheetView>
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
                  Gráfico Evolutivo
                </Text>
              </HStack>

              <HistoryChart
                examItemDescription={historyItemDescription}
                historyData={historyData}
                unit={historyItemUnit}
                color="#00B39D"
              />
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
    </>
  );
}
