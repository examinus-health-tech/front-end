import { IButtonProps } from 'native-base';

export type Props = IButtonProps & {
  title?: string;
  icon?: JSX.Element;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'fab' | 'full';
  variant:
    | 'primary'
    | 'secondary'
    | 'inline'
    | 'outline'
    | 'fab'
    | 'fabDark'
    | 'fabOutline'
    | 'transparent';
};

export interface backgroundColorProps {
  primary: string;
  secondary: string;
  inline: string;
  fab: string;
  outline: string;
  fabDark: string;
  fabOutline: string;
  transparent: string;
}

export interface ButtonSizeProps {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  fab: number;
  full: string;
}

export interface ButtonSizeHeightProps {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  fab: number;
  full: number;
}

export interface ColorVariantProps {
  primary: string;
  secondary: string;
  inline: string;
  transparent: string;
  outline: string;
}
