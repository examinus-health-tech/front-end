import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function FingerprintIcon({
  size = '24',
  color = '#052B3B',
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M12 2C9.24 2 7 4.24 7 7V10.5C7 12.43 8.57 14 10.5 14C12.43 14 14 12.43 14 10.5V7C14 5.9 13.1 5 12 5C10.9 5 10 5.9 10 7V10.5C10 11.05 10.45 11.5 11 11.5C11.55 11.5 12 11.05 12 10.5V7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7V10.5C17 14.09 14.09 17 10.5 17C6.91 17 4 14.09 4 10.5V9"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 10.5V7C20 4.24 17.76 2 15 2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 10.5C20 15.19 16.19 19 11.5 19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 15C5.58 17.5 8.37 19 11.5 19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.5 22C6.12 21.25 4.11 19.68 2.8 17.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 14C19.34 16.56 17.68 18.74 15.43 20.07"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
