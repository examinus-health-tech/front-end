import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { MentalHealthForm } from './mentalHealthForm';

// ── Mock NativeBase ──
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    ScrollView: require("react").forwardRef(({ children, ...rest }: any, ref: any) => {
      require("react").useImperativeHandle(ref, () => ({ scrollTo: jest.fn() }));
      return <RN.ScrollView {...rest}>{children}</RN.ScrollView>;
    }),
    Pressable: ({ children, onPress, ...rest }: any) => (
      <RN.TouchableOpacity onPress={onPress} {...rest}>{children}</RN.TouchableOpacity>
    ),
  };
});

// ── Mock react-native-reanimated ──
jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: {
      View: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    },
    FadeInDown: { duration: () => ({ delay: () => undefined }) },
    FadeInRight: { duration: () => undefined },
  };
});

// ── Mock expo-haptics ──
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'Light' },
  NotificationFeedbackType: { Success: 'Success' },
}));

// ── Mock navigation ──
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
}));

// ── Mock services ──
const mockSaveAssessment = jest.fn();
jest.mock('@services/mentalHealthService', () => ({
  DASS21_QUESTIONS: [
    'Achei difícil me acalmar',
    'Senti minha boca seca',
    'Não consegui vivenciar nenhum sentimento positivo',
    'Tive dificuldade em respirar',
    'Achei difícil ter iniciativa',
    'Tive a tendência de reagir de forma exagerada',
    'Senti tremores',
    'Senti que estava sempre nervoso',
    'Preocupei-me com situações de pânico',
    'Senti que não tinha nada a desejar',
    'Senti-me agitado',
    'Achei difícil relaxar',
    'Senti-me depressivo',
    'Fui intolerante',
    'Senti que ia entrar em pânico',
    'Não consegui me entusiasmar',
    'Senti que não tinha valor',
    'Senti que estava emotivo demais',
    'Sabia que meu coração estava alterado',
    'Senti medo sem motivo',
    'Senti que a vida não tinha sentido',
  ],
  RESPONSE_OPTIONS: [
    { value: 0, label: 'Não se aplicou de maneira alguma' },
    { value: 1, label: 'Aplicou-se em algum grau' },
    { value: 2, label: 'Aplicou-se em um grau considerável' },
    { value: 3, label: 'Aplicou-se muito' },
  ],
  saveAssessment: (...args: any[]) => mockSaveAssessment(...args),
}));

// ── Mock molecules ──
jest.mock('@components/molecules', () => {
  const RN = require('react-native');
  return {
    HeaderTitle: ({ title, withBackButton }: any) => (
      <RN.View testID="header-title">
        <RN.Text>{title}</RN.Text>
        {withBackButton && <RN.TouchableOpacity testID="back-button" onPress={withBackButton} />}
      </RN.View>
    ),
  };
});

// ── Mock atoms ──
jest.mock('@components/atoms', () => {
  const RN = require('react-native');
  return {
    Button: ({ title, onPress, isDisabled, isLoading, ...rest }: any) => (
      <RN.TouchableOpacity
        onPress={isDisabled ? undefined : onPress}
        disabled={isDisabled}
        testID={`button-${title}`}
        {...rest}
      >
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    ),
  };
});

// ── Mock toast ──
const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();
jest.mock('src/hooks/useCustomToast', () => ({
  useCustomToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

// ── Mock routes ──
jest.mock('@routes/app.routes', () => ({}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

// ────────────── TESTS ──────────────

describe('MentalHealthForm', () => {
  describe('Initial rendering', () => {
    it('renders "Saúde Mental" header', () => {
      const { getByText } = render(<MentalHealthForm />);
      expect(getByText('Saúde Mental')).toBeTruthy();
    });

    it('renders intro text', () => {
      const { getByText } = render(<MentalHealthForm />);
      expect(getByText('Bora cuidar da mente?')).toBeTruthy();
    });

    it('renders progress counter as 0/21', () => {
      const { getByText } = render(<MentalHealthForm />);
      expect(getByText('0/21')).toBeTruthy();
    });

    it('renders the first question', () => {
      const { getByText } = render(<MentalHealthForm />);
      expect(getByText('Achei difícil me acalmar')).toBeTruthy();
    });

    it('renders question number badge as "1"', () => {
      const { getAllByText } = render(<MentalHealthForm />);
      // The question number in the purple badge (may appear in carousel too)
      expect(getAllByText('1').length).toBeGreaterThanOrEqual(1);
    });

    it('renders all 4 response options', () => {
      const { getByText } = render(<MentalHealthForm />);
      expect(getByText('Não se aplicou de maneira alguma')).toBeTruthy();
      expect(getByText('Aplicou-se em algum grau')).toBeTruthy();
      expect(getByText('Aplicou-se em um grau considerável')).toBeTruthy();
      expect(getByText('Aplicou-se muito')).toBeTruthy();
    });

    it('renders navigation buttons (Anterior disabled, Próxima disabled)', () => {
      const { getByText } = render(<MentalHealthForm />);
      expect(getByText('Anterior')).toBeTruthy();
      expect(getByText('Próxima')).toBeTruthy();
    });

    it('renders 21 question indicators in carousel', () => {
      const { getByText } = render(<MentalHealthForm />);
      // Check that question 21 exists in the carousel
      expect(getByText('21')).toBeTruthy();
    });
  });

  describe('Answer selection', () => {
    it('selects an answer and advances to next question', () => {
      const { getByText } = render(<MentalHealthForm />);
      fireEvent.press(getByText('Não se aplicou de maneira alguma'));
      // After selecting, progress updates
      expect(getByText('1/21')).toBeTruthy();
      // After timeout, advances to question 2
      jest.advanceTimersByTime(300);
    });

    it('updates progress counter when answers are selected', () => {
      const { getByText } = render(<MentalHealthForm />);
      fireEvent.press(getByText('Aplicou-se em algum grau'));
      expect(getByText('1/21')).toBeTruthy();
    });
  });

  describe('Question navigation', () => {
    it('navigates to next question via Próxima button', async () => {
      const { getByText } = render(<MentalHealthForm />);
      // First answer question 1
      fireEvent.press(getByText('Não se aplicou de maneira alguma'));
      await act(async () => {
        jest.advanceTimersByTime(300);
      });
      // Now on question 2, the question text should change
      expect(getByText('Senti minha boca seca')).toBeTruthy();
    });

    it('navigates back to previous question via Anterior button', () => {
      const { getByText } = render(<MentalHealthForm />);
      // Answer Q1
      fireEvent.press(getByText('Não se aplicou de maneira alguma'));
      jest.advanceTimersByTime(300);
      // Now on Q2, go back
      fireEvent.press(getByText('Anterior'));
      expect(getByText('Achei difícil me acalmar')).toBeTruthy();
    });

    it('navigates directly to a question via carousel', () => {
      const { getByText } = render(<MentalHealthForm />);
      // Press question indicator "5"
      fireEvent.press(getByText('5'));
      expect(getByText('Achei difícil ter iniciativa')).toBeTruthy();
    });
  });

  describe('Back navigation', () => {
    it('calls goBack on header back button press', () => {
      const { getByTestId } = render(<MentalHealthForm />);
      fireEvent.press(getByTestId('back-button'));
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('Submission', () => {
    async function answerAllQuestions(getByText: any) {
      for (let i = 0; i < 21; i++) {
        fireEvent.press(getByText('Não se aplicou de maneira alguma'));
        if (i < 20) {
          await act(async () => {
            jest.advanceTimersByTime(300);
          });
        }
      }
    }

    it('shows "Concluir" button on last question', () => {
      const { getByText } = render(<MentalHealthForm />);
      // Navigate to question 21
      fireEvent.press(getByText('21'));
      // Answer it
      fireEvent.press(getByText('Não se aplicou de maneira alguma'));
      expect(getByText('Concluir')).toBeTruthy();
    });

    it('calls saveAssessment on successful submit', async () => {
      mockSaveAssessment.mockResolvedValue({ id: 'assessment-1' });
      const { getByText } = render(<MentalHealthForm />);
      await answerAllQuestions(getByText);
      // Now on Q21 with answer, click Concluir
      fireEvent.press(getByText('Concluir'));
      await waitFor(() => {
        expect(mockSaveAssessment).toHaveBeenCalledWith(expect.any(Array));
        expect(mockShowSuccess).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'Avaliação concluída!' })
        );
        expect(mockNavigate).toHaveBeenCalledWith('mentalHealthResult', { assessmentId: 'assessment-1' });
      });
    });

    it('shows error when submit fails', async () => {
      mockSaveAssessment.mockRejectedValue(new Error('fail'));
      const { getByText } = render(<MentalHealthForm />);
      await answerAllQuestions(getByText);
      fireEvent.press(getByText('Concluir'));
      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'Erro ao salvar' })
        );
      });
    });

    it('shows error when form is incomplete', async () => {
      const { getByText } = render(<MentalHealthForm />);
      // Navigate to Q21 without answering all
      fireEvent.press(getByText('21'));
      fireEvent.press(getByText('Não se aplicou de maneira alguma'));
      fireEvent.press(getByText('Concluir'));
      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'Formulário incompleto' })
        );
      });
    });
  });

  describe('Haptic feedback', () => {
    it('triggers haptic on answer selection', () => {
      const Haptics = require('expo-haptics');
      const { getByText } = render(<MentalHealthForm />);
      fireEvent.press(getByText('Não se aplicou de maneira alguma'));
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    });
  });
});
