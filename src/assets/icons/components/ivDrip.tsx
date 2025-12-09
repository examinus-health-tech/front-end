import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function IvDripIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="5" width="12" height="12" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M14 9H18" stroke={color} strokeWidth="2" />
          <Path d="M14 13H18" stroke={color} strokeWidth="2" />
          <Path d="M12 5L12 3" stroke={color} strokeWidth="2" />
          <Path d="M10 17L10 22" stroke={color} strokeWidth="2" />
          <Path d="M14 17V19.5C14 20.3284 14.6716 21 15.5 21H20" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="5" width="12" height="12" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M14 9H18" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M14 13H18" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M12 5L12 3" stroke={color} strokeWidth="2" />
          <Path d="M10 17L10 22" stroke={color} strokeWidth="2" />
          <Path d="M14 17V19.5C14 20.3284 14.6716 21 15.5 21H20" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M13 4V3H11V4H9C6.79086 4 5 5.79086 5 8V14C5 16.2091 6.79086 18 9 18L9 22H11V18H13V19.5C13 20.8807 14.1193 22 15.5 22H20V20H15.5C15.2239 20 15 19.7761 15 19.5V18C17.2091 18 19 16.2091 19 14H14V12H19V10H14V8H19C19 5.79086 17.2091 4 15 4H13Z" fill={color} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="5" width="12" height="12" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M14 9H18" stroke={color} strokeWidth="2" />
          <Path d="M14 13H18" stroke={color} strokeWidth="2" />
          <Path d="M12 5L12 3" stroke={color} strokeWidth="2" />
          <Path d="M10 17L10 22" stroke={color} strokeWidth="2" />
          <Path d="M14 17V19.5C14 20.3284 14.6716 21 15.5 21H20" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
