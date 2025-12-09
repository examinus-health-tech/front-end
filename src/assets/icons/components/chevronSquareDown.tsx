import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChevronSquareDownIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M8 11L9.87868 12.8787C11.0503 14.0503 12.9497 14.0503 14.1213 12.8787L16 11" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M8 11L9.87868 12.8787C11.0503 14.0503 12.9497 14.0503 14.1213 12.8787L16 11" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
