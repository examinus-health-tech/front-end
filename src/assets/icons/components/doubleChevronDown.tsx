import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function DoubleChevronDownIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 12L9.87868 16.8787C11.0503 18.0503 12.9497 18.0503 14.1213 16.8787L19 12" stroke={color} strokeWidth="2" />
          <Path d="M5 5L9.87868 9.87868C11.0503 11.0503 12.9497 11.0503 14.1213 9.87868L19 5" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 12L9.87868 16.8787C11.0503 18.0503 12.9497 18.0503 14.1213 16.8787L19 12" stroke={color} strokeWidth="2" />
          <Path d="M5 5L9.87868 9.87868C11.0503 11.0503 12.9497 11.0503 14.1213 9.87868L19 5" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
