import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function SunIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="7" y="7" width="10" height="10" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M12 4L12 1" stroke={color} strokeWidth="2" />
          <Path d="M18 6L20 4" stroke={color} strokeWidth="2" />
          <Path d="M6 6L4 4" stroke={color} strokeWidth="2" />
          <Path d="M12 20L12 23" stroke={color} strokeWidth="2" />
          <Path d="M18 18L20 20" stroke={color} strokeWidth="2" />
          <Path d="M6 18L4 20" stroke={color} strokeWidth="2" />
          <Path d="M4 12H1" stroke={color} strokeWidth="2" />
          <Path d="M23 12L20 12" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="7" y="7" width="10" height="10" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M12 4L12 1" stroke={color} strokeWidth="2" />
          <Path d="M18 6L20 4" stroke={color} strokeWidth="2" />
          <Path d="M6 6L4 4" stroke={color} strokeWidth="2" />
          <Path d="M12 20L12 23" stroke={color} strokeWidth="2" />
          <Path d="M18 18L20 20" stroke={color} strokeWidth="2" />
          <Path d="M6 18L4 20" stroke={color} strokeWidth="2" />
          <Path d="M4 12H1" stroke={color} strokeWidth="2" />
          <Path d="M23 12L20 12" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
