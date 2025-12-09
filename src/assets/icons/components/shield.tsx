import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ShieldIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 8V14" stroke={color} strokeWidth="2" />
          <Path d="M15 11L9 11" stroke={color} strokeWidth="2" />
          <Path d="M8 3H12H16C17.6569 3 19 4.34315 19 6V13.6202C19 14.496 18.6173 15.328 17.9524 15.898L13.9524 19.3265C12.8289 20.2895 11.1711 20.2895 10.0476 19.3265L6.04763 15.898C5.38269 15.328 5 14.496 5 13.6202V6C5 4.34315 6.34315 3 8 3Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 8V14" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M15 11L9 11" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M8 3H12H16C17.6569 3 19 4.34315 19 6V13.6202C19 14.496 18.6173 15.328 17.9524 15.898L13.9524 19.3265C12.8289 20.2895 11.1711 20.2895 10.0476 19.3265L6.04763 15.898C5.38269 15.328 5 14.496 5 13.6202V6C5 4.34315 6.34315 3 8 3Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M8 2C5.79086 2 4 3.79086 4 6V13.6202C4 14.7879 4.51025 15.8973 5.39683 16.6572L9.39683 20.0858C10.8948 21.3698 13.1052 21.3698 14.6032 20.0858L18.6032 16.6572C19.4897 15.8973 20 14.7879 20 13.6202V6C20 3.79086 18.2091 2 16 2H12H8ZM11 10V8H13V10H15V12H13V14H11V12H9V10H11Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 8V14" stroke={color} strokeWidth="2" />
          <Path d="M15 11L9 11" stroke={color} strokeWidth="2" />
          <Path d="M8 3H12H16C17.6569 3 19 4.34315 19 6V13.6202C19 14.496 18.6173 15.328 17.9524 15.898L13.9524 19.3265C12.8289 20.2895 11.1711 20.2895 10.0476 19.3265L6.04763 15.898C5.38269 15.328 5 14.496 5 13.6202V6C5 4.34315 6.34315 3 8 3Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
