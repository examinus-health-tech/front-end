import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function AddSquareIcon({
  size = '24',
  color = '#0CC1AF',
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
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="#052B3B"
        stroke-width="2"
      />
      <Path
        d="M7 12H9.5C10.8807 12 12 13.1193 12 14.5V17"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M17 12L14.5 12C13.1193 12 12 10.8807 12 9.5L12 7"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
