import { Button as ButtonNativeBase, Text, Row } from 'native-base';

import {
  Props,
  ButtonSizeProps,
  backgroundColorProps,
  ColorVariantProps,
  ButtonSizeHeightProps,
} from './button.type';

const backgroundColor: backgroundColorProps = {
  primary: 'ciano.40',
  secondary: 'ciano.10',
  inline: 'white',
  outline: 'transparent',
  fab: 'ciano.40',
  fabDark: 'gray.100',
  fabOutline: 'white',
  transparent: 'transparent',
};
const buttonSize: ButtonSizeProps = {
  lg: 252,
  md: 200,
  sm: 132,
  xs: 94,
  fab: 20,
  full: '100%',
};
const buttonSizeHeight: ButtonSizeHeightProps = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  fab: 20,
  full: 16,
};
const colorVariant: ColorVariantProps = {
  primary: 'white',
  secondary: 'ciano.40',
  inline: 'gray.70',
  transparent: 'gray.100',
  outline: 'white',
};

export function Button({ title, icon, size, variant, ...rest }: Props) {
  return (
    <ButtonNativeBase
      w={buttonSize[size as keyof ButtonSizeProps]}
      h={buttonSizeHeight[size as keyof ButtonSizeProps]}
      bg={backgroundColor[variant as keyof backgroundColorProps]}
      borderColor={colorVariant[variant as keyof ColorVariantProps]}
      borderWidth={variant === 'outline' ? 1 : 0}
      rounded={16}
      py={0}
      flexDirection="row"
      {...rest}
    >
      <Row alignItems="center">
        <Text
          color={colorVariant[variant as keyof ColorVariantProps]}
          paddingRight={icon && title ? 4 : 0}
          fontWeight={700}
        >
          {title}
        </Text>
        {icon}
      </Row>
    </ButtonNativeBase>
  );
}
