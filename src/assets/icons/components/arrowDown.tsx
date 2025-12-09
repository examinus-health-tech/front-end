import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowDownIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 2L12 21" stroke={color} strokeWidth="2" />
          <Path d="M12 22L12 21C12 18.2386 14.2386 16 17 16L20 16" stroke={color} strokeWidth="2" />
          <Path d="M12 22L12 21C12 18.2386 9.76142 16 7 16L4 16" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 2L12 21" stroke={color} strokeWidth="2" />
          <Path d="M12 22L12 21C12 18.2386 14.2386 16 17 16L20 16" stroke={color} strokeWidth="2" />
          <Path d="M12 22L12 21C12 18.2386 9.76142 16 7 16L4 16" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
