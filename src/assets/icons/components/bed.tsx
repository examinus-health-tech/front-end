import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function BedIcon({ size = '24', color = '#818BA0' }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M3 7V14C3 15.6569 4.34315 17 6 17H18C19.6569 17 21 15.6569 21 14V10.5"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M12 11V11C12 9.89543 11.1046 9 10 9L8 9C6.89543 9 6 9.89543 6 11V11"
        stroke={color}
        stroke-width="2"
      />
      <Path d="M5 20H9" stroke={color} stroke-width="2" />
      <Path d="M15 20H19" stroke={color} stroke-width="2" />
      <Path d="M3 13H21" stroke={color} stroke-width="2" />
    </Svg>
  );
}
