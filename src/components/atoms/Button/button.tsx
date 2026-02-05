import { Button as ButtonNativeBase, Text, Row } from 'native-base';

import { Props, ButtonSizeProps, backgroundColorProps, ColorVariantProps, ButtonSizeHeightProps } from './types';

const backgroundColor: backgroundColorProps = {
  primary: 'ciano.300',
  secondary: 'ciano.50',
  inline: 'white',
  outline: 'transparent',
  fab: 'ciano.300',
  fabDark: 'gray.900',
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
  secondary: 'ciano.300',
  inline: 'gray.800',
  transparent: 'gray.900',
  outline: 'white',
};

export function Button({ title, icon, size, variant, fontSize, isLoading, textColor, ...rest }: Props) {
  return (
    <ButtonNativeBase
      w={buttonSize[size as keyof ButtonSizeProps]}
      h={buttonSizeHeight[size as keyof ButtonSizeProps]}
      bg={isLoading ? 'red' : backgroundColor[variant as keyof backgroundColorProps]}
      borderColor={colorVariant[variant as keyof ColorVariantProps]}
      borderWidth={variant === 'outline' ? 1 : 0}
      rounded={16}
      py={0}
      flexDirection="row"
      isLoading={isLoading}
      _loading={{
        bg: 'ciano.300',
        _text: {
          color: 'white',
        },
      }}
      {...rest}
    >
      {!isLoading && (
        <Row alignItems="center">
          <Text
            color={textColor || colorVariant[variant as keyof ColorVariantProps]}
            paddingRight={icon && title ? 4 : 0}
            fontWeight={700}
            fontSize={fontSize}
          >
            {title}
          </Text>
          {icon}
        </Row>
      )}
    </ButtonNativeBase>
  );
}
