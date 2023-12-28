import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function FlaskIcon({
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
      <Path d="M8 14H16" stroke={color} stroke-width="2" />
      <Path d="M8 4H16" stroke={color} stroke-width="2" />
      <Path
        d="M14 4H10V9.7033C10 10.2254 9.86376 10.7384 9.60474 11.1917L6.56481 16.5116C5.42197 18.5116 6.86607 21 9.16954 21H14.8305C17.1339 21 18.578 18.5116 17.4352 16.5116L14.3953 11.1917C14.1363 10.7384 14 10.2254 14 9.70332V4Z"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
