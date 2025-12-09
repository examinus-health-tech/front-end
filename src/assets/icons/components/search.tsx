import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function SearchIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="2.92896" y="10" width="10" height="10" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M14 14L19.6569 19.6569" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="2.92896" y="10" width="10" height="10" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M14 14L19.6569 19.6569" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
