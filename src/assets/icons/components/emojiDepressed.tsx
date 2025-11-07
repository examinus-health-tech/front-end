import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function EmojiDepressedIcon({ size = '48', color = '#BEC5D2' }: IconProps) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 12C4 7.58172 7.58172 4 12 4H36C40.4183 4 44 7.58172 44 12V36C44 40.4183 40.4183 44 36 44H12C7.58172 44 4 40.4183 4 36V12ZM17 28C14.2386 28 12 30.2386 12 33V36H16V33C16 32.4477 16.4477 32 17 32H31C31.5523 32 32 32.4477 32 33V36H36V33C36 30.2386 33.7614 28 31 28H17ZM30 20.8284L27.4142 23.4142L24.5858 20.5858L27.1716 18L24.5858 15.4142L27.4142 12.5858L30 15.1716L32.5858 12.5858L35.4142 15.4142L32.8284 18L35.4142 20.5858L32.5858 23.4142L30 20.8284ZM18 20.8284L15.4142 23.4142L12.5858 20.5858L15.1716 18L12.5858 15.4142L15.4142 12.5858L18 15.1716L20.5858 12.5858L23.4142 15.4142L20.8284 18L23.4142 20.5858L20.5858 23.4142L18 20.8284Z"
        fill={color}
      />
    </Svg>
  );
}
