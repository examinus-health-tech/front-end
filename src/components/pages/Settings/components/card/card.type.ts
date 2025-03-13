export type Props = {
  text: string;
  icon: JSX.Element;
  type?: 'switch' | 'warning';
  goTo?: () => void;
};
