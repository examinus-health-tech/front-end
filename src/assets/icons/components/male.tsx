import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function MaleIcon({ size = '24', color = 'white' }: IconProps) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 25 24"
      fill="none"
    >
      <Path
        d="M4.5 13C4.5 11.3431 5.84315 10 7.5 10H11.5C13.1569 10 14.5 11.3431 14.5 13V17C14.5 18.6569 13.1569 20 11.5 20H7.5C5.84315 20 4.5 18.6569 4.5 17V13Z"
        stroke={color}
        stroke-width="2"
      />
      <Path d="M13.5 11L18.5 6" stroke={color} stroke-width="2" />
      <Path
        d="M14.5 5H18C18.8284 5 19.5 5.67157 19.5 6.5V10"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
