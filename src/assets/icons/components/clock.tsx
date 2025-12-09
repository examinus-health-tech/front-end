import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ClockIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="4" width="16" height="16" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M11 7L11 10C11 11.6569 12.3431 13 14 13L17 13" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="4" width="16" height="16" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M11 7L11 10C11 11.6569 12.3431 13 14 13L17 13" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
