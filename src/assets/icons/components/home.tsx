import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function HomeIcon({
  size = '24',
  color = '#BEC5D2',
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
        d="M3 12L10.5858 4.41421C11.3668 3.63316 12.6332 3.63317 13.4142 4.41421L21 12"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M6 9V17C6 18.6569 7.34315 20 9 20H15C16.6569 20 18 18.6569 18 17V9"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M10 20L10 15.5C10 14.6716 10.6716 14 11.5 14L12.5 14C13.3284 14 14 14.6716 14 15.5L14 20"
        stroke={color}
        // stroke="#0CC1AF"
        stroke-width="2"
      />
    </Svg>
  );
}
