import React from 'react';
import { render } from '@testing-library/react-native';
import { WorkingInProgress } from './workingInProgress';

// ── NativeBase mock ──
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...props }: any) => <RN.View {...props}>{children}</RN.View>,
    Image: ({ alt, ...props }: any) => <RN.View testID="image-vector" {...props} />,
    Text: ({ children, ...props }: any) => <RN.Text {...props}>{children}</RN.Text>,
  };
});

// ── PNG mock ──
jest.mock('@assets/png/vector-36.png', () => 'mocked-vector');

describe('WorkingInProgress', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<WorkingInProgress />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the main heading text', () => {
    const { getByText } = render(<WorkingInProgress />);
    expect(
      getByText(/Essa funcionalidade/)
    ).toBeTruthy();
  });

  it('renders the "em desenvolvimento" text', () => {
    const { getByText } = render(<WorkingInProgress />);
    expect(
      getByText(/está em desenvolvimento/)
    ).toBeTruthy();
  });

  it('renders the coming soon text', () => {
    const { getByText } = render(<WorkingInProgress />);
    expect(getByText(/Novidades em breve!/)).toBeTruthy();
  });

  it('renders the vector image', () => {
    const { getByTestId } = render(<WorkingInProgress />);
    expect(getByTestId('image-vector')).toBeTruthy();
  });
});
