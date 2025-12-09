import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function HeadHealthIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M16 22V18.2002C16 18.0775 16.0693 17.9653 16.1791 17.9105C18.5208 16.7396 20 14.3462 20 11.7281V10C20 6.13401 16.866 3 13 3L11.9231 3C8.65186 3 6 5.65186 6 8.9231C6 8.97342 5.98632 9.0228 5.96043 9.06595L3.9855 12.3575C3.55179 13.0804 4.07248 14 4.91548 14C5.51444 14 6 14.4856 6 15.0845V16.5C6 17.3284 6.67157 18 7.5 18H8.5C9.32843 18 10 18.6716 10 19.5V22" stroke={color} strokeWidth="2" />
          <Path d="M13 7V13" stroke={color} strokeWidth="2" />
          <Path d="M16 10L10 10" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M16 22V18.2002C16 18.0775 16.0693 17.9653 16.1791 17.9105C18.5208 16.7396 20 14.3462 20 11.7281V10C20 6.13401 16.866 3 13 3L11.9231 3C8.65186 3 6 5.65186 6 8.9231C6 8.97342 5.98632 9.0228 5.96043 9.06595L3.9855 12.3575C3.55179 13.0804 4.07248 14 4.91548 14C5.51444 14 6 14.4856 6 15.0845V16.5C6 17.3284 6.67157 18 7.5 18H8.5C9.32843 18 10 18.6716 10 19.5V22" stroke={color} strokeWidth="2" />
          <Path d="M13 7V13" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M16 10L10 10" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M11.9231 2C8.16819 2 5.11146 4.98938 5.003 8.71806L3.12804 11.843C2.29441 13.2324 3.29521 15 4.9155 15C4.96218 15 5.00003 15.0378 5.00003 15.0845V16.5C5.00003 17.8807 6.11931 19 7.50003 19H8.50003C8.77617 19 9.00003 19.2239 9.00003 19.5V22H17V18.6054C19.4632 17.2049 21 14.5832 21 11.7281V10C21 5.58172 17.4183 2 13 2H11.9231ZM12 9V7H14V9H16V11H14V13H12V11H10V9H12Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M16 22V18.2002C16 18.0775 16.0693 17.9653 16.1791 17.9105C18.5208 16.7396 20 14.3462 20 11.7281V10C20 6.13401 16.866 3 13 3L11.9231 3C8.65186 3 6 5.65186 6 8.9231C6 8.97342 5.98632 9.0228 5.96043 9.06595L3.9855 12.3575C3.55179 13.0804 4.07248 14 4.91548 14C5.51444 14 6 14.4856 6 15.0845V16.5C6 17.3284 6.67157 18 7.5 18H8.5C9.32843 18 10 18.6716 10 19.5V22" stroke={color} strokeWidth="2" />
          <Path d="M13 7V13" stroke={color} strokeWidth="2" />
          <Path d="M16 10L10 10" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
