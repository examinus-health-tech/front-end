import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChevronRightSmIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M10 17L12.8787 14.1213C14.0503 12.9497 14.0503 11.0503 12.8787 9.87868L10 7" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M10 17L12.8787 14.1213C14.0503 12.9497 14.0503 11.0503 12.8787 9.87868L10 7" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
