import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function RedoIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 15C3 13.4087 3.84285 11.8826 5.34315 10.7574C6.84344 9.63214 8.87827 9 11 9C13.1217 9 15.1566 9.63214 16.6569 10.7574C18.1571 11.8826 19 13.4087 19 15" stroke={color} strokeWidth="2" />
          <Path d="M15 15H18C19.6569 15 21 13.6569 21 12V9" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 15C3 13.4087 3.84285 11.8826 5.34315 10.7574C6.84344 9.63214 8.87827 9 11 9C13.1217 9 15.1566 9.63214 16.6569 10.7574C18.1571 11.8826 19 13.4087 19 15" stroke={color} strokeWidth="2" />
          <Path d="M15 15H18C19.6569 15 21 13.6569 21 12V9" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
