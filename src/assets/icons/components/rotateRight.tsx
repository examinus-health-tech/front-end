import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function RotateRightIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19.7942 16.5C18.7908 18.2381 17.2351 19.5909 15.3746 20.3434C13.5141 21.0959 11.4554 21.205 9.5258 20.6532C7.59619 20.1015 5.90634 18.9206 4.72485 17.2983C3.54336 15.676 2.93801 13.7053 3.00502 11.6995C3.07203 9.69368 3.80755 7.7678 5.09468 6.22795C6.38181 4.68811 8.1467 3.62266 10.1088 3.20094C12.071 2.77922 14.1178 3.02543 15.9239 3.90044C17.7301 4.77545 19.1919 6.22906 20.0772 8.03022" stroke={color} strokeWidth="2" />
          <Path d="M15 9H18C19.6569 9 21 7.65685 21 6V3" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19.7942 16.5C18.7908 18.2381 17.2351 19.5909 15.3746 20.3434C13.5141 21.0959 11.4554 21.205 9.5258 20.6532C7.59619 20.1015 5.90634 18.9206 4.72485 17.2983C3.54336 15.676 2.93801 13.7053 3.00502 11.6995C3.07203 9.69368 3.80755 7.7678 5.09468 6.22795C6.38181 4.68811 8.1467 3.62266 10.1088 3.20094C12.071 2.77922 14.1178 3.02543 15.9239 3.90044C17.7301 4.77545 19.1919 6.22906 20.0772 8.03022" stroke={color} strokeWidth="2" />
          <Path d="M15 9H18C19.6569 9 21 7.65685 21 6V3" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
