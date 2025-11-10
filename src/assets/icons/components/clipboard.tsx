import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ClipboardIcon({
  size = '24',
  color = '#BEC5D2',
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
        d="M6 17H18"
        stroke={color}
        strokeWidth="2"
      />
      <Rect
        x="6"
        y="3"
        width="12"
        height="18"
        rx="3"
        stroke={color}
        strokeWidth="2"
      />
      <Path
        d="M12 7L12 13"
        stroke={color}
        strokeWidth="2"
      />
      <Path
        d="M15 10H9"
        stroke={color}
        strokeWidth="2"
      />
    </Svg>
  );
}
