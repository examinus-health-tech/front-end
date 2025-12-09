import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ControlIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="7" y="10" width="4" height="4" rx="1.5" stroke={color} strokeWidth="2" />
          <Rect x="13" y="4" width="4" height="4" rx="1.5" stroke={color} strokeWidth="2" />
          <Rect x="13" y="16" width="4" height="4" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M3 6H13" stroke={color} strokeWidth="2" />
          <Path d="M11 12L21 12" stroke={color} strokeWidth="2" />
          <Path d="M3 18H13" stroke={color} strokeWidth="2" />
          <Path d="M3 12H7" stroke={color} strokeWidth="2" />
          <Path d="M21 6H16" stroke={color} strokeWidth="2" />
          <Path d="M21 18L17 18" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="7" y="10" width="4" height="4" rx="1.5" stroke={color} strokeWidth="2" />
          <Rect x="13" y="4" width="4" height="4" rx="1.5" stroke={color} strokeWidth="2" />
          <Rect x="13" y="16" width="4" height="4" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M3 6H13" stroke={color} strokeWidth="2" />
          <Path d="M11 12L21 12" stroke={color} strokeWidth="2" />
          <Path d="M3 18H13" stroke={color} strokeWidth="2" />
          <Path d="M3 12H7" stroke={color} strokeWidth="2" />
          <Path d="M21 6H16" stroke={color} strokeWidth="2" />
          <Path d="M21 18L17 18" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
