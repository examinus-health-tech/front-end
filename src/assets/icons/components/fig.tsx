import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function FigIcon({ size = '24', color = '#BEC5D2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M11 2V3C11 4.10457 11.8954 5 13 5H16V5.01411C16.1115 5.00476 16.2242 5 16.338 5H18C20.2091 5 22 6.79086 22 9V14.0784C22 15.2781 21.4615 16.4145 20.533 17.1742L16.9621 20.0958C16.2474 20.6805 15.3525 21 14.4291 21H11.5C9.73676 21 8.27806 19.6961 8.03544 18H7C5.89543 18 5 18.8954 5 20L5 21H3V20C3 17.7909 4.79086 16 7 16H8.18722C8.61694 14.8326 9.73899 14 11.0555 14C11.6157 14 12.0783 13.5624 12.1094 13.003L12.3441 8.77812C12.3801 8.13029 12.5689 7.52555 12.8742 6.99806C10.7233 6.93163 9 5.16706 9 3V2H11Z"
        fill={color}
      />
    </Svg>
  );
}
