import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

type Props = {
  size?: string;
  color?: string;
};

function NoneOfTheseIcon({ size = '24', color = '#052B3B' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={4}
        y={4}
        width={16}
        height={16}
        rx={3}
        stroke={color}
        strokeWidth={2}
      />
      <Path
        d="M19 19L5 5"
        stroke={color}
        strokeWidth={2}
      />
    </Svg>
  );
}

export default NoneOfTheseIcon;
