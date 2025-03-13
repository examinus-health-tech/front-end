import { Text } from 'native-base';

interface variantProps {
  display: string;
}

export function CustomText({
  children,
  variant,
  fontSize,
  fontWeight,
  ...rest
}: Props) {
  switch (variant) {
    case 'display': {
      return (
        <Text
          fontFamily="Poligon"
          fontSize={180}
          fontWeight={fontWeight}
          lineHeight={fontSize}
          letterSpacing={-0.07}
        >
          {children}
        </Text>
      );
    }
  }
}
