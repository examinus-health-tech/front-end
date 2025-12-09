import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function PerformanceIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="16" width="16" height="4" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M20 17V7C20 5.34315 18.6569 4 17 4H7C5.34315 4 4 5.34315 4 7V17" stroke={color} strokeWidth="2" />
          <Path d="M12 16L17 9" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="16" width="16" height="4" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M20 17V7C20 5.34315 18.6569 4 17 4H7C5.34315 4 4 5.34315 4 7V17" stroke={color} strokeWidth="2" />
          <Path d="M12 16L17 9" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 7C3 4.79086 4.79086 3 7 3H17C19.2091 3 21 4.79086 21 7V18.5C21 19.8807 19.8807 21 18.5 21H5.5C4.11929 21 3 19.8807 3 18.5V7ZM5 15H11.4854L16.1863 8.41876L17.8137 9.58124L13.9432 15H19V7C19 5.89543 18.1046 5 17 5H7C5.89543 5 5 5.89543 5 7V15Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="16" width="16" height="4" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M20 17V7C20 5.34315 18.6569 4 17 4H7C5.34315 4 4 5.34315 4 7V17" stroke={color} strokeWidth="2" />
          <Path d="M12 16L17 9" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
