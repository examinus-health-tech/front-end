import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function LightBulbIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="7" y="3" width="10" height="15" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M12 18L12 12" stroke={color} strokeWidth="2" />
          <Path d="M9 21H15" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="7" y="3" width="10" height="15" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M12 18L12 12" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M9 21H15" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M10 2C7.79086 2 6 3.79086 6 6V15C6 17.2091 7.79086 19 10 19H11L11 12H13L13 19H14C16.2091 19 18 17.2091 18 15V6C18 3.79086 16.2091 2 14 2H10Z" fill={color} />
          <Path d="M9 22H15V20H9V22Z" fill={color} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="7" y="3" width="10" height="15" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M12 18L12 12" stroke={color} strokeWidth="2" />
          <Path d="M9 21H15" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
