import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SmartSuggestionCard } from './smartSuggestionCard';
import type { GoalSuggestion } from 'src/services/goalCalculatorService';

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: (props: any) => require("react").createElement(RN.View, props),
    Text: (props: any) => require("react").createElement(RN.Text, props),
    HStack: (props: any) => require("react").createElement(RN.View, props),
    VStack: (props: any) => require("react").createElement(RN.View, props),
    ScrollView: require("react").forwardRef((props: any, ref: any) =>
      require("react").createElement(RN.ScrollView, { ...props, ref })
    ),
    Pressable: (props: any) => {
      if (typeof props.children === 'function') {
        return require("react").createElement(
          RN.TouchableOpacity,
          { ...props, children: undefined },
          props.children({ isPressed: false })
        );
      }
      return require("react").createElement(RN.TouchableOpacity, props);
    },
  };
});

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: (props: any) => require('react').createElement(require('react-native').View, props),
}));

jest.mock('@assets/icons', () => ({
  WaterDropFilledIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'water-icon' }),
  FireIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'fire-icon' }),
  StepsIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'steps-icon' }),
  GearIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'gear-icon' }),
  CompassTargetIcon: (props: any) => require('react').createElement(require('react-native').View, { ...props, testID: 'compass-icon' }),
}));

jest.mock('src/services/goalCalculatorService', () => ({}));

const makeSuggestion = (overrides: Partial<GoalSuggestion> = {}): GoalSuggestion => ({
  type: 'hydration',
  icon: 'water',
  suggestedGoal: 2500,
  currentGoal: 2000,
  unit: 'ml',
  reason: 'Voce precisa beber mais agua',
  ...overrides,
});

describe('SmartSuggestionCard', () => {
  const onApply = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when suggestions is empty and showEmptyState is false', () => {
    const { toJSON } = render(
      <SmartSuggestionCard suggestions={[]} onApply={onApply} />
    );
    expect(toJSON()).toBeNull();
  });

  it('returns null when suggestions is undefined and showEmptyState is false', () => {
    const { toJSON } = render(
      <SmartSuggestionCard suggestions={undefined as any} onApply={onApply} />
    );
    expect(toJSON()).toBeNull();
  });

  it('renders empty state when suggestions are empty and showEmptyState is true', () => {
    const { getByText } = render(
      <SmartSuggestionCard suggestions={[]} onApply={onApply} showEmptyState={true} />
    );
    expect(getByText('Metas Otimizadas')).toBeTruthy();
    expect(getByText('Suas metas estão alinhadas com seu perfil')).toBeTruthy();
  });

  it('renders hydration suggestion card', () => {
    const suggestion = makeSuggestion({ type: 'hydration', icon: 'water' });
    const { getByText } = render(
      <SmartSuggestionCard suggestions={[suggestion]} onApply={onApply} />
    );
    expect(getByText('Hidratação')).toBeTruthy();
    expect(getByText('Meta Sugerida')).toBeTruthy();
    expect(getByText('Aplicar Meta')).toBeTruthy();
  });

  it('renders calories suggestion card', () => {
    const suggestion = makeSuggestion({ type: 'calories', icon: 'fire', unit: 'kcal', suggestedGoal: 2200 });
    const { getByText } = render(
      <SmartSuggestionCard suggestions={[suggestion]} onApply={onApply} />
    );
    expect(getByText('Calorias')).toBeTruthy();
  });

  it('renders steps suggestion card', () => {
    const suggestion = makeSuggestion({ type: 'steps', icon: 'steps', unit: 'passos', suggestedGoal: 10000 });
    const { getByText } = render(
      <SmartSuggestionCard suggestions={[suggestion]} onApply={onApply} />
    );
    expect(getByText('Passos')).toBeTruthy();
  });

  it('renders default type label for unknown type', () => {
    const suggestion = makeSuggestion({ type: 'unknown' as any, icon: 'water' });
    const { toJSON } = render(
      <SmartSuggestionCard suggestions={[suggestion]} onApply={onApply} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('formats ml values >= 1000 as liters', () => {
    const suggestion = makeSuggestion({ suggestedGoal: 2500, unit: 'ml' });
    const { getByText } = render(
      <SmartSuggestionCard suggestions={[suggestion]} onApply={onApply} />
    );
    expect(getByText('2.5L')).toBeTruthy();
  });

  it('formats ml values < 1000 normally', () => {
    const suggestion = makeSuggestion({ suggestedGoal: 500, unit: 'ml' });
    const { getByText } = render(
      <SmartSuggestionCard suggestions={[suggestion]} onApply={onApply} />
    );
    expect(getByText('500 ml')).toBeTruthy();
  });

  it('formats non-ml values with locale', () => {
    const suggestion = makeSuggestion({ suggestedGoal: 10000, unit: 'passos' });
    const { toJSON } = render(
      <SmartSuggestionCard suggestions={[suggestion]} onApply={onApply} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders reason text', () => {
    const suggestion = makeSuggestion({ reason: 'Hidratacao e importante' });
    const { getByText } = render(
      <SmartSuggestionCard suggestions={[suggestion]} onApply={onApply} />
    );
    expect(getByText('Hidratacao e importante')).toBeTruthy();
  });

  it('calls onApply when "Aplicar Meta" is pressed', () => {
    const suggestion = makeSuggestion();
    const { getByText } = render(
      <SmartSuggestionCard suggestions={[suggestion]} onApply={onApply} />
    );
    fireEvent.press(getByText('Aplicar Meta'));
    expect(onApply).toHaveBeenCalledWith(suggestion);
  });

  it('renders configure button when onConfigure is provided', () => {
    const onConfigure = jest.fn();
    const suggestion = makeSuggestion();
    const { getByText } = render(
      <SmartSuggestionCard
        suggestions={[suggestion]}
        onApply={onApply}
        onConfigure={onConfigure}
      />
    );
    expect(getByText(/Configurar/)).toBeTruthy();
  });

  it('calls onConfigure when configure button is pressed', () => {
    const onConfigure = jest.fn();
    const suggestion = makeSuggestion();
    const { getByText } = render(
      <SmartSuggestionCard
        suggestions={[suggestion]}
        onApply={onApply}
        onConfigure={onConfigure}
      />
    );
    fireEvent.press(getByText(/Configurar/));
    expect(onConfigure).toHaveBeenCalledTimes(1);
  });

  it('does not render configure button when onConfigure is not provided', () => {
    const suggestion = makeSuggestion();
    const { queryByText, queryByTestId } = render(
      <SmartSuggestionCard suggestions={[suggestion]} onApply={onApply} />
    );
    expect(queryByText(/Configurar/)).toBeNull();
    expect(queryByTestId('gear-icon')).toBeNull();
  });

  it('renders multiple suggestion cards', () => {
    const suggestions = [
      makeSuggestion({ type: 'hydration', icon: 'water' }),
      makeSuggestion({ type: 'calories', icon: 'fire' }),
      makeSuggestion({ type: 'steps', icon: 'steps' }),
    ];
    const { getAllByText } = render(
      <SmartSuggestionCard suggestions={suggestions} onApply={onApply} />
    );
    expect(getAllByText('Aplicar Meta').length).toBe(3);
  });

  it('renders default icon for unknown icon type', () => {
    const suggestion = makeSuggestion({ icon: 'unknown' as any });
    const { toJSON } = render(
      <SmartSuggestionCard suggestions={[suggestion]} onApply={onApply} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('gets correct gradient colors for hydration', () => {
    const suggestion = makeSuggestion({ type: 'hydration' });
    const { toJSON } = render(
      <SmartSuggestionCard suggestions={[suggestion]} onApply={onApply} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('gets correct gradient colors for calories', () => {
    const suggestion = makeSuggestion({ type: 'calories' });
    const { toJSON } = render(
      <SmartSuggestionCard suggestions={[suggestion]} onApply={onApply} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('gets correct gradient colors for steps', () => {
    const suggestion = makeSuggestion({ type: 'steps' });
    const { toJSON } = render(
      <SmartSuggestionCard suggestions={[suggestion]} onApply={onApply} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('gets default gradient for unknown type', () => {
    const suggestion = makeSuggestion({ type: 'unknown' as any });
    const { toJSON } = render(
      <SmartSuggestionCard suggestions={[suggestion]} onApply={onApply} />
    );
    expect(toJSON()).toBeTruthy();
  });
});
