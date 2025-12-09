import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function MicroscopeIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M8 15V16C8 17.6569 9.34315 19 11 19H15C16.6569 19 18 17.6569 18 16V10C18 8.34315 16.6569 7 15 7H12" stroke={color} strokeWidth="2" />
          <Path d="M6 22C6 20.3431 7.34315 19 9 19H17C18.6569 19 20 20.3431 20 22" stroke={color} strokeWidth="2" />
          <Path d="M5 15H11" stroke={color} strokeWidth="2" />
          <Path d="M8.42354 5.05045C8.63795 4.25025 9.46046 3.77538 10.2607 3.98979L11.2266 4.24861C12.0268 4.46302 12.5017 5.28553 12.2872 6.08573L11.252 9.94943C11.0376 10.7496 10.215 11.2245 9.41485 11.0101L8.44892 10.7513C7.64872 10.5369 7.17385 9.71435 7.38826 8.91415L8.42354 5.05045Z" stroke={color} strokeWidth="2" />
          <Path d="M8.93188 10.8807L8.41425 12.8126" stroke={color} strokeWidth="2" />
          <Path d="M11.2612 2.18738L10.7436 4.11923" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M8 15V16C8 17.6569 9.34315 19 11 19H15C16.6569 19 18 17.6569 18 16V10C18 8.34315 16.6569 7 15 7H12" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M6 22C6 20.3431 7.34315 19 9 19H17C18.6569 19 20 20.3431 20 22" stroke={color} strokeWidth="2" />
          <Path d="M5 15H11" stroke={color} strokeWidth="2" />
          <Path d="M8.42354 5.05045C8.63795 4.25025 9.46046 3.77538 10.2607 3.98979L11.2266 4.24861C12.0268 4.46302 12.5017 5.28553 12.2872 6.08573L11.252 9.94943C11.0376 10.7496 10.215 11.2245 9.41485 11.0101L8.44892 10.7513C7.64872 10.5369 7.17385 9.71435 7.38826 8.91415L8.42354 5.05045Z" stroke={color} strokeWidth="2" />
          <Path d="M8.93188 10.8807L8.41425 12.8126" stroke={color} strokeWidth="2" />
          <Path d="M11.2612 2.18738L10.7436 4.11923" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M11.9554 3.4604C12.8953 3.92847 13.4499 4.94763 13.3203 6.00003H15C17.2091 6.00003 19 7.79089 19 10V16C19 16.8233 18.7513 17.5886 18.3248 18.2246C19.8829 18.7714 21 20.2552 21 22H19C19 20.8955 18.1046 20 17 20H9C7.89543 20 7 20.8955 7 22H5C5 20.2552 6.11714 18.7714 7.67518 18.2246C7.24874 17.5886 7 16.8233 7 16H5V14H11V16H9C9 17.1046 9.89543 18 11 18H15C16.1046 18 17 17.1046 17 16V10C17 8.89546 16.1046 8.00003 15 8.00003H12.8096L12.2179 10.2083C11.9049 11.3765 10.8141 12.1287 9.65194 12.0571L9.38016 13.0714L7.4483 12.5538L7.72009 11.5395C6.67781 11.0204 6.10932 9.82362 6.42235 8.65536L7.45763 4.79165C7.77066 3.6234 8.86137 2.8712 10.0235 2.94278L10.2953 1.92859L12.2271 2.44623L11.9554 3.4604Z" fill={color} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M8 15V16C8 17.6569 9.34315 19 11 19H15C16.6569 19 18 17.6569 18 16V10C18 8.34315 16.6569 7 15 7H12" stroke={color} strokeWidth="2" />
          <Path d="M6 22C6 20.3431 7.34315 19 9 19H17C18.6569 19 20 20.3431 20 22" stroke={color} strokeWidth="2" />
          <Path d="M5 15H11" stroke={color} strokeWidth="2" />
          <Path d="M8.42354 5.05045C8.63795 4.25025 9.46046 3.77538 10.2607 3.98979L11.2266 4.24861C12.0268 4.46302 12.5017 5.28553 12.2872 6.08573L11.252 9.94943C11.0376 10.7496 10.215 11.2245 9.41485 11.0101L8.44892 10.7513C7.64872 10.5369 7.17385 9.71435 7.38826 8.91415L8.42354 5.05045Z" stroke={color} strokeWidth="2" />
          <Path d="M8.93188 10.8807L8.41425 12.8126" stroke={color} strokeWidth="2" />
          <Path d="M11.2612 2.18738L10.7436 4.11923" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
