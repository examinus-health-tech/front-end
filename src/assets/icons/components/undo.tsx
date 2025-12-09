import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function UndoIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M21 15C21 13.4087 20.1571 11.8826 18.6569 10.7574C17.1566 9.63214 15.1217 9 13 9C10.8783 9 8.84344 9.63214 7.34315 10.7574C5.84286 11.8826 5 13.4087 5 15" stroke={color} strokeWidth="2" />
          <Path d="M9 15H6C4.34315 15 3 13.6569 3 12V9" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M21 15C21 13.4087 20.1571 11.8826 18.6569 10.7574C17.1566 9.63214 15.1217 9 13 9C10.8783 9 8.84344 9.63214 7.34315 10.7574C5.84286 11.8826 5 13.4087 5 15" stroke={color} strokeWidth="2" />
          <Path d="M9 15H6C4.34315 15 3 13.6569 3 12V9" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
