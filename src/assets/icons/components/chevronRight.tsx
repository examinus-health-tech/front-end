import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChevronRightIcon({
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
        d="M9 19L13.8787 14.1213C15.0503 12.9497 15.0503 11.0503 13.8787 9.87868L9 5"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
