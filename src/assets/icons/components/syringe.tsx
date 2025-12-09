import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function SyringeIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M14 11L16 13" stroke={color} strokeWidth="2" />
          <Path d="M12 13L14 15" stroke={color} strokeWidth="2" />
          <Path d="M19 11L12.1213 17.8787C10.9497 19.0503 9.05025 19.0503 7.87868 17.8787L6.12132 16.1213C4.94975 14.9497 4.94974 13.0503 6.12132 11.8787L13 5" stroke={color} strokeWidth="2" />
          <Path d="M19 5L16 8" stroke={color} strokeWidth="2" />
          <Path d="M11 3L21 13" stroke={color} strokeWidth="2" />
          <Path d="M7 16.9707L4 19.9707" stroke={color} strokeWidth="2" />
          <Path d="M21 7L17 3" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M14 11L16 13" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M12 13L14 15" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M19 11L12.1213 17.8787C10.9497 19.0503 9.05025 19.0503 7.87868 17.8787L6.12132 16.1213C4.94975 14.9497 4.94974 13.0503 6.12132 11.8787L13 5" stroke={color} strokeWidth="2" />
          <Path d="M19 5L16 8" stroke={color} strokeWidth="2" />
          <Path d="M11 3L21 13" stroke={color} strokeWidth="2" />
          <Path d="M7 16.9707L4 19.9707" stroke={color} strokeWidth="2" />
          <Path d="M21 7L17 3" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M21.7071 6.29288L17.7071 2.29288L16.2929 3.70709L17.5858 5.00003L16.0001 6.58578L11.7072 2.29291L10.293 3.70712L11.5859 5.00001L5.41428 11.1716C3.85218 12.7337 3.85218 15.2663 5.41428 16.8284L5.57119 16.9854L3.29297 19.2636L4.70718 20.6778L6.98541 18.3996L7.17164 18.5858C8.73373 20.1479 11.2664 20.1479 12.8285 18.5858L14.5001 16.9142L11.2929 13.7071L12.7071 12.2929L15.9143 15.5L16.5001 14.9142L13.2929 11.7071L14.7071 10.2929L17.9143 13.5L19.0001 12.4142L20.293 13.7071L21.7072 12.2929L17.4143 8L19 6.41424L20.2929 7.70709L21.7071 6.29288Z" fill={color} />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M14 11L16 13" stroke={color} strokeWidth="2" />
          <Path d="M12 13L14 15" stroke={color} strokeWidth="2" />
          <Path d="M19 11L12.1213 17.8787C10.9497 19.0503 9.05025 19.0503 7.87868 17.8787L6.12132 16.1213C4.94975 14.9497 4.94974 13.0503 6.12132 11.8787L13 5" stroke={color} strokeWidth="2" />
          <Path d="M19 5L16 8" stroke={color} strokeWidth="2" />
          <Path d="M11 3L21 13" stroke={color} strokeWidth="2" />
          <Path d="M7 16.9707L4 19.9707" stroke={color} strokeWidth="2" />
          <Path d="M21 7L17 3" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
