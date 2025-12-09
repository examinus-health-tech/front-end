import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowLeftSmIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M18 12L8 12" stroke={color} strokeWidth="2" />
          <Path d="M5 12L6 12C7.65685 12 9 13.3431 9 15L9 16" stroke={color} strokeWidth="2" />
          <Path d="M5 12L6 12C7.65685 12 9 10.6569 9 9L9 8" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M18 12L8 12" stroke={color} strokeWidth="2" />
          <Path d="M5 12L6 12C7.65685 12 9 13.3431 9 15L9 16" stroke={color} strokeWidth="2" />
          <Path d="M5 12L6 12C7.65685 12 9 10.6569 9 9L9 8" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
