import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChevronUpMdIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 15L14.1213 10.1213C12.9497 8.94975 11.0503 8.94975 9.87868 10.1213L5 15" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 15L14.1213 10.1213C12.9497 8.94975 11.0503 8.94975 9.87868 10.1213L5 15" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
