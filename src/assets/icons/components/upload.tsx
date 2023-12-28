import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function UploadIcon({
  size = '24',
  color = 'white',
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
        d="M11 2V3C11 4.10457 10.1046 5 9 5H8V7H9C9.72857 7 10.4117 6.80521 11 6.46487L11 16H13L13 6.46487C13.5883 6.80521 14.2714 7 15 7H16V5H15C13.8954 5 13 4.10457 13 3V2H11Z"
        fill={color}
      />
      <Path
        d="M2 14V17C2 19.2091 3.79086 21 6 21H18C20.2091 21 22 19.2091 22 17V14H20V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V14H2Z"
        fill={color}
      />
    </Svg>
  );
}
