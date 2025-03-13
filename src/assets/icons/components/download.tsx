import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function DownloadIcon({
  size = '24',
  color = '#769DB4',
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M2.5 11.666V14.166C2.5 15.5467 3.61929 16.666 5 16.666H15C16.3807 16.666 17.5 15.5467 17.5 14.166V11.666"
        stroke={color}
        stroke-width="1.66667"
      />
      <Path
        d="M10 13.334L10 12.5007C10 11.1199 11.1193 10.0007 12.5 10.0007L13.3333 10.0007"
        stroke={color}
        stroke-width="1.66667"
      />
      <Path
        d="M10 13.334L10 12.5007C10 11.1199 8.88071 10.0007 7.5 10.0007L6.66667 10.0007"
        stroke={color}
        stroke-width="1.66667"
      />
      <Path d="M10 1.66602L10 11.666" stroke={color} stroke-width="1.66667" />
    </Svg>
  );
}
