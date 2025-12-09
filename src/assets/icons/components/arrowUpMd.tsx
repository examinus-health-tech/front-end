import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowUpMdIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 21L12 3" stroke={color} strokeWidth="2" />
          <Path d="M12 3L12 6C12 7.65685 10.6569 9 9 9L6 9" stroke={color} strokeWidth="2" />
          <Path d="M12 3L12 6C12 7.65685 13.3431 9 15 9L18 9" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 21L12 3" stroke={color} strokeWidth="2" />
          <Path d="M12 3L12 6C12 7.65685 10.6569 9 9 9L6 9" stroke={color} strokeWidth="2" />
          <Path d="M12 3L12 6C12 7.65685 13.3431 9 15 9L18 9" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
