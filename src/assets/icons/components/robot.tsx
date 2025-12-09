import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function RobotIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="14" y="12" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="8" y="12" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M20 16V10C20 8.34315 18.6569 7 17 7H7C5.34315 7 4 8.34315 4 10V16C4 17.6569 5.34315 19 7 19H17C18.6569 19 20 17.6569 20 16Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M20 13H22" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M2 13L4 13" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M8 7V8.5C8 9.32843 8.67157 10 9.5 10H14.5C15.3284 10 16 9.32843 16 8.5V7" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="14" y="12" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="8" y="12" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M8 7V8.5C8 9.32843 8.67157 10 9.5 10H14.5C15.3284 10 16 9.32843 16 8.5V7" stroke={"#0CC1AF"} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M20 16V10C20 8.34315 18.6569 7 17 7H7C5.34315 7 4 8.34315 4 10V16C4 17.6569 5.34315 19 7 19H17C18.6569 19 20 17.6569 20 16Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M20 13H22" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M2 13L4 13" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M8.5 12C8.22386 12 8 12.2239 8 12.5V13.5C8 13.7761 8.22386 14 8.5 14H9.5C9.77614 14 10 13.7761 10 13.5V12.5C10 12.2239 9.77614 12 9.5 12H8.5Z" fill={color} />
          <Path d="M14.5 12C14.2239 12 14 12.2239 14 12.5V13.5C14 13.7761 14.2239 14 14.5 14H15.5C15.7761 14 16 13.7761 16 13.5V12.5C16 12.2239 15.7761 12 15.5 12H14.5Z" fill={color} />
          <Path d="M3 10C3 7.79086 4.79086 6 7 6H17C19.2091 6 21 7.79086 21 10V12H22V14H21V16C21 18.2091 19.2091 20 17 20H7C4.79086 20 3 18.2091 3 16V14H2V12H3V10ZM7 8C5.89543 8 5 8.89543 5 10V16C5 17.1046 5.89543 18 7 18H17C18.1046 18 19 17.1046 19 16V10C19 8.89543 18.1046 8 17 8V8.5C17 9.88071 15.8807 11 14.5 11H9.5C8.11929 11 7 9.88071 7 8.5V8Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="14" y="12" width="2" height="2" rx="0.5" fill={color} />
          <Rect x="8" y="12" width="2" height="2" rx="0.5" fill={color} />
          <Path d="M20 16V10C20 8.34315 18.6569 7 17 7H7C5.34315 7 4 8.34315 4 10V16C4 17.6569 5.34315 19 7 19H17C18.6569 19 20 17.6569 20 16Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M20 13H22" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M2 13L4 13" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <Path d="M8 7V8.5C8 9.32843 8.67157 10 9.5 10H14.5C15.3284 10 16 9.32843 16 8.5V7" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </Svg>
      );
  }
}
