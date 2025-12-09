import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChevronUpIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 16L9.87868 9.12132C11.0503 7.94975 12.9497 7.94975 14.1213 9.12132L21 16" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 16L9.87868 9.12132C11.0503 7.94975 12.9497 7.94975 14.1213 9.12132L21 16" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
