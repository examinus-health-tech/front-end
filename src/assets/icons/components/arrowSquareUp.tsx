import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowSquareUpIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M12 17L12 9" stroke={color} strokeWidth="2" />
          <Path d="M12 7C12 8.65685 13.3431 10 15 10" stroke={color} strokeWidth="2" />
          <Path d="M12 7C12 8.65685 10.6569 10 9 10" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M12 17L12 9" stroke={color} strokeWidth="2" />
          <Path d="M12 7C12 8.65685 13.3431 10 15 10" stroke={color} strokeWidth="2" />
          <Path d="M12 7C12 8.65685 10.6569 10 9 10" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
