import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChevronLeftSmIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M14 17L11.1213 14.1213C9.94975 12.9497 9.94975 11.0503 11.1213 9.87868L14 7" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M14 17L11.1213 14.1213C9.94975 12.9497 9.94975 11.0503 11.1213 9.87868L14 7" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
