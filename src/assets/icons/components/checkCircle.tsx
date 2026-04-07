import { Svg, Path, Circle } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function CheckCircleIcon({
  size = '24',
  color = '#0CC1AF',
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="2"
      />
      <Path
        d="M8 12.5L10.5 15L16 9.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
