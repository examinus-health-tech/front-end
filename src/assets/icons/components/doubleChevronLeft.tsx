import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function DoubleChevronLeftIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 19L7.12132 14.1213C5.94975 12.9497 5.94975 11.0503 7.12132 9.87868L12 5" stroke={color} strokeWidth="2" />
          <Path d="M19 19L14.1213 14.1213C12.9497 12.9497 12.9497 11.0503 14.1213 9.87868L19 5" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 19L7.12132 14.1213C5.94975 12.9497 5.94975 11.0503 7.12132 9.87868L12 5" stroke={color} strokeWidth="2" />
          <Path d="M19 19L14.1213 14.1213C12.9497 12.9497 12.9497 11.0503 14.1213 9.87868L19 5" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
