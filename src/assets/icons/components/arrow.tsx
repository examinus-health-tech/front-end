import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ArrowIcon({ size = '24', color = 'white' }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path d="M3.5 12.8584L21.5 12.8584" stroke={color} stroke-width="2" />
      <Path
        d="M21.5 12.8584L18.5 12.8584C16.8431 12.8584 15.5 11.5153 15.5 9.8584L15.5 6.8584"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M21.5 12.8584L18.5 12.8584C16.8431 12.8584 15.5 14.2015 15.5 15.8584L15.5 18.8584"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
