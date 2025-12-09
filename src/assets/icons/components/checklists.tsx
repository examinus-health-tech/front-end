import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChecklistsIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 15L4.93934 16.9393C5.52513 17.5251 6.47487 17.5251 7.06066 16.9393L11 13" stroke={color} strokeWidth="2" />
          <Path d="M3 7L4.93934 8.93934C5.52513 9.52513 6.47487 9.52513 7.06066 8.93934L11 5" stroke={color} strokeWidth="2" />
          <Path d="M13 16H22" stroke={color} strokeWidth="2" />
          <Path d="M13 8H22" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 15L4.93934 16.9393C5.52513 17.5251 6.47487 17.5251 7.06066 16.9393L11 13" stroke={color} strokeWidth="2" />
          <Path d="M3 7L4.93934 8.93934C5.52513 9.52513 6.47487 9.52513 7.06066 8.93934L11 5" stroke={color} strokeWidth="2" />
          <Path d="M13 16H22" stroke={color} strokeWidth="2" />
          <Path d="M13 8H22" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
