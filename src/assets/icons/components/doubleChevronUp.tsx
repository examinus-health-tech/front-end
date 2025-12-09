import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function DoubleChevronUpIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 12L9.87868 7.12132C11.0503 5.94975 12.9497 5.94975 14.1213 7.12132L19 12" stroke={color} strokeWidth="2" />
          <Path d="M5 19L9.87868 14.1213C11.0503 12.9497 12.9497 12.9497 14.1213 14.1213L19 19" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 12L9.87868 7.12132C11.0503 5.94975 12.9497 5.94975 14.1213 7.12132L19 12" stroke={color} strokeWidth="2" />
          <Path d="M5 19L9.87868 14.1213C11.0503 12.9497 12.9497 12.9497 14.1213 14.1213L19 19" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
