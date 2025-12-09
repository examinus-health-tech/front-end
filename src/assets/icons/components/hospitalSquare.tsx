import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function HospitalSquareIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="4" width="16" height="16" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M9 7V10.5C9 11.3284 9.67157 12 10.5 12H13.5C14.3284 12 15 11.3284 15 10.5V7" stroke={color} strokeWidth="2" />
          <Path d="M9 17V13.5C9 12.6716 9.67157 12 10.5 12H13.5C14.3284 12 15 12.6716 15 13.5V17" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="4" width="16" height="16" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M9 7V10.5C9 11.3284 9.67157 12 10.5 12H13.5C14.3284 12 15 11.3284 15 10.5V7" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M9 17V13.5C9 12.6716 9.67157 12 10.5 12H13.5C14.3284 12 15 12.6716 15 13.5V17" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 3C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21H17C19.2091 21 21 19.2091 21 17V7C21 4.79086 19.2091 3 17 3H7ZM8 10.5V7H10V10.5C10 10.7761 10.2239 11 10.5 11H13.5C13.7761 11 14 10.7761 14 10.5V7H16V10.5C16 11.0628 15.814 11.5822 15.5002 12C15.814 12.4178 16 12.9372 16 13.5V17H14V13.5C14 13.2239 13.7761 13 13.5 13H10.5C10.2239 13 10 13.2239 10 13.5V17H8V13.5C8 12.9372 8.18597 12.4178 8.49982 12C8.18597 11.5822 8 11.0628 8 10.5Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="4" width="16" height="16" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M9 7V10.5C9 11.3284 9.67157 12 10.5 12H13.5C14.3284 12 15 11.3284 15 10.5V7" stroke={color} strokeWidth="2" />
          <Path d="M9 17V13.5C9 12.6716 9.67157 12 10.5 12H13.5C14.3284 12 15 12.6716 15 13.5V17" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
