import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function DescriptionIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 21H17C18.6569 21 20 19.6569 20 18V9.24264C20 8.44699 19.6839 7.68393 19.1213 7.12132L15.8787 3.87868C15.3161 3.31607 14.553 3 13.7574 3H7C5.34315 3 4 4.34315 4 6V18C4 19.6569 5.34315 21 7 21Z" stroke={color} strokeWidth="2" />
          <Path d="M8 8H11" stroke={color} strokeWidth="2" />
          <Path d="M8 12H16" stroke={color} strokeWidth="2" />
          <Path d="M8 16H16" stroke={color} strokeWidth="2" />
          <Path d="M14 3V6C14 7.65685 15.3431 9 17 9H20" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 21H17C18.6569 21 20 19.6569 20 18V9.24264C20 8.44699 19.6839 7.68393 19.1213 7.12132L15.8787 3.87868C15.3161 3.31607 14.553 3 13.7574 3H7C5.34315 3 4 4.34315 4 6V18C4 19.6569 5.34315 21 7 21Z" stroke={color} strokeWidth="2" />
          <Path d="M8 8H11" stroke={color} strokeWidth="2" />
          <Path d="M8 12H16" stroke={color} strokeWidth="2" />
          <Path d="M8 16H16" stroke={color} strokeWidth="2" />
          <Path d="M14 3V6C14 7.65685 15.3431 9 17 9H20" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
