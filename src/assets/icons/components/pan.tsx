import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function PanIcon({ size = '24', color = '#BEC5D2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7 2C4.79086 2 3 3.79086 3 6V12V21H5V15.4649C5.58835 15.8052 6.27143 16 7 16H18C20.2091 16 22 14.2091 22 12V6C22 3.79086 20.2091 2 18 2H7ZM5 12H3C3 9.79086 4.79086 8 7 8H14V10H7C5.89543 10 5 10.8954 5 12Z"
        fill={color}
      />
    </Svg>
  );
}
