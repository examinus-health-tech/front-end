import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function SportsRollerbladeIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="5" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="8" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="11" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="14" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="17" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M5 4H12V8C12 9.65685 13.3431 11 15 11H16C17.6569 11 19 12.3431 19 14V15C19 16.6569 17.6569 18 16 18H8C6.34315 18 5 16.6569 5 15V4Z" stroke={color} strokeWidth="2" />
          <Path d="M12 8L8 8" stroke={color} strokeWidth="2" />
          <Path d="M16 11L8 11" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="5" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="8" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="11" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="14" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="17" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M12 8L8 8" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M16 11L8 11" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M5 4H12V8C12 9.65685 13.3431 11 15 11H16C17.6569 11 19 12.3431 19 14V15C19 16.6569 17.6569 18 16 18H8C6.34315 18 5 16.6569 5 15V4Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M4 3H13V7L8 7V9L13.2676 9C13.6134 9.5978 14.2597 10 15 10H8V12L19.4649 12C19.8052 12.5883 20 13.2714 20 14V15C20 17.2091 18.2091 19 16 19H8C5.79086 19 4 17.2091 4 15V3Z" fill={color} />
          <Path d="M5.5 20C5.22386 20 5 20.2239 5 20.5V21.5C5 21.7761 5.22386 22 5.5 22H6.5C6.77614 22 7 21.7761 7 21.5V20.5C7 20.2239 6.77614 20 6.5 20H5.5Z" fill={color} />
          <Path d="M8 20.5C8 20.2239 8.22386 20 8.5 20H9.5C9.77614 20 10 20.2239 10 20.5V21.5C10 21.7761 9.77614 22 9.5 22H8.5C8.22386 22 8 21.7761 8 21.5V20.5Z" fill={color} />
          <Path d="M11.5 20C11.2239 20 11 20.2239 11 20.5V21.5C11 21.7761 11.2239 22 11.5 22H12.5C12.7761 22 13 21.7761 13 21.5V20.5C13 20.2239 12.7761 20 12.5 20H11.5Z" fill={color} />
          <Path d="M14 20.5C14 20.2239 14.2239 20 14.5 20H15.5C15.7761 20 16 20.2239 16 20.5V21.5C16 21.7761 15.7761 22 15.5 22H14.5C14.2239 22 14 21.7761 14 21.5V20.5Z" fill={color} />
          <Path d="M17.5 20C17.2239 20 17 20.2239 17 20.5V21.5C17 21.7761 17.2239 22 17.5 22H18.5C18.7761 22 19 21.7761 19 21.5V20.5C19 20.2239 18.7761 20 18.5 20H17.5Z" fill={color} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="5" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="8" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="11" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="14" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="17" y="20" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M5 4H12V8C12 9.65685 13.3431 11 15 11H16C17.6569 11 19 12.3431 19 14V15C19 16.6569 17.6569 18 16 18H8C6.34315 18 5 16.6569 5 15V4Z" stroke={color} strokeWidth="2" />
          <Path d="M12 8L8 8" stroke={color} strokeWidth="2" />
          <Path d="M16 11L8 11" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
