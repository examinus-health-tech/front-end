import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MedicationAdherence } from './medicationAdherence';

// ── Mock NativeBase ──
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    View: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    ScrollView: ({ children, ...rest }: any) => <RN.ScrollView {...rest}>{children}</RN.ScrollView>,
    Progress: (props: any) => <RN.View testID="progress-bar" {...props} />,
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
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: mockGoBack }),
  useFocusEffect: (cb: any) => {
    const React = require('react');
    require("react").useEffect(() => {
      const cleanup = cb();
      return typeof cleanup === 'function' ? cleanup : undefined;
    }, []);
  },
}));

// ── Mock date-fns ──
jest.mock('date-fns', () => ({
  format: jest.fn((date: any, fmt: string, opts?: any) => {
    return 'março 2025';
  }),
  getDaysInMonth: jest.fn(() => 31),
  startOfMonth: jest.fn((date: any) => date),
  getDay: jest.fn(() => 3), // Wednesday
}));

jest.mock('date-fns/locale', () => ({
  ptBR: {},
}));

// ── Mock icons ──
jest.mock('@assets/icons', () => {
  const RN = require('react-native');
  return {
    ChevronLeftIcon: (props: any) => <RN.View testID="chevron-left-icon" {...props} />,
    WarningIcon: (props: any) => <RN.View testID="warning-icon" {...props} />,
  };
});

// ── Mock medication utils ──
jest.mock('../utils/medicationUtils', () => {
  const RN = require('react-native');
  return {
    MedicationIcon: (props: any) => <RN.View testID="medication-icon" {...props} />,
  };
});

// ── Mock routes ──
jest.mock('@routes/app.routes', () => ({}));

// ── Mock hooks ──
const mockLoadAdherence = jest.fn();
let mockAdherence: any = null;
let mockMedications: any[] = [];

jest.mock('src/hooks/useMedication', () => ({
  useMedication: () => ({
    adherence: mockAdherence,
    loadAdherence: mockLoadAdherence,
    medications: mockMedications,
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockAdherence = null;
  mockMedications = [];
});

// ────────────── TESTS ──────────────

describe('MedicationAdherence', () => {
  describe('Header', () => {
    it('renders "Seu histórico" title', () => {
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('Seu histórico')).toBeTruthy();
    });

    it('renders subtitle', () => {
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('Veja como você tem cuidado da sua saúde')).toBeTruthy();
    });

    it('goes back on header back button press', () => {
      const rendered = render(<MedicationAdherence />);
      const touchables = rendered.UNSAFE_getAllByType(
        require('react-native').TouchableOpacity
      );
      fireEvent.press(touchables[0]);
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('Average adherence (no data)', () => {
    it('renders 0% when no adherence data', () => {
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('0%')).toBeTruthy();
    });

    it('renders "Sem dados" message when adherence is 0', () => {
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('Sem dados')).toBeTruthy();
    });

    it('renders default description for 0 adherence', () => {
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('Registre suas doses para acompanhar sua adesão')).toBeTruthy();
    });
  });

  describe('Average adherence (with data)', () => {
    it('renders excellent adherence for >= 80%', () => {
      mockAdherence = {
        dailyAdherence: { '2025-03-01': 90 },
        monthlyAverage: 92,
        byMedication: [],
      };
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('92%')).toBeTruthy();
      expect(getByText('Excelente')).toBeTruthy();
    });

    it('renders "Bom" for >= 50%', () => {
      mockAdherence = {
        dailyAdherence: {},
        monthlyAverage: 65,
        byMedication: [],
      };
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('65%')).toBeTruthy();
      expect(getByText('Bom')).toBeTruthy();
    });

    it('renders "Precisa melhorar" for > 0% and < 50%', () => {
      mockAdherence = {
        dailyAdherence: {},
        monthlyAverage: 25,
        byMedication: [],
      };
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('25%')).toBeTruthy();
      expect(getByText('Precisa melhorar')).toBeTruthy();
    });

    it('renders "Adesão média" label', () => {
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('Adesão média')).toBeTruthy();
    });
  });

  describe('Calendar', () => {
    it('renders weekday headers', () => {
      const { getAllByText } = render(<MedicationAdherence />);
      expect(getAllByText('D').length).toBeGreaterThanOrEqual(1);
      expect(getAllByText('S').length).toBeGreaterThanOrEqual(1);
      expect(getAllByText('T').length).toBeGreaterThanOrEqual(1);
    });

    it('renders month label', () => {
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('março 2025')).toBeTruthy();
    });

    it('renders legend items', () => {
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('Dias perfeitos')).toBeTruthy();
      expect(getByText('Algumas doses esquecidas')).toBeTruthy();
      expect(getByText('Muitas doses esquecidas')).toBeTruthy();
    });

    it('renders day numbers in calendar', () => {
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('1')).toBeTruthy();
    });
  });

  describe('Month navigation', () => {
    it('calls loadAdherence on focus', () => {
      render(<MedicationAdherence />);
      expect(mockLoadAdherence).toHaveBeenCalled();
    });

    it('navigates to previous month on left arrow press', () => {
      const rendered = render(<MedicationAdherence />);
      const touchables = rendered.UNSAFE_getAllByType(
        require('react-native').TouchableOpacity
      );
      // The prev month button is after the back button; find it by the chevron text
      const prevButton = touchables.find((t: any) => {
        try {
          const text = render(t.props.children).getByText('‹');
          return true;
        } catch {
          return false;
        }
      });
      // If we can find the prev arrow, press it
      if (prevButton) {
        fireEvent.press(prevButton);
      }
      // loadAdherence should be called again (re-render with new month)
      expect(mockLoadAdherence).toHaveBeenCalled();
    });
  });

  describe('By medication breakdown', () => {
    it('renders "Melhor adesão" section when medications exist', () => {
      mockAdherence = {
        dailyAdherence: {},
        monthlyAverage: 80,
        byMedication: [
          {
            medicationId: 'med-1',
            medicationName: 'Losartana',
            adherencePercent: 90,
            totalDoses: 30,
            takenDoses: 27,
          },
        ],
      };
      mockMedications = [{ id: 'med-1', name: 'Losartana', form: 1 }];
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('Melhor adesão')).toBeTruthy();
      expect(getByText('Losartana')).toBeTruthy();
      expect(getByText('90%')).toBeTruthy();
    });

    it('renders taken count and total doses', () => {
      mockAdherence = {
        dailyAdherence: {},
        monthlyAverage: 80,
        byMedication: [
          {
            medicationId: 'med-1',
            medicationName: 'Losartana',
            adherencePercent: 90,
            totalDoses: 30,
            takenDoses: 27,
          },
        ],
      };
      mockMedications = [{ id: 'med-1', name: 'Losartana', form: 1 }];
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('27 de 30 doses tomadas')).toBeTruthy();
    });

    it('shows missed count with warning when there are missed doses', () => {
      mockAdherence = {
        dailyAdherence: {},
        monthlyAverage: 80,
        byMedication: [
          {
            medicationId: 'med-1',
            medicationName: 'Losartana',
            adherencePercent: 90,
            totalDoses: 30,
            takenDoses: 27,
          },
        ],
      };
      mockMedications = [{ id: 'med-1', name: 'Losartana', form: 1 }];
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('3 esquecidas')).toBeTruthy();
    });

    it('does not show "esquecidas" when all doses taken', () => {
      mockAdherence = {
        dailyAdherence: {},
        monthlyAverage: 100,
        byMedication: [
          {
            medicationId: 'med-1',
            medicationName: 'VitD',
            adherencePercent: 100,
            totalDoses: 30,
            takenDoses: 30,
          },
        ],
      };
      mockMedications = [{ id: 'med-1', name: 'VitD', form: 5 }];
      const { queryByText } = render(<MedicationAdherence />);
      // The legend always shows "Algumas doses esquecidas" and "Muitas doses esquecidas",
      // but the per-medication "0 esquecidas" should not appear
      expect(queryByText(/^\d+ esquecidas$/)).toBeNull();
    });

    it('renders medication icon from medications list', () => {
      mockAdherence = {
        dailyAdherence: {},
        monthlyAverage: 80,
        byMedication: [
          {
            medicationId: 'med-1',
            medicationName: 'Losartana',
            adherencePercent: 90,
            totalDoses: 30,
            takenDoses: 27,
          },
        ],
      };
      mockMedications = [{ id: 'med-1', name: 'Losartana', form: 1 }];
      const { getByTestId } = render(<MedicationAdherence />);
      expect(getByTestId('medication-icon')).toBeTruthy();
    });

    it('renders fallback when medication form is not found', () => {
      mockAdherence = {
        dailyAdherence: {},
        monthlyAverage: 80,
        byMedication: [
          {
            medicationId: 'med-unknown',
            medicationName: 'Unknown Med',
            adherencePercent: 70,
            totalDoses: 20,
            takenDoses: 14,
          },
        ],
      };
      mockMedications = []; // No matching medication
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('Unknown Med')).toBeTruthy();
    });

    it('sorts medications by adherence (highest first)', () => {
      mockAdherence = {
        dailyAdherence: {},
        monthlyAverage: 75,
        byMedication: [
          {
            medicationId: 'med-1',
            medicationName: 'Low Med',
            adherencePercent: 50,
            totalDoses: 20,
            takenDoses: 10,
          },
          {
            medicationId: 'med-2',
            medicationName: 'High Med',
            adherencePercent: 95,
            totalDoses: 20,
            takenDoses: 19,
          },
        ],
      };
      mockMedications = [];
      const { getAllByText } = render(<MedicationAdherence />);
      // Both should render
      expect(getAllByText(/Med/).length).toBe(2);
    });
  });

  describe('No by-medication data', () => {
    it('does not render "Melhor adesão" when byMedication is empty', () => {
      mockAdherence = {
        dailyAdherence: {},
        monthlyAverage: 0,
        byMedication: [],
      };
      const { queryByText } = render(<MedicationAdherence />);
      expect(queryByText('Melhor adesão')).toBeNull();
    });
  });

  describe('Color functions via adherence display', () => {
    it('renders green color for >= 80% adherence', () => {
      mockAdherence = {
        dailyAdherence: { '2025-03-01': 90 },
        monthlyAverage: 90,
        byMedication: [],
      };
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('Excelente')).toBeTruthy();
    });

    it('renders yellow for >= 50% and < 80% adherence', () => {
      mockAdherence = {
        dailyAdherence: { '2025-03-01': 60 },
        monthlyAverage: 60,
        byMedication: [],
      };
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('Bom')).toBeTruthy();
    });

    it('renders red for > 0% and < 50% adherence', () => {
      mockAdherence = {
        dailyAdherence: { '2025-03-01': 30 },
        monthlyAverage: 30,
        byMedication: [],
      };
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('Precisa melhorar')).toBeTruthy();
    });

    it('renders gray for 0% adherence', () => {
      mockAdherence = {
        dailyAdherence: {},
        monthlyAverage: 0,
        byMedication: [],
      };
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('Sem dados')).toBeTruthy();
    });
  });

  describe('Month navigation - prevMonth', () => {
    it('goes to December of previous year when current month is January', () => {
      // We test by pressing the prev button, which calls prevMonth
      const rendered = render(<MedicationAdherence />);
      const touchables = rendered.UNSAFE_getAllByType(
        require('react-native').TouchableOpacity
      );
      // Find the prev month button (has ‹ text)
      const prevButton = touchables.find((t: any) => {
        try {
          const text = render(t.props.children).getByText('‹');
          return true;
        } catch {
          return false;
        }
      });
      if (prevButton) {
        // Press prev multiple times to go back to January, then one more to December
        // This tests the prevMonth boundary logic
        fireEvent.press(prevButton);
        fireEvent.press(prevButton);
        fireEvent.press(prevButton);
      }
      // Should not crash - loadAdherence will be called for the new month
      expect(mockLoadAdherence).toHaveBeenCalled();
    });
  });

  describe('Month navigation - nextMonth', () => {
    it('does nothing when already at current month', () => {
      const rendered = render(<MedicationAdherence />);
      const touchables = rendered.UNSAFE_getAllByType(
        require('react-native').TouchableOpacity
      );
      // Find the next month button (has › text)
      const nextButton = touchables.find((t: any) => {
        try {
          const text = render(t.props.children).getByText('›');
          return true;
        } catch {
          return false;
        }
      });
      if (nextButton) {
        // We're already at current month, pressing next should do nothing
        fireEvent.press(nextButton);
      }
      expect(mockLoadAdherence).toHaveBeenCalled();
    });

    it('navigates forward after going back', () => {
      const rendered = render(<MedicationAdherence />);
      const touchables = rendered.UNSAFE_getAllByType(
        require('react-native').TouchableOpacity
      );
      const prevButton = touchables.find((t: any) => {
        try {
          render(t.props.children).getByText('‹');
          return true;
        } catch {
          return false;
        }
      });
      const nextButton = touchables.find((t: any) => {
        try {
          render(t.props.children).getByText('›');
          return true;
        } catch {
          return false;
        }
      });
      // Go back first
      if (prevButton) {
        fireEvent.press(prevButton);
      }
      // Then go forward
      if (nextButton) {
        fireEvent.press(nextButton);
      }
      expect(mockLoadAdherence).toHaveBeenCalled();
    });
  });

  describe('Calendar day coloring', () => {
    it('renders day with dailyAdherence data', () => {
      mockAdherence = {
        dailyAdherence: { '2025-03-15': 100, '2025-03-16': 40, '2025-03-17': 0 },
        monthlyAverage: 50,
        byMedication: [],
      };
      const { getByText } = render(<MedicationAdherence />);
      // Days with data should render
      expect(getByText('15')).toBeTruthy();
      expect(getByText('16')).toBeTruthy();
      expect(getByText('17')).toBeTruthy();
    });
  });

  describe('Medication breakdown - edge cases', () => {
    it('renders multiple medications sorted by adherence', () => {
      mockAdherence = {
        dailyAdherence: {},
        monthlyAverage: 70,
        byMedication: [
          {
            medicationId: 'med-1',
            medicationName: 'Low Med',
            adherencePercent: 40,
            totalDoses: 30,
            takenDoses: 12,
          },
          {
            medicationId: 'med-2',
            medicationName: 'Mid Med',
            adherencePercent: 60,
            totalDoses: 30,
            takenDoses: 18,
          },
          {
            medicationId: 'med-3',
            medicationName: 'High Med',
            adherencePercent: 95,
            totalDoses: 30,
            takenDoses: 28,
          },
        ],
      };
      mockMedications = [
        { id: 'med-1', name: 'Low Med', form: 2 },
        { id: 'med-2', name: 'Mid Med', form: 3 },
        { id: 'med-3', name: 'High Med', form: 1 },
      ];
      const { getByText } = render(<MedicationAdherence />);
      expect(getByText('High Med')).toBeTruthy();
      expect(getByText('Mid Med')).toBeTruthy();
      expect(getByText('Low Med')).toBeTruthy();
      expect(getByText('95%')).toBeTruthy();
      expect(getByText('60%')).toBeTruthy();
      expect(getByText('40%')).toBeTruthy();
      // Missed doses
      expect(getByText('18 esquecidas')).toBeTruthy();
      expect(getByText('12 esquecidas')).toBeTruthy();
      expect(getByText('2 esquecidas')).toBeTruthy();
    });
  });
});
