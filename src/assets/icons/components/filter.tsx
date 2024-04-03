import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function FilterIcon({
  size = '24',
  color = '#818BA0',
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
        d="M8.72566 3C5.49902 3 3.60025 6.62391 5.43689 9.27684L8.71119 14.0064C9.06477 14.5171 9.50758 14.9143 9.99996 15.198L9.99996 21H14V15.198C14.4923 14.9143 14.9351 14.5171 15.2887 14.0064L18.563 9.27684C20.3997 6.62392 18.5009 3 15.2743 3H8.72566Z"
        fill={color}
      />
    </Svg>
  );
}
