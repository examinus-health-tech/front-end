import { VStack } from 'native-base';
import { TextInput, Platform, TextInputProps } from 'react-native';

export type Props = TextInputProps & {
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
  focused?: boolean;
};

export interface VariantLeftIconProps {
  mail: JSX.Element;
}

export function InputNative({ focused: propFocused, ...rest }: Props) {
  return (
    <VStack mx={6} pointerEvents="auto">
      <TextInput
        placeholder="0"
        style={{
          backgroundColor: '#ffffff',
          height: 60,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: '#e5e7eb',
          paddingHorizontal: 16,
          textAlign: 'left',
          fontFamily: 'Poligon-Bold',
          fontSize: 28,
          color: '#090E1D',
        }}
        selectionColor={Platform.OS === 'ios' ? '#000000' : undefined}
        {...rest}
      />
    </VStack>
  );
}
