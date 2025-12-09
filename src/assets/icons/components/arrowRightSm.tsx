import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowRightSmIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 12L16 12" stroke={color} strokeWidth="2" />
          <Path d="M19 12L18 12C16.3431 12 15 13.3431 15 15L15 16" stroke={color} strokeWidth="2" />
          <Path d="M19 12L18 12C16.3431 12 15 10.6569 15 9L15 8" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 12L16 12" stroke={color} strokeWidth="2" />
          <Path d="M19 12L18 12C16.3431 12 15 13.3431 15 15L15 16" stroke={color} strokeWidth="2" />
          <Path d="M19 12L18 12C16.3431 12 15 10.6569 15 9L15 8" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
