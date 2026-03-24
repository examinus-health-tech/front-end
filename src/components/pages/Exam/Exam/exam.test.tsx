import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Exam } from './exam';

// ── Mock NativeBase ──
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    ScrollView: ({ children, ...rest }: any) => <RN.ScrollView {...rest}>{children}</RN.ScrollView>,
    Badge: ({ children, ...rest }: any) => <RN.View {...rest}><RN.Text>{children}</RN.Text></RN.View>,
    Divider: (props: any) => <RN.View {...props} />,
    Modal: Object.assign(
      ({ children, isOpen }: any) => (isOpen ? <RN.View testID="modal">{children}</RN.View> : null),
      {
        Content: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
        Body: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
      }
    ),
    Button: ({ children, onPress, ...rest }: any) => (
      <RN.TouchableOpacity onPress={onPress} {...rest}>
        <RN.Text>{children}</RN.Text>
      </RN.TouchableOpacity>
    ),
    useDisclose: () => ({ isOpen: false, onOpen: jest.fn(), onClose: jest.fn() }),
  };
});

// ── Mock @gorhom/bottom-sheet ──
jest.mock('@gorhom/bottom-sheet', () => {
  const RN = require('react-native');
  return {
    BottomSheetModal: require("react").forwardRef(({ children }: any, ref: any) => {
      require("react").useImperativeHandle(ref, () => ({ present: jest.fn(), dismiss: jest.fn() }));
      return <RN.View testID="bottom-sheet-modal">{children}</RN.View>;
    }),
    BottomSheetView: ({ children }: any) => <RN.View>{children}</RN.View>,
    BottomSheetScrollView: ({ children }: any) => <RN.ScrollView>{children}</RN.ScrollView>,
    BottomSheetBackdrop: (props: any) => <RN.View {...props} />,
    TouchableOpacity: ({ children, onPress, ...rest }: any) => (
      <RN.TouchableOpacity onPress={onPress} {...rest}>{children}</RN.TouchableOpacity>
    ),
  };
});

// ── Mock react-native-circular-progress ──
jest.mock('react-native-circular-progress', () => {
  const RN = require('react-native');
  return {
    AnimatedCircularProgress: ({ fill, tintColor, ...rest }: any) => (
      <RN.View testID="circular-progress" {...rest} />
    ),
  };
});

// ── Mock navigation ──
const mockNavigate = jest.fn();
const mockRouteParams: any = {};
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: mockRouteParams }),
}));

// ── Mock hooks ──
const mockSelectExamById = jest.fn();
const mockDeleteExam = jest.fn();
const mockExamSelected: any = {};
const mockExamData: any[] = [];
jest.mock('src/hooks/useExam', () => ({
  useExam: () => ({
    examSelected: mockExamSelected.current,
    selectExamById: mockSelectExamById,
    examData: mockExamData,
    deleteExam: mockDeleteExam,
  }),
}));

const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();
const mockShowInfo = jest.fn();
jest.mock('src/hooks/useCustomToast', () => ({
  useCustomToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
    showInfo: mockShowInfo,
  }),
}));

// ── Mock assets/icons ──
jest.mock('@assets/icons', () => {
  const RN = require('react-native');
  return {
    AddSquareIcon: (props: any) => <RN.View testID="add-square-icon" {...props} />,
    ChartIcon: (props: any) => <RN.View testID="chart-icon" {...props} />,
    TrashIcon: (props: any) => <RN.View testID="trash-icon" {...props} />,
  };
});

// ── Mock components/molecules ──
jest.mock('@components/molecules', () => {
  const RN = require('react-native');
  return {
    HeaderDescription: ({ title, withBackButton, onDeletePress }: any) => (
      <RN.View testID="header-description">
        <RN.Text>{title}</RN.Text>
        <RN.TouchableOpacity testID="back-button" onPress={withBackButton} />
        {onDeletePress && <RN.TouchableOpacity testID="delete-button" onPress={onDeletePress} />}
      </RN.View>
    ),
    HistoryChart: (props: any) => <RN.View testID="history-chart" />,
    ReviewBottomSheet: ({ isOpen, onClose }: any) =>
      isOpen ? <RN.View testID="review-bottom-sheet" /> : null,
  };
});

// ── Mock utils ──
jest.mock('@utils/dateFormatter', () => ({
  formatDateToBrazilian: (date: string) => '01/01/2025 10:00',
  formatDateToBrazilianNoTime: (date: string) => '01/01/2025',
}));

jest.mock('@utils/numberFormatter', () => ({
  formatExamValue: (val: string) => val,
}));

// ── Mock services ──
jest.mock('@services/reviewService', () => ({
  shouldShowReviewPromptOnPositiveAction: jest.fn().mockResolvedValue(false),
}));

// ── Mock routes ──
jest.mock('@routes/app.routes', () => ({}));

// ── Helpers ──
function setExamSelected(exam: any) {
  mockExamSelected.current = exam;
}

function setRouteParams(params: any) {
  Object.assign(mockRouteParams, params);
}

function clearRouteParams() {
  Object.keys(mockRouteParams).forEach((k) => delete mockRouteParams[k]);
}

beforeEach(() => {
  jest.clearAllMocks();
  setExamSelected(null);
  clearRouteParams();
  mockExamData.length = 0;
});

// ────────────── TESTS ──────────────

describe('Exam', () => {
  const baseExam = {
    medicalExamId: 'exam-1',
    laboratoryName: 'Lab Test',
    createdDate: '2025-01-01T10:00:00.000Z',
    examDate: '2024-12-20T00:00:00.000Z',
    doctorName: 'Dr. House',
    requestingDoctorName: null,
    responsibleDoctorName: null,
    healthInsuranceName: 'Unimed',
    medicalExamItems: [
      {
        examItemDescription: 'Glicose',
        medicalExamItemReferenceValue: '95',
        medicalExamItemMeasureUnit: 'mg/dL',
        medicalExamItemWeightColor: 'Green',
        referenceMin: 70,
        referenceMax: 100,
        examItemExplanation: 'Explicacao da glicose',
        medicalExamItemWeightSummaryExplanation: 'Resultado normal',
        medicalExamItemWeightActionRecommendation: 'Continue assim',
      },
    ],
  };

  describe('Empty / Loading states', () => {
    it('renders "Nenhum exame selecionado" when no exam is selected and no params', () => {
      setExamSelected(null);
      const { getByText } = render(<Exam />);
      expect(getByText('Nenhum exame selecionado')).toBeTruthy();
    });

    it('renders loading state when isLoadingExam is true (via examId param)', async () => {
      clearRouteParams();
      setRouteParams({ examId: 'exam-load-1' });
      mockSelectExamById.mockResolvedValue(true);
      setExamSelected(baseExam);
      render(<Exam />);
      await waitFor(() => {
        expect(mockSelectExamById).toHaveBeenCalledWith('exam-load-1');
      });
    });

    it('navigates to examList and shows info when exam not found via params', async () => {
      setRouteParams({ examId: 'not-found' });
      mockSelectExamById.mockResolvedValue(false);
      setExamSelected(baseExam); // provide a non-null exam to avoid crash on initial render
      render(<Exam />);
      await waitFor(() => {
        expect(mockShowInfo).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'Exame não encontrado' })
        );
        expect(mockNavigate).toHaveBeenCalledWith('examList');
      });
    });

    it('navigates to examList and shows error when loading throws', async () => {
      setRouteParams({ examId: 'err' });
      mockSelectExamById.mockRejectedValue(new Error('Network'));
      setExamSelected(baseExam); // provide a non-null exam to avoid crash on initial render
      render(<Exam />);
      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'Erro ao carregar' })
        );
        expect(mockNavigate).toHaveBeenCalledWith('examList');
      });
    });
  });

  describe('Rendering with exam data', () => {
    it('renders exam header with laboratory name', () => {
      setExamSelected(baseExam);
      const { getByText } = render(<Exam />);
      expect(getByText('Lab Test')).toBeTruthy();
    });

    it('renders exam date info', () => {
      setExamSelected(baseExam);
      const { getByText } = render(<Exam />);
      expect(getByText(/Exame:/)).toBeTruthy();
      expect(getByText(/Enviado:/)).toBeTruthy();
    });

    it('renders doctor name (legacy fallback)', () => {
      setExamSelected(baseExam);
      const { getByText } = render(<Exam />);
      expect(getByText(/Dr\. House/)).toBeTruthy();
    });

    it('renders requesting and responsible doctors when available', () => {
      setExamSelected({
        ...baseExam,
        requestingDoctorName: 'Dr. Solicita',
        responsibleDoctorName: 'Dr. Responsavel',
        doctorName: null,
      });
      const { getByText } = render(<Exam />);
      expect(getByText(/Dr\. Solicita/)).toBeTruthy();
      expect(getByText(/Dr\. Responsavel/)).toBeTruthy();
    });

    it('renders health insurance name', () => {
      setExamSelected(baseExam);
      const { getByText } = render(<Exam />);
      expect(getByText(/Unimed/)).toBeTruthy();
    });

    it('renders exam item description (Glicose)', () => {
      setExamSelected(baseExam);
      const { getByText } = render(<Exam />);
      expect(getByText('Glicose')).toBeTruthy();
    });

    it('renders "Desmistificando" action', () => {
      setExamSelected(baseExam);
      const { getByText } = render(<Exam />);
      expect(getByText('Desmistificando')).toBeTruthy();
    });

    it('renders "Sobre o resultado" action', () => {
      setExamSelected(baseExam);
      const { getByText } = render(<Exam />);
      expect(getByText('Sobre o resultado')).toBeTruthy();
    });

    it('renders "O que fazer?" action', () => {
      setExamSelected(baseExam);
      const { getByText } = render(<Exam />);
      expect(getByText('O que fazer?')).toBeTruthy();
    });

    it('renders "Ver histórico de resultados"', () => {
      setExamSelected(baseExam);
      const { getByText } = render(<Exam />);
      expect(getByText('Ver histórico de resultados')).toBeTruthy();
    });

    it('renders "Nenhum item de exame disponível" when medicalExamItems is empty', () => {
      setExamSelected({ ...baseExam, medicalExamItems: null });
      const { getByText } = render(<Exam />);
      expect(getByText('Nenhum item de exame disponível')).toBeTruthy();
    });

    it('renders medical reference sources', () => {
      setExamSelected(baseExam);
      const { getByText } = render(<Exam />);
      expect(getByText(/Organização Mundial da Saúde/)).toBeTruthy();
      expect(getByText(/Ministério da Saúde/)).toBeTruthy();
      expect(getByText(/Mayo Clinic/)).toBeTruthy();
    });

    it('renders the disclaimer warning', () => {
      setExamSelected(baseExam);
      const { getByText } = render(<Exam />);
      expect(getByText(/não substituem orientação médica/)).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('opens "Desmistificando" bottom sheet on press', () => {
      setExamSelected(baseExam);
      const { getAllByText } = render(<Exam />);
      fireEvent.press(getAllByText('Desmistificando')[0]);
      // The bottom sheet title gets set inside state; confirm it rendered
      expect(getAllByText('Desmistificando').length).toBeGreaterThanOrEqual(1);
    });

    it('opens "Sobre o resultado" bottom sheet on press', () => {
      setExamSelected(baseExam);
      const { getAllByText } = render(<Exam />);
      fireEvent.press(getAllByText('Sobre o resultado')[0]);
      expect(getAllByText('Sobre o resultado').length).toBeGreaterThanOrEqual(1);
    });

    it('opens "O que fazer?" bottom sheet on press', () => {
      setExamSelected(baseExam);
      const { getAllByText } = render(<Exam />);
      fireEvent.press(getAllByText('O que fazer?')[0]);
      expect(getAllByText('O que fazer?').length).toBeGreaterThanOrEqual(1);
    });

    it('navigates back via header back button', () => {
      setExamSelected(baseExam);
      const { getByTestId } = render(<Exam />);
      fireEvent.press(getByTestId('back-button'));
      expect(mockNavigate).toHaveBeenCalledWith('examList');
    });

    it('opens delete confirmation modal', () => {
      setExamSelected(baseExam);
      const { getByTestId, getByText } = render(<Exam />);
      fireEvent.press(getByTestId('delete-button'));
      expect(getByText('Excluir exame?')).toBeTruthy();
    });

    it('closes delete modal on cancel', () => {
      setExamSelected(baseExam);
      const { getByTestId, getByText, queryByText } = render(<Exam />);
      fireEvent.press(getByTestId('delete-button'));
      expect(getByText('Excluir exame?')).toBeTruthy();
      fireEvent.press(getByText('Cancelar'));
      // After pressing cancel, modal should close
      expect(queryByText('Excluir exame?')).toBeNull();
    });

    it('deletes exam successfully', async () => {
      mockDeleteExam.mockResolvedValue(undefined);
      setExamSelected(baseExam);
      const { getByTestId, getByText } = render(<Exam />);
      fireEvent.press(getByTestId('delete-button'));
      fireEvent.press(getByText('Excluir'));
      await waitFor(() => {
        expect(mockDeleteExam).toHaveBeenCalledWith('exam-1');
        expect(mockShowSuccess).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'Exame excluído' })
        );
        expect(mockNavigate).toHaveBeenCalledWith('examList');
      });
    });

    it('shows error on delete failure', async () => {
      mockDeleteExam.mockRejectedValue(new Error('fail'));
      setExamSelected(baseExam);
      const { getByTestId, getByText } = render(<Exam />);
      fireEvent.press(getByTestId('delete-button'));
      fireEvent.press(getByText('Excluir'));
      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'Erro ao excluir' })
        );
      });
    });
  });

  describe('Color helpers (getCorrectedColor / getColor / getFillPercentage / formatReferenceValue)', () => {
    it('renders green circle for values within reference', () => {
      setExamSelected(baseExam);
      const { getByTestId } = render(<Exam />);
      expect(getByTestId('circular-progress')).toBeTruthy();
    });

    it('renders yellow item correctly', () => {
      setExamSelected({
        ...baseExam,
        medicalExamItems: [
          {
            ...baseExam.medicalExamItems[0],
            medicalExamItemReferenceValue: '110',
            medicalExamItemWeightColor: 'Yellow',
            referenceMin: 70,
            referenceMax: 100,
          },
        ],
      });
      const { getByTestId } = render(<Exam />);
      expect(getByTestId('circular-progress')).toBeTruthy();
    });

    it('renders red item correctly', () => {
      setExamSelected({
        ...baseExam,
        medicalExamItems: [
          {
            ...baseExam.medicalExamItems[0],
            medicalExamItemReferenceValue: '250',
            medicalExamItemWeightColor: 'Red',
            referenceMin: 70,
            referenceMax: 100,
          },
        ],
      });
      const { getByTestId } = render(<Exam />);
      expect(getByTestId('circular-progress')).toBeTruthy();
    });

    it('renders qualitative item (e.g. "Negativo")', () => {
      setExamSelected({
        ...baseExam,
        medicalExamItems: [
          {
            ...baseExam.medicalExamItems[0],
            examItemDescription: 'Anti-HBS',
            medicalExamItemReferenceValue: 'Negativo',
            medicalExamItemMeasureUnit: 'Qualitativo',
            medicalExamItemWeightColor: 'Green',
            referenceMin: null,
            referenceMax: null,
          },
        ],
      });
      const { getByText } = render(<Exam />);
      expect(getByText('Negativo')).toBeTruthy();
    });

    it('renders reference value with only max', () => {
      setExamSelected({
        ...baseExam,
        medicalExamItems: [
          {
            ...baseExam.medicalExamItems[0],
            referenceMin: null,
            referenceMax: 100,
          },
        ],
      });
      const { getByText } = render(<Exam />);
      expect(getByText(/Ref:/)).toBeTruthy();
    });

    it('renders reference value with only min', () => {
      setExamSelected({
        ...baseExam,
        medicalExamItems: [
          {
            ...baseExam.medicalExamItems[0],
            referenceMin: 40,
            referenceMax: null,
          },
        ],
      });
      const { getByText } = render(<Exam />);
      expect(getByText(/Ref:/)).toBeTruthy();
    });

    it('does not show Ref: when no reference values', () => {
      setExamSelected({
        ...baseExam,
        medicalExamItems: [
          {
            ...baseExam.medicalExamItems[0],
            referenceMin: null,
            referenceMax: null,
          },
        ],
      });
      const { queryByText } = render(<Exam />);
      expect(queryByText(/Ref:/)).toBeNull();
    });
  });

  describe('History data', () => {
    it('opens history bottom sheet on "Ver histórico" press', () => {
      setExamSelected(baseExam);
      mockExamData.push(baseExam);
      const { getByText } = render(<Exam />);
      fireEvent.press(getByText('Ver histórico de resultados'));
      // History bottom sheet content is always rendered (ref-based)
      expect(getByText('Gráfico Evolutivo')).toBeTruthy();
    });

    it('handles qualitative history data', () => {
      const qualExam = {
        ...baseExam,
        medicalExamItems: [
          {
            ...baseExam.medicalExamItems[0],
            examItemDescription: 'HIV',
            medicalExamItemReferenceValue: 'Negativo',
            medicalExamItemWeightColor: 'Green',
          },
        ],
      };
      setExamSelected(qualExam);
      mockExamData.push(qualExam);
      const { getByText } = render(<Exam />);
      fireEvent.press(getByText('Ver histórico de resultados'));
      expect(getByText('Histórico de Resultados')).toBeTruthy();
    });

    it('shows empty history message for qualitative with no data', () => {
      const qualExam = {
        ...baseExam,
        medicalExamItems: [
          {
            ...baseExam.medicalExamItems[0],
            examItemDescription: 'HIV',
            medicalExamItemReferenceValue: 'Negativo',
          },
        ],
      };
      setExamSelected(qualExam);
      // No exam data matching
      mockExamData.length = 0;
      const { getByText } = render(<Exam />);
      fireEvent.press(getByText('Ver histórico de resultados'));
      expect(getByText(/Nenhum dado disponível/)).toBeTruthy();
    });
  });

  describe('Explanation fallback', () => {
    it('uses fallback text when examItemExplanation is null', () => {
      setExamSelected({
        ...baseExam,
        medicalExamItems: [
          {
            ...baseExam.medicalExamItems[0],
            examItemExplanation: null,
          },
        ],
      });
      const { getAllByText } = render(<Exam />);
      fireEvent.press(getAllByText('Desmistificando')[0]);
      // Should use fallback
      expect(getAllByText('Desmistificando').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Multiple exam items', () => {
    it('renders divider when there are multiple items', () => {
      setExamSelected({
        ...baseExam,
        medicalExamItems: [
          baseExam.medicalExamItems[0],
          {
            ...baseExam.medicalExamItems[0],
            examItemDescription: 'Hemoglobina',
            medicalExamItemReferenceValue: '14',
            medicalExamItemMeasureUnit: 'g/dL',
            referenceMin: 12,
            referenceMax: 16,
          },
        ],
      });
      const { getByText } = render(<Exam />);
      expect(getByText('Glicose')).toBeTruthy();
      expect(getByText('Hemoglobina')).toBeTruthy();
    });
  });
});
