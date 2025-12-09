import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowUpSmIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 19L12 9" stroke={color} strokeWidth="2" />
          <Path d="M12 6V7C12 8.65685 13.3431 10 15 10H16" stroke={color} strokeWidth="2" />
          <Path d="M12 6V7C12 8.65685 10.6569 10 9 10H8" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 19L12 9" stroke={color} strokeWidth="2" />
          <Path d="M12 6V7C12 8.65685 13.3431 10 15 10H16" stroke={color} strokeWidth="2" />
          <Path d="M12 6V7C12 8.65685 10.6569 10 9 10H8" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
