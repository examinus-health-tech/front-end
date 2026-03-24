import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EditProfile } from './editProfile';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Flex: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Icon: ({ as: AsComponent, ...p }: any) => <RN.View {...p} />,
    ScrollView: require("react").forwardRef(({ children, ...p }: any, ref: any) => (
      <RN.ScrollView ref={ref} {...p}>{children}</RN.ScrollView>
    )),
    Text: ({ children, ...p }: any) => <RN.Text {...p}>{children}</RN.Text>,
    VStack: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
  };
});

// ── navigation mock ─────────────────────────────────────────────────
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
}));

jest.mock('@routes/app.routes', () => ({
  AppNavigatorRoutesProps: {},
}));

// ── assets mocks ─────────────────────────────────────────────────────
jest.mock('@assets/icons', () => ({
  ArrowIcon: () => null,
  BriefcaseIcon: ({ solid, color }: any) => null,
  EmailIcon: ({ solid, color }: any) => null,
  LocationIcon: ({ solid, color }: any) => null,
  TelephoneIcon: ({ solid, color }: any) => null,
  UserIcon: ({ solid, color }: any) => null,
}));

// ── component mocks ─────────────────────────────────────────────────
jest.mock('@components/atoms', () => {
  const RN = require('react-native');
  return {
    Button: ({ title, onPress, ...p }: any) => (
      <RN.TouchableOpacity testID="continue-button" onPress={onPress} {...p}>
        <RN.Text>{title}</RN.Text>
      </RN.TouchableOpacity>
    ),
  };
});

jest.mock('@components/molecules', () => {
  const RN = require('react-native');
  return {
    HeaderProgress: ({ withBackButton, ...p }: any) => (
      <RN.View testID="header-progress">
        {withBackButton && (
          <RN.TouchableOpacity testID="back-button" onPress={withBackButton} />
        )}
      </RN.View>
    ),
    Input: ({ label, ...p }: any) => {
      const RN2 = require('react-native');
      return <RN2.TextInput testID={`input-${label}`} placeholder={label} {...p} />;
    },
  };
});

describe('EditProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title', () => {
    const { getByText } = render(<EditProfile />);
    expect(getByText('Editar Perfil')).toBeTruthy();
  });

  it('renders the subtitle', () => {
    const { getByText } = render(<EditProfile />);
    expect(getByText('Conclua a configuração do seu perfil.')).toBeTruthy();
  });

  it('renders all input fields', () => {
    const { getByTestId } = render(<EditProfile />);
    expect(getByTestId('input-Nome completo')).toBeTruthy();
    expect(getByTestId('input-Telefone')).toBeTruthy();
    expect(getByTestId('input-Localização')).toBeTruthy();
    expect(getByTestId('input-E-mail')).toBeTruthy();
    expect(getByTestId('input-Profissão')).toBeTruthy();
  });

  it('renders the continue button', () => {
    const { getByText } = render(<EditProfile />);
    expect(getByText('Continuar')).toBeTruthy();
  });

  it('navigates to passwordConfig on continue press', () => {
    const { getByTestId } = render(<EditProfile />);
    fireEvent.press(getByTestId('continue-button'));
    expect(mockNavigate).toHaveBeenCalledWith('passwordConfig');
  });

  it('navigates back when back button is pressed', () => {
    const { getByTestId } = render(<EditProfile />);
    fireEvent.press(getByTestId('back-button'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('renders the header progress', () => {
    const { getByTestId } = render(<EditProfile />);
    expect(getByTestId('header-progress')).toBeTruthy();
  });

  it('renders the avatar placeholder', () => {
    // The avatar is a Box with nested Box, just ensure no crash
    const { toJSON } = render(<EditProfile />);
    expect(toJSON()).toBeTruthy();
  });
});
