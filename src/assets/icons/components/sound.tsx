import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function SoundIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 9H5.5C4.67157 9 4 9.67157 4 10.5V14.5C4 15.3284 4.67157 16 5.5 16H7" stroke={color} strokeWidth="2" />
          <Path d="M7 9H8C9.65685 9 11 7.65685 11 6V4" stroke={color} strokeWidth="2" />
          <Path d="M14 15H14.5C15.3284 15 16 14.3284 16 13.5V10.5C16 9.67157 15.3284 9 14.5 9H14" stroke={color} strokeWidth="2" />
          <Path d="M16 19H17C18.6569 19 20 17.6569 20 16V8C20 6.34315 18.6569 5 17 5H16" stroke={color} strokeWidth="2" />
          <Path d="M7 16H8C9.65685 16 11 17.3431 11 19V21" stroke={color} strokeWidth="2" />
          <Path d="M11 5V20" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 9H5.5C4.67157 9 4 9.67157 4 10.5V14.5C4 15.3284 4.67157 16 5.5 16H7" stroke={color} strokeWidth="2" />
          <Path d="M7 9H8C9.65685 9 11 7.65685 11 6V4" stroke={color} strokeWidth="2" />
          <Path d="M14 15H14.5C15.3284 15 16 14.3284 16 13.5V10.5C16 9.67157 15.3284 9 14.5 9H14" stroke={color} strokeWidth="2" />
          <Path d="M16 19H17C18.6569 19 20 17.6569 20 16V8C20 6.34315 18.6569 5 17 5H16" stroke={color} strokeWidth="2" />
          <Path d="M7 16H8C9.65685 16 11 17.3431 11 19V21" stroke={color} strokeWidth="2" />
          <Path d="M11 5V20" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
