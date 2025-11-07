import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function EmojiAnxiousIcon({ size = '48', color = '#BEC5D2' }: IconProps) {
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
        d="M4 12C4 7.58172 7.58172 4 12 4H36C40.4183 4 44 7.58172 44 12V36C44 40.4183 40.4183 44 36 44H12C7.58172 44 4 40.4183 4 36V12ZM15 16C14.4477 16 14 16.4477 14 17V19C14 19.5523 14.4477 20 15 20H17C17.5523 20 18 19.5523 18 19V17C18 16.4477 17.5523 16 17 16H15ZM30 17C30 16.4477 30.4477 16 31 16H33C33.5523 16 34 16.4477 34 17V19C34 19.5523 33.5523 20 33 20H31C30.4477 20 30 19.5523 30 19V17ZM17 26C14.2386 26 12 28.2386 12 31V34V36H14H34H36V34V31C36 28.2386 33.7614 26 31 26H17ZM16 31C16 30.4477 16.4477 30 17 30H31C31.5523 30 32 30.4477 32 31V32H16V31Z"
        fill={color}
      />
    </Svg>
  );
}
