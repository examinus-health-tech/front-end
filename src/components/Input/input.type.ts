import { IInputProps } from 'native-base';

export type Props = IInputProps & {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  label?: string;
};

export interface VariantLeftIconProps {
  mail: JSX.Element;
}
