import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function QuoteIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 7.5V11.5C3 12.3284 3.67157 13 4.5 13H5C5.82843 13 6.5 13.6716 6.5 14.5V16.5C6.5 17.3284 7.17157 18 8 18H8.5C9.32843 18 10 17.3284 10 16.5V7.5C10 6.67157 9.32843 6 8.5 6H6.5H4.5C3.67157 6 3 6.67157 3 7.5Z" stroke={color} strokeWidth="2" />
          <Path d="M13 7.5V11.5C13 12.3284 13.6716 13 14.5 13H15C15.8284 13 16.5 13.6716 16.5 14.5V16.5C16.5 17.3284 17.1716 18 18 18H18.5C19.3284 18 20 17.3284 20 16.5V7.5C20 6.67157 19.3284 6 18.5 6H16.5H14.5C13.6716 6 13 6.67157 13 7.5Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 7.5V11.5C3 12.3284 3.67157 13 4.5 13H5C5.82843 13 6.5 13.6716 6.5 14.5V16.5C6.5 17.3284 7.17157 18 8 18H8.5C9.32843 18 10 17.3284 10 16.5V7.5C10 6.67157 9.32843 6 8.5 6H6.5H4.5C3.67157 6 3 6.67157 3 7.5Z" stroke={color} strokeWidth="2" />
          <Path d="M13 7.5V11.5C13 12.3284 13.6716 13 14.5 13H15C15.8284 13 16.5 13.6716 16.5 14.5V16.5C16.5 17.3284 17.1716 18 18 18H18.5C19.3284 18 20 17.3284 20 16.5V7.5C20 6.67157 19.3284 6 18.5 6H16.5H14.5C13.6716 6 13 6.67157 13 7.5Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
