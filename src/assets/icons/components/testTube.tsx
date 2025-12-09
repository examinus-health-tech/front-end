import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function TestTubeIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M9 12H15" stroke={color} strokeWidth="2" />
          <Path d="M8 4V17C8 18.6569 9.34315 20 11 20H13C14.6569 20 16 18.6569 16 17V4" stroke={color} strokeWidth="2" />
          <Path d="M5 4H19" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M9 12H15" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M8 4V17C8 18.6569 9.34315 20 11 20H13C14.6569 20 16 18.6569 16 17V4" stroke={color} strokeWidth="2" />
          <Path d="M5 4H19" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M17 5H19V3H5V5H7V17C7 19.2091 8.79086 21 11 21H13C15.2091 21 17 19.2091 17 17V5ZM15 5H9V11H15V5Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M9 12H15" stroke={color} strokeWidth="2" />
          <Path d="M8 4V17C8 18.6569 9.34315 20 11 20H13C14.6569 20 16 18.6569 16 17V4" stroke={color} strokeWidth="2" />
          <Path d="M5 4H19" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
