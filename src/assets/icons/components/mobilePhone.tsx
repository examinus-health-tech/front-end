import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function MobilePhoneIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="3" width="12" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M6 17H18" stroke={color} strokeWidth="2" />
          <Path d="M15 8H9" stroke={color} strokeWidth="2" />
          <Path d="M13 12H9" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="3" width="12" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M6 17H18" stroke={color} strokeWidth="2" />
          <Path d="M15 8H9" stroke={color} strokeWidth="2" />
          <Path d="M13 12H9" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
