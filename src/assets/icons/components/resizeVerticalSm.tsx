import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ResizeVerticalSmIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 14L9.87868 16.8787C11.0503 18.0503 12.9497 18.0503 14.1213 16.8787L17 14" stroke={color} strokeWidth="2" />
          <Path d="M7 10L9.87868 7.12132C11.0503 5.94975 12.9497 5.94975 14.1213 7.12132L17 10" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 14L9.87868 16.8787C11.0503 18.0503 12.9497 18.0503 14.1213 16.8787L17 14" stroke={color} strokeWidth="2" />
          <Path d="M7 10L9.87868 7.12132C11.0503 5.94975 12.9497 5.94975 14.1213 7.12132L17 10" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
