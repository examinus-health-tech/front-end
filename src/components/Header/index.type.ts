import { IButtonProps } from 'native-base';

export type Props = IButtonProps & {
  progressValue: number;
  withBackButton?: boolean;
  jumpTo?: () => void;
};
