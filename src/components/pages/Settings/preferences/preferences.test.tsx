import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Preferences } from './preferences';

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();
const mockIsFitnessEnabled = jest.fn();
const mockSetFitnessEnabled = jest.fn();
const mockRefreshFitnessData = jest.fn();

jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    VStack: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    Text: ({ children, ...rest }: any) => <RN.Text {...rest}>{children}</RN.Text>,
    ScrollView: require("react").forwardRef(({ children, ...rest }: any, ref: any) => (
      <RN.View ref={ref} {...rest}>{children}</RN.View>
    )),
    IScrollViewProps: {},
    View: ({ children, ...rest }: any) => <RN.View {...rest}>{children}</RN.View>,
    StatusBar: (props: any) => <RN.View {...props} />,
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack, navigate: mockNavigate }),
}));

jest.mock('@routes/app.routes', () => ({}));

jest.mock('../components/header/header', () => ({
  Header: ({ title, handleBackTo }: any) => {
    const RN = require('react-native');
    return (
      <RN.TouchableOpacity testID="header-back" onPress={handleBackTo}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    );
  },
}));

jest.mock('../components/card/card', () => ({
  Card: ({ title, subTitle, switchValue, onSwitchChange, disabled, goTo, action, ...rest }: any) => {
    const RN = require('react-native');
    return (
      <RN.View testID={`card-${title}`}>
        <RN.Text>{title}</RN.Text>
        {subTitle && <RN.Text>{subTitle}</RN.Text>}
        {action === 'switch' && onSwitchChange && (
          <RN.TouchableOpacity
            testID={`switch-${title}`}
            onPress={() => onSwitchChange(!switchValue)}
            disabled={disabled}
          >
            <RN.Text>{switchValue ? 'ON' : 'OFF'}</RN.Text>
          </RN.TouchableOpacity>
        )}
        {action === 'chevron' && goTo && (
          <RN.TouchableOpacity testID={`goto-${title}`} onPress={goTo}>
            <RN.Text>Go</RN.Text>
          </RN.TouchableOpacity>
        )}
      </RN.View>
    );
  },
}));

jest.mock('src/hooks/useCustomToast', () => ({
  useCustomToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

jest.mock('src/hooks/useHome', () => ({
  useHome: () => ({
    refreshFitnessData: mockRefreshFitnessData,
  }),
}));

jest.mock('@services/fitnessService', () => ({
  isFitnessEnabled: (...args: any[]) => mockIsFitnessEnabled(...args),
  setFitnessEnabled: (...args: any[]) => mockSetFitnessEnabled(...args),
}));

jest.mock('@assets/icons', () => {
  const RN = require('react-native');
  return {
    BarbellIcon: (props: any) => <RN.View testID="barbell-icon" {...props} />,
    CompassTargetIcon: (props: any) => <RN.View testID="compass-icon" {...props} />,
  };
});

describe('Preferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsFitnessEnabled.mockResolvedValue(false);
    mockSetFitnessEnabled.mockResolvedValue(undefined);
    mockRefreshFitnessData.mockResolvedValue(undefined);
  });

  it('renders the header with "Preferências" title', async () => {
    const { getByText } = render(<Preferences />);
    await waitFor(() => {
      expect(getByText('Preferências')).toBeTruthy();
    });
  });

  it('renders Rastreamento de Saúde section', async () => {
    const { getByText } = render(<Preferences />);
    await waitFor(() => {
      expect(getByText('Rastreamento de Saúde')).toBeTruthy();
    });
  });

  it('renders Rastreador Fitness card', async () => {
    const { getByText } = render(<Preferences />);
    await waitFor(() => {
      expect(getByText('Rastreador Fitness')).toBeTruthy();
    });
  });

  it('renders Metas Inteligentes card', async () => {
    const { getByText } = render(<Preferences />);
    await waitFor(() => {
      expect(getByText('Metas Inteligentes')).toBeTruthy();
    });
  });

  it('loads fitness preference on mount', async () => {
    render(<Preferences />);
    await waitFor(() => {
      expect(mockIsFitnessEnabled).toHaveBeenCalled();
    });
  });

  it('navigates back when header back is pressed', () => {
    const { getByTestId } = render(<Preferences />);
    fireEvent.press(getByTestId('header-back'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('navigates to smartGoals when Metas Inteligentes is pressed', async () => {
    const { getByTestId } = render(<Preferences />);
    await waitFor(() => {
      expect(getByTestId('goto-Metas Inteligentes')).toBeTruthy();
    });
    fireEvent.press(getByTestId('goto-Metas Inteligentes'));
    expect(mockNavigate).toHaveBeenCalledWith('smartGoals');
  });

  it('shows success toast when fitness toggle is enabled', async () => {
    jest.replaceProperty(require('react-native').Platform, 'OS', 'ios');

    const { getByTestId } = render(<Preferences />);
    await waitFor(() => {
      expect(getByTestId('switch-Rastreador Fitness')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId('switch-Rastreador Fitness'));
    });

    await waitFor(() => {
      expect(mockSetFitnessEnabled).toHaveBeenCalledWith(true);
      expect(mockShowSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Salvo' })
      );
    });
  });

  it('shows error toast when fitness toggle fails', async () => {
    jest.replaceProperty(require('react-native').Platform, 'OS', 'ios');
    mockSetFitnessEnabled.mockRejectedValueOnce(new Error('Failed'));

    const { getByTestId } = render(<Preferences />);
    await waitFor(() => {
      expect(getByTestId('switch-Rastreador Fitness')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByTestId('switch-Rastreador Fitness'));
    });

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Erro' })
      );
    });
  });
});
