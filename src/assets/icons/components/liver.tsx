import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function LiverIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M14 13H16.5C17.4443 13 18.3334 12.5554 18.9 11.8L20.4 9.8C20.7895 9.28071 21 8.64911 21 8V7C21 5.34315 19.6569 4 18 4H6C4.34315 4 3 5.34315 3 7V15.0458C3 16.1251 3.87491 17 4.95416 17C5.60754 17 6.2177 16.6735 6.58013 16.1298L7.1094 15.3359C7.6658 14.5013 8.60249 14 9.60555 14H12C13.6569 14 15 12.6569 15 11V9" stroke={color} strokeWidth="2" />
          <Path d="M6 10H7C8.65685 10 10 11.3431 10 13V21" stroke={color} strokeWidth="2" />
          <Path d="M10 20V10C10 8.34315 11.3431 7 13 7H14" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M14 13H16.5C17.4443 13 18.3334 12.5554 18.9 11.8L20.4 9.8C20.7895 9.28071 21 8.64911 21 8V7C21 5.34315 19.6569 4 18 4H6C4.34315 4 3 5.34315 3 7V15.0458C3 16.1251 3.87491 17 4.95416 17C5.60754 17 6.2177 16.6735 6.58013 16.1298L7.1094 15.3359C7.6658 14.5013 8.60249 14 9.60555 14H12C13.6569 14 15 12.6569 15 11V9" stroke={color} strokeWidth="2" />
          <Path d="M6 10H7C8.65685 10 10 11.3431 10 13V21" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M10 20V10C10 8.34315 11.3431 7 13 7H14" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M14.6458 14H16.5C17.759 14 18.9446 13.4072 19.7 12.4L21.2 10.4C21.7193 9.70762 22 8.86548 22 8V7C22 4.79086 20.2091 3 18 3H6C3.79086 3 2 4.79086 2 7V15.0458C2 16.6774 3.32262 18 4.95416 18C5.9419 18 6.86428 17.5064 7.41218 16.6845L7.94145 15.8906C8.19687 15.5075 8.57249 15.2297 9 15.0939V21H11V15H12C13.0144 15 13.9407 14.6224 14.6458 14ZM9 15V13C9 11.8954 8.10457 11 7 11H6V9H7C7.73894 9 8.43108 9.20037 9.02506 9.54975C9.24878 7.55257 10.9431 6 13 6H14V8H13C11.8954 8 11 8.89543 11 10V15H9Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M14 13H16.5C17.4443 13 18.3334 12.5554 18.9 11.8L20.4 9.8C20.7895 9.28071 21 8.64911 21 8V7C21 5.34315 19.6569 4 18 4H6C4.34315 4 3 5.34315 3 7V15.0458C3 16.1251 3.87491 17 4.95416 17C5.60754 17 6.2177 16.6735 6.58013 16.1298L7.1094 15.3359C7.6658 14.5013 8.60249 14 9.60555 14H12C13.6569 14 15 12.6569 15 11V9" stroke={color} strokeWidth="2" />
          <Path d="M6 10H7C8.65685 10 10 11.3431 10 13V21" stroke={color} strokeWidth="2" />
          <Path d="M10 20V10C10 8.34315 11.3431 7 13 7H14" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
