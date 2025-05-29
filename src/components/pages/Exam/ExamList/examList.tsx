import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VStack, Text, useDisclose, Box, HStack, ScrollView, IScrollViewProps, Actionsheet, View } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

// routes
import { AppNavigatorRoutesProps } from '@routes/app.routes';

// assets
import { ChevronRightIcon, FilterIcon, FlaskIcon } from '@assets/icons';

// components
import { HeaderTitle, Input } from '@components/molecules';
import { TouchableOpacity, useWindowDimensions } from 'react-native';
import { Button } from '@components/atoms';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from 'src/hooks/useAuth';
import { useExam } from 'src/hooks/useExam';
import ContentLoader, { Rect } from 'react-content-loader/native';

type FormDataProps = {
  lab: string;
  start_date: string;
  final_date: string;
};

const uploadFormSchema = yup.object({
  lab: yup.string(),
  start_date: yup.string().datetime().required(),
  final_date: yup.string().datetime().required(),
});

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
  const { isOpen, onOpen, onClose } = useDisclose();
  const [shadowOpacity, setShadowOpacity] = useState<0 | 60>(0);
  const { user } = useAuth();
  const { getExamList, examData } = useExam();
  const { width, height } = useWindowDimensions();

  const snapPoints = useMemo(() => ['42%', '65%'], []);

  const {
    control,
    getValues,
    handleSubmit,
    setValue,
    reset,
    resetField,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {},
    resolver: yupResolver(uploadFormSchema),
  });

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // const handleSheetChanges = useCallback((index: number) => {
  //   console.log('handleSheetChanges', index);
  // }, []);

  const handleSheetChanges = (value: number) => {
    console.log('handleSheetChanges', value);

    if (value === 0 || value === -1) {
      return setShadowOpacity(0);
    }
    return setShadowOpacity(60);
  };

  async function handleExamList() {
    try {
      setIsLoading(true);
      await getExamList(user?.email);

      setIsLoading(false);
    } catch (error) {
    } finally {
    }
  }

  function renderExam(exam: ExamDataProps) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('exam')}>
        <HStack justifyContent="space-between" alignItems="center" space={6} flex={1}>
          <Box bg="gray.200" borderRadius={16} w={20} h={16} alignItems="center" justifyContent="center">
            <FlaskIcon size="36" variant="duotone" />
          </Box>

          <VStack flex={1}>
            <Text mt={1} fontSize={22} fontWeight={800} letterSpacing={-0.16} lineHeight={22}>
              {exam.labor_name}
            </Text>

            <Text mt={1} fontSize={16} fontWeight={400} letterSpacing={-0.16} color="gray.600">
              {exam.exam_date}
            </Text>

            <Text mt={1} fontSize={14} fontWeight={400} letterSpacing={-0.16} color="gray.600">
              {exam.doctor_name}
            </Text>
          </VStack>

          <ChevronRightIcon color="#0CC1AF" size="36" />
        </HStack>
      </TouchableOpacity>
    );
  }

  useEffect(() => {
    console.log('!@# useEffect');
    handleExamList();
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

      <VStack my={16} flex={1}>
        <HeaderTitle
          title="Exames Realizados"
          withBackButton={() => navigation.navigate('homepage')}
          withFilterButton
          filterButtonAction={handlePresentModalPress}
          position="fixed"
        />

        {isLoading ? (
          <ContentLoader viewBox={`0 0 ${width} ${height}`} backgroundColor="#d5d5d5" foregroundColor="#ebebeb">
            <Rect y="20" rx="12" ry="12" width={410} height={100} />
            <Rect y="140" rx="12" ry="12" width={410} height={100} />
            <Rect y="260" rx="12" ry="12" width={410} height={100} />
            <Rect y="380" rx="12" ry="12" width={410} height={100} />
            <Rect y="500" rx="12" ry="12" width={410} height={100} />
            <Rect y="620" rx="12" ry="12" width={410} height={100} />
            <Rect y="740" rx="12" ry="12" width={410} height={100} />
            <Rect y="860" rx="12" ry="12" width={410} height={100} />
          </ContentLoader>
        ) : (
          <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
            <VStack flex={1} space={8} pt={2} pb={32}>
              <VStack mx={6} mt={4} space={8}>
                {examData.map((exam) => renderExam(exam))}
              </VStack>

              <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                keyboardBehavior="fillParent"
              >
                <BottomSheetView>
                  <VStack mx={6} alignItems="center">
                    <HStack justifyContent="space-between" alignItems="center" width="100%" mt={4}>
                      <Text fontSize={30} fontWeight={500} letterSpacing={-0.16} color="gray.600">
                        Filter Exames
                      </Text>
                      <FilterIcon size="26" />
                    </HStack>

                    <Text fontSize={20} fontWeight={500} letterSpacing={-0.16} color="gray.300" width="100%">
                      Selecione o filtro
                    </Text>

                    <VStack>
                      <Controller
                        control={control}
                        name="start_date"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            placeholder="Data Inicio"
                            h={10}
                            bgColor="gray.50"
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.lab?.message}
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name="final_date"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            placeholder="Data Final"
                            h={10}
                            bgColor="gray.50"
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.lab?.message}
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name="lab"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            placeholder="Laboratório"
                            h={10}
                            bgColor="gray.50"
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.lab?.message}
                          />
                        )}
                      />
                    </VStack>

                    <Button mt={8} title="Filtrar" size="sm" variant="primary" fontSize={18} />
                  </VStack>
                </BottomSheetView>
              </BottomSheetModal>
            </VStack>

            <Actionsheet isOpen={isOpen} onClose={onClose}>
              <Actionsheet.Content h={540} px={6}>
                <HStack justifyContent="space-between" alignItems="center" width="100%" mt={4}>
                  <Text fontSize={30} fontWeight={500} letterSpacing={-0.16} color="gray.600">
                    Filter Exames
                  </Text>
                  <FilterIcon size="26" />
                </HStack>

                <Text fontSize={20} fontWeight={500} letterSpacing={-0.16} color="gray.300" width="100%">
                  Selecione o filtro
                </Text>

                <VStack>
                  <Controller
                    control={control}
                    name="start_date"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Data Inicio"
                        h={10}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.lab?.message}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="final_date"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Data Final"
                        h={10}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.lab?.message}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="lab"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Laboratório"
                        h={10}
                        onChangeText={onChange}
                        value={value}
                        errorMessage={errors.lab?.message}
                      />
                    )}
                  />
                </VStack>

                <Button mt={8} title="Filtrar" size="sm" variant="primary" fontSize={18} />
              </Actionsheet.Content>
            </Actionsheet>
          </ScrollView>
        )}
      </VStack>
    </>
  );
}
