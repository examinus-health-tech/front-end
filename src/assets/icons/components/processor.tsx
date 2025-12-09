import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ProcessorIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="6" width="12" height="12" rx="3" stroke={color} strokeWidth="2" />
          <Rect x="10" y="10" width="4" height="4" rx="1" stroke={color} strokeWidth="2" />
          <Path d="M10 6L10 3" stroke={color} strokeWidth="2" />
          <Path d="M14 6L14 3" stroke={color} strokeWidth="2" />
          <Path d="M10 21L10 18" stroke={color} strokeWidth="2" />
          <Path d="M14 21L14 18" stroke={color} strokeWidth="2" />
          <Path d="M18 10L21 10" stroke={color} strokeWidth="2" />
          <Path d="M18 14L21 14" stroke={color} strokeWidth="2" />
          <Path d="M3 10H6" stroke={color} strokeWidth="2" />
          <Path d="M3 14H6" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="6" width="12" height="12" rx="3" stroke={color} strokeWidth="2" />
          <Rect x="10" y="10" width="4" height="4" rx="1" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M10 6L10 3" stroke={color} strokeWidth="2" />
          <Path d="M14 6L14 3" stroke={color} strokeWidth="2" />
          <Path d="M10 21L10 18" stroke={color} strokeWidth="2" />
          <Path d="M14 21L14 18" stroke={color} strokeWidth="2" />
          <Path d="M18 10L21 10" stroke={color} strokeWidth="2" />
          <Path d="M18 14L21 14" stroke={color} strokeWidth="2" />
          <Path d="M3 10H6" stroke={color} strokeWidth="2" />
          <Path d="M3 14H6" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M11 3V5H9V3L11 3Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
          <Path d="M15 3V5H13V3L15 3Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
          <Path d="M11 19V21H9V19H11Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
          <Path d="M15 19V21H13V19H15Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
          <Path d="M21 11H19V9H21V11Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
          <Path d="M21 15H19V13H21V15Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
          <Path d="M5 11H3V9H5V11Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
          <Path d="M5 15H3V13H5V15Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
          <Path d="M11 11H13V13H11V11Z" fill={color} />
          <Path d="M5 9C5 6.79086 6.79086 5 9 5H15C17.2091 5 19 6.79086 19 9V15C19 17.2091 17.2091 19 15 19H9C6.79086 19 5 17.2091 5 15V9ZM11 9C9.89543 9 9 9.89543 9 11V13C9 14.1046 9.89543 15 11 15H13C14.1046 15 15 14.1046 15 13V11C15 9.89543 14.1046 9 13 9H11Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="6" width="12" height="12" rx="3" stroke={color} strokeWidth="2" />
          <Rect x="10" y="10" width="4" height="4" rx="1" stroke={color} strokeWidth="2" />
          <Path d="M10 6L10 3" stroke={color} strokeWidth="2" />
          <Path d="M14 6L14 3" stroke={color} strokeWidth="2" />
          <Path d="M10 21L10 18" stroke={color} strokeWidth="2" />
          <Path d="M14 21L14 18" stroke={color} strokeWidth="2" />
          <Path d="M18 10L21 10" stroke={color} strokeWidth="2" />
          <Path d="M18 14L21 14" stroke={color} strokeWidth="2" />
          <Path d="M3 10H6" stroke={color} strokeWidth="2" />
          <Path d="M3 14H6" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
