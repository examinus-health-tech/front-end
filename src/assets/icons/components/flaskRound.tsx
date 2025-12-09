import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function FlaskRoundIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 14H18" stroke={color} strokeWidth="2" />
          <Path d="M8 4H16" stroke={color} strokeWidth="2" />
          <Path d="M14 4H10V7.21988C10 8.49133 9.14295 9.57193 8.16546 10.385C6.84232 11.4856 6 13.1444 6 15C6 18.3137 8.68629 21 12 21C15.3137 21 18 18.3137 18 15C18 13.1444 17.1577 11.4856 15.8345 10.385C14.8571 9.57193 14 8.49134 14 7.21988V4Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 14H18" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M8 4H16" stroke={color} strokeWidth="2" />
          <Path d="M14 4H10V7.21988C10 8.49133 9.14295 9.57193 8.16546 10.385C6.84232 11.4856 6 13.1444 6 15C6 18.3137 8.68629 21 12 21C15.3137 21 18 18.3137 18 15C18 13.1444 17.1577 11.4856 15.8345 10.385C14.8571 9.57193 14 8.49134 14 7.21988V4Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M16 3H8V5H9V7.21988C9 8.0335 8.43722 8.85822 7.52597 9.61621C5.98421 10.8987 5 12.8348 5 15C5 18.866 8.13401 22 12 22C15.866 22 19 18.866 19 15C19 12.8348 18.0158 10.8987 16.474 9.61621C15.5628 8.85822 15 8.03351 15 7.21988V5H16V3ZM11 7.21988V5H13V7.21988C13 8.94917 14.1513 10.2856 15.1951 11.1538C16.0549 11.869 16.6698 12.8646 16.9001 14H7.09991C7.33017 12.8646 7.94512 11.869 8.80495 11.1538C9.84867 10.2856 11 8.94916 11 7.21988Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 14H18" stroke={color} strokeWidth="2" />
          <Path d="M8 4H16" stroke={color} strokeWidth="2" />
          <Path d="M14 4H10V7.21988C10 8.49133 9.14295 9.57193 8.16546 10.385C6.84232 11.4856 6 13.1444 6 15C6 18.3137 8.68629 21 12 21C15.3137 21 18 18.3137 18 15C18 13.1444 17.1577 11.4856 15.8345 10.385C14.8571 9.57193 14 8.49134 14 7.21988V4Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
