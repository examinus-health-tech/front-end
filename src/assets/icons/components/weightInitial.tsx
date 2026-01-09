import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface Props extends SvgProps {
  size?: string;
  color?: string;
}

export function WeightInitialIcon({ size = '24', color = '#8A3FFC', ...rest }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 6C2 3.79086 3.79086 2 6 2H18C20.2091 2 22 3.79086 22 6V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18V6ZM8 8.5C8 8.22386 8.22386 8 8.5 8H15.5C15.7761 8 16 8.22386 16 8.5V11H18V8.5C18 7.11929 16.8807 6 15.5 6H8.5C7.11929 6 6 7.11929 6 8.5V11H8V8.5Z"
        fill={color}
      />
    </Svg>
  );
}
