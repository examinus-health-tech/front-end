import { Svg, Path, Rect } from 'react-native-svg';
import { IconProps } from '../icon.type';

export default function WarningIcon({
  size = '24',
  color = '#BEC5D2',
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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.4616 4.98413C13.9209 2.32299 10.0789 2.323 8.5382 4.98414L2.74154 14.9966C1.19768 17.6632 3.12193 21.0007 6.20325 21.0007H17.7966C20.8779 21.0007 22.8021 17.6632 21.2583 14.9965L15.4616 4.98413ZM10.9999 15.5007C10.9999 15.2246 11.2237 15.0007 11.4999 15.0007H12.4999C12.776 15.0007 12.9999 15.2246 12.9999 15.5007V16.5007C12.9999 16.7768 12.776 17.0007 12.4999 17.0007H11.4999C11.2237 17.0007 10.9999 16.7768 10.9999 16.5007V15.5007ZM10.9999 8.00069V14.0007H12.9999V8.00069H10.9999Z"
        fill={color}
      />
    </Svg>
  );
}
