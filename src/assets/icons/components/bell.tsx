import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function BellIcon({
  size = '24',
  color = '#052B3B',
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M9.33398 18.6667V12C9.33398 9.79086 11.1248 8 13.334 8H18.6673C20.8765 8 22.6673 9.79086 22.6673 12V18.6667"
        stroke={color}
        stroke-width="2.66667"
      />
      <Path
        d="M9.33398 18.667V20.0003C9.33398 22.2095 7.54312 24.0003 5.33398 24.0003H4.00065"
        stroke={color}
        stroke-width="2.66667"
      />
      <Path
        d="M22.666 18.667V20.0003C22.666 22.2095 24.4569 24.0003 26.666 24.0003H27.9993"
        stroke={color}
        stroke-width="2.66667"
      />
      <Path d="M5.33398 24H26.6673" stroke={color} stroke-width="2.66667" />
      <Path d="M16 8V4" stroke={color} stroke-width="2.66667" />
      <Path
        d="M13.334 24V26C13.334 27.1046 14.2294 28 15.334 28H16.6673C17.7719 28 18.6673 27.1046 18.6673 26V24"
        stroke={color}
        stroke-width="2.66667"
      />
    </Svg>
  );
}
