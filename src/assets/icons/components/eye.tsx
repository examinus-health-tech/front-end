import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function EyeIcon({
  size = '24',
  solid = false,
  color = '#052B3B',
  closed = false,
}: IconProps) {
  if (solid) {
    if (closed) {
      return (
        <Svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M22 13H2V11H22V13Z"
            fill={color}
          />
        </Svg>
      );
    }

    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8.47252 5.89984C10.6521 4.62844 13.3472 4.62844 15.5267 5.89984L22.2823 9.84062C23.9361 10.8053 23.9361 13.1948 22.2823 14.1595L15.5267 18.1003C13.3472 19.3717 10.6521 19.3717 8.47251 18.1003L1.71688 14.1595C0.0631182 13.1948 0.0631251 10.8053 1.71689 9.84062L8.47252 5.89984ZM7.9996 13.5001C7.9996 14.8808 9.11889 16.0001 10.4996 16.0001H13.4996C14.8803 16.0001 15.9996 14.8808 15.9996 13.5001V10.5001C15.9996 9.11935 14.8803 8.00006 13.4996 8.00006L10.4996 8.00006C9.11889 8.00006 7.9996 9.11935 7.9996 10.5001V13.5001ZM10.4996 14.0001C10.2235 14.0001 9.9996 13.7762 9.9996 13.5001V10.5001C9.9996 10.2239 10.2235 10.0001 10.4996 10.0001H13.4996C13.7757 10.0001 13.9996 10.2239 13.9996 10.5001V13.5001C13.9996 13.7762 13.7757 14.0001 13.4996 14.0001H10.4996Z"
          fill={color}
        />
      </Svg>
    );
  }

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
