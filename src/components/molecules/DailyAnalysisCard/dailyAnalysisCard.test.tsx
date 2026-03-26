import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { DailyAnalysisCard } from './dailyAnalysisCard';

const mockGetDailyAnalysis = jest.fn();
const mockClearAnalysisCache = jest.fn();

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: (props: any) => require("react").createElement(RN.View, props),
    Text: (props: any) => require("react").createElement(RN.Text, props),
    VStack: (props: any) => require("react").createElement(RN.View, props),
    HStack: (props: any) => require("react").createElement(RN.View, props),
    Pressable: (props: any) => require("react").createElement(RN.TouchableOpacity, props),
    Skeleton: Object.assign(
      (props: any) => require("react").createElement(RN.View, { ...props, testID: 'skeleton' }),
      { Text: (props: any) => require("react").createElement(RN.View, { ...props, testID: 'skeleton-text' }) }
    ),
  };
});

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: (props: any) => require('react').createElement(require('react-native').View, props),
}));

jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: {
      View: (props: any) => require("react").createElement(RN.View, props),
    },
    FadeIn: { duration: () => ({}) },
  };
});

jest.mock('@assets/icons', () => ({
  AnalyticsIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'analytics-icon' }),
  LightBulbIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'lightbulb-icon' }),
  RotateRightIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'rotate-icon' }),
}));

jest.mock('src/services/dailyAnalysisService', () => ({
  getDailyAnalysis: (...args: any[]) => mockGetDailyAnalysis(...args),
  clearAnalysisCache: (...args: any[]) => mockClearAnalysisCache(...args),
}));

const mockFitnessData = {
  steps: 8000,
  calories: 1500,
  water: 6,
  sleep: 7,
};

const mockAnalysis = {
  analysis: 'Hoje foi um bom dia de atividades!',
  mood: 'good' as const,
  tips: ['Beba mais agua', 'Durma mais cedo'],
};

jest.setTimeout(15000);

describe('DailyAnalysisCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockGetDailyAnalysis.mockReturnValue(new Promise(() => {})); // never resolves
    const { getAllByTestId } = render(
      <DailyAnalysisCard fitnessData={mockFitnessData} />
    );
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0);
  });

  it('renders analysis after loading', async () => {
    mockGetDailyAnalysis.mockResolvedValue(mockAnalysis);
    const { getByText } = render(
      <DailyAnalysisCard fitnessData={mockFitnessData} />
    );
    await waitFor(() => {
      expect(getByText('Hoje foi um bom dia de atividades!')).toBeTruthy();
    });
  });

  it('renders header text', async () => {
    mockGetDailyAnalysis.mockResolvedValue(mockAnalysis);
    const { getByText } = render(
      <DailyAnalysisCard fitnessData={mockFitnessData} />
    );
    await waitFor(() => {
      expect(getByText('Análise do Dia')).toBeTruthy();
    });
  });

  it('returns null when analysis is null after loading', async () => {
    mockGetDailyAnalysis.mockResolvedValue(null);
    const { toJSON } = render(
      <DailyAnalysisCard fitnessData={mockFitnessData} />
    );
    await waitFor(() => {
      expect(toJSON()).toBeNull();
    });
  });

  it('handles API error gracefully', async () => {
    mockGetDailyAnalysis.mockRejectedValue(new Error('API Error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { toJSON } = render(
      <DailyAnalysisCard fitnessData={mockFitnessData} />
    );
    await waitFor(() => {
      expect(toJSON()).toBeNull();
    });
    consoleSpy.mockRestore();
  });

  it('shows tips toggle button when tips exist', async () => {
    mockGetDailyAnalysis.mockResolvedValue(mockAnalysis);
    const { getByText } = render(
      <DailyAnalysisCard fitnessData={mockFitnessData} />
    );
    await waitFor(() => {
      expect(getByText('Ver 2 dicas')).toBeTruthy();
    });
  });

  it('shows single tip text for 1 tip', async () => {
    mockGetDailyAnalysis.mockResolvedValue({
      ...mockAnalysis,
      tips: ['Apenas uma dica'],
    });
    const { getByText } = render(
      <DailyAnalysisCard fitnessData={mockFitnessData} />
    );
    await waitFor(() => {
      expect(getByText('Ver 1 dica')).toBeTruthy();
    });
  });

  it('toggles tips visibility on press', async () => {
    mockGetDailyAnalysis.mockResolvedValue(mockAnalysis);
    const { getByText } = render(
      <DailyAnalysisCard fitnessData={mockFitnessData} />
    );
    await waitFor(() => {
      expect(getByText('Ver 2 dicas')).toBeTruthy();
    });
    fireEvent.press(getByText('Ver 2 dicas'));
    await waitFor(() => {
      expect(getByText('Ocultar dicas')).toBeTruthy();
      expect(getByText('Beba mais agua')).toBeTruthy();
      expect(getByText('Durma mais cedo')).toBeTruthy();
    });
  });

  it('hides tips when toggled off', async () => {
    mockGetDailyAnalysis.mockResolvedValue(mockAnalysis);
    const { getByText, queryByText } = render(
      <DailyAnalysisCard fitnessData={mockFitnessData} />
    );
    await waitFor(() => {
      expect(getByText('Ver 2 dicas')).toBeTruthy();
    });
    // Open tips
    fireEvent.press(getByText('Ver 2 dicas'));
    await waitFor(() => {
      expect(getByText('Ocultar dicas')).toBeTruthy();
    });
    // Close tips
    fireEvent.press(getByText('Ocultar dicas'));
    await waitFor(() => {
      expect(queryByText('Beba mais agua')).toBeNull();
    });
  });

  it('handles refresh action', async () => {
    mockGetDailyAnalysis.mockResolvedValue(mockAnalysis);
    mockClearAnalysisCache.mockResolvedValue(undefined);
    const onRefresh = jest.fn();
    const { getByTestId } = render(
      <DailyAnalysisCard fitnessData={mockFitnessData} onRefresh={onRefresh} />
    );
    await waitFor(() => {
      expect(getByTestId('rotate-icon')).toBeTruthy();
    });
    // The refresh button wraps rotate-icon, press the parent Pressable
    const refreshButton = getByTestId('rotate-icon').parent;
    if (refreshButton) {
      await act(async () => {
        fireEvent.press(refreshButton);
      });
    }
  });

  it('does not render tips section when tips is empty', async () => {
    mockGetDailyAnalysis.mockResolvedValue({
      ...mockAnalysis,
      tips: [],
    });
    const { queryByText } = render(
      <DailyAnalysisCard fitnessData={mockFitnessData} />
    );
    await waitFor(() => {
      expect(queryByText(/Ver.*dica/)).toBeNull();
    });
  });

  it('does not render tips section when tips is undefined', async () => {
    mockGetDailyAnalysis.mockResolvedValue({
      analysis: 'Some analysis',
      mood: 'excellent',
      tips: undefined,
    });
    const { queryByText } = render(
      <DailyAnalysisCard fitnessData={mockFitnessData} />
    );
    await waitFor(() => {
      expect(queryByText(/Ver.*dica/)).toBeNull();
    });
  });

  it('renders with excellent mood gradient', async () => {
    mockGetDailyAnalysis.mockResolvedValue({
      ...mockAnalysis,
      mood: 'excellent',
    });
    const { getByText } = render(
      <DailyAnalysisCard fitnessData={mockFitnessData} />
    );
    await waitFor(() => {
      expect(getByText('Análise do Dia')).toBeTruthy();
    });
  });

  it('renders with moderate mood gradient', async () => {
    mockGetDailyAnalysis.mockResolvedValue({
      ...mockAnalysis,
      mood: 'moderate',
    });
    const { getByText } = render(
      <DailyAnalysisCard fitnessData={mockFitnessData} />
    );
    await waitFor(() => {
      expect(getByText('Análise do Dia')).toBeTruthy();
    });
  });

  it('renders with needs_attention mood gradient', async () => {
    mockGetDailyAnalysis.mockResolvedValue({
      ...mockAnalysis,
      mood: 'needs_attention',
    });
    const { getByText } = render(
      <DailyAnalysisCard fitnessData={mockFitnessData} />
    );
    await waitFor(() => {
      expect(getByText('Análise do Dia')).toBeTruthy();
    });
  });

  it('renders with default/unknown mood gradient', async () => {
    mockGetDailyAnalysis.mockResolvedValue({
      ...mockAnalysis,
      mood: 'unknown_mood',
    });
    const { getByText } = render(
      <DailyAnalysisCard fitnessData={mockFitnessData} />
    );
    await waitFor(() => {
      expect(getByText('Análise do Dia')).toBeTruthy();
    });
  });
});
