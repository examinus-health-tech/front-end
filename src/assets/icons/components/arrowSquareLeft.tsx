import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowSquareLeftIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M17 12L9 12" stroke={color} strokeWidth="2" />
          <Path d="M7 12C8.65685 12 10 13.3431 10 15" stroke={color} strokeWidth="2" />
          <Path d="M7 12C8.65685 12 10 10.6569 10 9" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M17 12L9 12" stroke={color} strokeWidth="2" />
          <Path d="M7 12C8.65685 12 10 13.3431 10 15" stroke={color} strokeWidth="2" />
          <Path d="M7 12C8.65685 12 10 10.6569 10 9" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
