import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function EnergyBoltIcon({
  size = '24',
  color = '#FA4D5E',
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M12.9995 5.00005C12.9995 2.39747 9.51841 1.52718 8.29366 3.82358L4.29366 11.3236C3.40552 12.9888 4.61225 15.0001 6.49955 15.0001H10.4995C10.7757 15.0001 10.9995 15.2239 10.9995 15.5001V19.0001C10.9995 21.6026 14.4807 22.4729 15.7054 20.1765L19.7054 12.6765C20.5936 11.0113 19.3868 9.00005 17.4995 9.00005H13.4995C13.2234 9.00005 12.9995 8.7762 12.9995 8.50005V5.00005Z"
        fill={color}
      />
    </Svg>
  );
}
