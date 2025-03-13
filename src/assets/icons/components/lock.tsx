import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function LockIcon({
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
      <Path
        d="M16 9V4.5C16 3.67157 15.3284 3 14.5 3H9.5C8.67157 3 8 3.67157 8 4.5V9"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M7 21L17 21C18.6569 21 20 19.6569 20 18L20 12C20 10.3431 18.6569 9 17 9L7 9C5.34315 9 4 10.3431 4 12L4 18C4 19.6569 5.34314 21 7 21Z"
        stroke={color}
        stroke-width="2"
      />
      <Rect
        x="10"
        y="13"
        width="4"
        height="4"
        rx="1"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
