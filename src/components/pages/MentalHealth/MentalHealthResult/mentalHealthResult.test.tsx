import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { MentalHealthResult } from './mentalHealthResult';

// ── Mock NativeBase ──
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    ScrollView: ({ children, ...rest }: any) => <RN.ScrollView {...rest}>{children}</RN.ScrollView>,
    Badge: ({ children, ...rest }: any) => (
      <RN.View {...rest}><RN.Text>{children}</RN.Text></RN.View>
    ),
    Divider: (props: any) => <RN.View {...props} />,
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
  };
});

// ── Mock navigation ──
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
let mockRouteParams: any = {};
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
  useRoute: () => ({ params: mockRouteParams }),
}));

// ── Mock mental health service ──
const mockGetAssessments = jest.fn();
jest.mock('@services/mentalHealthService', () => ({
  getAssessments: (...args: any[]) => mockGetAssessments(...args),
  getColorByClassification: (classification: string) => {
    const map: any = {
      normal: { color: '#0CC1AF', bgColor: 'green.50', label: 'Normal' },
      leve: { color: '#F59E0B', bgColor: 'yellow.50', label: 'Leve' },
      moderado: { color: '#F97316', bgColor: 'orange.50', label: 'Moderado' },
      grave: { color: '#EF4444', bgColor: 'red.50', label: 'Grave' },
      extremamente_grave: { color: '#DC2626', bgColor: 'red.100', label: 'Extremamente Grave' },
    };
    return map[classification] || { color: '#6B7280', bgColor: 'gray.50', label: 'Desconhecido' };
  },
  formatAssessmentDate: (dateString: string) => '20 de mar. de 2025',
  ClassificationLevel: {},
}));

// ── Mock icons ──
jest.mock('@assets/icons', () => {
  const RN = require('react-native');
  return {
    HeadHealthIcon: (props: any) => <RN.View testID="head-health-icon" {...props} />,
    HeartIcon: (props: any) => <RN.View testID="heart-icon" {...props} />,
    EnergyIcon: (props: any) => <RN.View testID="energy-icon" {...props} />,
    WarningIcon: (props: any) => <RN.View testID="warning-icon" {...props} />,
    LightBulbIcon: (props: any) => <RN.View testID="light-bulb-icon" {...props} />,
  };
});

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
    Button: ({ title, onPress, ...rest }: any) => (
      <RN.TouchableOpacity onPress={onPress} testID={`button-${title}`} {...rest}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    ),
  };
});

// ── Mock routes ──
jest.mock('@routes/app.routes', () => ({}));

// ── Spy on Linking ──
jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as any);

beforeEach(() => {
  jest.clearAllMocks();
  mockRouteParams = {};
});

// ────────────── TESTS ──────────────

describe('MentalHealthResult', () => {
  const normalAssessment = {
    id: 'assessment-1',
    date: '2025-03-20T10:00:00.000Z',
    answers: new Array(21).fill(0),
    scores: { depression: 0, anxiety: 0, stress: 0 },
    classifications: { depression: 'normal', anxiety: 'normal', stress: 'normal' },
  };

  const severeAssessment = {
    id: 'assessment-2',
    date: '2025-03-20T10:00:00.000Z',
    answers: new Array(21).fill(3),
    scores: { depression: 42, anxiety: 42, stress: 42 },
    classifications: { depression: 'grave', anxiety: 'extremamente_grave', stress: 'grave' },
  };

  const mildAssessment = {
    id: 'assessment-3',
    date: '2025-03-20T10:00:00.000Z',
    answers: new Array(21).fill(1),
    scores: { depression: 10, anxiety: 8, stress: 16 },
    classifications: { depression: 'leve', anxiety: 'leve', stress: 'leve' },
  };

  const moderateAssessment = {
    id: 'assessment-4',
    date: '2025-03-20T10:00:00.000Z',
    answers: new Array(21).fill(2),
    scores: { depression: 18, anxiety: 12, stress: 22 },
    classifications: { depression: 'moderado', anxiety: 'moderado', stress: 'moderado' },
  };

  describe('Loading state', () => {
    it('renders loading text initially', () => {
      mockGetAssessments.mockImplementation(() => new Promise(() => {}));
      const { getByText } = render(<MentalHealthResult />);
      expect(getByText('Carregando...')).toBeTruthy();
    });
  });

  describe('No assessment state', () => {
    it('renders "Nenhuma avaliação encontrada" when no assessments', async () => {
      mockGetAssessments.mockResolvedValue([]);
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByText('Nenhuma avaliação encontrada.')).toBeTruthy();
      });
    });

    it('renders "Fazer Avaliação" button when no assessments', async () => {
      mockGetAssessments.mockResolvedValue([]);
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByText('Fazer Avaliação')).toBeTruthy();
      });
    });

    it('navigates to mentalHealthForm on "Fazer Avaliação" press', async () => {
      mockGetAssessments.mockResolvedValue([]);
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        fireEvent.press(getByText('Fazer Avaliação'));
        expect(mockNavigate).toHaveBeenCalledWith('mentalHealthForm');
      });
    });
  });

  describe('With normal assessment', () => {
    beforeEach(() => {
      mockGetAssessments.mockResolvedValue([normalAssessment]);
      mockRouteParams = { assessmentId: 'assessment-1' };
    });

    it('renders "Saúde Mental" header', async () => {
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByText('Saúde Mental')).toBeTruthy();
      });
    });

    it('renders "Resultado DASS-21" subtitle', async () => {
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByText('Resultado DASS-21')).toBeTruthy();
      });
    });

    it('renders assessment date', async () => {
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByText(/20 de mar/)).toBeTruthy();
      });
    });

    it('renders three domain cards: Depressão, Ansiedade, Estresse', async () => {
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByText('Depressão')).toBeTruthy();
        expect(getByText('Ansiedade')).toBeTruthy();
        expect(getByText('Estresse')).toBeTruthy();
      });
    });

    it('renders "Normal" badge for normal classifications', async () => {
      const { getAllByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getAllByText('Normal').length).toBe(3);
      });
    });

    it('renders depression description for normal level', async () => {
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByText(/indicadores de depressão estão dentro da faixa normal/)).toBeTruthy();
      });
    });

    it('does not render warning alert for normal assessment', async () => {
      const { queryByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(queryByText('Atenção Importante')).toBeNull();
      });
    });

    it('renders "Sobre o DASS-21" info box', async () => {
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByText('Sobre o DASS-21')).toBeTruthy();
      });
    });

    it('renders disclaimer', async () => {
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByText(/apenas informativa/)).toBeTruthy();
      });
    });
  });

  describe('With severe assessment (warning)', () => {
    beforeEach(() => {
      mockGetAssessments.mockResolvedValue([severeAssessment]);
      mockRouteParams = { assessmentId: 'assessment-2' };
    });

    it('renders warning alert', async () => {
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByText('Atenção Importante')).toBeTruthy();
      });
    });

    it('renders CVV phone link', async () => {
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByText(/CVV - Ligue 188/)).toBeTruthy();
      });
    });

    it('opens tel:188 on CVV link press', async () => {
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        fireEvent.press(getByText(/CVV - Ligue 188/));
        expect(Linking.openURL).toHaveBeenCalledWith('tel:188');
      });
    });

    it('renders "Grave" badge for severe classifications', async () => {
      const { getAllByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getAllByText('Grave').length).toBeGreaterThanOrEqual(1);
      });
    });

    it('renders severe depression description', async () => {
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByText(/merecem atenção urgente/)).toBeTruthy();
      });
    });
  });

  describe('With mild assessment', () => {
    beforeEach(() => {
      mockGetAssessments.mockResolvedValue([mildAssessment]);
      mockRouteParams = { assessmentId: 'assessment-3' };
    });

    it('renders "Leve" badges', async () => {
      const { getAllByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getAllByText('Leve').length).toBe(3);
      });
    });

    it('renders mild depression description', async () => {
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByText(/sinais leves de depressão/)).toBeTruthy();
      });
    });
  });

  describe('With moderate assessment', () => {
    beforeEach(() => {
      mockGetAssessments.mockResolvedValue([moderateAssessment]);
      mockRouteParams = { assessmentId: 'assessment-4' };
    });

    it('renders "Moderado" badges', async () => {
      const { getAllByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getAllByText('Moderado').length).toBe(3);
      });
    });

    it('renders moderate anxiety description', async () => {
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByText(/Indicadores moderados de ansiedade/)).toBeTruthy();
      });
    });
  });

  describe('Action buttons', () => {
    beforeEach(() => {
      mockGetAssessments.mockResolvedValue([normalAssessment]);
      mockRouteParams = { assessmentId: 'assessment-1' };
    });

    it('renders "Refazer Avaliação" button', async () => {
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByText('Refazer Avaliação')).toBeTruthy();
      });
    });

    it('renders "Voltar para Início" button', async () => {
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByText('Voltar para Início')).toBeTruthy();
      });
    });

    it('navigates to mentalHealthForm on "Refazer Avaliação" press', async () => {
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        fireEvent.press(getByText('Refazer Avaliação'));
        expect(mockNavigate).toHaveBeenCalledWith('mentalHealthForm');
      });
    });

    it('navigates to homepage on "Voltar para Início" press', async () => {
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        fireEvent.press(getByText('Voltar para Início'));
        expect(mockNavigate).toHaveBeenCalledWith('homepage');
      });
    });
  });

  describe('Back navigation', () => {
    it('calls goBack on header back button press', async () => {
      mockGetAssessments.mockResolvedValue([normalAssessment]);
      mockRouteParams = { assessmentId: 'assessment-1' };
      const { getByTestId } = render(<MentalHealthResult />);
      await waitFor(() => {
        fireEvent.press(getByTestId('back-button'));
        expect(mockGoBack).toHaveBeenCalled();
      });
    });
  });

  describe('Assessment loading by ID', () => {
    it('loads assessment by assessmentId from route params', async () => {
      mockGetAssessments.mockResolvedValue([normalAssessment, severeAssessment]);
      mockRouteParams = { assessmentId: 'assessment-2' };
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        // Should load severe assessment since ID matches
        expect(getByText('Atenção Importante')).toBeTruthy();
      });
    });

    it('falls back to first assessment when ID not found', async () => {
      mockGetAssessments.mockResolvedValue([normalAssessment]);
      mockRouteParams = { assessmentId: 'non-existent' };
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        // Falls back to first assessment (normal)
        expect(getByText('Depressão')).toBeTruthy();
      });
    });

    it('loads latest assessment when no assessmentId in params', async () => {
      mockGetAssessments.mockResolvedValue([severeAssessment, normalAssessment]);
      mockRouteParams = {};
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        // First in array (severe)
        expect(getByText('Atenção Importante')).toBeTruthy();
      });
    });
  });

  describe('Error handling', () => {
    it('shows no assessment found when getAssessments throws', async () => {
      mockGetAssessments.mockRejectedValue(new Error('Network'));
      const { getByText } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByText('Nenhuma avaliação encontrada.')).toBeTruthy();
      });
    });
  });

  describe('Domain icons', () => {
    it('renders head health icon for depression', async () => {
      mockGetAssessments.mockResolvedValue([normalAssessment]);
      mockRouteParams = { assessmentId: 'assessment-1' };
      const { getByTestId } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByTestId('head-health-icon')).toBeTruthy();
      });
    });

    it('renders heart icon for anxiety', async () => {
      mockGetAssessments.mockResolvedValue([normalAssessment]);
      mockRouteParams = { assessmentId: 'assessment-1' };
      const { getByTestId } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByTestId('heart-icon')).toBeTruthy();
      });
    });

    it('renders energy icon for stress', async () => {
      mockGetAssessments.mockResolvedValue([normalAssessment]);
      mockRouteParams = { assessmentId: 'assessment-1' };
      const { getByTestId } = render(<MentalHealthResult />);
      await waitFor(() => {
        expect(getByTestId('energy-icon')).toBeTruthy();
      });
    });
  });
});
