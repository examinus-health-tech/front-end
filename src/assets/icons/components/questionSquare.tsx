import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function QuestionSquareIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Rect x="11" y="16" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M9 10V8.5C9 7.67157 9.67157 7 10.5 7H13.5C14.3284 7 15 7.67157 15 8.5V10.5C15 11.3284 14.3284 12 13.5 12C12.6716 12 12 12.6716 12 13.5V15" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
          <Rect x="11" y="16" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M9 10V8.5C9 7.67157 9.67157 7 10.5 7H13.5C14.3284 7 15 7.67157 15 8.5V10.5C15 11.3284 14.3284 12 13.5 12C12.6716 12 12 12.6716 12 13.5V15" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
