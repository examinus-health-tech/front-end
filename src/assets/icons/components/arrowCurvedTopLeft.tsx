import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowCurvedTopLeftIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 21V12C19 10.3431 17.6569 9 16 9H4" stroke={color} strokeWidth="2" />
          <Path d="M9 15L5.12132 11.1213C3.94975 9.94975 3.94975 8.05025 5.12132 6.87868L9 3" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 21V12C19 10.3431 17.6569 9 16 9H4" stroke={color} strokeWidth="2" />
          <Path d="M9 15L5.12132 11.1213C3.94975 9.94975 3.94975 8.05025 5.12132 6.87868L9 3" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
