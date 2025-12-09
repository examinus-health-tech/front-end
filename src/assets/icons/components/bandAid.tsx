import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function BandAidIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="21" y="8" width="8" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Rect x="11" y="11" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="15" y="11" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="7" y="11" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M8 7.5V6C8 4.34315 9.34315 3 11 3H13C14.6569 3 16 4.34315 16 6V7.5M8 16.5V18C8 19.6569 9.34315 21 11 21H13C14.6569 21 16 19.6569 16 18V16.5" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="21" y="8" width="8" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Rect x="11" y="11" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="15" y="11" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="7" y="11" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M8 7.5V6C8 4.34315 9.34315 3 11 3H13C14.6569 3 16 4.34315 16 6V7.5M8 16.5V18C8 19.6569 9.34315 21 11 21H13C14.6569 21 16 19.6569 16 18V16.5" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M11 2C8.79086 2 7 3.79086 7 6V7H6C3.79086 7 2 8.79086 2 11V13C2 15.2091 3.79086 17 6 17H7V18C7 20.2091 8.79086 22 11 22H13C15.2091 22 17 20.2091 17 18V17H18C20.2091 17 22 15.2091 22 13V11C22 8.79086 20.2091 7 18 7H17V6C17 3.79086 15.2091 2 13 2H11ZM15 7V6C15 4.89543 14.1046 4 13 4H11C9.89543 4 9 4.89543 9 6V7H15ZM15 17H9V18C9 19.1046 9.89543 20 11 20H13C14.1046 20 15 19.1046 15 18V17ZM11 11.5C11 11.2239 11.2239 11 11.5 11H12.5C12.7761 11 13 11.2239 13 11.5V12.5C13 12.7761 12.7761 13 12.5 13H11.5C11.2239 13 11 12.7761 11 12.5V11.5ZM15.5 11C15.2239 11 15 11.2239 15 11.5V12.5C15 12.7761 15.2239 13 15.5 13H16.5C16.7761 13 17 12.7761 17 12.5V11.5C17 11.2239 16.7761 11 16.5 11H15.5ZM7 11.5C7 11.2239 7.22386 11 7.5 11H8.5C8.77614 11 9 11.2239 9 11.5V12.5C9 12.7761 8.77614 13 8.5 13H7.5C7.22386 13 7 12.7761 7 12.5V11.5Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="21" y="8" width="8" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Rect x="11" y="11" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="15" y="11" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="7" y="11" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M8 7.5V6C8 4.34315 9.34315 3 11 3H13C14.6569 3 16 4.34315 16 6V7.5M8 16.5V18C8 19.6569 9.34315 21 11 21H13C14.6569 21 16 19.6569 16 18V16.5" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
