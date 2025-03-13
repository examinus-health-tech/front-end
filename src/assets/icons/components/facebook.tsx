import { Svg, Path, G } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function FacebookIcon({
  size = '25',
  color = '#3D4966',
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/Svg"
    >
      <G id="Frame">
        <Path
          id="Subtract"
          d="M17.8732 13.3039L18.4965 9.34688H14.6568V6.7748C14.6568 5.6928 15.1928 4.63553 16.907 4.63553H18.6772V1.26586C17.6463 1.10161 16.6046 1.01275 15.5606 1C12.4003 1 10.3371 2.89814 10.3371 6.32964V9.34688H6.83398V13.3039H10.3371V22.875H14.6568V13.3039H17.8732Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
