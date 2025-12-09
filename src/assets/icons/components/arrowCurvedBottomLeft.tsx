import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowCurvedBottomLeftIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 3V12C19 13.6569 17.6569 15 16 15H4" stroke={color} strokeWidth="2" />
          <Path d="M9 9L5.12132 12.8787C3.94975 14.0503 3.94975 15.9497 5.12132 17.1213L9 21" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 3V12C19 13.6569 17.6569 15 16 15H4" stroke={color} strokeWidth="2" />
          <Path d="M9 9L5.12132 12.8787C3.94975 14.0503 3.94975 15.9497 5.12132 17.1213L9 21" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
