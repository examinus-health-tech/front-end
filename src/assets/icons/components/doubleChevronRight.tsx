import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function DoubleChevronRightIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 19L16.8787 14.1213C18.0503 12.9497 18.0503 11.0503 16.8787 9.87868L12 5" stroke={color} strokeWidth="2" />
          <Path d="M5 19L9.87868 14.1213C11.0503 12.9497 11.0503 11.0503 9.87868 9.87868L5 5" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 19L16.8787 14.1213C18.0503 12.9497 18.0503 11.0503 16.8787 9.87868L12 5" stroke={color} strokeWidth="2" />
          <Path d="M5 19L9.87868 14.1213C11.0503 12.9497 11.0503 11.0503 9.87868 9.87868L5 5" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
