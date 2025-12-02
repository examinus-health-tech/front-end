import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function FaceIdIcon({
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
      {/* Top left corner */}
      <Path
        d="M7 3H5C3.89543 3 3 3.89543 3 5V7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top right corner */}
      <Path
        d="M17 3H19C20.1046 3 21 3.89543 21 5V7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom left corner */}
      <Path
        d="M7 21H5C3.89543 21 3 20.1046 3 19V17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom right corner */}
      <Path
        d="M17 21H19C20.1046 21 21 20.1046 21 19V17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left eye */}
      <Path
        d="M8 9V10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Right eye */}
      <Path
        d="M16 9V10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Nose */}
      <Path
        d="M12 9V13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Smile */}
      <Path
        d="M9 16C9.5 17 10.5 17.5 12 17.5C13.5 17.5 14.5 17 15 16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
