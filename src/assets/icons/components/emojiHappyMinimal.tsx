import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function EmojiHappyMinimalIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 9V12C3 13.6569 4.34315 15 6 15H18C19.6569 15 21 13.6569 21 12V9" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 9V12C3 13.6569 4.34315 15 6 15H18C19.6569 15 21 13.6569 21 12V9" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M2 12C2 14.2091 3.79086 16 6 16H18C20.2091 16 22 14.2091 22 12V9H20V12C20 13.1046 19.1046 14 18 14H6C4.89543 14 4 13.1046 4 12V9H2V12Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 9V12C3 13.6569 4.34315 15 6 15H18C19.6569 15 21 13.6569 21 12V9" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
