import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function HeartbeatIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M2 12H5.7371C7.07654 12 8.25369 12.8879 8.62167 14.1758L10 19L12 12" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M22 12H18.2629C16.9235 12 15.7463 11.1121 15.3783 9.82416L14 5L12 12" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M2 12H5.7371C7.07654 12 8.25369 12.8879 8.62167 14.1758L10 19L12 12" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M22 12H18.2629C16.9235 12 15.7463 11.1121 15.3783 9.82416L14 5L12 12" stroke={"#0CC1AF"} strokeWidth="2" strokeLinejoin="round" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M22 11H18.2629C17.3699 11 16.5852 10.408 16.3399 9.54944L14.9615 4.72528C14.8389 4.29598 14.4465 4 14 4C13.5535 4 13.1611 4.29598 13.0385 4.72528L11.0385 11.7253L10 15.3599L9.58319 13.9011C9.09256 12.1839 7.52302 11 5.7371 11H2V13H5.7371C6.63006 13 7.41483 13.592 7.66014 14.4506L9.03848 19.2747C9.16113 19.704 9.55352 20 10 20C10.4465 20 10.8389 19.704 10.9615 19.2747L12.9615 12.2747L14 8.64005L14.4168 10.0989C14.9074 11.8161 16.477 13 18.2629 13H22V11Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M2 12H5.7371C7.07654 12 8.25369 12.8879 8.62167 14.1758L10 19L12 12" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M22 12H18.2629C16.9235 12 15.7463 11.1121 15.3783 9.82416L14 5L12 12" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </Svg>
      );
  }
}
