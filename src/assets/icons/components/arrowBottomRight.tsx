import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowBottomRightIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 9L19 16C19 17.6569 17.6569 19 16 19L9 19" stroke={color} strokeWidth="2" />
          <Path d="M18 18L4 4" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 9L19 16C19 17.6569 17.6569 19 16 19L9 19" stroke={color} strokeWidth="2" />
          <Path d="M18 18L4 4" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
