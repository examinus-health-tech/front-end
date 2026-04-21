import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { HealthWallet } from './healthWallet';

// Mock native-base
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    Box: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    HStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    ScrollView: require("react").forwardRef(({ children, ...rest }: any, ref: any) => (
      <RN.View {...rest}>{children}</RN.View>
    )),
    Flex: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Image: (props: any) => <RN.Image {...props} />,
    Badge: ({ children, _text, ...rest }: any) => <RN.View {...rest}><RN.Text>{children}</RN.Text></RN.View>,
    Avatar: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    useDisclose: () => ({
      isOpen: false,
      onOpen: jest.fn(),
      onClose: jest.fn(),
    }),
    StatusBar: (props: any) => null,
  };
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: {
      View: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    },
    FadeInDown: {
      duration: () => ({
        delay: () => undefined,
      }),
    },
  };
});

// Mock react-native-circular-progress
jest.mock('react-native-circular-progress', () => ({
  AnimatedCircularProgress: ({ children, ...rest }: any) => {
    const RN = require('react-native');
    return <RN.View testID="circular-progress">{typeof children === 'function' ? children() : children}</RN.View>;
  },
}));

// Mock ScoreGauge
jest.mock('@components/molecules/ScoreGauge/scoreGauge', () => {
  const RN = require('react-native');
  return {
    ScoreGauge: ({ score, ...rest }: any) => <RN.View testID="score-gauge" {...rest} />,
  };
});

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
  useFocusEffect: (cb: any) => {
    const React = require('react');
    React.useEffect(() => {
      const cleanup = cb();
      return cleanup;
    }, []);
  },
}));

// Mock icons
jest.mock('@assets/icons', () => {
  const createIcon = (name: string) => (props: any) => name;
  return {
    FigIcon: createIcon('FigIcon'),
    HeartIcon: createIcon('HeartIcon'),
    ImuIcon: createIcon('ImuIcon'),
    PanIcon: createIcon('PanIcon'),
    RinIcon: createIcon('RinIcon'),
    SanIcon: createIcon('SanIcon'),
    UserIcon: createIcon('UserIcon'),
    IntestineIcon: createIcon('IntestineIcon'),
    UrinaIcon: createIcon('UrinaIcon'),
    FlaskIcon: createIcon('FlaskIcon'),
    ChecklistIcon: createIcon('ChecklistIcon'),
    HormonioIcon: createIcon('HormonioIcon'),
    TireoideIcon: createIcon('TireoideIcon'),
  };
});

// Mock assets
jest.mock('@assets/png/vector-22.png', () => 'mock-vector-22');

// Mock components
jest.mock('@components/molecules', () => ({
  HeaderTitle: ({ title, withBackButton }: any) => {
    const RN = require('react-native');
    return (
      <RN.View testID="header-title">
        <RN.Text>{title}</RN.Text>
        {withBackButton && (
          <RN.TouchableOpacity testID="back-button" onPress={withBackButton}>
            <RN.Text>Back</RN.Text>
          </RN.TouchableOpacity>
        )}
      </RN.View>
    );
  },
  Progress: () => null,
  StatusCards: () => null,
}));

// Mock hooks
const mockSetCurrentSystem = jest.fn();
let mockHomeData: any = {
  generalScore: 750,
  generalScoreActionRecommendation: 'Tudo bem com a saude',
  medicalExamOrganicSystemsScore: [
    {
      examOrganicSystemId: '1',
      examOrganicSystemDescription: 'Coração',
      organicSystemScore: 800,
      organicSystemScoreSummaryExplanation: '',
      organicSystemScoreActionRecommendation: '',
    },
    {
      examOrganicSystemId: '2',
      examOrganicSystemDescription: 'Fígado',
      organicSystemScore: 400,
      organicSystemScoreSummaryExplanation: '',
      organicSystemScoreActionRecommendation: '',
    },
    {
      examOrganicSystemId: '3',
      examOrganicSystemDescription: 'Rins',
      organicSystemScore: 200,
      organicSystemScoreSummaryExplanation: '',
      organicSystemScoreActionRecommendation: '',
    },
  ],
};

jest.mock('src/hooks/useHome', () => ({
  useHome: () => ({
    homeData: mockHomeData,
    setCurrentSystem: mockSetCurrentSystem,
    currentSystem: null,
  }),
}));

const mockUpdateUserPhoto = jest.fn();
jest.mock('src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      fullName: 'John Doe',
      profilePhotoBase64: null,
      photoUrl: null,
    },
    updateUserPhoto: mockUpdateUserPhoto,
  }),
}));

jest.mock('src/services/userService', () => ({
  getUserPersonalData: jest.fn().mockResolvedValue({ profilePhotoBase64: null }),
}));

describe('HealthWallet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHomeData = {
      generalScore: 750,
      generalScoreActionRecommendation: 'Tudo bem com a saude',
      medicalExamOrganicSystemsScore: [
        {
          examOrganicSystemId: '1',
          examOrganicSystemDescription: 'Coração',
          organicSystemScore: 800,
        },
        {
          examOrganicSystemId: '2',
          examOrganicSystemDescription: 'Fígado',
          organicSystemScore: 400,
        },
        {
          examOrganicSystemId: '3',
          examOrganicSystemDescription: 'Rins',
          organicSystemScore: 200,
        },
      ],
    };
  });

  it('renders the header title', () => {
    const { getByText } = render(<HealthWallet />);
    expect(getByText('Carteira de Saúde')).toBeTruthy();
  });

  it('navigates back to homepage when back button is pressed', () => {
    const { getByTestId } = render(<HealthWallet />);
    fireEvent.press(getByTestId('back-button'));
    expect(mockNavigate).toHaveBeenCalledWith('homepage');
  });

  it('renders the Score X text', () => {
    const { getByText } = render(<HealthWallet />);
    expect(getByText('Score X')).toBeTruthy();
  });

  it('renders the general score value', () => {
    const { getByText } = render(<HealthWallet />);
    expect(getByText('750')).toBeTruthy();
  });

  it('renders the "Visão Geral" title', () => {
    const { getByText } = render(<HealthWallet />);
    expect(getByText('Visão Geral')).toBeTruthy();
  });

  it('renders system cards for each organ system', () => {
    const { getByText } = render(<HealthWallet />);
    expect(getByText('Coração')).toBeTruthy();
    expect(getByText('Fígado')).toBeTruthy();
    expect(getByText('Rins')).toBeTruthy();
  });

  it('renders score badges for each system', () => {
    const { getAllByText } = render(<HealthWallet />);
    // Rins with score 200 => "risco alto"
    expect(getAllByText('risco alto').length).toBeGreaterThanOrEqual(1);
    // Fígado with score 400 => "normal"
    expect(getAllByText('normal').length).toBeGreaterThanOrEqual(1);
    // Coração with score 800 => "excelente"
    expect(getAllByText('excelente').length).toBeGreaterThanOrEqual(1);
  });

  it('renders empty state when no systems data', () => {
    mockHomeData.medicalExamOrganicSystemsScore = [];
    const { getByText } = render(<HealthWallet />);
    expect(getByText('Você não possui dados de exames.')).toBeTruthy();
  });

  it('renders empty state when systems data is null', () => {
    mockHomeData.medicalExamOrganicSystemsScore = null;
    const { getByText } = render(<HealthWallet />);
    expect(getByText('Você não possui dados de exames.')).toBeTruthy();
  });

  it('calls setCurrentSystem when a system card is pressed', () => {
    const { getByText } = render(<HealthWallet />);
    fireEvent.press(getByText('Coração'));
    expect(mockSetCurrentSystem).toHaveBeenCalledWith({
      sistema: 'Coração',
      nivel: 'excelente',
    });
  });

  it('renders score gauge', () => {
    const { getByTestId } = render(<HealthWallet />);
    expect(getByTestId('score-gauge')).toBeTruthy();
  });

  it('renders recommendation text', () => {
    const { getByText } = render(<HealthWallet />);
    expect(getByText('Tudo bem com a saude')).toBeTruthy();
  });

  it('renders medical disclaimer', () => {
    const { getByText } = render(<HealthWallet />);
    expect(getByText(/Aviso Médico/)).toBeTruthy();
  });

  it('renders references section when there are systems', () => {
    const { getByText } = render(<HealthWallet />);
    expect(getByText('Fontes e Referências')).toBeTruthy();
  });

  it('renders reference links', () => {
    const { getByText } = render(<HealthWallet />);
    expect(getByText(/Organização Mundial da Saúde/)).toBeTruthy();
    expect(getByText(/Ministério da Saúde/)).toBeTruthy();
    expect(getByText(/Mayo Clinic/)).toBeTruthy();
  });

  it('opens external links when pressed', () => {
    const { Linking } = require('react-native');
    jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());
    const { getByText } = render(<HealthWallet />);
    fireEvent.press(getByText(/Organização Mundial da Saúde/));
    expect(Linking.openURL).toHaveBeenCalledWith('https://www.who.int/health-topics');
  });

  it('handles score = 0 gracefully', () => {
    mockHomeData.generalScore = 0;
    const { getByText } = render(<HealthWallet />);
    expect(getByText('0')).toBeTruthy();
  });

  it('renders icons based on organ system description', () => {
    mockHomeData.medicalExamOrganicSystemsScore = [
      { examOrganicSystemId: '1', examOrganicSystemDescription: 'Sangue', organicSystemScore: 500 },
      { examOrganicSystemId: '2', examOrganicSystemDescription: 'Intestino', organicSystemScore: 700 },
      { examOrganicSystemId: '3', examOrganicSystemDescription: 'Urina', organicSystemScore: 300 },
      { examOrganicSystemId: '4', examOrganicSystemDescription: 'Hormônios', organicSystemScore: 500 },
      { examOrganicSystemId: '5', examOrganicSystemDescription: 'Tireóide', organicSystemScore: 800 },
      { examOrganicSystemId: '6', examOrganicSystemDescription: 'Imunidade', organicSystemScore: 600 },
      { examOrganicSystemId: '7', examOrganicSystemDescription: 'Pâncreas', organicSystemScore: 400 },
      { examOrganicSystemId: '8', examOrganicSystemDescription: 'Desconhecido', organicSystemScore: 500 },
    ];
    const { getByText } = render(<HealthWallet />);
    expect(getByText('Sangue')).toBeTruthy();
    expect(getByText('Intestino')).toBeTruthy();
    expect(getByText('Urina')).toBeTruthy();
    expect(getByText('Hormônios')).toBeTruthy();
    expect(getByText('Tireóide')).toBeTruthy();
    expect(getByText('Desconhecido')).toBeTruthy();
  });
});
