import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function DocumentIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="5" y="3" width="14" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M8 8H16" stroke={color} strokeWidth="2" />
          <Path d="M8 12H16" stroke={color} strokeWidth="2" />
          <Path d="M8 16H12" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="5" y="3" width="14" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M8 8H16" stroke={color} strokeWidth="2" />
          <Path d="M8 12H16" stroke={color} strokeWidth="2" />
          <Path d="M8 16H12" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
