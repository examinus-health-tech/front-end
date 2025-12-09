import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowTopRightIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M20 15L20 8C20 6.34315 18.6569 5 17 5L10 5" stroke={color} strokeWidth="2" />
          <Path d="M19 6L5 20" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M20 15L20 8C20 6.34315 18.6569 5 17 5L10 5" stroke={color} strokeWidth="2" />
          <Path d="M19 6L5 20" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
