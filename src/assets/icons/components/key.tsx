import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function KeyIcon({ size = '24', color = '#052B3B' }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Rect
        x="3"
        y="8"
        width="8"
        height="8"
        rx="3"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M11 12H13.5C14.3284 12 15 12.6716 15 13.5V16"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M10 12H16.5C17.3284 12 18 12.6716 18 13.5V16"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M13 12H19.5C20.3284 12 21 12.6716 21 13.5V16"
        stroke={color}
        stroke-width="2"
      />
      <Rect x="6" y="11" width="2" height="2" rx="0.5" fill={color} />
    </Svg>
  );
}
