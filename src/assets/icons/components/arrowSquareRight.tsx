import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowSquareRightIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M7 12L15 12" stroke={color} strokeWidth="2" />
          <Path d="M17 12C15.3431 12 14 10.6569 14 9" stroke={color} strokeWidth="2" />
          <Path d="M17 12C15.3431 12 14 13.3431 14 15" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M7 12L15 12" stroke={color} strokeWidth="2" />
          <Path d="M17 12C15.3431 12 14 10.6569 14 9" stroke={color} strokeWidth="2" />
          <Path d="M17 12C15.3431 12 14 13.3431 14 15" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
