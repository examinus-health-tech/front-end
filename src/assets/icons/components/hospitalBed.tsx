import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function HospitalBedIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="12" width="18" height="4" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M14 17C14 18.6569 15.3431 20 17 20H22" stroke={color} strokeWidth="2" />
          <Path d="M10 17C10 18.6569 8.65685 20 7 20H2" stroke={color} strokeWidth="2" />
          <Path d="M12 4V6M12 6V8M12 6H14M12 6H10" stroke={color} strokeWidth="2" strokeLinecap="square" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="12" width="18" height="4" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M14 17C14 18.6569 15.3431 20 17 20H22" stroke={color} strokeWidth="2" />
          <Path d="M10 17C10 18.6569 8.65685 20 7 20H2" stroke={color} strokeWidth="2" />
          <Path d="M12 4V6M12 6V8M12 6H14M12 6H10" stroke={"#0CC1AF"} strokeWidth="2" strokeLinecap="square" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M13 3H11V5H9V7H11V9H13V7H15V5H13V3ZM4.5 11C3.11929 11 2 12.1193 2 13.5V14.5C2 15.8807 3.11929 17 4.5 17H9C9 18.1046 8.10457 19 7 19H2V21H7C9.20914 21 11 19.2091 11 17H13C13 19.2091 14.7909 21 17 21H22V19H17C15.8954 19 15 18.1046 15 17H19.5C20.8807 17 22 15.8807 22 14.5V13.5C22 12.1193 20.8807 11 19.5 11H4.5Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="12" width="18" height="4" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M14 17C14 18.6569 15.3431 20 17 20H22" stroke={color} strokeWidth="2" />
          <Path d="M10 17C10 18.6569 8.65685 20 7 20H2" stroke={color} strokeWidth="2" />
          <Path d="M12 4V6M12 6V8M12 6H14M12 6H10" stroke={color} strokeWidth="2" strokeLinecap="square" />
        </Svg>
      );
  }
}
