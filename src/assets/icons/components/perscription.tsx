import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function PerscriptionIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="7" width="12" height="13" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M7 4L17 4" stroke={color} strokeWidth="2" />
          <Path d="M12 10L12 16" stroke={color} strokeWidth="2" />
          <Path d="M15 13H9" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="7" width="12" height="13" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M7 4L17 4" stroke={color} strokeWidth="2" />
          <Path d="M12 10L12 16" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M15 13H9" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M17 5L7 5L7 3L17 3V5Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
          <Path d="M9 6C6.79086 6 5 7.79086 5 10V17C5 19.2091 6.79086 21 9 21H15C17.2091 21 19 19.2091 19 17V10C19 7.79086 17.2091 6 15 6H9ZM11 12V10H13V12H15V14H13V16H11V14H9V12H11Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="7" width="12" height="13" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M7 4L17 4" stroke={color} strokeWidth="2" />
          <Path d="M12 10L12 16" stroke={color} strokeWidth="2" />
          <Path d="M15 13H9" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
