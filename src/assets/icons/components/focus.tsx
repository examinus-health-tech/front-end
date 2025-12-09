import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function FocusIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="8" y="8" width="8" height="8" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M9 3H6C4.34315 3 3 4.34315 3 6V9" stroke={color} strokeWidth="2" />
          <Path d="M9 21H6C4.34315 21 3 19.6569 3 18V15" stroke={color} strokeWidth="2" />
          <Path d="M15 3H18C19.6569 3 21 4.34315 21 6V9" stroke={color} strokeWidth="2" />
          <Path d="M15 21H18C19.6569 21 21 19.6569 21 18V15" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="8" y="8" width="8" height="8" rx="1.5" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M9 3H6C4.34315 3 3 4.34315 3 6V9" stroke={color} strokeWidth="2" />
          <Path d="M9 21H6C4.34315 21 3 19.6569 3 18V15" stroke={color} strokeWidth="2" />
          <Path d="M15 3H18C19.6569 3 21 4.34315 21 6V9" stroke={color} strokeWidth="2" />
          <Path d="M15 21H18C19.6569 21 21 19.6569 21 18V15" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M2 6C2 3.79086 3.79086 2 6 2H9V4H6C4.89543 4 4 4.89543 4 6V9H2V6ZM2 18C2 20.2091 3.79086 22 6 22H9V20H6C4.89543 20 4 19.1046 4 18V15H2V18ZM18 2C20.2091 2 22 3.79086 22 6V9H20V6C20 4.89543 19.1046 4 18 4H15V2H18ZM22 18C22 20.2091 20.2091 22 18 22H15V20H18C19.1046 20 20 19.1046 20 18V15H22V18ZM7 9.5C7 8.11929 8.11929 7 9.5 7H14.5C15.8807 7 17 8.11929 17 9.5V14.5C17 15.8807 15.8807 17 14.5 17H9.5C8.11929 17 7 15.8807 7 14.5V9.5Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="8" y="8" width="8" height="8" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M9 3H6C4.34315 3 3 4.34315 3 6V9" stroke={color} strokeWidth="2" />
          <Path d="M9 21H6C4.34315 21 3 19.6569 3 18V15" stroke={color} strokeWidth="2" />
          <Path d="M15 3H18C19.6569 3 21 4.34315 21 6V9" stroke={color} strokeWidth="2" />
          <Path d="M15 21H18C19.6569 21 21 19.6569 21 18V15" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
