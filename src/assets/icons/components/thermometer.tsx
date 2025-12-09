import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ThermometerIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M8 16L4 20" stroke={color} strokeWidth="2" />
          <Path d="M15 9L11 13" stroke={color} strokeWidth="2" />
          <Path d="M8.87868 16.8787L7.12132 15.1213C5.94975 13.9497 5.94975 12.0503 7.12132 10.8787L12.8787 5.12132C14.0503 3.94975 15.9497 3.94975 17.1213 5.12132L18.8787 6.87868C20.0503 8.05025 20.0503 9.94975 18.8787 11.1213L13.1213 16.8787C11.9497 18.0503 10.0503 18.0503 8.87868 16.8787Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M8 16L4 20" stroke={color} strokeWidth="2" />
          <Path d="M15 9L11 13" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M8.87868 16.8787L7.12132 15.1213C5.94975 13.9497 5.94975 12.0503 7.12132 10.8787L12.8787 5.12132C14.0503 3.94975 15.9497 3.94975 17.1213 5.12132L18.8787 6.87868C20.0503 8.05025 20.0503 9.94975 18.8787 11.1213L13.1213 16.8787C11.9497 18.0503 10.0503 18.0503 8.87868 16.8787Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M17.8285 4.41425C16.2664 2.85215 13.7337 2.85215 12.1716 4.41425L6.41425 10.1716C4.85215 11.7337 4.85215 14.2664 6.41425 15.8285L6.58577 16L3.29285 19.2929L4.70706 20.7071L7.99998 17.4142L8.17161 17.5858C9.7337 19.1479 12.2664 19.1479 13.8285 17.5858L19.5858 11.8285C21.1479 10.2664 21.1479 7.7337 19.5858 6.17161L17.8285 4.41425ZM10.2929 12.2929L14.2929 8.29292L15.7071 9.70714L11.7071 13.7071L10.2929 12.2929Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M8 16L4 20" stroke={color} strokeWidth="2" />
          <Path d="M15 9L11 13" stroke={color} strokeWidth="2" />
          <Path d="M8.87868 16.8787L7.12132 15.1213C5.94975 13.9497 5.94975 12.0503 7.12132 10.8787L12.8787 5.12132C14.0503 3.94975 15.9497 3.94975 17.1213 5.12132L18.8787 6.87868C20.0503 8.05025 20.0503 9.94975 18.8787 11.1213L13.1213 16.8787C11.9497 18.0503 10.0503 18.0503 8.87868 16.8787Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
