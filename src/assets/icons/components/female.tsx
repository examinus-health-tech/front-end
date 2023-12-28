import { Svg, Path, Rect, G } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function FemaleIcon({
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
      <G id="Monotone/56  gender female">
        <Path id="Vector" d="M15 18H9" stroke={color} stroke-width="2" />
        <Rect
          id="Vector_2"
          x="7"
          y="4"
          width="10"
          height="10"
          rx="3"
          stroke={color}
          stroke-width="2"
        />
        <Path id="Vector_3" d="M12 14V22" stroke={color} stroke-width="2" />
      </G>
    </Svg>
  );
}
