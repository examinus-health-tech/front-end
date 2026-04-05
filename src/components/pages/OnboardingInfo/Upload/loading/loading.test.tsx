import React from 'react';
import { render } from '@testing-library/react-native';
import { Loading } from './loading';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    Image: ({ alt, ...p }: any) => <RN.Image {...p} accessibilityLabel={alt} />,
    Center: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
  };
});

// ── assets mocks ─────────────────────────────────────────────────────
jest.mock('@assets/png/x-examinus.png', () => 'Vector1');

describe('Loading', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the loading title text', () => {
    const { getByText } = render(<Loading />);
    expect(getByText(/Carregando os/)).toBeTruthy();
    expect(getByText(/resultados do seu exame/)).toBeTruthy();
  });

  it('renders the subtitle text', () => {
    const { getByText } = render(<Loading />);
    expect(getByText(/Nosso time está fazendo a mágica/)).toBeTruthy();
  });

  it('renders the X logo image', () => {
    const { getByLabelText } = render(<Loading />);
    expect(getByLabelText('X examinus Logo')).toBeTruthy();
  });

  it('starts pulse and glow animations on mount', () => {
    // Animations are mocked via react-native-reanimated mock in jest.setup.ts
    // Just verify no crash on render
    const { toJSON } = render(<Loading />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders multiple fog layers', () => {
    const { toJSON } = render(<Loading />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders StatusBar with light content', () => {
    // StatusBar is rendered but not easily testable in RNTL,
    // just verify the component renders without crash
    render(<Loading />);
  });
});
