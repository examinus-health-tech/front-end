import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function HeartbeatMobileIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 9.5V6C6 4.34315 7.34315 3 9 3H15C16.6569 3 18 4.34315 18 6V9.5M6 14.5V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V14.5" stroke={color} strokeWidth="2" />
          <Path d="M2 12H6.92462C8.26995 12 9.45077 12.8956 9.81351 14.1911L10.6 17L12 12" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M22 12H17.0754C15.7301 12 14.5492 11.1044 14.1865 9.80889L13.4 7L12 12" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 9.5V6C6 4.34315 7.34315 3 9 3H15C16.6569 3 18 4.34315 18 6V9.5M6 14.5V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V14.5" stroke={color} strokeWidth="2" />
          <Path d="M2 12H6.92462C8.26995 12 9.45077 12.8956 9.81351 14.1911L10.6 17L12 12" stroke={"#0CC1AF"} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M22 12H17.0754C15.7301 12 14.5492 11.1044 14.1865 9.80889L13.4 7L12 12" stroke={"#0CC1AF"} strokeWidth="2" strokeLinejoin="round" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 6C5 3.79086 6.79086 2 9 2H15C17.2091 2 19 3.79086 19 6V9.5H17V6C17 4.89543 16.1046 4 15 4H9C7.89543 4 7 4.89543 7 6V9.5H5V6Z" fill={color} />
          <Path d="M7 14.5V18C7 19.1046 7.89543 20 9 20H15C16.1046 20 17 19.1046 17 18V14.5H19V18C19 20.2091 17.2091 22 15 22H9C6.79086 22 5 20.2091 5 18V14.5H7Z" fill={color} />
          <Path d="M6.92462 13H2V11H6.92462C8.52058 11 9.9429 11.9453 10.5778 13.3704L12.437 6.73037C12.5579 6.29854 12.9516 6 13.4 6C13.8484 6 14.2421 6.29854 14.363 6.73037L15.1495 9.53926C15.3913 10.4029 16.1785 11 17.0754 11H22V13H17.0754C15.4794 13 14.0571 12.0547 13.4222 10.6296L11.563 17.2696C11.4421 17.7015 11.0484 18 10.6 18C10.1516 18 9.75795 17.7015 9.63704 17.2696L8.85055 14.4607C8.60872 13.5971 7.8215 13 6.92462 13Z" fill={color} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 9.5V6C6 4.34315 7.34315 3 9 3H15C16.6569 3 18 4.34315 18 6V9.5M6 14.5V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V14.5" stroke={color} strokeWidth="2" />
          <Path d="M2 12H6.92462C8.26995 12 9.45077 12.8956 9.81351 14.1911L10.6 17L12 12" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M22 12H17.0754C15.7301 12 14.5492 11.1044 14.1865 9.80889L13.4 7L12 12" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </Svg>
      );
  }
}
