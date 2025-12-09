import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function MaskIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 10H5" stroke={color} strokeWidth="2" />
          <Path d="M19 14H5" stroke={color} strokeWidth="2" />
          <Path d="M11.2529 6.19212C11.743 6.06609 12.257 6.06609 12.7471 6.19212L16.7471 7.22069C18.0731 7.56165 19 8.75707 19 10.1262V13.8738C19 15.2429 18.0731 16.4383 16.7471 16.7793L12.7471 17.8079C12.257 17.9339 11.743 17.9339 11.2529 17.8079L7.25288 16.7793C5.92691 16.4383 5 15.2429 5 13.8738V10.1262C5 8.75707 5.92691 7.56165 7.25288 7.22069L11.2529 6.19212Z" stroke={color} strokeWidth="2" />
          <Path d="M18 8L21 5" stroke={color} strokeWidth="2" />
          <Path d="M6 8L3 5" stroke={color} strokeWidth="2" />
          <Path d="M18 16L21 19" stroke={color} strokeWidth="2" />
          <Path d="M6 16L3 19" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 10H5" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M19 14H5" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M11.2529 6.19212C11.743 6.06609 12.257 6.06609 12.7471 6.19212L16.7471 7.22069C18.0731 7.56165 19 8.75707 19 10.1262V13.8738C19 15.2429 18.0731 16.4383 16.7471 16.7793L12.7471 17.8079C12.257 17.9339 11.743 17.9339 11.2529 17.8079L7.25288 16.7793C5.92691 16.4383 5 15.2429 5 13.8738V10.1262C5 8.75707 5.92691 7.56165 7.25288 7.22069L11.2529 6.19212Z" stroke={color} strokeWidth="2" />
          <Path d="M18 8L21 5" stroke={color} strokeWidth="2" />
          <Path d="M6 8L3 5" stroke={color} strokeWidth="2" />
          <Path d="M18 16L21 19" stroke={color} strokeWidth="2" />
          <Path d="M6 16L3 19" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M4.60184 8.016L2.29297 5.70712L3.70718 4.29291L6.04842 6.63414C6.34391 6.46904 6.66406 6.33957 7.00387 6.2522L11.0039 5.22362C11.6573 5.05559 12.3427 5.05559 12.9962 5.22362L16.9962 6.25219C17.336 6.33957 17.6561 6.46904 17.9516 6.63414L20.2929 4.29291L21.7071 5.70712L19.3982 8.01599C19.5874 8.32043 19.7363 8.65111 19.8386 9H4.16144C4.2638 8.65111 4.41268 8.32043 4.60184 8.016Z" fill={color} />
          <Path d="M4.00003 13V11H20V13H4.00003Z" fill={color} />
          <Path d="M6.04842 17.3659C6.34391 17.531 6.66406 17.6604 7.00387 17.7478L11.0039 18.7764C11.6573 18.9444 12.3427 18.9444 12.9962 18.7764L16.9962 17.7478C17.336 17.6604 17.6561 17.531 17.9516 17.3659L20.2929 19.7071L21.7071 18.2929L19.3982 15.984C19.5874 15.6796 19.7363 15.3489 19.8386 15H4.16144C4.2638 15.3489 4.41268 15.6796 4.60184 15.984L2.29297 18.2929L3.70718 19.7071L6.04842 17.3659Z" fill={color} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 10H5" stroke={color} strokeWidth="2" />
          <Path d="M19 14H5" stroke={color} strokeWidth="2" />
          <Path d="M11.2529 6.19212C11.743 6.06609 12.257 6.06609 12.7471 6.19212L16.7471 7.22069C18.0731 7.56165 19 8.75707 19 10.1262V13.8738C19 15.2429 18.0731 16.4383 16.7471 16.7793L12.7471 17.8079C12.257 17.9339 11.743 17.9339 11.2529 17.8079L7.25288 16.7793C5.92691 16.4383 5 15.2429 5 13.8738V10.1262C5 8.75707 5.92691 7.56165 7.25288 7.22069L11.2529 6.19212Z" stroke={color} strokeWidth="2" />
          <Path d="M18 8L21 5" stroke={color} strokeWidth="2" />
          <Path d="M6 8L3 5" stroke={color} strokeWidth="2" />
          <Path d="M18 16L21 19" stroke={color} strokeWidth="2" />
          <Path d="M6 16L3 19" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
