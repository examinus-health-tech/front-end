import { IInputProps, ISelectProps, VStack } from 'native-base';
import { InputStyled } from './styles';
import { useState } from 'react';

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

export function InputNative({ focused: propFocused, ...rest }: Props & { focused?: boolean }) {
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <VStack mx={6} pointerEvents="auto">
      <InputStyled
        placeholder="0"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        focused={focused}
        textAlign="left"
        {...rest}
      />
    </VStack>
  );
}
