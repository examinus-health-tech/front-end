import React from 'react';
import { render } from '@testing-library/react-native';
import { Loading } from './loading';

// Mock native-base
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    Image: (props: any) => <RN.Image {...props} />,
    Center: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
  };
});

// Mock assets
jest.mock('@assets/png/x-examinus.png', () => 'mock-x-examinus');

describe('Loading', () => {
  it('renders loading text', () => {
    const { getByText } = render(<Loading />);
    expect(getByText(/Carregando os/)).toBeTruthy();
    expect(getByText(/resultados do seu exame/)).toBeTruthy();
  });

  it('renders secondary description text', () => {
    const { getByText } = render(<Loading />);
    expect(getByText(/Nosso time está fazendo a mágica/)).toBeTruthy();
    expect(getByText(/acontecer para desvendar sua saúde!/)).toBeTruthy();
  });

  it('renders the component tree', () => {
    const { toJSON } = render(<Loading />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders without crashing on mount/unmount', () => {
    const { unmount } = render(<Loading />);
    unmount();
  });

  it('renders the component structure', () => {
    const { UNSAFE_root } = render(<Loading />);
    expect(UNSAFE_root).toBeTruthy();
  });
});
