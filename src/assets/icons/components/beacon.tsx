import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function BeaconIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="18" width="14" height="4" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M18 18V11C18 9.34315 16.6569 8 15 8H11C9.34315 8 8 9.34315 8 11V18" stroke={color} strokeWidth="2" />
          <Path d="M9 2L8.99998 4.99995M2.99994 3L5.99994 6M2 8.99998H4.99998" stroke={color} strokeWidth="2" />
          <Path d="M13 11L13 15" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="18" width="14" height="4" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M18 18V11C18 9.34315 16.6569 8 15 8H11C9.34315 8 8 9.34315 8 11V18" stroke={color} strokeWidth="2" />
          <Path d="M9 2L8.99998 4.99995M2.99994 3L5.99994 6M2 8.99998H4.99998" stroke={color} strokeWidth="2" />
          <Path d="M13 11L13 15" stroke={"#0CC1AF"} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7.99998 4.99995L8 2L10 2.00002L9.99998 4.99996L7.99998 4.99995Z" fill={color} />
          <Path d="M5.29283 6.70711L2.29283 3.70711L3.70705 2.2929L6.70705 5.2929L5.29283 6.70711Z" fill={color} />
          <Path d="M4.99998 9.99999H2V7.99999H4.99998V9.99999Z" fill={color} />
          <Path d="M19 17.05V11C19 8.79086 17.2091 7 15 7H11C8.79086 7 7 8.79086 7 11V17.05C5.85888 17.2816 5 18.2905 5 19.5V20.5C5 21.8807 6.11929 23 7.5 23H18.5C19.8807 23 21 21.8807 21 20.5V19.5C21 18.2905 20.1411 17.2816 19 17.05ZM7.5 19C7.22386 19 7 19.2239 7 19.5V20.5C7 20.7761 7.22386 21 7.5 21H18.5C18.7761 21 19 20.7761 19 20.5V19.5C19 19.2239 18.7761 19 18.5 19H7.5ZM12 15V11H14V15H12Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="18" width="14" height="4" rx="1.5" stroke={color} strokeWidth="2" />
          <Path d="M18 18V11C18 9.34315 16.6569 8 15 8H11C9.34315 8 8 9.34315 8 11V18" stroke={color} strokeWidth="2" />
          <Path d="M9 2L8.99998 4.99995M2.99994 3L5.99994 6M2 8.99998H4.99998" stroke={color} strokeWidth="2" />
          <Path d="M13 11L13 15" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
