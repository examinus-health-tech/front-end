import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function DoubleChevronLeftSmIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M11 17L8.12132 14.1213C6.94975 12.9498 6.94975 11.0503 8.12132 9.87868L11 7" stroke={color} strokeWidth="2" />
          <Path d="M17 17L14.1213 14.1213C12.9497 12.9498 12.9497 11.0503 14.1213 9.87868L17 7" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M11 17L8.12132 14.1213C6.94975 12.9498 6.94975 11.0503 8.12132 9.87868L11 7" stroke={color} strokeWidth="2" />
          <Path d="M17 17L14.1213 14.1213C12.9497 12.9498 12.9497 11.0503 14.1213 9.87868L17 7" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
