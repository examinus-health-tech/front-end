import {
  Select,
  Input as InputNativeBase,
  IInputProps,
  ISelectProps,
  WarningOutlineIcon,
  VStack,
  Text,
  HStack,
  Box,
} from 'native-base';
import { TextInput, Platform, View } from 'react-native';

export type Props = {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  InputLeftElement?: JSX.Element;
  InputRightElement?: JSX.Element;
  label?: string;
  selectType?: boolean;
  options?: {
    value: string;
    label: string;
  }[];
  errorMessage?: string;
  isRequired?: boolean;
  wContainer?: string;
  [key: string]: any;
};

export interface VariantLeftIconProps {
  mail: JSX.Element;
}

export function Input({
  leftIcon,
  rightIcon,
  InputLeftElement,
  InputRightElement,
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
        <View style={{ position: 'relative' }}>
          {(leftIcon || InputLeftElement) && (
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}
            >
              {leftIcon || InputLeftElement}
            </View>
          )}

          <TextInput
            style={{
              height: 53,
              borderWidth: 1,
              borderColor: !!errorMessage ? '#F87171' : '#E5E7EB',
              borderRadius: 12,
              paddingLeft: leftIcon || InputLeftElement ? 48 : 18,
              paddingRight: rightIcon || InputRightElement ? 48 : 16,
              backgroundColor: 'white',
              fontSize: 15,
              fontFamily: 'Poligon-Medium',
              color: '#1F2937',
            }}
            selectionColor={Platform.OS === 'ios' ? '#000000' : undefined}
            placeholderTextColor="#9CA3AF"
            {...rest}
          />

          {(rightIcon || InputRightElement) && (
            <View
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}
            >
              {rightIcon || InputRightElement}
            </View>
          )}
        </View>
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
