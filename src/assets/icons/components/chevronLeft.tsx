import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChevronLeftIcon({
  size = '24',
  color = '#052B3B',
}: IconProps) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M16 3L9.12132 9.87868C7.94975 11.0503 7.94975 12.9497 9.12132 14.1213L16 21"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
