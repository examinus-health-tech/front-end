import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function BandaidSingleIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="8" y="3" width="8" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Rect x="11" y="11" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M8 8L16 8" stroke={color} strokeWidth="2" />
          <Path d="M8 16L16 16" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="8" y="3" width="8" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Rect x="11" y="11" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M8 8L16 8" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M8 16L16 16" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M11 2C8.79086 2 7 3.79086 7 6V18C7 20.2091 8.79086 22 11 22H13C15.2091 22 17 20.2091 17 18V6C17 3.79086 15.2091 2 13 2H11ZM9 6C9 4.89543 9.89543 4 11 4H13C14.1046 4 15 4.89543 15 6V7H9V6ZM9 17V18C9 19.1046 9.89543 20 11 20H13C14.1046 20 15 19.1046 15 18V17L9 17ZM11 11.5C11 11.2239 11.2239 11 11.5 11H12.5C12.7761 11 13 11.2239 13 11.5V12.5C13 12.7761 12.7761 13 12.5 13H11.5C11.2239 13 11 12.7761 11 12.5V11.5Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="8" y="3" width="8" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Rect x="11" y="11" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M8 8L16 8" stroke={color} strokeWidth="2" />
          <Path d="M8 16L16 16" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
