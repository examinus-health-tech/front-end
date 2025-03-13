import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function LocationIcon({
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
        d="M5.12132 14.1213L12 21L18.8787 14.1213C20.0503 12.9497 20.0503 11.0503 18.8787 9.87868L14.1213 5.12132C12.9497 3.94975 11.0503 3.94974 9.87868 5.12132L5.12132 9.87868C3.94975 11.0503 3.94974 12.9497 5.12132 14.1213Z"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M11.2929 9.70711C11.6834 9.31658 12.3166 9.31658 12.7071 9.70711L14.2929 11.2929C14.6834 11.6834 14.6834 12.3166 14.2929 12.7071L12.7071 14.2929C12.3166 14.6834 11.6834 14.6834 11.2929 14.2929L9.70711 12.7071C9.31658 12.3166 9.31658 11.6834 9.70711 11.2929L11.2929 9.70711Z"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
