import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function HospitalIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M17 20V7C17 5.34315 15.6569 4 14 4H10C8.34315 4 7 5.34315 7 7V20" stroke={color} strokeWidth="2" />
          <Path d="M6 11H4.5C3.67157 11 3 11.6716 3 12.5V20" stroke={color} strokeWidth="2" />
          <Path d="M18 11H19.5C20.3284 11 21 11.6716 21 12.5V20" stroke={color} strokeWidth="2" />
          <Path d="M12 8L12 14" stroke={color} strokeWidth="2" />
          <Path d="M15 11L9 11" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M17 20V7C17 5.34315 15.6569 4 14 4H10C8.34315 4 7 5.34315 7 7V20" stroke={color} strokeWidth="2" />
          <Path d="M6 11H4.5C3.67157 11 3 11.6716 3 12.5V20" stroke={color} strokeWidth="2" />
          <Path d="M18 11H19.5C20.3284 11 21 11.6716 21 12.5V20" stroke={color} strokeWidth="2" />
          <Path d="M12 8L12 14" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M15 11L9 11" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 7C6 4.79086 7.79086 3 10 3H14C16.2091 3 18 4.79086 18 7V10H19.5C20.8807 10 22 11.1193 22 12.5V20H20V12.5C20 12.2239 19.7761 12 19.5 12H18V20H6V12H4.5C4.22386 12 4 12.2239 4 12.5V20H2V12.5C2 11.1193 3.11929 10 4.5 10H6V7ZM11 8V10H9V12H11V14H13V12H15V10H13V8H11Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M17 20V7C17 5.34315 15.6569 4 14 4H10C8.34315 4 7 5.34315 7 7V20" stroke={color} strokeWidth="2" />
          <Path d="M6 11H4.5C3.67157 11 3 11.6716 3 12.5V20" stroke={color} strokeWidth="2" />
          <Path d="M18 11H19.5C20.3284 11 21 11.6716 21 12.5V20" stroke={color} strokeWidth="2" />
          <Path d="M12 8L12 14" stroke={color} strokeWidth="2" />
          <Path d="M15 11L9 11" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
