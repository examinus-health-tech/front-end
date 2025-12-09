import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function DocumentHealthIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 21H17C18.6569 21 20 19.6569 20 18V9.24264C20 8.44699 19.6839 7.68393 19.1213 7.12132L15.8787 3.87868C15.3161 3.31607 14.553 3 13.7574 3H7C5.34315 3 4 4.34315 4 6V18C4 19.6569 5.34315 21 7 21Z" stroke={color} strokeWidth="2" />
          <Path d="M14 3V6C14 7.65685 15.3431 9 17 9H20" stroke={color} strokeWidth="2" />
          <Path d="M12 10L12 16" stroke={color} strokeWidth="2" />
          <Path d="M15 13L9 13" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 21H17C18.6569 21 20 19.6569 20 18V9.24264C20 8.44699 19.6839 7.68393 19.1213 7.12132L15.8787 3.87868C15.3161 3.31607 14.553 3 13.7574 3H7C5.34315 3 4 4.34315 4 6V18C4 19.6569 5.34315 21 7 21Z" stroke={color} strokeWidth="2" />
          <Path d="M14 3V6C14 7.65685 15.3431 9 17 9H20" stroke={color} strokeWidth="2" />
          <Path d="M12 10L12 16" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M15 13L9 13" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 6C3 3.79086 4.79086 2 7 2H13V6C13 8.20914 14.7909 10 17 10H21V18C21 20.2091 19.2091 22 17 22H7C4.79086 22 3 20.2091 3 18V6ZM20.8021 8C20.6085 7.40767 20.2773 6.86309 19.8284 6.41421L16.5858 3.17157C16.1369 2.72269 15.5923 2.39152 15 2.19791V6C15 7.10457 15.8954 8 17 8H20.8021ZM11 12V10H13V12H15V14H13V16H11V14H9V12H11Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 21H17C18.6569 21 20 19.6569 20 18V9.24264C20 8.44699 19.6839 7.68393 19.1213 7.12132L15.8787 3.87868C15.3161 3.31607 14.553 3 13.7574 3H7C5.34315 3 4 4.34315 4 6V18C4 19.6569 5.34315 21 7 21Z" stroke={color} strokeWidth="2" />
          <Path d="M14 3V6C14 7.65685 15.3431 9 17 9H20" stroke={color} strokeWidth="2" />
          <Path d="M12 10L12 16" stroke={color} strokeWidth="2" />
          <Path d="M15 13L9 13" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
