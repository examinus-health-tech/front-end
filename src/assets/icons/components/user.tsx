import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function UserIcon({ size = '24', color = 'white' }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M3 20V17C3 15.3431 4.34315 14 6 14H18C19.6569 14 21 15.3431 21 17V20"
        stroke={color}
        stroke-width="2"
      />
      <Rect
        x="8"
        y="3"
        width="8"
        height="8"
        rx="3"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
