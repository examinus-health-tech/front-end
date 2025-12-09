import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowLeftIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M22 12L2 12" stroke={color} strokeWidth="2" />
          <Path d="M2 12L3 12C5.76142 12 8 14.2386 8 17L8 20" stroke={color} strokeWidth="2" />
          <Path d="M2 12L3 12C5.76142 12 8 9.76142 8 7L8 4" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M22 12L2 12" stroke={color} strokeWidth="2" />
          <Path d="M2 12L3 12C5.76142 12 8 14.2386 8 17L8 20" stroke={color} strokeWidth="2" />
          <Path d="M2 12L3 12C5.76142 12 8 9.76142 8 7L8 4" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
