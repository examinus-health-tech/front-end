import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function DoubleChevronRightSmIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M13 17L15.8787 14.1213C17.0503 12.9498 17.0503 11.0503 15.8787 9.87868L13 7" stroke={color} strokeWidth="2" />
          <Path d="M7 17L9.87868 14.1213C11.0503 12.9498 11.0503 11.0503 9.87868 9.87868L7 7" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M13 17L15.8787 14.1213C17.0503 12.9498 17.0503 11.0503 15.8787 9.87868L13 7" stroke={color} strokeWidth="2" />
          <Path d="M7 17L9.87868 14.1213C11.0503 12.9498 11.0503 11.0503 9.87868 9.87868L7 7" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
