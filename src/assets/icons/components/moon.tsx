import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function MoonIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M20 10.6667V8C20 5.79086 18.2091 4 16 4L8 4C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20H16C18.2091 20 20 18.2091 20 16V13.3333" stroke={color} strokeWidth="2" />
          <Path d="M20 11V10C20 8.34315 18.6569 7 17 7L13 7C11.3431 7 10 8.34315 10 10V14C10 15.6569 11.3431 17 13 17H17C18.6569 17 20 15.6569 20 14V13" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M20 10.6667V8C20 5.79086 18.2091 4 16 4L8 4C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20H16C18.2091 20 20 18.2091 20 16V13.3333" stroke={color} strokeWidth="2" />
          <Path d="M20 11V10C20 8.34315 18.6569 7 17 7L13 7C11.3431 7 10 8.34315 10 10V14C10 15.6569 11.3431 17 13 17H17C18.6569 17 20 15.6569 20 14V13" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
