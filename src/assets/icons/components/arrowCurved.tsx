import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowCurvedIcon({
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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4 12V3H6V12C6 13.1046 6.89543 14 8 14H18.49C18.4044 13.8519 18.2983 13.7125 18.1716 13.5858L14.2929 9.70711L15.7071 8.29289L19.5858 12.1716C21.1479 13.7337 21.1479 16.2663 19.5858 17.8284L15.7071 21.7071L14.2929 20.2929L18.1716 16.4142C18.2983 16.2875 18.4044 16.1481 18.49 16H8C5.79086 16 4 14.2091 4 12Z"
        fill={color}
      />
    </Svg>
  );
}
