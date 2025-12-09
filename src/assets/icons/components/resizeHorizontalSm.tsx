import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ResizeHorizontalSmIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M10 7L7.12132 9.87868C5.94975 11.0502 5.94975 12.9497 7.12132 14.1213L10 17" stroke={color} strokeWidth="2" />
          <Path d="M14 7L16.8787 9.87868C18.0502 11.0503 18.0503 12.9497 16.8787 14.1213L14 17" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M10 7L7.12132 9.87868C5.94975 11.0502 5.94975 12.9497 7.12132 14.1213L10 17" stroke={color} strokeWidth="2" />
          <Path d="M14 7L16.8787 9.87868C18.0502 11.0503 18.0503 12.9497 16.8787 14.1213L14 17" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
