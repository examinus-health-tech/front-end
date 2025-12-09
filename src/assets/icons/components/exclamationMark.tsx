import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ExclamationMarkIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="11" y="19" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M12 3L12 17" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="11" y="19" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M12 3L12 17" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
