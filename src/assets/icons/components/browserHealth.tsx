import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function BrowserHealthIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="4" width="18" height="16" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M3 8H21" stroke={color} strokeWidth="2" />
          <Path d="M9 11V17" stroke={color} strokeWidth="2" />
          <Path d="M12 14L6 14" stroke={color} strokeWidth="2" />
          <Path d="M14 12H18" stroke={color} strokeWidth="2" />
          <Path d="M14 16H18" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="4" width="18" height="16" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M3 8H21" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M9 11V17" stroke={color} strokeWidth="2" />
          <Path d="M12 14L6 14" stroke={color} strokeWidth="2" />
          <Path d="M14 12H18" stroke={color} strokeWidth="2" />
          <Path d="M14 16H18" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M2 7C2 4.79086 3.79086 3 6 3H18C20.2091 3 22 4.79086 22 7H2ZM2 9V17C2 19.2091 3.79086 21 6 21H18C20.2091 21 22 19.2091 22 17V9H2ZM8 15V17H10V15H12V13H10V11H8V13H6V15H8ZM14 13H18V11H14V13ZM18 17H14V15H18V17Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="4" width="18" height="16" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M3 8H21" stroke={color} strokeWidth="2" />
          <Path d="M9 11V17" stroke={color} strokeWidth="2" />
          <Path d="M12 14L6 14" stroke={color} strokeWidth="2" />
          <Path d="M14 12H18" stroke={color} strokeWidth="2" />
          <Path d="M14 16H18" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
