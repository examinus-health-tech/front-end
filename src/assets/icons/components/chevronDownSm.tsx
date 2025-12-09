import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChevronDownSmIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 10L9.87868 12.8787C11.0503 14.0503 12.9497 14.0503 14.1213 12.8787L17 10" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 10L9.87868 12.8787C11.0503 14.0503 12.9497 14.0503 14.1213 12.8787L17 10" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
