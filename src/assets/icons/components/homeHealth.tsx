import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function HomeHealthIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 12L10.5858 4.41421C11.3668 3.63316 12.6332 3.63317 13.4142 4.41421L21 12" stroke={color} strokeWidth="2" />
          <Path d="M6 9V17C6 18.6569 7.34315 20 9 20H15C16.6569 20 18 18.6569 18 17V9" stroke={color} strokeWidth="2" />
          <Path d="M12 10L12 16" stroke={color} strokeWidth="2" />
          <Path d="M15 13H9" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 12L10.5858 4.41421C11.3668 3.63316 12.6332 3.63317 13.4142 4.41421L21 12" stroke={color} strokeWidth="2" />
          <Path d="M6 9V17C6 18.6569 7.34315 20 9 20H15C16.6569 20 18 18.6569 18 17V9" stroke={color} strokeWidth="2" />
          <Path d="M12 10L12 16" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M15 13H9" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 11.4142L3.70706 12.7071L2.29285 11.2929L9.87863 3.70711C11.0502 2.53553 12.9497 2.53554 14.1213 3.70711L21.7071 11.2929L20.2928 12.7071L19 11.4143V17C19 19.2092 17.2091 21 15 21H9C6.79086 21 5 19.2092 5 17V11.4142ZM11 11V13H9V15H11V17H13V15H15V13H13V11H11Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 12L10.5858 4.41421C11.3668 3.63316 12.6332 3.63317 13.4142 4.41421L21 12" stroke={color} strokeWidth="2" />
          <Path d="M6 9V17C6 18.6569 7.34315 20 9 20H15C16.6569 20 18 18.6569 18 17V9" stroke={color} strokeWidth="2" />
          <Path d="M12 10L12 16" stroke={color} strokeWidth="2" />
          <Path d="M15 13H9" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
