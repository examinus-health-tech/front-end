import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowCurvedTopRightIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 21V12C5 10.3431 6.34315 9 8 9H20" stroke={color} strokeWidth="2" />
          <Path d="M15 15L18.8787 11.1213C20.0503 9.94975 20.0503 8.05025 18.8787 6.87868L15 3" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 21V12C5 10.3431 6.34315 9 8 9H20" stroke={color} strokeWidth="2" />
          <Path d="M15 15L18.8787 11.1213C20.0503 9.94975 20.0503 8.05025 18.8787 6.87868L15 3" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
