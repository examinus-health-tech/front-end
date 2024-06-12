import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import {
  VStack,
  Text,
  HStack,
  Flex,
  Badge,
  CloseIcon,
  Box,
  Modal,
  useToast,
  Center,
  Pressable,
  ScrollView,
  IScrollViewProps,
} from 'native-base';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { find } from 'lodash';

// assets
import { Input } from '@components/molecules';
import { Button } from '@components/atoms';
import { ArrowIcon } from '@assets/icons';
import { AppError } from '@utils/AppErrors';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { remove } from 'lodash';
import { useUpload } from 'src/hooks/useUpload';
import { useAuth } from 'src/hooks/useAuth';

type ExamProps = {
  exam_id: number;
  code_exam: string;
  reference_unit_system: string;
  group: string;
  target_units: string[];
};

type FormDataProps = {
  lab: string;
  medico: string;
  data: string;
  code_exam: string;
  value: string;
  reference_unit: string;
  exam_id: number;
};

type OptionProps = {
  value: string;
  label: string;
};

const uploadFormSchema = yup.object({
  lab: yup.string(),
  medico: yup.string(),
  data: yup.string().datetime(),
  code_exam: yup.string(),
  value: yup.string(),
  reference_unit: yup.string(),
});

export function UploadTypeManual() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [unitOptions, setUnitOptions] = useState<OptionProps[]>([]);
  const [examOptions, setExamOptions] = useState<OptionProps[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamProps>({} as ExamProps);
  const [examManual, setExamManual] = useState<FormDataProps[]>([]);

  const { getExamTypes, examList, handleManualUploadFile } = useUpload();
  const { user } = useAuth();
  const scrollRef = useRef<IScrollViewProps>(null);

  const {
    control,
    getValues,
    handleSubmit,
    setValue,
    reset,
    resetField,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: { code_exam: '' },
    resolver: yupResolver(uploadFormSchema),
  });
  const toast = useToast();

  function handleDateSelected(event: DateTimePickerEvent, selectedDate: Date | undefined) {
    if (selectedDate) {
      setShow(false);
      setDate(selectedDate);
      setValue('data', selectedDate?.toLocaleDateString('pt-br', {}));
      handleBlurOpenModal();
    }
  }

  function handleBlurOpenModal() {
    const { lab, medico, data, code_exam } = getValues();

    if (lab && medico && data && code_exam) {
      setShowModal(true);
    }
  }

  function adicionaExame() {
    const formData = { ...getValues(), code_exam: selectedExam.code_exam, exam_id: selectedExam.exam_id };
    const tempExamesManuais = [...examManual, formData];
    console.log('!@# 🚀 ~ adicionaExame ~ tempExamesManuais:', tempExamesManuais);

    setExamManual(tempExamesManuais);
    setShowModal(false);
    reset();
    resetField('code_exam');
  }

  function deletaExame(position: number) {
    const tempExamesManuais = remove(examManual, (_, i) => i !== position);

    setExamManual(tempExamesManuais);
  }

  function handleSelectedExam(value: string) {
    const options = find(examList, (exam) => exam.exam_id.toString() === value);

    if (options?.target_units || options?.reference_unit_system) {
      const { target_units, reference_unit_system } = options;
      let newUnitOptions = [];

      if (target_units.length) {
        newUnitOptions = options.target_units.map((unit) => {
          return { value: unit, label: unit };
        });
      } else {
        newUnitOptions = [{ value: reference_unit_system, label: reference_unit_system }];
      }

      setUnitOptions(newUnitOptions);
    }
  }

  async function handleUploadManual(data: FormDataProps) {
    try {
      const detail = examManual.map((e) => {
        return {
          exam_id: e.exam_id,
          code_exam: e.code_exam,
          value: e.value,
          reference_unit: e.reference_unit,
        };
      });

      const payload = {
        email: user.email,
        doctor_name: examManual[0].medico,
        labor_name: examManual[0].lab,
        exam_date: examManual[0].data
          .toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
          })
          .replace(/\//g, '-')
          .split('-')
          .reverse()
          .join('-'),
        detail: [...detail],
      };
      console.log('!@# 🚀 ~ handleUploadManual ~ payload:', payload);

      await handleManualUploadFile(payload);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? 'Não foi possível salvar seus exames.'
        : 'Não foi possível salvar seus exames.\nTente novamente mais tarde.';
      const description = isAppError && error.message;

      toast.show({
        borderRadius: '12',
        title,
        description,
        _title: {
          textAlign: 'center',
          mx: '4',
        },
        _description: {
          textAlign: 'center',
          mx: '4',
        },
        placement: 'top',
        color: 'gray.900',
        bgColor: 'red.500',
      });

      // setIsLoading(false);
    }
  }

  useEffect(() => {
    getExamTypes(user.email);
  }, []);

  useEffect(() => {
    const tempExamOptions = examList.map(({ exam_id, code_exam }) => {
      return { value: exam_id.toString(), label: code_exam };
    });

    setExamOptions(tempExamOptions || []);
  }, [examList]);

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <Center>
        <VStack alignItems="center" mt={12} mb={24}>
          <Text fontSize={24} fontWeight={800} letterSpacing={-0.24} textAlign="center">
            Insira o exame manualmente
          </Text>

          <Text
            fontSize={14}
            fontWeight={500}
            lineHeight={22.4}
            textAlign="center"
            mx={8}
            mt={2}
            mb={8}
            color={'gray.400'}
          >
            Preencha as informações abaixo conforme está no seu exame em PDF ou papel
          </Text>

          <Controller
            control={control}
            name="lab"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Nome do Laboratório"
                h={10}
                w={348}
                mb={2}
                onChangeText={onChange}
                value={value}
                onBlur={() => handleBlurOpenModal()}
                errorMessage={errors.lab?.message}
              />
            )}
          />

          <HStack justifyContent="center" w={204} space={4} ml={20} mb={2}>
            <Controller
              control={control}
              name="medico"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Nome do Médico"
                  h={10}
                  onChangeText={onChange}
                  value={value}
                  onBlur={() => handleBlurOpenModal()}
                  errorMessage={errors.medico?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="data"
              render={({ field: { onChange, value } }) => (
                <Pressable onPress={() => setShow(true)} w="100%">
                  <Input
                    label="Data do Exame"
                    keyboardType="numbers-and-punctuation"
                    h={10}
                    w={124}
                    onChangeText={onChange}
                    isReadOnly={true}
                    value={value}
                    editable={false}
                    errorMessage={errors.data?.message}
                  />

                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode="date"
                      is24Hour={true}
                      onChange={handleDateSelected}
                    />
                  )}
                </Pressable>
              )}
            />
          </HStack>

          <Controller
            control={control}
            name="code_exam"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Selecione o Exame"
                selectType
                options={examOptions}
                h={10}
                w={348}
                selectedValue={value}
                onValueChange={(val) => {
                  onChange(val);
                  handleSelectedExam(val);
                  handleBlurOpenModal();

                  const exam = find(examList, (exam) => exam.exam_id.toString() === val);
                  setSelectedExam(exam);
                }}
                errorMessage={errors.code_exam?.message}
              />
            )}
          />

          <HStack flexWrap="wrap" flexDir="row" mt={8} space={4}>
            {!!examManual.length &&
              examManual.map(({ code_exam }, index) => (
                <Badge borderRadius={7} borderColor={'gray.600'} mb={4} pl={0}>
                  <Flex
                    _text={{
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: -0.12,
                      color: 'gray.600',
                      textTransform: 'uppercase',
                    }}
                    flexDir="row"
                    alignItems="center"
                  >
                    <TouchableOpacity onPress={() => deletaExame(index)}>
                      <Box w={5} h={5} alignItems="center" justifyContent="center" pl={4}>
                        <CloseIcon color="gray.600" mr={4} size={3} />
                      </Box>
                    </TouchableOpacity>
                    {code_exam}
                  </Flex>
                </Badge>
              ))}
          </HStack>

          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            _backdrop={{
              bg: 'gray.900',
            }}
          >
            <Modal.Content borderRadius={20}>
              <Modal.CloseButton />
              <Modal.Body alignItems="center" mt={8} mx={4} mb={2}>
                <Controller
                  control={control}
                  name="value"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Valor exame"
                      h={10}
                      mb={2}
                      onChangeText={onChange}
                      value={value}
                      errorMessage={errors.value?.message}
                      keyboardType="numeric"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="reference_unit"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Unidade de Referência"
                      h={10}
                      mb={2}
                      selectType
                      options={unitOptions}
                      onChangeText={onChange}
                      selectedValue={value}
                      onValueChange={onChange}
                      errorMessage={errors.reference_unit?.message}
                    />
                  )}
                />

                <Button variant="primary" title="Inserir" size="sm" mt={8} onPress={adicionaExame} />
              </Modal.Body>
            </Modal.Content>
          </Modal>

          <Button
            my={12}
            variant="primary"
            size="lg"
            title="Desvende sua saúde"
            icon={<ArrowIcon />}
            isDisabled={!examManual.length}
            onPress={handleSubmit(handleUploadManual)}
          />
        </VStack>
      </Center>
    </ScrollView>
  );
}
