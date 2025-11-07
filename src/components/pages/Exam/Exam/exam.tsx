import React, { useCallback, useMemo, useRef, useState } from 'react';
import { VStack, Text, HStack, ScrollView, IScrollViewProps, Badge, Divider, Box } from 'native-base';

// routes

// assets
import { AddSquareIcon, ChartIcon } from '@assets/icons';

// components
import { BottomSheetModal, BottomSheetView, TouchableOpacity } from '@gorhom/bottom-sheet';
import { HeaderDescription } from '@components/molecules';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useExam } from 'src/hooks/useExam';
import { formatDateToBrazilian } from '@utils/dateFormatter';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Alert, Linking } from 'react-native';

export function Exam() {
  const { examSelected } = useExam();
  const [shadowOpacity, setShadowOpacity] = useState<0 | 60>(0);
  const [bottomSheetText, setBottomSheetText] = useState<string>('');
  const [bottomSheetTitle, setBottomSheetTitle] = useState<string>('');
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['40%', '60%', '80%'], []);

  const scrollRef = useRef<IScrollViewProps>(null);

  const handleSheetChanges = (value: number) => {
    if (value === -1) {
      return setShadowOpacity(0);
    }
    return setShadowOpacity(60);
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  function getColor(color: string) {
    if (color === 'Green') {
      return '#00B39D';
    } else if (color === 'Yellow') {
      return '#00B39D';
    } else if (color === 'Red') {
      return '#FA4D5E';
    }
  }

  function getReferenceRange(unit: string, examDescription: string): string {
    const desc = examDescription.toLowerCase();

    // Glicose
    if (desc.includes('glicose')) {
      if (unit === 'mg/dL') return '70 a 100 mg/dL';
      if (unit === 'mmol/L') return '3.9 a 5.6 mmol/L';
    }

    // Colesterol Total
    if (desc.includes('colesterol total')) {
      if (unit === 'mg/dL') return 'até 200 mg/dL';
      if (unit === 'mmol/L') return 'até 5.17 mmol/L';
    }

    // Colesterol HDL
    if (desc.includes('hdl')) {
      if (unit === 'mg/dL') return 'acima de 60 mg/dL';
      if (unit === 'mmol/L') return 'acima de 1.55 mmol/L';
    }

    // Colesterol LDL
    if (desc.includes('ldl')) {
      if (unit === 'mg/dL') return 'até 100 mg/dL';
      if (unit === 'mmol/L') return 'até 2.59 mmol/L';
    }

    // Triglicérides
    if (desc.includes('triglicérides') || desc.includes('triglicerides')) {
      if (unit === 'mg/dL') return 'até 150 mg/dL';
      if (unit === 'mmol/L') return 'até 1.69 mmol/L';
    }

    // Hemoglobina
    if (desc.includes('hemoglobina')) {
      if (unit === 'g/dL') return '12 a 18 g/dL';
      if (unit === 'g/L') return '120 a 180 g/L';
    }

    // Hematócrito
    if (desc.includes('hematócrito') || desc.includes('hematocrito')) {
      if (unit === '%') return '36 a 54%';
    }

    // Leucócitos
    if (desc.includes('leucócitos') || desc.includes('leucocitos')) {
      if (unit === 'mil/mm³' || unit === 'mil/µL') return '4 a 10 mil/mm³';
      if (unit === '×10⁹/L') return '4 a 10 ×10⁹/L';
    }

    // Plaquetas
    if (desc.includes('plaquetas')) {
      if (unit === 'mil/mm³' || unit === 'mil/µL') return '150 a 400 mil/mm³';
      if (unit === '×10⁹/L') return '150 a 400 ×10⁹/L';
    }

    // TGO (AST)
    if (desc.includes('tgo') || desc.includes('ast')) {
      if (unit === 'U/L' || unit === 'UI/L') return 'até 40 U/L';
    }

    // TGP (ALT)
    if (desc.includes('tgp') || desc.includes('alt')) {
      if (unit === 'U/L' || unit === 'UI/L') return 'até 40 U/L';
    }

    // Creatinina
    if (desc.includes('creatinina')) {
      if (unit === 'mg/dL') return '0.6 a 1.3 mg/dL';
      if (unit === 'µmol/L') return '53 a 115 µmol/L';
    }

    // Ureia
    if (desc.includes('ureia') || desc.includes('uréia')) {
      if (unit === 'mg/dL') return '10 a 50 mg/dL';
      if (unit === 'mmol/L') return '1.7 a 8.3 mmol/L';
    }

    // Ácido Úrico
    if (desc.includes('ácido úrico') || desc.includes('acido urico')) {
      if (unit === 'mg/dL') return '3.5 a 7.0 mg/dL';
      if (unit === 'µmol/L') return '208 a 416 µmol/L';
    }

    // Valor padrão: apenas retorna a unidade
    return unit;
  }

  function getFillPercentage(value: string, unit: string, examDescription: string): number {
    const numericValue = parseFloat(value);

    // Mapeamento baseado no documento "Variações da unidade de concentração"
    const getMaxReference = (unit: string, description: string): number => {
      const desc = description.toLowerCase();

      // Glicose
      if (desc.includes('glicose')) {
        if (unit === 'mg/dL') return 100; // Referência: jejum até 100 mg/dL
        if (unit === 'mmol/L') return 5.6; // Conversão: mg/dL × 0.0555
      }

      // Colesterol Total
      if (desc.includes('colesterol total')) {
        if (unit === 'mg/dL') return 200; // Referência desejável < 200 mg/dL
        if (unit === 'mmol/L') return 5.17; // Conversão: mg/dL × 0.02586
      }

      // Colesterol HDL
      if (desc.includes('hdl')) {
        if (unit === 'mg/dL') return 60; // Referência ideal > 60 mg/dL
        if (unit === 'mmol/L') return 1.55; // Conversão: mg/dL × 0.02586
      }

      // Colesterol LDL
      if (desc.includes('ldl')) {
        if (unit === 'mg/dL') return 100; // Referência ideal < 100 mg/dL
        if (unit === 'mmol/L') return 2.59; // Conversão: mg/dL × 0.02586
      }

      // Triglicérides
      if (desc.includes('triglicérides') || desc.includes('triglicerides')) {
        if (unit === 'mg/dL') return 150; // Referência normal < 150 mg/dL
        if (unit === 'mmol/L') return 1.69; // Conversão: mg/dL × 0.01129
      }

      // Hemoglobina
      if (desc.includes('hemoglobina')) {
        if (unit === 'g/dL') return 18; // Referência: 12-18 g/dL
        if (unit === 'g/L') return 180; // Conversão: g/dL × 10
      }

      // Hematócrito
      if (desc.includes('hematócrito') || desc.includes('hematocrito')) {
        if (unit === '%') return 100; // Já é percentual
      }

      // Leucócitos
      if (desc.includes('leucócitos') || desc.includes('leucocitos')) {
        if (unit === 'mil/mm³' || unit === 'mil/µL') return 10; // Referência: 4-10 mil/mm³
        if (unit === '×10⁹/L') return 10; // Equivalente
      }

      // Plaquetas
      if (desc.includes('plaquetas')) {
        if (unit === 'mil/mm³' || unit === 'mil/µL') return 400; // Referência: 150-400 mil/mm³
        if (unit === '×10⁹/L') return 400; // Equivalente
      }

      // TGO (AST)
      if (desc.includes('tgo') || desc.includes('ast')) {
        if (unit === 'U/L' || unit === 'UI/L') return 40; // Referência: até 40 U/L
      }

      // TGP (ALT)
      if (desc.includes('tgp') || desc.includes('alt')) {
        if (unit === 'U/L' || unit === 'UI/L') return 40; // Referência: até 40 U/L
      }

      // Creatinina
      if (desc.includes('creatinina')) {
        if (unit === 'mg/dL') return 1.3; // Referência: 0.6-1.3 mg/dL
        if (unit === 'µmol/L') return 115; // Conversão: mg/dL × 88.4
      }

      // Ureia
      if (desc.includes('ureia') || desc.includes('uréia')) {
        if (unit === 'mg/dL') return 50; // Referência: 10-50 mg/dL
        if (unit === 'mmol/L') return 8.3; // Conversão: mg/dL × 0.1665
      }

      // Ácido Úrico
      if (desc.includes('ácido úrico') || desc.includes('acido urico')) {
        if (unit === 'mg/dL') return 7; // Referência: até 7 mg/dL
        if (unit === 'µmol/L') return 416; // Conversão: mg/dL × 59.48
      }

      // Valores genéricos por unidade
      if (unit === 'mg/dL') return 200;
      if (unit === 'g/dL') return 18;
      if (unit === '%') return 100;
      if (unit === 'mm³' || unit === 'mil/mm³') return 10000;
      if (unit === 'x 10³/mm³' || unit === '×10³/mm³') return 400;
      if (unit === 'U/L' || unit === 'UI/L') return 40;

      return 100; // Valor padrão
    };

    const maxReference = getMaxReference(unit, examDescription);
    const percentage = (numericValue / maxReference) * 100;

    // Limitar entre 0 e 100
    return Math.min(Math.max(percentage, 0), 100);
  }

  function renderExamItem() {
    return examSelected.medicalExamItems.map((item: any, index: number) => {
      return (
        <>
          <VStack flex={1}>
            <Text fontSize={30} fontWeight={800} letterSpacing={-0.16}>
              {item.examItemDescription}
            </Text>

            <HStack space={6} mt={2}>
              <AnimatedCircularProgress
                size={144}
                lineCap="round"
                width={20}
                fill={getFillPercentage(item.medicalExamItemReferenceValue, item.medicalExamItemMeasureUnit, item.examItemDescription)}
                children={() => (
                  <VStack alignItems="center">
                    <Text
                      color={getColor(item.medicalExamItemWeightColor)}
                      fontSize={42}
                      fontWeight={800}
                      letterSpacing={-1}
                    >
                      {item.medicalExamItemReferenceValue}
                    </Text>

                    <Text
                      mt={-4}
                      mx={2}
                      color="gray.400"
                      fontSize={10}
                      fontWeight={800}
                      letterSpacing={1}
                      textAlign="center"
                    >
                      Ref: {getReferenceRange(item.medicalExamItemMeasureUnit, item.examItemDescription)}
                    </Text>
                  </VStack>
                )}
                rotation={90}
                tintColor={getColor(item.medicalExamItemWeightColor) || '#00B39D'}
                backgroundColor="#DCE1E8"
                delay={10}
              />

              <VStack flex={1} space={2} justifyContent="center">
                <HStack space={2} alignItems="center">
                  <AddSquareIcon size="28" />
                  <Text fontSize={16} fontWeight={800} letterSpacing={-0.16}>
                    Desmistificando
                  </Text>
                </HStack>

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

                {/* <HStack space={3} alignItems="center">
                  <ChartIcon size="28" duotone />
                  <Text fontSize={14} fontWeight={500} letterSpacing={-0.16} color="ciano.300">
                    Ver histórico de resultados
                  </Text>
                </HStack> */}
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

  return (
    <>
      <Box
        width="100%"
        height="100%"
        bg="#000"
        opacity={shadowOpacity}
        position="absolute"
        zIndex={1}
        display={shadowOpacity ? 'flex' : 'none'}
      />

      <VStack my={16}>
        <HeaderDescription
          title="Laboratório"
          date={formatDateToBrazilian(examSelected.createdDate)}
          withBackButton={() => navigation.navigate('examList')}
          position="fixed"
        />

        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
          <VStack flex={1} mx={6} mt={4} mb={20} space={4}>
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
          onChange={handleSheetChanges}
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
      </VStack>
    </>
  );
}
