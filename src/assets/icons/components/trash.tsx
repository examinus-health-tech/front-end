import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function TrashIcon({
  size = '24',
  color = '#white',
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
        d="M8 6V6C8 4.34315 9.34315 3 11 3H13C14.6569 3 16 4.34315 16 6V6"
        stroke={color}
        stroke-width="2"
      />
      <Path d="M3 6H21" stroke={color} stroke-width="2" />
      <Path
        d="M6 7V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V7"
        stroke={color}
        stroke-width="2"
      />
      <Path d="M10 9V18" stroke={color} stroke-width="2" />
      <Path d="M14 9V18" stroke={color} stroke-width="2" />
    </Svg>
  );
}
