import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function EnergyIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 8.5V5C12 3.43845 9.91132 2.91628 9.17647 4.29412L5.17647 11.7941C4.64359 12.7933 5.36762 14 6.5 14H10.5C11.3284 14 12 14.6716 12 15.5V19C12 20.5616 14.0887 21.0837 14.8235 19.7059L18.8235 12.2059C19.3564 11.2067 18.6324 10 17.5 10H13.5C12.6716 10 12 9.32843 12 8.5Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 8.5V5C12 3.43845 9.91132 2.91628 9.17647 4.29412L5.17647 11.7941C4.64359 12.7933 5.36762 14 6.5 14H10.5C11.3284 14 12 14.6716 12 15.5V19C12 20.5616 14.0887 21.0837 14.8235 19.7059L18.8235 12.2059C19.3564 11.2067 18.6324 10 17.5 10H13.5C12.6716 10 12 9.32843 12 8.5Z" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
