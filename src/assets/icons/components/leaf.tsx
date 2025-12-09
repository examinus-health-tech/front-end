import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function LeafIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M4 6C4 4.34315 5.34315 3 7 3H18C19.6569 3 21 4.34315 21 6V12C21 13.6569 19.6569 15 18 15H7C5.34315 15 4 13.6569 4 12V6Z" stroke={color} strokeWidth="2" />
          <Path d="M4 21V12C4 10.3431 5.34315 9 7 9H14" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M4 6C4 4.34315 5.34315 3 7 3H18C19.6569 3 21 4.34315 21 6V12C21 13.6569 19.6569 15 18 15H7C5.34315 15 4 13.6569 4 12V6Z" stroke={color} strokeWidth="2" />
          <Path d="M4 21V12C4 10.3431 5.34315 9 7 9H14" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 2C4.79086 2 3 3.79086 3 6V12V21H5V15.4649C5.58835 15.8052 6.27143 16 7 16H18C20.2091 16 22 14.2091 22 12V6C22 3.79086 20.2091 2 18 2H7ZM5 12H3C3 9.79086 4.79086 8 7 8H14V10H7C5.89543 10 5 10.8954 5 12Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M4 6C4 4.34315 5.34315 3 7 3H18C19.6569 3 21 4.34315 21 6V12C21 13.6569 19.6569 15 18 15H7C5.34315 15 4 13.6569 4 12V6Z" stroke={color} strokeWidth="2" />
          <Path d="M4 21V12C4 10.3431 5.34315 9 7 9H14" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
