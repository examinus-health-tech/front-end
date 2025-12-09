import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowTopLeftIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 15L5 8C5 6.34315 6.34315 5 8 5L15 5" stroke={color} strokeWidth="2" />
          <Path d="M6 6L20 20" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 15L5 8C5 6.34315 6.34315 5 8 5L15 5" stroke={color} strokeWidth="2" />
          <Path d="M6 6L20 20" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
