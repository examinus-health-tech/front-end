import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function SanitizerIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="9" width="12" height="12" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M9.00002 4L14.5 4C15.3284 4 16 4.67158 16 5.50001L16 6.5" stroke={color} strokeWidth="2" />
          <Path d="M12 4L12 8" stroke={color} strokeWidth="2" />
          <Path d="M12 12L12 18" stroke={color} strokeWidth="2" />
          <Path d="M15 15L9 15" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="9" width="12" height="12" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M9.00002 4L14.5 4C15.3284 4 16 4.67158 16 5.50001L16 6.5" stroke={color} strokeWidth="2" />
          <Path d="M12 4L12 8" stroke={color} strokeWidth="2" />
          <Path d="M12 12L12 18" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M15 15L9 15" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M17 5.50002C17 4.1193 15.8807 3 14.5 3H9.00003V5H11V8H9C6.79086 8 5 9.79086 5 12V18C5 20.2091 6.79086 22 9 22H15C17.2091 22 19 20.2091 19 18V12C19 9.79086 17.2091 8 15 8H13V5H14.5C14.7761 5 15 5.22386 15 5.5L15 6.49999L17 6.50001L17 5.50002ZM11 12V14H9V16H11V18H13V16H15V14H13V12H11Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="9" width="12" height="12" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M9.00002 4L14.5 4C15.3284 4 16 4.67158 16 5.50001L16 6.5" stroke={color} strokeWidth="2" />
          <Path d="M12 4L12 8" stroke={color} strokeWidth="2" />
          <Path d="M12 12L12 18" stroke={color} strokeWidth="2" />
          <Path d="M15 15L9 15" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
