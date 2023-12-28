import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function BellSecondaryIcon({
  size = '24',
  color = '#052B3B',
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M14.7716 19.1481V19.1481C15.0206 18.5469 14.4726 18 13.8219 18H12L10.1781 18C9.52745 18 8.97937 18.5469 9.22836 19.1481V19.1481C9.37913 19.512 9.6001 19.8427 9.87868 20.1213C10.1573 20.3999 10.488 20.6209 10.8519 20.7716C11.2159 20.9224 11.606 21 12 21C12.394 21 12.7841 20.9224 13.1481 20.7716C13.512 20.6209 13.8427 20.3999 14.1213 20.1213C14.3999 19.8427 14.6209 19.512 14.7716 19.1481Z"
        stroke={color}
        stroke-width="2"
      />
      <Path d="M12 4V2" stroke={color} stroke-width="2" />
      <Path
        d="M6.90111 7.8461C7.55156 5.56955 9.63235 4 12 4V4C14.3676 4 16.4484 5.56954 17.0989 7.8461L19.0086 14.5299C19.5054 16.2689 18.1997 18 16.3911 18H7.60892C5.80034 18 4.49459 16.2689 4.99145 14.5299L6.90111 7.8461Z"
        stroke={color}
        stroke-width="2"
      />
    </Svg>
  );
}
