import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function TaskHealthIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="4" width="12" height="12" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M10 20H17C18.6569 20 20 18.6569 20 17V10" stroke={color} strokeWidth="2" />
          <Path d="M10 7V13" stroke={color} strokeWidth="2" />
          <Path d="M13 10L7 10" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="4" width="12" height="12" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M10 20H17C18.6569 20 20 18.6569 20 17V10" stroke={color} strokeWidth="2" />
          <Path d="M10 7V13" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M13 10L7 10" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 5.5C3 4.11929 4.11929 3 5.5 3H14.5C15.8807 3 17 4.11929 17 5.5V14.5C17 15.8807 15.8807 17 14.5 17H5.5C4.11929 17 3 15.8807 3 14.5V5.5ZM9 7V9H7V11H9V13H11V11H13V9H11V7H9Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
          <Path d="M17 21C19.2091 21 21 19.2091 21 17V10H19V17C19 18.1046 18.1046 19 17 19H10V21H17Z" fill={color} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="4" width="12" height="12" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M10 20H17C18.6569 20 20 18.6569 20 17V10" stroke={color} strokeWidth="2" />
          <Path d="M10 7V13" stroke={color} strokeWidth="2" />
          <Path d="M13 10L7 10" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
