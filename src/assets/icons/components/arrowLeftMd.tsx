import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowLeftMdIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M21 12L3 12" stroke={color} strokeWidth="2" />
          <Path d="M3 12L6 12C7.65685 12 9 10.6569 9 9L9 6" stroke={color} strokeWidth="2" />
          <Path d="M3 12L6 12C7.65685 12 9 13.3431 9 15L9 18" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M21 12L3 12" stroke={color} strokeWidth="2" />
          <Path d="M3 12L6 12C7.65685 12 9 10.6569 9 9L9 6" stroke={color} strokeWidth="2" />
          <Path d="M3 12L6 12C7.65685 12 9 13.3431 9 15L9 18" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
