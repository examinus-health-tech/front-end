import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function EmojiSadMinimalIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 15V12C3 10.3431 4.34315 9 6 9H18C19.6569 9 21 10.3431 21 12V15" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 15V12C3 10.3431 4.34315 9 6 9H18C19.6569 9 21 10.3431 21 12V15" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M2 12C2 9.79086 3.79086 8 6 8H18C20.2091 8 22 9.79086 22 12V15H20V12C20 10.8954 19.1046 10 18 10H6C4.89543 10 4 10.8954 4 12V15H2V12Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 15V12C3 10.3431 4.34315 9 6 9H18C19.6569 9 21 10.3431 21 12V15" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
