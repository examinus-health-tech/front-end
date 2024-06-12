import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function RinIcon({ size = '24', color = '#BEC5D2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.6458 14H16.5C17.759 14 18.9446 13.4072 19.7 12.4L21.2 10.4C21.7193 9.70762 22 8.86548 22 8V7C22 4.79086 20.2091 3 18 3H6C3.79086 3 2 4.79086 2 7V15.0458C2 16.6774 3.32262 18 4.95416 18C5.9419 18 6.86428 17.5064 7.41218 16.6845L7.94145 15.8906C8.19687 15.5075 8.57249 15.2297 9 15.0939V21H11V15H12C13.0144 15 13.9407 14.6224 14.6458 14ZM9 15V13C9 11.8954 8.10457 11 7 11H6V9H7C7.73894 9 8.43108 9.20037 9.02506 9.54975C9.24878 7.55257 10.9431 6 13 6H14V8H13C11.8954 8 11 8.89543 11 10V15H9Z"
        fill={color}
      />
    </Svg>
  );
}
