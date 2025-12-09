import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function NurseIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 7H17" stroke={color} strokeWidth="2" />
          <Path d="M8 3H16V10C16 11.6569 14.6569 13 13 13H11C9.34315 13 8 11.6569 8 10V3Z" stroke={color} strokeWidth="2" />
          <Path d="M20 21V14C20 12.3431 18.6569 11 17 11H16M4 21V14C4 12.3431 5.34315 11 7 11H8" stroke={color} strokeWidth="2" />
          <Path d="M12 15L12 21" stroke={color} strokeWidth="2" />
          <Path d="M15 18L9 18" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 7H17" stroke={color} strokeWidth="2" />
          <Path d="M8 3H16V10C16 11.6569 14.6569 13 13 13H11C9.34315 13 8 11.6569 8 10V3Z" stroke={color} strokeWidth="2" />
          <Path d="M20 21V14C20 12.3431 18.6569 11 17 11H16M4 21V14C4 12.3431 5.34315 11 7 11H8" stroke={color} strokeWidth="2" />
          <Path d="M12 15L12 21" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M15 18L9 18" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 2H17V10C19.2091 10 21 11.7909 21 14V21H13V19H15V17H13V15H11V17H9V19H11V21H3V14C3 11.7909 4.79086 10 7 10V2ZM9 10V8H15V10C15 11.1046 14.1046 12 13 12H11C9.89543 12 9 11.1046 9 10Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 7H17" stroke={color} strokeWidth="2" />
          <Path d="M8 3H16V10C16 11.6569 14.6569 13 13 13H11C9.34315 13 8 11.6569 8 10V3Z" stroke={color} strokeWidth="2" />
          <Path d="M20 21V14C20 12.3431 18.6569 11 17 11H16M4 21V14C4 12.3431 5.34315 11 7 11H8" stroke={color} strokeWidth="2" />
          <Path d="M12 15L12 21" stroke={color} strokeWidth="2" />
          <Path d="M15 18L9 18" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
