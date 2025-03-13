import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ChartIcon({
  size = '24',
  color = '#BEC5D2',
  duotone,
}: IconProps) {
  if (duotone) {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path d="M8 17L8 11" stroke="#0CC1AF" stroke-width="2" />
        <Path d="M12 17L12 7" stroke="#0CC1AF" stroke-width="2" />
        <Path d="M16 17L16 13" stroke="#0CC1AF" stroke-width="2" />
        <Path
          d="M4 4V17C4 18.6569 5.34315 20 7 20H20"
          stroke="#052B3B"
          stroke-width="2"
        />
      </Svg>
    );
  }

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9 11L9 17H7L7 11H9Z"
        fill={color}
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13 7V17H11V7H13Z"
        fill={color}
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17 13V17H15V13H17Z"
        fill={color}
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3 17V4H5V17C5 18.1046 5.89543 19 7 19H20V21H7C4.79086 21 3 19.2091 3 17Z"
        fill={color}
      />
    </Svg>
  );
}
