import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function AnalyticsIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 4V15C19 16.6569 17.6569 18 16 18H9" stroke={color} strokeWidth="2" />
          <Path d="M14 6V15C14 16.6569 12.6569 18 11 18H6" stroke={color} strokeWidth="2" />
          <Path d="M9 10V15C9 16.6569 7.65685 18 6 18H3" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 4V15C19 16.6569 17.6569 18 16 18H9" stroke={color} strokeWidth="2" />
          <Path d="M14 6V15C14 16.6569 12.6569 18 11 18H6" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M9 10V15C9 16.6569 7.65685 18 6 18H3" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M18 15V4H20V15C20 17.2091 18.2091 19 16 19H11.0028C11.0019 19 11.0009 19 11 19H3V17H6C7.10457 17 8 16.1046 8 15V10H10V15C10 15.7286 9.80521 16.4117 9.46487 17L11 17C11.0007 17 11.0013 17 11.002 17C12.1056 16.9989 13 16.1039 13 15V6H15V15C15 15.7286 14.8052 16.4117 14.4649 17H16C17.1046 17 18 16.1046 18 15Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 4V15C19 16.6569 17.6569 18 16 18H9" stroke={color} strokeWidth="2" />
          <Path d="M14 6V15C14 16.6569 12.6569 18 11 18H6" stroke={color} strokeWidth="2" />
          <Path d="M9 10V15C9 16.6569 7.65685 18 6 18H3" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
