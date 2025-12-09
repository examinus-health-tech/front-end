import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function RobotChatIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="14" y="13" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="8" y="13" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M20 12V14V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V14V11C4 9.34315 5.34315 8 7 8H10" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M20 14L22 14" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M2 14L4 14" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M12 5.5C12 4.67157 12.6716 4 13.5 4H19.5C20.3284 4 21 4.67157 21 5.5V8.5C21 9.32843 20.3284 10 19.5 10H14.6213C14.2235 10 13.842 10.158 13.5607 10.4393L12.8536 11.1464C12.5386 11.4614 12 11.2383 12 10.7929V5.5Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="14" y="13" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="8" y="13" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M12 5.5C12 4.67157 12.6716 4 13.5 4H19.5C20.3284 4 21 4.67157 21 5.5V8.5C21 9.32843 20.3284 10 19.5 10H14.6213C14.2235 10 13.842 10.158 13.5607 10.4393L12.8536 11.1464C12.5386 11.4614 12 11.2383 12 10.7929V5.5Z" stroke={"#0CC1AF"} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M20 12V14V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V14V11C4 9.34315 5.34315 8 7 8H10" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M20 14L22 14" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M2 14L4 14" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M11 5.5C11 4.11929 12.1193 3 13.5 3H19.5C20.8807 3 22 4.11929 22 5.5V8.5C22 9.88071 20.8807 11 19.5 11H14.6213C14.4887 11 14.3615 11.0527 14.2678 11.1464L13.5607 11.8536C12.6157 12.7985 11 12.1292 11 10.7929V5.5Z" fill={color} />
          <Path d="M5 11C5 9.89543 5.89543 9 7 9H10V7H7C4.79086 7 3 8.79086 3 11V13H2V15H3V17C3 19.2091 4.79086 21 7 21H17C19.2091 21 21 19.2091 21 17V15H22V13H21V12H19V17C19 18.1046 18.1046 19 17 19H7C5.89543 19 5 18.1046 5 17V11Z" fill={color} />
          <Path d="M14 13.5C14 13.2239 14.2239 13 14.5 13H15.5C15.7761 13 16 13.2239 16 13.5V14.5C16 14.7761 15.7761 15 15.5 15H14.5C14.2239 15 14 14.7761 14 14.5V13.5Z" fill={color} />
          <Path d="M8.5 13C8.22386 13 8 13.2239 8 13.5V14.5C8 14.7761 8.22386 15 8.5 15H9.5C9.77614 15 10 14.7761 10 14.5V13.5C10 13.2239 9.77614 13 9.5 13H8.5Z" fill={color} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="14" y="13" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="8" y="13" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M20 12V14V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V14V11C4 9.34315 5.34315 8 7 8H10" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M20 14L22 14" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M2 14L4 14" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M12 5.5C12 4.67157 12.6716 4 13.5 4H19.5C20.3284 4 21 4.67157 21 5.5V8.5C21 9.32843 20.3284 10 19.5 10H14.6213C14.2235 10 13.842 10.158 13.5607 10.4393L12.8536 11.1464C12.5386 11.4614 12 11.2383 12 10.7929V5.5Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </Svg>
      );
  }
}
