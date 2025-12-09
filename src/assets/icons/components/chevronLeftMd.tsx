import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChevronLeftMdIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M15 19L10.1213 14.1213C8.94975 12.9497 8.94975 11.0503 10.1213 9.87868L15 5" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M15 19L10.1213 14.1213C8.94975 12.9497 8.94975 11.0503 10.1213 9.87868L15 5" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
