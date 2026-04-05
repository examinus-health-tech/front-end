import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Header } from './header';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
  };
});

jest.mock('@assets/icons', () => ({
  ChevronLeftIcon: (props: any) => {
    const RN = require('react-native');
    return <RN.View testID="chevron-left-icon" {...props} />;
  },
  MoreIcon: (props: any) => {
    const RN = require('react-native');
    return <RN.View testID="more-icon" {...props} />;
  },
}));

describe('Header (Tracker)', () => {
  const mockBackTo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title text', () => {
    const { getByText } = render(<Header title="Test Title" backTo={mockBackTo} />);
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('renders the back button icon', () => {
    const { getByTestId } = render(<Header title="Test" backTo={mockBackTo} />);
    expect(getByTestId('chevron-left-icon')).toBeTruthy();
  });

  it('renders the more icon', () => {
    const { getByTestId } = render(<Header title="Test" backTo={mockBackTo} />);
    expect(getByTestId('more-icon')).toBeTruthy();
  });

  it('calls backTo when back button is pressed', () => {
    const { getByTestId } = render(<Header title="Test" backTo={mockBackTo} />);
    fireEvent.press(getByTestId('chevron-left-icon'));
    expect(mockBackTo).toHaveBeenCalledTimes(1);
  });

  it('renders with different titles', () => {
    const titles = ['Passos', 'Calorias', 'Sono', 'Hidratação', 'Peso'];
    titles.forEach((title) => {
      const { getByText } = render(<Header title={title} backTo={mockBackTo} />);
      expect(getByText(title)).toBeTruthy();
    });
  });
});
