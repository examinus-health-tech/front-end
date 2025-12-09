import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChevronUpSmIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 14L9.87868 11.1213C11.0503 9.94975 12.9497 9.94975 14.1213 11.1213L17 14" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 14L9.87868 11.1213C11.0503 9.94975 12.9497 9.94975 14.1213 11.1213L17 14" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
