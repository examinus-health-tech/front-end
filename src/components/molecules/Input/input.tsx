import {
  Select,
  Input as InputNativeBase,
  IInputProps,
  ISelectProps,
  WarningOutlineIcon,
  VStack,
  Text,
  HStack,
} from 'native-base';

export type Props = (IInputProps | ISelectProps) & {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  label?: string;
  selectType?: boolean;
  options?: {
    value: string;
    label: string;
  }[];
  errorMessage?: string;
  isRequired?: boolean;
  wContainer?: string;
};

export interface VariantLeftIconProps {
  mail: JSX.Element;
}

export function Input({
  leftIcon,
  rightIcon,
  label,
  selectType,
  options,
  errorMessage,
  isRequired,
  wContainer = 'full',
  ...rest
}: Props) {
  return (
    <VStack w={wContainer}>
      <Text color="gray.900" fontSize={15} fontWeight={800} letterSpacing={-0.14} mb={2}>
        {label} {isRequired && <Text color="red.400">*</Text>}
      </Text>
      {selectType ? (
        <Select
          bg="white"
          borderColor={!!errorMessage ? 'red.400' : 'gray.100'}
          h={12}
          borderRadius={12}
          color="gray.800"
          fontSize={16}
          fontWeight={600}
          letterSpacing={-0.16}
          w="100%"
          {...rest}
        >
          {options?.length && options.map(({ label, value }) => <Select.Item label={label} value={value} />)}
        </Select>
      ) : (
        <InputNativeBase
          selectionColor={'white'}
          h={12}
          pl={4}
          borderRadius={12}
          color="gray.800"
          bgColor="white"
          fontSize={16}
          fontWeight={600}
          letterSpacing={-0.16}
          w="100%"
          caretHidden={false}
          {...rest}
        />
      )}

      {!!errorMessage && (
        <HStack mb={-5} mt={1} alignItems="center" space={1} color="red.400">
          <WarningOutlineIcon size="xs" color="red.400" />
          <Text color="red.400" fontSize={12} fontWeight={600} letterSpacing={-0.16}>
            {errorMessage}
          </Text>
        </HStack>
      )}
    </VStack>
  );
}
