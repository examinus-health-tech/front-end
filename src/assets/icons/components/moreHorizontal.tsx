import { Svg, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function MoreHorizontalIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="17" y="10" width="4" height="4" rx="0.5" stroke={color} strokeWidth="2" />
          <Rect x="10" y="10" width="4" height="4" rx="0.5" stroke={color} strokeWidth="2" />
          <Rect x="3" y="10" width="4" height="4" rx="0.5" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="17" y="10" width="4" height="4" rx="0.5" stroke={color} strokeWidth="2" />
          <Rect x="10" y="10" width="4" height="4" rx="0.5" stroke={color} strokeWidth="2" />
          <Rect x="3" y="10" width="4" height="4" rx="0.5" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
