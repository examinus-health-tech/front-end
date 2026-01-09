import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ClockSquareIcon({
  size = '24',
  color = '#8A3FFC',
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 7C3 4.79086 4.79086 3 7 3H17C19.2091 3 21 4.79086 21 7V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V7ZM10 7L10 10C10 12.2091 11.7909 14 14 14H17V12H14C12.8954 12 12 11.1046 12 10L12 7L10 7Z"
        fill={color}
      />
    </Svg>
  );
}
