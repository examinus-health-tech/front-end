import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowUpIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 22L12 3" stroke={color} strokeWidth="2" />
          <Path d="M12 2L12 3C12 5.76142 14.2386 8 17 8L20 8" stroke={color} strokeWidth="2" />
          <Path d="M12 2L12 3C12 5.76142 9.76142 8 7 8L4 8" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 22L12 3" stroke={color} strokeWidth="2" />
          <Path d="M12 2L12 3C12 5.76142 14.2386 8 17 8L20 8" stroke={color} strokeWidth="2" />
          <Path d="M12 2L12 3C12 5.76142 9.76142 8 7 8L4 8" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
