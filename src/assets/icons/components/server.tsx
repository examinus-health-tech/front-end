import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ServerIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="17" y="7" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="14" y="7" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="17" y="16" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="14" y="16" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M18 5H6C4.34315 5 3 6.34315 3 8V11H21V8C21 6.34315 19.6569 5 18 5Z" stroke={color} strokeWidth="2" />
          <Path d="M18 14H6C4.34315 14 3 15.3431 3 17V20H21V17C21 15.3431 19.6569 14 18 14Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="17" y="7" width="2" height="2" rx="0.5" fill={"#0CC1AF"} />
          <Rect x="14" y="7" width="2" height="2" rx="0.5" fill={"#0CC1AF"} />
          <Rect x="17" y="16" width="2" height="2" rx="0.5" fill={"#0CC1AF"} />
          <Rect x="14" y="16" width="2" height="2" rx="0.5" fill={"#0CC1AF"} />
          <Path d="M18 5H6C4.34315 5 3 6.34315 3 8V11H21V8C21 6.34315 19.6569 5 18 5Z" stroke={color} strokeWidth="2" />
          <Path d="M18 14H6C4.34315 14 3 15.3431 3 17V20H21V17C21 15.3431 19.6569 14 18 14Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 4C3.79086 4 2 5.79086 2 8V12H22V8C22 5.79086 20.2091 4 18 4H6ZM17 7.5C17 7.22386 17.2239 7 17.5 7H18.5C18.7761 7 19 7.22386 19 7.5V8.5C19 8.77614 18.7761 9 18.5 9H17.5C17.2239 9 17 8.77614 17 8.5V7.5ZM14.5 7C14.2239 7 14 7.22386 14 7.5V8.5C14 8.77614 14.2239 9 14.5 9H15.5C15.7761 9 16 8.77614 16 8.5V7.5C16 7.22386 15.7761 7 15.5 7H14.5Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
          <Path d="M6 13C3.79086 13 2 14.7909 2 17V21H22V17C22 14.7909 20.2091 13 18 13H6ZM17 16.5C17 16.2239 17.2239 16 17.5 16H18.5C18.7761 16 19 16.2239 19 16.5V17.5C19 17.7761 18.7761 18 18.5 18H17.5C17.2239 18 17 17.7761 17 17.5V16.5ZM14.5 16C14.2239 16 14 16.2239 14 16.5V17.5C14 17.7761 14.2239 18 14.5 18H15.5C15.7761 18 16 17.7761 16 17.5V16.5C16 16.2239 15.7761 16 15.5 16H14.5Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="17" y="7" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="14" y="7" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="17" y="16" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="14" y="16" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M18 5H6C4.34315 5 3 6.34315 3 8V11H21V8C21 6.34315 19.6569 5 18 5Z" stroke={color} strokeWidth="2" />
          <Path d="M18 14H6C4.34315 14 3 15.3431 3 17V20H21V17C21 15.3431 19.6569 14 18 14Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
