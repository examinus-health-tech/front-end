import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function StomachIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M16 6H13C11.3431 6 10 4.65685 10 3V2" stroke={color} strokeWidth="2" />
          <Path d="M4 21L4 20C4 18.3431 5.34315 17 7 17L10 17" stroke={color} strokeWidth="2" />
          <Path d="M18 6H16.338C14.7458 6 13.4309 7.24384 13.3426 8.83359L13.1079 13.0585C13.0473 14.1478 12.1464 15 11.0555 15C9.92028 15 9 15.9203 9 17.0555V17.5C9 18.8807 10.1193 20 11.5 20H14.4291C15.1216 20 15.7928 19.7604 16.3288 19.3219L19.8997 16.4002C20.5961 15.8304 21 14.9782 21 14.0784V9C21 7.34315 19.6569 6 18 6Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M16 6H13C11.3431 6 10 4.65685 10 3V2" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M4 21L4 20C4 18.3431 5.34315 17 7 17L10 17" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M18 6H16.338C14.7458 6 13.4309 7.24384 13.3426 8.83359L13.1079 13.0585C13.0473 14.1478 12.1464 15 11.0555 15C9.92028 15 9 15.9203 9 17.0555V17.5C9 18.8807 10.1193 20 11.5 20H14.4291C15.1216 20 15.7928 19.7604 16.3288 19.3219L19.8997 16.4002C20.5961 15.8304 21 14.9782 21 14.0784V9C21 7.34315 19.6569 6 18 6Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M11 2V3C11 4.10457 11.8954 5 13 5H16V5.01411C16.1115 5.00476 16.2242 5 16.338 5H18C20.2091 5 22 6.79086 22 9V14.0784C22 15.2781 21.4615 16.4145 20.533 17.1742L16.9621 20.0958C16.2474 20.6805 15.3525 21 14.4291 21H11.5C9.73676 21 8.27806 19.6961 8.03544 18H7C5.89543 18 5 18.8954 5 20L5 21H3V20C3 17.7909 4.79086 16 7 16H8.18722C8.61694 14.8326 9.73899 14 11.0555 14C11.6157 14 12.0783 13.5624 12.1094 13.003L12.3441 8.77812C12.3801 8.13029 12.5689 7.52555 12.8742 6.99806C10.7233 6.93163 9 5.16706 9 3V2H11Z" fill={color} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M16 6H13C11.3431 6 10 4.65685 10 3V2" stroke={color} strokeWidth="2" />
          <Path d="M4 21L4 20C4 18.3431 5.34315 17 7 17L10 17" stroke={color} strokeWidth="2" />
          <Path d="M18 6H16.338C14.7458 6 13.4309 7.24384 13.3426 8.83359L13.1079 13.0585C13.0473 14.1478 12.1464 15 11.0555 15C9.92028 15 9 15.9203 9 17.0555V17.5C9 18.8807 10.1193 20 11.5 20H14.4291C15.1216 20 15.7928 19.7604 16.3288 19.3219L19.8997 16.4002C20.5961 15.8304 21 14.9782 21 14.0784V9C21 7.34315 19.6569 6 18 6Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
