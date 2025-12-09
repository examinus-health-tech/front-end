import { Svg, Path } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function EmojiDepressedMinimalIcon({
  size = '24',
  color = '#052B3B',
  variant = 'monotone',
}: IconProps) {
  switch (variant) {
    case 'monotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M14.0001 15.0002L15.586 13.4143C16.367 12.6333 16.367 11.367 15.586 10.5859L14.0001 9.00004" stroke={color} strokeWidth="2" />
          <Path d="M19.9999 9.00004L18.414 10.5859C17.633 11.367 17.633 12.6333 18.414 13.4143L19.9999 15.0002" stroke={color} strokeWidth="2" />
          <Path d="M4.00009 15.0002L5.58596 13.4143C6.36701 12.6333 6.36701 11.367 5.58596 10.5859L4.00009 9.00004" stroke={color} strokeWidth="2" />
          <Path d="M9.99991 9.00004L8.41404 10.5859C7.63299 11.367 7.63299 12.6333 8.41404 13.4143L9.99991 15.0002" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'duotone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M14.0001 15.0002L15.586 13.4143C16.367 12.6333 16.367 11.367 15.586 10.5859L14.0001 9.00004" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M19.9999 9.00004L18.414 10.5859C17.633 11.367 17.633 12.6333 18.414 13.4143L19.9999 15.0002" stroke={"#0CC1AF"} strokeWidth="2" />
          <Path d="M4.00009 15.0002L5.58596 13.4143C6.36701 12.6333 6.36701 11.367 5.58596 10.5859L4.00009 9.00004" stroke={color} strokeWidth="2" />
          <Path d="M9.99991 9.00004L8.41404 10.5859C7.63299 11.367 7.63299 12.6333 8.41404 13.4143L9.99991 15.0002" stroke={color} strokeWidth="2" />
        </Svg>
      );
    case 'solid':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M14.7072 8.29293L16.2931 9.8788C17.4646 11.0504 17.4646 12.9499 16.2931 14.1214L14.7072 15.7073L13.293 14.2931L14.8789 12.7072C15.2694 12.3167 15.2694 11.6835 14.8789 11.293L13.293 9.70714L14.7072 8.29293Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
          <Path d="M19.2928 15.7073L17.7069 14.1214C16.5354 12.9499 16.5354 11.0504 17.7069 9.8788L19.2928 8.29293L20.707 9.70714L19.1211 11.293C18.7306 11.6835 18.7306 12.3167 19.1211 12.7072L20.707 14.2931L19.2928 15.7073Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
          <Path d="M4.70719 8.29293L6.29307 9.8788C7.46464 11.0504 7.46464 12.9499 6.29307 14.1214L4.70719 15.7073L3.29298 14.2931L4.87885 12.7072C5.26938 12.3167 5.26938 11.6835 4.87885 11.293L3.29298 9.70714L4.70719 8.29293Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
          <Path d="M9.29281 15.7073L7.70693 14.1214C6.53536 12.9499 6.53536 11.0504 7.70693 9.8788L9.29281 8.29293L10.707 9.70714L9.12115 11.293C8.73062 11.6835 8.73062 12.3167 9.12115 12.7072L10.707 14.2931L9.29281 15.7073Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M14.0001 15.0002L15.586 13.4143C16.367 12.6333 16.367 11.367 15.586 10.5859L14.0001 9.00004" stroke={color} strokeWidth="2" />
          <Path d="M19.9999 9.00004L18.414 10.5859C17.633 11.367 17.633 12.6333 18.414 13.4143L19.9999 15.0002" stroke={color} strokeWidth="2" />
          <Path d="M4.00009 15.0002L5.58596 13.4143C6.36701 12.6333 6.36701 11.367 5.58596 10.5859L4.00009 9.00004" stroke={color} strokeWidth="2" />
          <Path d="M9.99991 9.00004L8.41404 10.5859C7.63299 11.367 7.63299 12.6333 8.41404 13.4143L9.99991 15.0002" stroke={color} strokeWidth="2" />
        </Svg>
      );
  }
}
