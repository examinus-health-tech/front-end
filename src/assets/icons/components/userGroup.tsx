import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function UserGroupIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="8" y="5" width="8" height="8" rx="3" stroke={color} strokeWidth="2" />
          <Rect x="18" y="4" width="3" height="3" rx="1" fill={color} />
          <Rect x="1" width="3" height="3" rx="1" fill={color} />
          <Path d="M4 22V19C4 17.3431 5.34315 16 7 16H17C18.6569 16 20 17.3431 20 19V22" stroke={color} strokeWidth="2" />
          <Path d="M18 9H20.5C21.3284 9 22 9.67157 22 10.5V12" stroke={color} strokeWidth="2" />
          <Path d="M6 9H3.5C2.67157 9 2 9.67157 2 10.5V12" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="8" y="5" width="8" height="8" rx="3" stroke={color} strokeWidth="2" />
          <Rect x="18" y="4" width="3" height="3" rx="1" fill={color} />
          <Rect x="1" width="3" height="3" rx="1" fill={color} />
          <Path d="M4 22V19C4 17.3431 5.34315 16 7 16H17C18.6569 16 20 17.3431 20 19V22" stroke={color} strokeWidth="2" />
          <Path d="M18 9H20.5C21.3284 9 22 9.67157 22 10.5V12" stroke={color} strokeWidth="2" />
          <Path d="M6 9H3.5C2.67157 9 2 9.67157 2 10.5V12" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
