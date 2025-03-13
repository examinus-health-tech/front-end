import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function DinnerIcon({
  size = '24',
  color = 'white',
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
        d="M4 2V8.5C4 9.32843 4.67157 10 5.5 10H10.5C11.3284 10 12 9.32843 12 8.5V2"
        stroke={color}
        stroke-width="2"
      />
      <Path d="M8 2L8 22" stroke={color} stroke-width="2" />
      <Path
        d="M20 22L20 2L19 2C17.3431 2 16 3.34315 16 5L16 14L20 14"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
