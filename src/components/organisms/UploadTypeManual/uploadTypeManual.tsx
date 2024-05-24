import { useState } from 'react';
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
  Container,
  Pressable,
} from 'native-base';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// assets
import { Input } from '@components/molecules';
import { Button } from '@components/atoms';
import { ArrowIcon } from '@assets/icons';
import { AppError } from '@utils/AppErrors';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { remove } from 'lodash';

type FormDataProps = {
  lab: string;
  medico: string;
  data: string;
  exame: string;
  valor: string;
  unidade: string;
};

const uploadFormSchema = yup.object({
  lab: yup.string().required(),
  medico: yup.string().required(),
  data: yup.string().required().datetime(),
  exame: yup.string().required(),
  valor: yup.string().required(),
  unidade: yup.string().required(),
});

export function UploadTypeManual() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [examesManuais, setExamesManuais] = useState<FormDataProps[]>([]);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    resetField,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: { exame: '' },
    resolver: yupResolver(uploadFormSchema),
  });
  const toast = useToast();

  function handleDateSelected(
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) {
    if (selectedDate) {
      setShow(false);
      setDate(selectedDate);
      setValue('data', selectedDate?.toLocaleDateString('pt-br', {}));
      handleBlurOpenModal();
    }
  }

  function handleBlurOpenModal() {
    const { lab, medico, data, exame } = getValues();
    console.log('!@# 🚀 ~ handleBlurOpenModal ~ exame:', exame);

    if (lab && medico && data && exame) {
      setShowModal(true);
    }
  }

  function adicionaExame() {
    const formData = getValues();
    const tempExamesManuais = [...examesManuais, formData];

    setExamesManuais(tempExamesManuais);
    setShowModal(false);
    reset();
    resetField('exame');
  }

  function deletaExame(position: number) {
    const tempExamesManuais = remove(examesManuais, (_, i) => i !== position);

    setExamesManuais(tempExamesManuais);
  }

  async function handleUploadManual(data: FormDataProps) {
    try {
      // setIsLoading(true);
      // await singIn(data.email, data.password);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? 'Não foi possível acessar sua conta'
        : 'Não foi possível acessar sua conta.\nTente novamente mais tarde.';
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

  return (
    <Container>
      <VStack alignItems="center" mt={12}>
        <Text
          fontSize={24}
          fontWeight={800}
          letterSpacing={-0.24}
          textAlign="center"
        >
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
          Preencha as informações abaixo conforme está no seu exame em PDF ou
          papel
        </Text>

        <Controller
          control={control}
          name="lab"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Nome do Laboratório"
              h={10}
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
          name="exame"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Selecione o Exame"
              selectType
              options={[
                { value: 'teste', label: 'teste' },
                { value: 'teste1', label: 'teste1' },
                { value: 'teste2', label: 'teste2' },
              ]}
              h={10}
              w={348}
              selectedValue={value}
              onValueChange={(val) => {
                onChange(val);
                handleBlurOpenModal();
              }}
              errorMessage={errors.exame?.message}
            />
          )}
        />

        <HStack flexWrap="wrap" flexDir="row" mt={8} space={4}>
          {!!examesManuais.length &&
            examesManuais.map(({ exame }, index) => (
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
                    <Box
                      w={5}
                      h={5}
                      alignItems="center"
                      justifyContent="center"
                      pl={4}
                    >
                      <CloseIcon color="gray.600" mr={4} size={3} />
                    </Box>
                  </TouchableOpacity>
                  {exame}
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
                name="valor"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Valor exame"
                    h={10}
                    mb={2}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.valor?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="unidade"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Unidade de Referência"
                    h={10}
                    mb={2}
                    selectType
                    options={[
                      { value: 'teste', label: 'teste' },
                      { value: 'teste1', label: 'teste1' },
                      { value: 'teste2', label: 'teste2' },
                    ]}
                    onChangeText={onChange}
                    selectedValue={value}
                    onValueChange={onChange}
                    errorMessage={errors.unidade?.message}
                  />
                )}
              />

              <Button
                variant="primary"
                title="Inserir"
                size="sm"
                mt={8}
                onPress={adicionaExame}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Button
          my={12}
          variant="primary"
          size="lg"
          title="Desvende sua saúde"
          icon={<ArrowIcon />}
          isDisabled={!examesManuais.length}
        />
      </VStack>
    </Container>
  );
}
