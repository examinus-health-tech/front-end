import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChevronDownIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 8L9.87868 14.8787C11.0503 16.0503 12.9497 16.0503 14.1213 14.8787L21 8" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 8L9.87868 14.8787C11.0503 16.0503 12.9497 16.0503 14.1213 14.8787L21 8" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
