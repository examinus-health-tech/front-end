import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function CartIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="7" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="18" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M2 4H3C4.65685 4 6 5.34315 6 7V15C6 16.6569 7.34315 18 9 18H18C19.6569 18 21 16.6569 21 15V10C21 8.34315 19.6569 7 18 7H9" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="7" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="18" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M2 4H3C4.65685 4 6 5.34315 6 7V15C6 16.6569 7.34315 18 9 18H18C19.6569 18 21 16.6569 21 15V10C21 8.34315 19.6569 7 18 7H9" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
