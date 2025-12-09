import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function BookHealthIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M17.5 3H8C6.34315 3 5 4.34315 5 6V16H17.5C18.3284 16 19 15.3284 19 14.5V4.5C19 3.67157 18.3284 3 17.5 3Z" stroke={color} strokeWidth="2" />
          <Path d="M15 16H7.5C6.11929 16 5 17.1193 5 18.5C5 19.8807 6.11929 21 7.5 21H20" stroke={color} strokeWidth="2" />
          <Path d="M12 7L12 13" stroke={color} strokeWidth="2" />
          <Path d="M15 10H9" stroke={color} strokeWidth="2" />
          <Path d="M5 18.5V14" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M17.5 3H8C6.34315 3 5 4.34315 5 6V16H17.5C18.3284 16 19 15.3284 19 14.5V4.5C19 3.67157 18.3284 3 17.5 3Z" stroke={color} strokeWidth="2" />
          <Path d="M15 16H7.5C6.11929 16 5 17.1193 5 18.5C5 19.8807 6.11929 21 7.5 21H20" stroke={color} strokeWidth="2" />
          <Path d="M12 7L12 13" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M15 10H9" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M5 18.5V14" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M8 2C5.79086 2 4 3.79086 4 6V18.5C4 20.433 5.567 22 7.5 22H20V20H7.5C6.67157 20 6 19.3284 6 18.5C6 17.6716 6.67157 17 7.5 17H17.5C18.8807 17 20 15.8807 20 14.5V4.5C20 3.11929 18.8807 2 17.5 2H8ZM11 9V7H13V9H15V11H13V13H11V11H9V9H11Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M17.5 3H8C6.34315 3 5 4.34315 5 6V16H17.5C18.3284 16 19 15.3284 19 14.5V4.5C19 3.67157 18.3284 3 17.5 3Z" stroke={color} strokeWidth="2" />
          <Path d="M15 16H7.5C6.11929 16 5 17.1193 5 18.5C5 19.8807 6.11929 21 7.5 21H20" stroke={color} strokeWidth="2" />
          <Path d="M12 7L12 13" stroke={color} strokeWidth="2" />
          <Path d="M15 10H9" stroke={color} strokeWidth="2" />
          <Path d="M5 18.5V14" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
