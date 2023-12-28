import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function CheckIcon({
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
      <Path
        d="M3 12L6.87868 15.8787C8.05025 17.0503 9.94975 17.0503 11.1213 15.8787L21 6"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
