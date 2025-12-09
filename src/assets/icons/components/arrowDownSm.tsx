import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowDownSmIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 6L12 16" stroke={color} strokeWidth="2" />
          <Path d="M12 19V18C12 16.3431 13.3431 15 15 15H16" stroke={color} strokeWidth="2" />
          <Path d="M12 19V18C12 16.3431 10.6569 15 9 15H8" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 6L12 16" stroke={color} strokeWidth="2" />
          <Path d="M12 19V18C12 16.3431 13.3431 15 15 15H16" stroke={color} strokeWidth="2" />
          <Path d="M12 19V18C12 16.3431 10.6569 15 9 15H8" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
