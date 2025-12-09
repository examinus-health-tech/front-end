import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function BriefcaseHealthIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="8" width="18" height="12" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M7 7V5.5C7 4.67157 7.67157 4 8.5 4H15.5C16.3284 4 17 4.67157 17 5.5V7" stroke={color} strokeWidth="2" />
          <Path d="M12 11L12 17" stroke={color} strokeWidth="2" />
          <Path d="M15 14H9" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="8" width="18" height="12" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M7 7V5.5C7 4.67157 7.67157 4 8.5 4H15.5C16.3284 4 17 4.67157 17 5.5V7" stroke={color} strokeWidth="2" />
          <Path d="M12 11L12 17" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M15 14H9" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M8 5.5V7H16V5.5C16 5.22386 15.7761 5 15.5 5H8.5C8.22386 5 8 5.22386 8 5.5ZM6 7V5.5C6 4.11929 7.11929 3 8.5 3H15.5C16.8807 3 18 4.11929 18 5.5V7C20.2091 7 22 8.79086 22 11V17C22 19.2091 20.2091 21 18 21H6C3.79086 21 2 19.2091 2 17V11C2 8.79086 3.79086 7 6 7ZM11 11V13H9V15H11V17H13V15H15V13H13V11H11Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="8" width="18" height="12" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M7 7V5.5C7 4.67157 7.67157 4 8.5 4H15.5C16.3284 4 17 4.67157 17 5.5V7" stroke={color} strokeWidth="2" />
          <Path d="M12 11L12 17" stroke={color} strokeWidth="2" />
          <Path d="M15 14H9" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
