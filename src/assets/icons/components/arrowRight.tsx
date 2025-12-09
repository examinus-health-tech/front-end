import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowRightIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M2 12L21 12" stroke={color} strokeWidth="2" />
          <Path d="M22 12L21 12C18.2386 12 16 14.2386 16 17L16 20" stroke={color} strokeWidth="2" />
          <Path d="M22 12L21 12C18.2386 12 16 9.76142 16 7L16 4" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M2 12L21 12" stroke={color} strokeWidth="2" />
          <Path d="M22 12L21 12C18.2386 12 16 14.2386 16 17L16 20" stroke={color} strokeWidth="2" />
          <Path d="M22 12L21 12C18.2386 12 16 9.76142 16 7L16 4" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
