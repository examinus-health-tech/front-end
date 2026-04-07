import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function CheckSquareIcon({ size = '24', color = '#0CC1AF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 106 107" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M26.5 53.4997L42.0453 69.045C43.2169 70.2166 45.1164 70.2166 46.288 69.045L79.5 35.833"
        stroke={color}
        strokeWidth="4"
      />
      <Rect x="13.25" y="13.75" width="79.5" height="79.5" rx="12" stroke={color} strokeWidth="4" />
    </Svg>
  );
}
