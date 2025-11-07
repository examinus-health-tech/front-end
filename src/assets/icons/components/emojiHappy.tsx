import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function EmojiHappyIcon({ size = '48', color = '#BEC5D2' }: IconProps) {
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
        d="M4 12C4 7.58172 7.58172 4 12 4H36C40.4183 4 44 7.58172 44 12V36C44 40.4183 40.4183 44 36 44H12C7.58172 44 4 40.4183 4 36V12ZM17 36C14.2386 36 12 33.7614 12 31V28H16V31C16 31.5523 16.4477 32 17 32H31C31.5523 32 32 31.5523 32 31V28H36V31C36 33.7614 33.7614 36 31 36H17ZM14 17C14 16.4477 14.4477 16 15 16H17C17.5523 16 18 16.4477 18 17V19C18 19.5523 17.5523 20 17 20H15C14.4477 20 14 19.5523 14 19V17ZM31 16C30.4477 16 30 16.4477 30 17V19C30 19.5523 30.4477 20 31 20H33C33.5523 20 34 19.5523 34 19V17C34 16.4477 33.5523 16 33 16H31Z"
        fill={color}
      />
    </Svg>
  );
}
