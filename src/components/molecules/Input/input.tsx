import {
  Flex,
  Input as InputNativeBase,
  Select as SelectNativeBase,
  Text,
  IInputProps,
  VStack,
  FormControl,
  WarningOutlineIcon,
} from 'native-base';

export type Props = IInputProps & {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  label?: string;
  select?: boolean;
  options?: {
    value: string;
    label: string;
  }[];
  errorMessage?: string;
};

export interface VariantLeftIconProps {
  mail: JSX.Element;
}

export function Input({
  leftIcon,
  rightIcon,
  label,
  select,
  options,
  isInvalid,
  errorMessage,
  ...rest
}: Props) {
  return (
    <FormControl isInvalid={isInvalid} mb={1}>
      <FormControl.Label>
        <Text
          color="gray.900"
          fontSize={15}
          fontWeight={800}
          letterSpacing={-0.14}
        >
          {label}
        </Text>
      </FormControl.Label>
      {select ? (
        <SelectNativeBase
          bg="white"
          h={12}
          borderRadius={12}
          color="gray.800"
          fontSize={16}
          fontWeight={600}
          letterSpacing={-0.16}
          {...rest}
        >
          <SelectNativeBase.Item label="UX Research" value="ux" />
          <SelectNativeBase.Item label="Web Development" value="web" />
          <SelectNativeBase.Item
            label="Cross Platform Development"
            value="cross"
          />
          <SelectNativeBase.Item label="UI Designing" value="ui" />
          <SelectNativeBase.Item label="Backend Development" value="backend" />
        </SelectNativeBase>
      ) : (
        <InputNativeBase
          bg="white"
          h={12}
          borderRadius={12}
          color="gray.800"
          fontSize={16}
          fontWeight={600}
          letterSpacing={-0.16}
          {...rest}
        />
      )}
      {!!errorMessage && (
        <FormControl.ErrorMessage
          leftIcon={<WarningOutlineIcon size="xs" />}
          mb={-2}
          mt={0.5}
        >
          {errorMessage}
        </FormControl.ErrorMessage>
      )}
    </FormControl>
  );
}
