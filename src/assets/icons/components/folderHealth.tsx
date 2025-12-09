import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function FolderHealthIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 19H18C19.6569 19 21 17.6569 21 16V10.4706C21 8.81373 19.6569 7.47059 18 7.47059H12.971C12.2496 7.47059 11.5523 7.2106 11.0069 6.73826L9.84552 5.73233C9.30018 5.25999 8.60288 5 7.88143 5H6C4.34315 5 3 6.34315 3 8V16C3 17.6569 4.34315 19 6 19Z" stroke={color} strokeWidth="2" />
          <Path d="M12 10L12 16" stroke={color} strokeWidth="2" />
          <Path d="M15 13L9 13" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 18.9999H18C19.6569 18.9999 21 17.6568 21 15.9999V10.4705C21 8.81367 19.6569 7.47053 18 7.47053H12.971C12.2496 7.47053 11.5523 7.21054 11.0069 6.7382L9.84552 5.73226C9.30018 5.25993 8.60288 4.99994 7.88143 4.99994H6C4.34315 4.99994 3 6.34309 3 7.99994V15.9999C3 17.6568 4.34315 18.9999 6 18.9999Z" stroke={color} strokeWidth="2" />
          <Path d="M12 10L12 16" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M15 13L9 13" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 3.99994C3.79086 3.99994 2 5.7908 2 7.99994V15.9999C2 18.2091 3.79086 19.9999 6 19.9999H18C20.2091 19.9999 22 18.2091 22 15.9999V10.4705C22 8.26139 20.2091 6.47053 18 6.47053H12.971C12.4901 6.47053 12.0252 6.2972 11.6616 5.98231L10.5002 4.97637C9.77309 4.34659 8.84337 3.99994 7.88143 3.99994H6ZM11 12V10H13V12H15V14H13V16H11V14H9V12H11Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 19H18C19.6569 19 21 17.6569 21 16V10.4706C21 8.81373 19.6569 7.47059 18 7.47059H12.971C12.2496 7.47059 11.5523 7.2106 11.0069 6.73826L9.84552 5.73233C9.30018 5.25999 8.60288 5 7.88143 5H6C4.34315 5 3 6.34315 3 8V16C3 17.6569 4.34315 19 6 19Z" stroke={color} strokeWidth="2" />
          <Path d="M12 10L12 16" stroke={color} strokeWidth="2" />
          <Path d="M15 13L9 13" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
