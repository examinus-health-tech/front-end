import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function BarbellIcon({
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
        d="M4 4L5 5"
        stroke={color}
        stroke-width="2"
        stroke-linejoin="round"
      />
      <Path
        d="M19 19L20 20"
        stroke={color}
        stroke-width="2"
        stroke-linejoin="round"
      />
      <Path
        d="M8 8L15 15"
        stroke={color}
        stroke-width="2"
        stroke-linejoin="round"
      />
      <Path
        d="M4.12123 11.1212L5 12L8.5 8.5L12 5L11.1213 4.12128C9.94973 2.94973 8.05026 2.94971 6.87868 4.12125L4.12127 6.87856C2.94966 8.05012 2.94965 9.94965 4.12123 11.1212Z"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M16.4142 20.5858L20.5858 16.4142C21.3668 15.6332 21.3668 14.3668 20.5858 13.5858L19 12L11.9999 18.9999L13.5858 20.5858C14.3668 21.3668 15.6332 21.3668 16.4142 20.5858Z"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
