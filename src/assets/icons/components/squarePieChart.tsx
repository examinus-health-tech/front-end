import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function SquarePieChartIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M13 3H7C5.34315 3 4 4.34315 4 6V12" stroke={color} strokeWidth="2" />
          <Path d="M4 14L4 17C4 18.6569 5.34315 20 7 20L10 20" stroke={color} strokeWidth="2" />
          <Path d="M15.5 3H17.5C19.1569 3 20.5 4.34315 20.5 6V17C20.5 18.6569 19.1569 20 17.5 20H12" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M13 3H7C5.34315 3 4 4.34315 4 6V12" stroke={color} strokeWidth="2" />
          <Path d="M4 14L4 17C4 18.6569 5.34315 20 7 20L10 20" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M15.5 3H17.5C19.1569 3 20.5 4.34315 20.5 6V17C20.5 18.6569 19.1569 20 17.5 20H12" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 6C3 3.79086 4.79086 2 7 2H13V4H7C5.89543 4 5 4.89543 5 6V12H3V6ZM17.5 4H15.5V2H17.5C19.7091 2 21.5 3.79086 21.5 6V17C21.5 19.2091 19.7091 21 17.5 21H12V19H17.5C18.6046 19 19.5 18.1046 19.5 17V6C19.5 4.89543 18.6046 4 17.5 4ZM5 14V17C5 18.1046 5.89543 19 7 19H10V21H7C4.79086 21 3 19.2091 3 17L3 14H5Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M13 3H7C5.34315 3 4 4.34315 4 6V12" stroke={color} strokeWidth="2" />
          <Path d="M4 14L4 17C4 18.6569 5.34315 20 7 20L10 20" stroke={color} strokeWidth="2" />
          <Path d="M15.5 3H17.5C19.1569 3 20.5 4.34315 20.5 6V17C20.5 18.6569 19.1569 20 17.5 20H12" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
