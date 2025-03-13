import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function CoffeIcon({ size = '24', color = 'white' }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M17 4H5V13C5 14.6569 6.34315 16 8 16H14C15.6569 16 17 14.6569 17 13V4Z"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M17 4H19.5C20.3284 4 21 4.67157 21 5.5V7.5C21 8.32843 20.3284 9 19.5 9H18.5C17.6716 9 17 8.32843 17 7.5V4Z"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M3 17V17C3 18.6569 4.34315 20 6 20H16C17.6569 20 19 18.6569 19 17V17"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
