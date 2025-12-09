import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function MicrophoneIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="9" y="3" width="6" height="12" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M6 12V15C6 16.6569 7.34315 18 9 18H15C16.6569 18 18 16.6569 18 15V12" stroke={color} strokeWidth="2" />
          <Path d="M12 22V18" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="9" y="3" width="6" height="12" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M6 12V15C6 16.6569 7.34315 18 9 18H15C16.6569 18 18 16.6569 18 15V12" stroke={color} strokeWidth="2" />
          <Path d="M12 22V18" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
