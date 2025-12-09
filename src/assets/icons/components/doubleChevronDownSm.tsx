import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function DoubleChevronDownSmIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 13L9.87868 15.8787C11.0503 17.0503 12.9497 17.0503 14.1213 15.8787L17 13" stroke={color} strokeWidth="2" />
          <Path d="M7 7L9.87868 9.87868C11.0503 11.0503 12.9497 11.0503 14.1213 9.87868L17 7" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 13L9.87868 15.8787C11.0503 17.0503 12.9497 17.0503 14.1213 15.8787L17 13" stroke={color} strokeWidth="2" />
          <Path d="M7 7L9.87868 9.87868C11.0503 11.0503 12.9497 11.0503 14.1213 9.87868L17 7" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
