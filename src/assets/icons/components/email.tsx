import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function EmailIcon({
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
        d="M20 5L14.1213 10.8787C12.9497 12.0503 11.0503 12.0503 9.87868 10.8787L4 5"
        stroke={color}
        stroke-width="2"
      />
      <Rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="3"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
