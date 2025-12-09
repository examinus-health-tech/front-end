import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChevronDownMdIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 9L9.87868 13.8787C11.0503 15.0503 12.9497 15.0503 14.1213 13.8787L19 9" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 9L9.87868 13.8787C11.0503 15.0503 12.9497 15.0503 14.1213 13.8787L19 9" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
