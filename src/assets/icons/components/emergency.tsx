import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function EmergencyIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 22V2" stroke={color} strokeWidth="2" />
          <Path d="M21 6L15.7442 9.50385C13.963 10.6913 13.963 13.3087 15.7442 14.4962L21 18" stroke={color} strokeWidth="2" />
          <Path d="M3 6L8.25577 9.50385C10.037 10.6913 10.037 13.3087 8.25577 14.4962L3 18" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 22V2" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M21 6L15.7442 9.50385C13.963 10.6913 13.963 13.3087 15.7442 14.4962L21 18" stroke={color} strokeWidth="2" />
          <Path d="M3 6L8.25577 9.50385C10.037 10.6913 10.037 13.3087 8.25577 14.4962L3 18" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M13 2V22H11V2H13ZM15.1895 8.67179L20.4453 5.16794L21.5547 6.83204L16.2989 10.3359C15.1115 11.1275 15.1115 12.8724 16.2989 13.6641L21.5547 17.1679L20.4453 18.832L15.1895 15.3282C12.8146 13.7449 12.8146 10.2551 15.1895 8.67179ZM3.55471 5.16794L8.81048 8.67179C11.1854 10.2551 11.1854 13.7449 8.81049 15.3282L3.55471 18.832L2.44531 17.1679L7.70109 13.6641C8.88855 12.8724 8.88855 11.1275 7.70108 10.3359L2.44531 6.83204L3.55471 5.16794Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 22V2" stroke={color} strokeWidth="2" />
          <Path d="M21 6L15.7442 9.50385C13.963 10.6913 13.963 13.3087 15.7442 14.4962L21 18" stroke={color} strokeWidth="2" />
          <Path d="M3 6L8.25577 9.50385C10.037 10.6913 10.037 13.3087 8.25577 14.4962L3 18" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
