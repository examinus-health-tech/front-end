import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function StethoscopeIcon({ size = '24', color = '#0CC1AF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M8 12V18C8 19.6569 9.34315 21 11 21H15C16.6569 21 18 19.6569 18 18V11" stroke={color} stroke-width="2" />
      <Path
        d="M7 3H6C4.34315 3 3 4.34315 3 6V10C3 11.6569 4.34315 13 6 13H10C11.6569 13 13 11.6569 13 10V6C13 4.34315 11.6569 3 10 3H9"
        stroke="#052B3B"
        stroke-width="2"
      />
      <Rect x="16" y="7" width="4" height="4" rx="1.5" stroke="#052B3B" stroke-width="2" />
    </Svg>
  );
}
