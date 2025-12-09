import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function TransgenderIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="8" y="8" width="8" height="8" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M15 9L20 4" stroke={color} strokeWidth="2" />
          <Path d="M16 3H18C19.6569 3 21 4.34315 21 6V8" stroke={color} strokeWidth="2" />
          <Path d="M8 3H6C4.34315 3 3 4.34315 3 6V8" stroke={color} strokeWidth="2" />
          <Path d="M12 16V22" stroke={color} strokeWidth="2" />
          <Path d="M14.9999 19L8.99988 19" stroke={color} strokeWidth="2" />
          <Path d="M9 9L4 4" stroke={color} strokeWidth="2" />
          <Path d="M5 9L9 5" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="8" y="8" width="8" height="8" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M15 9L20 4" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M12 16V22" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M9 9L4 4" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M16 3H18C19.6569 3 21 4.34315 21 6V8" stroke={color} strokeWidth="2" />
          <Path d="M8 3H6C4.34315 3 3 4.34315 3 6V8" stroke={color} strokeWidth="2" />
          <Path d="M14.9999 19L8.99988 19" stroke={color} strokeWidth="2" />
          <Path d="M5 9L9 5" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M8 4H6C5.82084 4 5.64718 4.02356 5.48196 4.06774L7 5.58579L8.29289 4.29289L9.70711 5.70711L8.41421 7L8.96803 7.55382C9.56355 7.20193 10.2582 7 11 7H13C13.7418 7 14.4365 7.20193 15.032 7.55382L18.518 4.06774C18.3528 4.02356 18.1792 4 18 4H16V2H18C20.2091 2 22 3.79086 22 6V8H20V6C20 5.82084 19.9764 5.64718 19.9323 5.48196L16.4462 8.96803C16.7981 9.56355 17 10.2582 17 11V13C17 15.2091 15.2091 17 13 17V18H14.9999V20H13V22H11V20H8.99988V18H11V17C8.79086 17 7 15.2091 7 13V11C7 10.2582 7.20193 9.56355 7.55382 8.96803L7 8.41421L5.70711 9.70711L4.29289 8.29289L5.58579 7L4.06774 5.48196C4.02356 5.64718 4 5.82084 4 6V8H2V6C2 3.79086 3.79086 2 6 2H8V4Z" fill={color} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="8" y="8" width="8" height="8" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M15 9L20 4" stroke={color} strokeWidth="2" />
          <Path d="M16 3H18C19.6569 3 21 4.34315 21 6V8" stroke={color} strokeWidth="2" />
          <Path d="M8 3H6C4.34315 3 3 4.34315 3 6V8" stroke={color} strokeWidth="2" />
          <Path d="M12 16V22" stroke={color} strokeWidth="2" />
          <Path d="M14.9999 19L8.99988 19" stroke={color} strokeWidth="2" />
          <Path d="M9 9L4 4" stroke={color} strokeWidth="2" />
          <Path d="M5 9L9 5" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
