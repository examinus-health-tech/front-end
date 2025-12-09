import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function CoffeeIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M17 4H5V13C5 14.6569 6.34315 16 8 16H14C15.6569 16 17 14.6569 17 13V4Z" stroke={color} strokeWidth="2" />
          <Path d="M17 4H19.5C20.3284 4 21 4.67157 21 5.5V7.5C21 8.32843 20.3284 9 19.5 9H18.5C17.6716 9 17 8.32843 17 7.5V4Z" stroke={color} strokeWidth="2" />
          <Path d="M3 17C3 18.6569 4.34315 20 6 20H16C17.6569 20 19 18.6569 19 17" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M17 4H5V13C5 14.6569 6.34315 16 8 16H14C15.6569 16 17 14.6569 17 13V4Z" stroke={color} strokeWidth="2" />
          <Path d="M17 4H19.5C20.3284 4 21 4.67157 21 5.5V7.5C21 8.32843 20.3284 9 19.5 9H18.5C17.6716 9 17 8.32843 17 7.5V4Z" stroke={color} strokeWidth="2" />
          <Path d="M3 17C3 18.6569 4.34315 20 6 20H16C17.6569 20 19 18.6569 19 17" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M4 3V13C4 15.2091 5.79086 17 8 17H14C16.2091 17 18 15.2091 18 13V9.94999C18.1616 9.98278 18.3288 10 18.5 10H19.5C20.8807 10 22 8.88071 22 7.5V5.5C22 4.11929 20.8807 3 19.5 3H4ZM18.5 8C18.2239 8 18 7.77614 18 7.5V5H19.5C19.7761 5 20 5.22386 20 5.5V7.5C20 7.77614 19.7761 8 19.5 8H18.5Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
          <Path d="M2 17C2 19.2091 3.79086 21 6 21H16C18.2091 21 20 19.2091 20 17H18C18 18.1046 17.1046 19 16 19H6C4.89543 19 4 18.1046 4 17H2Z" fill={color} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M17 4H5V13C5 14.6569 6.34315 16 8 16H14C15.6569 16 17 14.6569 17 13V4Z" stroke={color} strokeWidth="2" />
          <Path d="M17 4H19.5C20.3284 4 21 4.67157 21 5.5V7.5C21 8.32843 20.3284 9 19.5 9H18.5C17.6716 9 17 8.32843 17 7.5V4Z" stroke={color} strokeWidth="2" />
          <Path d="M3 17C3 18.6569 4.34315 20 6 20H16C17.6569 20 19 18.6569 19 17" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
