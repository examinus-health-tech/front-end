import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function EyeIcon({ size = '24', color = '#052B3B' }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M8.97678 6.76355L2.22115 10.7043C1.22889 11.2831 1.22889 12.7168 2.22114 13.2957L8.97677 17.2365C10.8449 18.3262 13.155 18.3262 15.0232 17.2365L21.7789 13.2957C22.7711 12.7169 22.7711 11.2832 21.7789 10.7043L15.0232 6.76355C13.1551 5.67378 10.845 5.67378 8.97678 6.76355Z"
        stroke={color}
        stroke-width="2"
      />
      <Rect
        x="13"
        y="11"
        width="2"
        height="2"
        rx="0.5"
        transform="rotate(90 13 11)"
        fill={color}
      />
      <Rect
        x="9"
        y="15"
        width="6"
        height="6"
        rx="1.5"
        transform="rotate(-90 9 15)"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
