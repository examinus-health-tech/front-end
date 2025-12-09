import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChevronSquareLeftIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M13 8L11.1213 9.87868C9.94975 11.0503 9.94975 12.9497 11.1213 14.1213L13 16" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M13 8L11.1213 9.87868C9.94975 11.0503 9.94975 12.9497 11.1213 14.1213L13 16" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
