import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChevronSquareUpIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M8 14L9.87868 12.1213C11.0503 10.9497 12.9497 10.9497 14.1213 12.1213L16 14" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M8 14L9.87868 12.1213C11.0503 10.9497 12.9497 10.9497 14.1213 12.1213L16 14" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
