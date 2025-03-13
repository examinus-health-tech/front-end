import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function AppleIcon({
  size = '24',
  color = '#818BA0',
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
        d="M9 3V3C10.6569 3 12 4.34315 12 6V8"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M15 3V3C13.3431 3 12 4.34315 12 6V8"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M9.37217 6.94887L10.8858 7.55433C11.6011 7.84042 12.3989 7.84042 13.1142 7.55433L14.6278 6.94887C15.995 6.40201 17.5569 6.92819 18.3145 8.19081L19.2344 9.72398C19.7168 10.5279 19.7955 11.5112 19.4473 12.3816L17.1376 18.1561C16.5252 19.687 14.7352 20.3676 13.2604 19.6302C12.467 19.2335 11.533 19.2335 10.7396 19.6302C9.26483 20.3676 7.47481 19.687 6.86244 18.1561L4.55266 12.3816C4.20446 11.5112 4.28324 10.5279 4.76561 9.72398L5.68551 8.19081C6.44309 6.92818 8.00502 6.40201 9.37217 6.94887Z"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
