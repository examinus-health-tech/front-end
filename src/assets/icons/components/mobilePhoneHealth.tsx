import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function MobilePhoneHealthIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="3" width="12" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M6 17H18" stroke={color} strokeWidth="2" />
          <Path d="M12 7L12 13" stroke={color} strokeWidth="2" />
          <Path d="M15 10H9" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="3" width="12" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M6 17H18" stroke={color} strokeWidth="2" />
          <Path d="M12 7L12 13" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M15 10H9" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 6C5 3.79086 6.79086 2 9 2H15C17.2091 2 19 3.79086 19 6V16H5V6ZM11 9V7H13V9H15V11H13V13H11V11H9V9H11Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
          <Path d="M19 18H5C5 20.2091 6.79086 22 9 22H15C17.2091 22 19 20.2091 19 18Z" fill={color} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="3" width="12" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M6 17H18" stroke={color} strokeWidth="2" />
          <Path d="M12 7L12 13" stroke={color} strokeWidth="2" />
          <Path d="M15 10H9" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
