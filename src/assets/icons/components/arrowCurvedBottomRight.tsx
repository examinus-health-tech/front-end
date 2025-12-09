import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowCurvedBottomRightIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 3V12C5 13.6569 6.34315 15 8 15H20" stroke={color} strokeWidth="2" />
          <Path d="M15 9L18.8787 12.8787C20.0503 14.0503 20.0503 15.9497 18.8787 17.1213L15 21" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 3V12C5 13.6569 6.34315 15 8 15H20" stroke={color} strokeWidth="2" />
          <Path d="M15 9L18.8787 12.8787C20.0503 14.0503 20.0503 15.9497 18.8787 17.1213L15 21" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
