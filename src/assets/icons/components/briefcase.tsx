import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function BriefcaseIcon({
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
      <Path d="M21 13L3 13" stroke={color} stroke-width="2" />
      <Rect
        x="3"
        y="9"
        width="18"
        height="12"
        rx="3"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M7 8V7C7 5.34315 8.34315 4 10 4H14C15.6569 4 17 5.34315 17 7V8"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
