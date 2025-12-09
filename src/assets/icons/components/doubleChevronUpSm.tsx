import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function DoubleChevronUpSmIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 11L9.87868 8.12132C11.0503 6.94975 12.9497 6.94975 14.1213 8.12132L17 11" stroke={color} strokeWidth="2" />
          <Path d="M7 17L9.87868 14.1213C11.0503 12.9497 12.9497 12.9497 14.1213 14.1213L17 17" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 11L9.87868 8.12132C11.0503 6.94975 12.9497 6.94975 14.1213 8.12132L17 11" stroke={color} strokeWidth="2" />
          <Path d="M7 17L9.87868 14.1213C11.0503 12.9497 12.9497 12.9497 14.1213 14.1213L17 17" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
