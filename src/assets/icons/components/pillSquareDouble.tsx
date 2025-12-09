import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function PillSquareDoubleIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="9" y="9" width="12" height="12" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M20 10L10 20" stroke={color} strokeWidth="2" />
          <Path d="M15 6C15 4.34315 13.6569 3 12 3H6C4.34315 3 3 4.34315 3 6V12C3 13.6569 4.34315 15 6 15" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="9" y="9" width="12" height="12" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M20 10L10 20" stroke={color} strokeWidth="2" />
          <Path d="M15 6C15 4.34315 13.6569 3 12 3H6C4.34315 3 3 4.34315 3 6V12C3 13.6569 4.34315 15 6 15" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 2C3.79086 2 2 3.79086 2 6V12C2 14.2091 3.79086 16 6 16V14C4.89543 14 4 13.1046 4 12V6C4 4.89543 4.89543 4 6 4H12C13.1046 4 14 4.89543 14 6H16C16 3.79086 14.2091 2 12 2H6Z" fill={color} />
          <Path d="M12 8C9.79086 8 8 9.79086 8 12V18C8 18.7418 8.20193 19.4365 8.55382 20.032L20.032 8.55382C19.4365 8.20193 18.7418 8 18 8H12Z" fill={color} />
          <Path d="M12 22C11.2582 22 10.5635 21.7981 9.96803 21.4462L21.4462 9.96803C21.7981 10.5635 22 11.2582 22 12V18C22 20.2091 20.2091 22 18 22H12Z" fill={color} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="9" y="9" width="12" height="12" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M20 10L10 20" stroke={color} strokeWidth="2" />
          <Path d="M15 6C15 4.34315 13.6569 3 12 3H6C4.34315 3 3 4.34315 3 6V12C3 13.6569 4.34315 15 6 15" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
