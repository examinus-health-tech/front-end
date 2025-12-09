import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function EmojiAnxiousMinimalIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M21 15H3V12C3 10.3431 4.34315 9 6 9H18C19.6569 9 21 10.3431 21 12V15Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M21 15H3V12C3 10.3431 4.34315 9 6 9H18C19.6569 9 21 10.3431 21 12V15Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M2 16V12C2 9.79086 3.79086 8 6 8H18C20.2091 8 22 9.79086 22 12V16H2Z" fill={color} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M21 15H3V12C3 10.3431 4.34315 9 6 9H18C19.6569 9 21 10.3431 21 12V15Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
