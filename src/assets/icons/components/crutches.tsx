import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function CrutchesIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M8 16L3 21" stroke={color} strokeWidth="2" />
          <Path d="M15 13L11 9" stroke={color} strokeWidth="2" />
          <Path d="M13 3L21 11" stroke={color} strokeWidth="2" />
          <Path d="M15 5L9.50078 10.4992C9.17145 10.8285 8.92332 11.23 8.77605 11.6719L7.94868 14.1539C7.5578 15.3266 8.67341 16.4422 9.84605 16.0513L12.3281 15.224C12.77 15.0767 13.1715 14.8285 13.5008 14.4992L19 9" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M15 13L11 9" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M8 16L3 21" stroke={color} strokeWidth="2" />
          <Path d="M13 3L21 11" stroke={color} strokeWidth="2" />
          <Path d="M15 5L9.50078 10.4992C9.17145 10.8285 8.92332 11.23 8.77605 11.6719L7.94868 14.1539C7.5578 15.3266 8.67341 16.4422 9.84605 16.0513L12.3281 15.224C12.77 15.0767 13.1715 14.8285 13.5008 14.4992L19 9" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M13.5858 5.00006L12.2928 3.70712L13.7071 2.29291L21.7071 10.2929L20.2928 11.7071L19 10.4143L14.2079 15.2063C13.7688 15.6454 13.2335 15.9763 12.6444 16.1727L10.1623 17C9.56095 17.2005 8.96858 17.1632 8.45559 16.9586L3.70706 21.7071L2.29285 20.2929L7.04142 15.5443C6.83685 15.0314 6.79961 14.4391 7.00005 13.8377L7.82741 11.3556C8.02378 10.7665 8.35462 10.2312 8.79372 9.79213L13.5858 5.00006ZM15 6.41427L12.4142 9.00006L15 11.5858L17.5858 9.00006L15 6.41427ZM13.5858 13.0001L11 10.4143L10.2079 11.2063C9.98838 11.4259 9.82296 11.6935 9.72478 11.9881L8.89741 14.4702C8.76712 14.8611 9.13899 15.2329 9.52987 15.1026L12.012 14.2753C12.3065 14.1771 12.5742 14.0117 12.7937 13.7921L13.5858 13.0001Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M8 16L3 21" stroke={color} strokeWidth="2" />
          <Path d="M15 13L11 9" stroke={color} strokeWidth="2" />
          <Path d="M13 3L21 11" stroke={color} strokeWidth="2" />
          <Path d="M15 5L9.50078 10.4992C9.17145 10.8285 8.92332 11.23 8.77605 11.6719L7.94868 14.1539C7.5578 15.3266 8.67341 16.4422 9.84605 16.0513L12.3281 15.224C12.77 15.0767 13.1715 14.8285 13.5008 14.4992L19 9" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
