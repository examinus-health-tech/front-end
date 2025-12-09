import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function SmartwatchHealthIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="5" y="5" width="14" height="14" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M16 5V3.5C16 2.67157 15.3284 2 14.5 2H9.5C8.67157 2 8 2.67157 8 3.5V5" stroke={color} strokeWidth="2" />
          <Path d="M8 19V20.5C8 21.3284 8.67157 22 9.5 22H14.5C15.3284 22 16 21.3284 16 20.5V19" stroke={color} strokeWidth="2" />
          <Path d="M12 9L12 15" stroke={color} strokeWidth="2" />
          <Path d="M15 12H9" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="5" y="5" width="14" height="14" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M16 5V3.5C16 2.67157 15.3284 2 14.5 2H9.5C8.67157 2 8 2.67157 8 3.5V5" stroke={color} strokeWidth="2" />
          <Path d="M8 19V20.5C8 21.3284 8.67157 22 9.5 22H14.5C15.3284 22 16 21.3284 16 20.5V19" stroke={color} strokeWidth="2" />
          <Path d="M12 9L12 15" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M15 12H9" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 3.5C7 2.11929 8.11929 1 9.5 1H14.5C15.8807 1 17 2.11929 17 3.5V4.12602C18.7252 4.57006 20 6.13616 20 8V16C20 17.8638 18.7252 19.4299 17 19.874V20.5C17 21.8807 15.8807 23 14.5 23H9.5C8.11929 23 7 21.8807 7 20.5V19.874C5.27477 19.4299 4 17.8638 4 16V8C4 6.13616 5.27477 4.57006 7 4.12602V3.5ZM9 4H15V3.5C15 3.22386 14.7761 3 14.5 3H9.5C9.22386 3 9 3.22386 9 3.5V4ZM9 20V20.5C9 20.7761 9.22386 21 9.5 21H14.5C14.7761 21 15 20.7761 15 20.5V20H9ZM11 9V11H9V13H11V15H13V13H15V11H13V9H11Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="5" y="5" width="14" height="14" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M16 5V3.5C16 2.67157 15.3284 2 14.5 2H9.5C8.67157 2 8 2.67157 8 3.5V5" stroke={color} strokeWidth="2" />
          <Path d="M8 19V20.5C8 21.3284 8.67157 22 9.5 22H14.5C15.3284 22 16 21.3284 16 20.5V19" stroke={color} strokeWidth="2" />
          <Path d="M12 9L12 15" stroke={color} strokeWidth="2" />
          <Path d="M15 12H9" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
