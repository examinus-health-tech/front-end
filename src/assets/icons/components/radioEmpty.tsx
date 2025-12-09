import { Svg, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function RadioEmptyIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="5" y="5" width="14" height="14" rx="3" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="5" y="5" width="14" height="14" rx="3" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
