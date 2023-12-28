import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ({ size = '20', color = '#0CC1AF' }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M6.66602 4.16699L6.66602 1.66699"
        stroke={color}
        stroke-width="1.66667"
      />
      <Path
        d="M13.334 4.16699L13.334 1.66699"
        stroke={color}
        stroke-width="1.66667"
      />
      <Path d="M17.5 7.5L2.5 7.5" stroke={color} stroke-width="1.66667" />
      <Rect
        x="2.5"
        y="4.16699"
        width="15"
        height="11.6667"
        rx="2.5"
        stroke={color}
        stroke-width="1.66667"
      />
      <Rect x="5" y="10" width="1.66667" height="1.66667" fill={color} />
      <Rect x="9.16602" y="10" width="1.66667" height="1.66667" fill={color} />
      <Rect x="13.334" y="10" width="1.66667" height="1.66667" fill={color} />
    </Svg>
  );
}
