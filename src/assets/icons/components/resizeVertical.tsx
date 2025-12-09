import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ResizeVerticalIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 14L9.87868 18.8787C11.0503 20.0503 12.9497 20.0503 14.1213 18.8787L19 14" stroke={color} strokeWidth="2" />
          <Path d="M5 10L9.87868 5.12132C11.0503 3.94975 12.9497 3.94975 14.1213 5.12132L19 10" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 14L9.87868 18.8787C11.0503 20.0503 12.9497 20.0503 14.1213 18.8787L19 14" stroke={color} strokeWidth="2" />
          <Path d="M5 10L9.87868 5.12132C11.0503 3.94975 12.9497 3.94975 14.1213 5.12132L19 10" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
