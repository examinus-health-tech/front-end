import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ShareIcon({
  size = '24',
  color = '#052B3B',
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Rect
        x="4"
        y="10"
        width="4"
        height="4"
        rx="1.5"
        stroke={color}
        stroke-width="2"
      />
      <Rect
        x="16"
        y="3"
        width="4"
        height="4"
        rx="1.5"
        stroke={color}
        stroke-width="2"
      />
      <Rect
        x="16"
        y="17"
        width="4"
        height="4"
        rx="1.5"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M8 12H15C16.6569 12 18 13.3431 18 15V17"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M8 12H15C16.6569 12 18 10.6569 18 9V7"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
