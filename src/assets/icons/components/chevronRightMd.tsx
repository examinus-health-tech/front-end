import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChevronRightMdIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M9 19L13.8787 14.1213C15.0503 12.9497 15.0503 11.0503 13.8787 9.87868L9 5" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M9 19L13.8787 14.1213C15.0503 12.9497 15.0503 11.0503 13.8787 9.87868L9 5" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
