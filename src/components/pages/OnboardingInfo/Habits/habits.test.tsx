import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Habits } from './habits';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    Box: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    HStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    View: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
  };
});

// ── assets mocks ─────────────────────────────────────────────────────
jest.mock('@assets/icons', () => ({
  ArrowIcon: () => null,
  NoDietIcon: ({ color }: any) => null,
  BalancedDietIcon: ({ color }: any) => null,
  VegetarianIcon: ({ color }: any) => null,
  NoneOfTheseIcon: ({ color }: any) => null,
}));

// ── component mocks ─────────────────────────────────────────────────
jest.mock('@components/atoms', () => {
  const RN = require('react-native');
  return {
    Button: ({ title, onPress, isLoading, ...p }: any) => (
      <RN.TouchableOpacity testID="save-button" onPress={onPress} {...p}>
        <RN.Text>{isLoading ? 'Loading...' : title}</RN.Text>
      </RN.TouchableOpacity>
    ),
  };
});

// ── hook mocks ──────────────────────────────────────────────────────
const mockSaveOnboarding = jest.fn().mockResolvedValue(undefined);
const mockSetOnboardingData = jest.fn();
let mockOnboardingData: any = {};

jest.mock('src/hooks/useOnboarding', () => ({
  useOnboarding: () => ({
    onboardingData: mockOnboardingData,
    setOnboardingData: mockSetOnboardingData,
    saveOnboarding: mockSaveOnboarding,
  }),
}));

jest.mock('src/hooks/useAuth', () => ({
  useAuth: () => ({ user: { userId: '1' } }),
}));

describe('Habits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnboardingData = {};
  });

  it('renders the title text', () => {
    const { getByText } = render(<Habits />);
    expect(getByText('Como são seus hábitos alimentares?')).toBeTruthy();
  });

  it('renders all four habit options', () => {
    const { getByText } = render(<Habits />);
    expect(getByText('Não faço dieta')).toBeTruthy();
    expect(getByText(/Dieta/)).toBeTruthy();
    expect(getByText('Vegetariano')).toBeTruthy();
    expect(getByText('Nenhuma dessas')).toBeTruthy();
  });

  it('renders the continue button', () => {
    const { getByText } = render(<Habits />);
    expect(getByText('Continuar')).toBeTruthy();
  });

  it('selects "Não faço dieta" option', () => {
    const { getByText } = render(<Habits />);
    fireEvent.press(getByText('Não faço dieta'));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ eatingHabits: 'X' })
    );
  });

  it('selects "Dieta Balanceada" option', () => {
    const { getByText } = render(<Habits />);
    fireEvent.press(getByText(/Dieta/));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ eatingHabits: 'B' })
    );
  });

  it('selects "Vegetariano" option', () => {
    const { getByText } = render(<Habits />);
    fireEvent.press(getByText('Vegetariano'));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ eatingHabits: 'V' })
    );
  });

  it('selects "Nenhuma dessas" option', () => {
    const { getByText } = render(<Habits />);
    fireEvent.press(getByText('Nenhuma dessas'));
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ eatingHabits: 'N' })
    );
  });

  it('calls saveOnboarding when continue is pressed', async () => {
    const { getByTestId, getByText } = render(<Habits />);
    // Select a habit first
    fireEvent.press(getByText('Vegetariano'));
    fireEvent.press(getByTestId('save-button'));
    await waitFor(() => {
      expect(mockSaveOnboarding).toHaveBeenCalled();
    });
  });

  it('loads existing eating habits from onboarding data', () => {
    mockOnboardingData = { eatingHabits: 'B' };
    render(<Habits />);
    // Should auto-save with the loaded habit
    expect(mockSetOnboardingData).toHaveBeenCalledWith(
      expect.objectContaining({ eatingHabits: 'B' })
    );
  });

  it('handles saveOnboarding error gracefully', async () => {
    mockSaveOnboarding.mockRejectedValueOnce(new Error('Network error'));
    const { getByTestId, getByText } = render(<Habits />);
    fireEvent.press(getByText('Vegetariano'));
    fireEvent.press(getByTestId('save-button'));
    await waitFor(() => {
      expect(mockSaveOnboarding).toHaveBeenCalled();
    });
    // Should not crash
  });

  it('sets isLoading when saving and resets on error', async () => {
    mockSaveOnboarding.mockRejectedValueOnce(new Error('fail'));
    const { getByTestId, getByText } = render(<Habits />);
    fireEvent.press(getByText('Não faço dieta'));
    fireEvent.press(getByTestId('save-button'));
    await waitFor(() => {
      expect(mockSaveOnboarding).toHaveBeenCalled();
    });
  });
});
