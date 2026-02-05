import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: string;
  color?: string;
};

function NoDietIcon({ size = '24', color = '#052B3B' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.00002 18L9.87869 14.1213C11.0503 12.9497 12.9498 12.9497 14.1213 14.1213L18 18"
        stroke={color}
        strokeWidth={2}
      />
      <Path
        d="M17.9999 6L14.1213 9.87869C12.9497 11.0503 11.0502 11.0503 9.87861 9.87868L5.99994 5.99994"
        stroke={color}
        strokeWidth={2}
      />
    </Svg>
  );
}

export default NoDietIcon;
