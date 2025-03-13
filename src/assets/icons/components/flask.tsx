import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function FlaskIcon({ size = '24', color = '#052B3B', variant = 'monotone' }: IconProps) {
  switch (variant) {
    case 'monotone': {
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path d="M8 14H16" stroke={color} stroke-width="2" />
          <Path d="M8 4H16" stroke={color} stroke-width="2" />
          <Path
            d="M14 4H10V9.7033C10 10.2254 9.86376 10.7384 9.60474 11.1917L6.56481 16.5116C5.42197 18.5116 6.86607 21 9.16954 21H14.8305C17.1339 21 18.578 18.5116 17.4352 16.5116L14.3953 11.1917C14.1363 10.7384 14 10.2254 14 9.70332V4Z"
            stroke={color}
            stroke-width="2"
          />
        </Svg>
      );
    }
    case 'duotone': {
      return (
        <Svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path d="M10 17.5H20" stroke="#0CC1AF" stroke-width="2" />
          <Path d="M10 5H20" stroke="#052B3B" stroke-width="2" />
          <Path
            d="M17.5 5H12.5V12.3283C12.5 12.8504 12.3638 13.3634 12.1047 13.8167L7.56481 21.7616C6.42197 23.7616 7.86607 26.25 10.1695 26.25H19.8305C22.1339 26.25 23.578 23.7616 22.4352 21.7616L17.8953 13.8167C17.6363 13.3634 17.5 12.8504 17.5 12.3283V5Z"
            stroke="#052B3B"
            stroke-width="2"
          />
        </Svg>
      );
    }
  }
}
