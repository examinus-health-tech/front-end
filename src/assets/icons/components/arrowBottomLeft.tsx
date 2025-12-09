import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowBottomLeftIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 10L5 17C5 18.6569 6.34315 20 8 20L15 20" stroke={color} strokeWidth="2" />
          <Path d="M6 19L20 5" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 10L5 17C5 18.6569 6.34315 20 8 20L15 20" stroke={color} strokeWidth="2" />
          <Path d="M6 19L20 5" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
