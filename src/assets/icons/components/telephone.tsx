import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function TelephoneIcon({
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
        d="M5 12L7 10L8.56066 8.43934C8.84196 8.15804 9 7.7765 9 7.37868V4.5C9 3.67157 8.32843 3 7.5 3H5.5C4.67157 3 4 3.67157 4 4.5V9.84879C4 10.5899 4.27433 11.3048 4.77012 11.8557L8.5 16L12.1062 20.0069C12.6751 20.639 13.4856 21 14.3361 21H19.5C20.3284 21 21 20.3284 21 19.5V17.5C21 16.6716 20.3284 16 19.5 16H17.6213C17.2235 16 16.842 16.158 16.5607 16.4393L15 18L13 20"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
