import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function MoreIcon({
  size = '24',
  color = '#818BA0',
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
        d="M3.5 10C3.22386 10 3 10.2239 3 10.5V13.5C3 13.7761 3.22386 14 3.5 14H6.5C6.77614 14 7 13.7761 7 13.5V10.5C7 10.2239 6.77614 10 6.5 10H3.5Z"
        fill={color}
      />
      <Path
        d="M10 10.5C10 10.2239 10.2239 10 10.5 10H13.5C13.7761 10 14 10.2239 14 10.5V13.5C14 13.7761 13.7761 14 13.5 14H10.5C10.2239 14 10 13.7761 10 13.5V10.5Z"
        fill={color}
      />
      <Path
        d="M17 10.5C17 10.2239 17.2239 10 17.5 10H20.5C20.7761 10 21 10.2239 21 10.5V13.5C21 13.7761 20.7761 14 20.5 14H17.5C17.2239 14 17 13.7761 17 13.5V10.5Z"
        fill={color}
      />
    </Svg>
  );
}
