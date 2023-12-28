import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function FlagIcon({
  size = '24',
  color = '#052B3B',
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M6 21V6.5C6 5.67157 6.67157 5 7.5 5H10.5458C10.842 5 11.1315 5.08766 11.3779 5.25192L13.6221 6.74808C13.8685 6.91234 14.158 7 14.4542 7H17.5C18.3284 7 19 7.67157 19 8.5V13.5C19 14.3284 18.3284 15 17.5 15H14.4542C14.158 15 13.8685 14.9123 13.6221 14.7481L11.3779 13.2519C11.1315 13.0877 10.842 13 10.5458 13H6"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
