import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowRightMdIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 12L21 12" stroke={color} strokeWidth="2" />
          <Path d="M21 12L18 12C16.3431 12 15 10.6569 15 9L15 6" stroke={color} strokeWidth="2" />
          <Path d="M21 12L18 12C16.3431 12 15 13.3431 15 15L15 18" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 12L21 12" stroke={color} strokeWidth="2" />
          <Path d="M21 12L18 12C16.3431 12 15 10.6569 15 9L15 6" stroke={color} strokeWidth="2" />
          <Path d="M21 12L18 12C16.3431 12 15 13.3431 15 15L15 18" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
