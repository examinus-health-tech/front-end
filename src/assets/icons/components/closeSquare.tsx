import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function CloseSquareIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M8 16L10.2322 13.7678C11.2086 12.7914 12.7915 12.7914 13.7678 13.7678L16 16" stroke={color} strokeWidth="2" />
          <Path d="M16 8L13.7678 10.2322C12.7914 11.2086 11.2085 11.2086 10.2322 10.2322L8 8.00002" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Path d="M8 16L10.2322 13.7678C11.2086 12.7914 12.7915 12.7914 13.7678 13.7678L16 16" stroke={color} strokeWidth="2" />
          <Path d="M16 8L13.7678 10.2322C12.7914 11.2086 11.2085 11.2086 10.2322 10.2322L8 8.00002" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
