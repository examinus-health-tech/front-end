import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ResizeHorizontalIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M10 5L5.12132 9.87868C3.94975 11.0503 3.94975 12.9497 5.12132 14.1213L10 19" stroke={color} strokeWidth="2" />
          <Path d="M14 5L18.8787 9.87868C20.0503 11.0503 20.0503 12.9497 18.8787 14.1213L14 19" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M10 5L5.12132 9.87868C3.94975 11.0503 3.94975 12.9497 5.12132 14.1213L10 19" stroke={color} strokeWidth="2" />
          <Path d="M14 5L18.8787 9.87868C20.0503 11.0503 20.0503 12.9497 18.8787 14.1213L14 19" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
