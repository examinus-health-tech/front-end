import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function ImuIcon({ size = '24', color = '#BEC5D2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13.1716 4.41422C14.7337 2.85212 17.2664 2.85212 18.8285 4.41422L19.5858 5.17158C21.1479 6.73368 21.1479 9.26634 19.5858 10.8284L15.9142 14.5L9.50002 8.08581L13.1716 4.41422ZM8.08581 9.50002L4.41425 13.1716C2.85215 14.7337 2.85215 17.2663 4.41425 18.8284L5.17161 19.5858C6.73371 21.1479 9.26637 21.1479 10.8285 19.5858L14.5 15.9142L8.08581 9.50002Z"
        fill={color}
      />
    </Svg>
  );
}
