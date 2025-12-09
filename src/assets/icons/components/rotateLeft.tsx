import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function RotateLeftIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M4.20577 16.5C5.20924 18.2381 6.76486 19.5909 8.62539 20.3434C10.4859 21.0959 12.5446 21.205 14.4742 20.6532C16.4038 20.1015 18.0937 18.9206 19.2751 17.2983C20.4566 15.676 21.062 13.7053 20.995 11.6995C20.928 9.69368 20.1925 7.7678 18.9053 6.22795C17.6182 4.68811 15.8533 3.62266 13.8912 3.20094C11.929 2.77922 9.88223 3.02543 8.07608 3.90044C6.26992 4.77545 4.80806 6.22906 3.92282 8.03022" stroke={color} strokeWidth="2" />
          <Path d="M9 9H6C4.34315 9 3 7.65685 3 6V3" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M4.20577 16.5C5.20924 18.2381 6.76486 19.5909 8.62539 20.3434C10.4859 21.0959 12.5446 21.205 14.4742 20.6532C16.4038 20.1015 18.0937 18.9206 19.2751 17.2983C20.4566 15.676 21.062 13.7053 20.995 11.6995C20.928 9.69368 20.1925 7.7678 18.9053 6.22795C17.6182 4.68811 15.8533 3.62266 13.8912 3.20094C11.929 2.77922 9.88223 3.02543 8.07608 3.90044C6.26992 4.77545 4.80806 6.22906 3.92282 8.03022" stroke={color} strokeWidth="2" />
          <Path d="M9 9H6C4.34315 9 3 7.65685 3 6V3" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
