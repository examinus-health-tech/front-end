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

export function Exam() {
  const { examSelected } = useExam();
  const [shadowOpacity, setShadowOpacity] = useState<0 | 60>(0);
  const [bottomSheetText, setBottomSheetText] = useState<string>('');
  const [bottomSheetTitle, setBottomSheetTitle] = useState<string>('');
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['40%', '50%'], []);

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
                fill={item.medicalExamItemScore / 10}
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
                      Ref: {item.medicalExamItemMeasureUnit}
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
          <VStack flex={1} mx={6} mt={4} space={4}>
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
