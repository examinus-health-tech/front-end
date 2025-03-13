import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function SanIcon({ size = '24', color = '#BEC5D2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.2769 4.93753C13.6845 2.66266 10.3155 2.66267 8.72307 4.93754L5.32769 9.78808C4.46352 11.0226 4 12.4931 4 14C4 15.0506 4.20693 16.0909 4.60896 17.0615C5.011 18.0321 5.60028 18.914 6.34315 19.6569C7.08601 20.3997 7.96793 20.989 8.93853 21.391C9.90914 21.7931 10.9494 22 12 22C13.0506 22 14.0909 21.7931 15.0615 21.391C16.0321 20.989 16.914 20.3997 17.6569 19.6569C18.3997 18.914 18.989 18.0321 19.391 17.0615C19.7931 16.0909 20 15.0506 20 14C20 12.4931 19.5365 11.0226 18.6723 9.78807L15.2769 4.93753ZM11 13V11H13V13H15V15H13V17H11V15H9V13H11Z"
        fill={color}
      />
    </Svg>
  );
}
