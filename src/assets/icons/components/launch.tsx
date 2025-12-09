import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function LaunchIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M20 12V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4H12" stroke={color} strokeWidth="2" />
          <Path d="M9 15L19 5" stroke={color} strokeWidth="2" />
          <Path d="M14 4H18.5C19.3284 4 20 4.67157 20 5.5V10" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M20 12V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4H12" stroke={color} strokeWidth="2" />
          <Path d="M9 15L19 5" stroke={color} strokeWidth="2" />
          <Path d="M14 4H18.5C19.3284 4 20 4.67157 20 5.5V10" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
