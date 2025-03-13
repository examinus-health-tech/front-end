import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChatIcon({
  size = '24',
  color = '#052B3B',
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
        d="M20 8C20 6.34315 18.6569 5 17 5H7C5.34315 5 4 6.34315 4 8V17.3787C4 18.715 5.61571 19.3843 6.56066 18.4393L7.12132 17.8787C7.68393 17.3161 8.44699 17 9.24264 17H17C18.6569 17 20 15.6569 20 14V8Z"
        stroke={color}
        stroke-width="2"
      />
      <Path d="M7 9L17 9" stroke={color} stroke-width="2" />
      <Path d="M7 13L12 13" stroke={color} stroke-width="2" />
    </Svg>
  );
}
