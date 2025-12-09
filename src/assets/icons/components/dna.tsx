import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function DnaIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 16L19 16" stroke={color} strokeWidth="2" />
          <Path d="M5 19L19 19" stroke={color} strokeWidth="2" />
          <Path d="M5 5L19 5" stroke={color} strokeWidth="2" />
          <Path d="M5 8L19 8" stroke={color} strokeWidth="2" />
          <Path d="M19 2V9C19 10.6569 17.6569 12 16 12H8C6.34315 12 5 13.3431 5 15V22" stroke={color} strokeWidth="2" />
          <Path d="M5 2V9C5 10.6569 6.34315 12 8 12H16C17.6569 12 19 13.3431 19 15V22" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 16L19 16" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M5 19L19 19" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M5 5L19 5" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M5 8L19 8" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M19 1.99994V8.99994C19 10.6568 17.6569 11.9999 16 11.9999H8C6.34315 11.9999 5 13.3431 5 14.9999V21.9999" stroke={color} strokeWidth="2" />
          <Path d="M5 2V9C5 10.6569 6.34315 12 8 12H16C17.6569 12 19 13.3431 19 15V22" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M20 8.99994V1.99994H18V4L6 4V2H4V9C4 10.1947 4.52374 11.267 5.35414 12C4.52374 12.7329 4 13.8053 4 14.9999V21.9999H6V20L18 20V22H20V15C20 13.8053 19.4762 12.7329 18.6458 12C19.4762 11.267 20 10.1946 20 8.99994ZM7.98711 13C6.88847 13.0069 6 13.8997 6 14.9999L18 15C18 13.8954 17.1046 13 16 13H8C7.9957 13 7.9914 13 7.98711 13ZM18 17L6 17V18L18 18V17ZM7.98711 11C7.99141 10.9999 7.9957 10.9999 8 10.9999H16C17.1045 10.9999 18 10.1045 18 9L6 9C6 10.1003 6.88848 10.993 7.98711 11ZM6 7L18 7V6L6 6V7Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 16L19 16" stroke={color} strokeWidth="2" />
          <Path d="M5 19L19 19" stroke={color} strokeWidth="2" />
          <Path d="M5 5L19 5" stroke={color} strokeWidth="2" />
          <Path d="M5 8L19 8" stroke={color} strokeWidth="2" />
          <Path d="M19 2V9C19 10.6569 17.6569 12 16 12H8C6.34315 12 5 13.3431 5 15V22" stroke={color} strokeWidth="2" />
          <Path d="M5 2V9C5 10.6569 6.34315 12 8 12H16C17.6569 12 19 13.3431 19 15V22" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
