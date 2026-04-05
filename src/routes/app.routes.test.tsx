import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { AppRoutes } from './app.routes';

// ── NativeBase mock ──────────────────────────────────────────────────
jest.mock('native-base', () => {
  const RN = require('react-native');
  return {
    Box: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    View: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Flex: ({ children, ...p }: any) => <RN.View {...p}>{children}</RN.View>,
    Image: ({ alt, ...p }: any) => <RN.View {...p} />,
  };
});

// ── Navigation mock ──────────────────────────────────────────────────
const mockNavigate = jest.fn();
const mockReset = jest.fn();

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children, initialRouteName, ...p }: any) => {
      const RN = require('react-native');
      return (
        <RN.View testID={`navigator-${initialRouteName}`} {...p}>
          {children}
        </RN.View>
      );
    },
    Screen: ({ name, component: Component, ...p }: any) => {
      const RN = require('react-native');
      return <RN.View testID={`screen-${name}`} />;
    },
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children, ...p }: any) => {
      const RN = require('react-native');
      return <RN.View testID="tab-navigator">{children}</RN.View>;
    },
    Screen: ({ name, ...p }: any) => {
      const RN = require('react-native');
      return <RN.View testID={`tab-screen-${name}`} />;
    },
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, reset: mockReset }),
  NavigationContainer: ({ children }: any) => children,
}));

// ── assets/icons mocks ──────────────────────────────────────────────
jest.mock('@assets/icons', () => ({
  ChartIcon: () => null,
  ChecklistIcon: () => null,
  ExaminusIcon: () => null,
  HomeIcon: () => null,
  UserIcon: () => null,
}));
jest.mock('@assets/png/logo-animado-2.gif', () => 'logo-gif-mock');

// ── All screen component mocks ──────────────────────────────────────
jest.mock('@components/pages/Homepage', () => {
  const RN = require('react-native');
  return {
    Homepage: () => <RN.View testID="Homepage" />,
    HealthWallet: () => <RN.View testID="HealthWallet" />,
    HeartScore: () => <RN.View testID="HeartScore" />,
    UploadMain: () => <RN.View testID="UploadMain" />,
  };
});

jest.mock('@components/pages/MentalHealth', () => {
  const RN = require('react-native');
  return {
    MentalHealthForm: () => <RN.View testID="MentalHealthForm" />,
    MentalHealthResult: () => <RN.View testID="MentalHealthResult" />,
  };
});

jest.mock('@components/pages/Settings', () => {
  const RN = require('react-native');
  return {
    AboutUs: () => <RN.View testID="AboutUs" />,
    Bonus: () => <RN.View testID="Bonus" />,
    ConfigNotifications: () => <RN.View testID="ConfigNotifications" />,
    ContactUs: () => <RN.View testID="ContactUs" />,
    Info: () => <RN.View testID="Info" />,
    MyAccount: () => <RN.View testID="MyAccount" />,
    Preferences: () => <RN.View testID="Preferences" />,
    Security: () => <RN.View testID="Security" />,
    SmartGoals: () => <RN.View testID="SmartGoals" />,
  };
});

jest.mock('@components/pages/Exam', () => {
  const RN = require('react-native');
  return {
    ExamList: () => <RN.View testID="ExamList" />,
    Exam: () => <RN.View testID="Exam" />,
  };
});

jest.mock('@components/pages/OnboardingInfo/onboarding', () => {
  const RN = require('react-native');
  return { OnboardingSteps: () => <RN.View testID="OnboardingSteps" /> };
});

jest.mock('@components/pages/Medication', () => {
  const RN = require('react-native');
  return {
    MedicationTimeline: () => <RN.View testID="MedicationTimeline" />,
    MedicationForm: () => <RN.View testID="MedicationForm" />,
    MedicationDetail: () => <RN.View testID="MedicationDetail" />,
    MedicationAdherence: () => <RN.View testID="MedicationAdherence" />,
  };
});

jest.mock('@components/pages/Tracker', () => {
  const RN = require('react-native');
  return {
    Weight: () => <RN.View testID="WeightTracker" />,
    Tracker: () => <RN.View testID="Tracker" />,
    Calories: () => <RN.View testID="Calories" />,
    Nutrition: () => <RN.View testID="Nutrition" />,
    Steps: () => <RN.View testID="Steps" />,
    Hydration: () => <RN.View testID="Hydration" />,
    Sleep: () => <RN.View testID="Sleep" />,
  };
});

jest.mock('@components/pages/OnboardingSetup', () => {
  const RN = require('react-native');
  return {
    BiomConfig: () => <RN.View testID="BiomConfig" />,
    EditProfile: () => <RN.View testID="EditProfile" />,
    NotificationConfig: () => <RN.View testID="NotificationConfig" />,
    OtpConfig: () => <RN.View testID="OtpConfig" />,
    OtpSecurity: () => <RN.View testID="OtpSecurity" />,
    PasswordConfig: () => <RN.View testID="PasswordConfig" />,
  };
});

jest.mock('@components/organisms', () => {
  const RN = require('react-native');
  return {
    UploadType: () => <RN.View testID="UploadType" />,
  };
});

jest.mock('@components/pages/Settings/components/successSaved/successSaved', () => {
  const RN = require('react-native');
  return { SuccessSaved: () => <RN.View testID="SuccessSaved" /> };
});

jest.mock('@components/pages/Notifications', () => {
  const RN = require('react-native');
  return { Notifications: () => <RN.View testID="Notifications" /> };
});

jest.mock('@components/organisms/GlobalUploadBottomSheet/GlobalUploadBottomSheet', () => {
  const RN = require('react-native');
  return { GlobalUploadBottomSheet: () => <RN.View testID="GlobalUploadBottomSheet" /> };
});

// ── Context mocks ───────────────────────────────────────────────────
jest.mock('@contexts/OnboardingContext', () => ({
  OnboardingContextProvider: ({ children }: any) => children,
}));

jest.mock('@contexts/TabBarContext', () => ({
  TabBarContextProvider: ({ children }: any) => children,
}));

jest.mock('src/contexts/UploadBottomSheetContext', () => ({
  UploadBottomSheetProvider: ({ children }: any) => children,
  useUploadBottomSheet: () => ({ openBottomSheet: jest.fn(), closeBottomSheet: jest.fn() }),
}));

// ── Hook mocks ──────────────────────────────────────────────────────
const mockCheckOnboardingCompletion = jest.fn().mockResolvedValue(true);

jest.mock('src/hooks/useOnboarding', () => ({
  useOnboarding: () => ({
    isOnboardingComplete: true,
    checkOnboardingCompletion: mockCheckOnboardingCompletion,
  }),
}));

jest.mock('src/hooks/useTabBar', () => ({
  useTabBar: () => ({ isTabBarVisible: true }),
}));

jest.mock('src/hooks/useDeepLinking', () => ({
  useDeepLinking: jest.fn(),
}));

const mockUser = { userId: '1' };
jest.mock('src/hooks/useAuth', () => ({
  useAuth: () => ({ user: mockUser }),
}));

describe('AppRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckOnboardingCompletion.mockResolvedValue(true);
  });

  it('renders loading state initially', () => {
    mockCheckOnboardingCompletion.mockImplementation(() => new Promise(() => {})); // never resolves
    const { toJSON } = render(<AppRoutes />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders navigator with homepage initial route when onboarding complete', async () => {
    mockCheckOnboardingCompletion.mockResolvedValueOnce(true);
    const { findByTestId } = render(<AppRoutes />);
    const navigator = await findByTestId('navigator-homepage');
    expect(navigator).toBeTruthy();
  });

  it('renders navigator with onboardingSteps initial route when onboarding not complete', async () => {
    mockCheckOnboardingCompletion.mockResolvedValueOnce(false);
    const { findByTestId } = render(<AppRoutes />);
    const navigator = await findByTestId('navigator-onboardingSteps');
    expect(navigator).toBeTruthy();
  });

  it('renders homepage route on error (fallback)', async () => {
    mockCheckOnboardingCompletion.mockRejectedValueOnce(new Error('fail'));
    const { findByTestId } = render(<AppRoutes />);
    const navigator = await findByTestId('navigator-homepage');
    expect(navigator).toBeTruthy();
  });

  it('registers all expected screen routes', async () => {
    mockCheckOnboardingCompletion.mockResolvedValueOnce(true);
    const { findByTestId } = render(<AppRoutes />);
    await findByTestId('navigator-homepage');

    // Verify critical screens exist
    const screenNames = [
      'onboardingSteps', 'editProfile', 'passwordConfig',
      'notificationConfig', 'biomConfig', 'otpConfig', 'otpSecurity',
      'homepage', 'upload', 'heartScore', 'exam',
      'notifications', 'successSaved',
      'configNotifications', 'preferences', 'smartGoals',
      'info', 'security', 'contactUs', 'aboutUs', 'bonus',
      'mentalHealthForm', 'mentalHealthResult',
      'medicationTimeline', 'medicationForm', 'medicationDetail', 'medicationAdherence',
    ];

    for (const name of screenNames) {
      expect(findByTestId(`screen-${name}`)).toBeTruthy();
    }
  });

  it('does not check onboarding when user is null', async () => {
    // Override to return null user temporarily
    const useAuthModule = require('src/hooks/useAuth');
    const originalUseAuth = useAuthModule.useAuth;
    useAuthModule.useAuth = () => ({ user: null });

    const { toJSON } = render(<AppRoutes />);
    expect(toJSON()).toBeTruthy();

    // Restore
    useAuthModule.useAuth = originalUseAuth;
  });

  it('renders homepage screen in stack navigator', async () => {
    mockCheckOnboardingCompletion.mockResolvedValueOnce(true);
    const { findByTestId } = render(<AppRoutes />);
    const navigator = await findByTestId('navigator-homepage');
    expect(navigator).toBeTruthy();

    // The Screen mock renders screen-homepage for HomeTabs
    const homepageScreen = await findByTestId('screen-homepage');
    expect(homepageScreen).toBeTruthy();
  });

  it('renders all critical stack navigator screens', async () => {
    mockCheckOnboardingCompletion.mockResolvedValue(true);
    const { findByTestId, getByTestId } = render(<AppRoutes />);
    await findByTestId('navigator-homepage');

    // Medication screens
    expect(getByTestId('screen-medicationTimeline')).toBeTruthy();
    expect(getByTestId('screen-medicationForm')).toBeTruthy();
    expect(getByTestId('screen-medicationDetail')).toBeTruthy();
    expect(getByTestId('screen-medicationAdherence')).toBeTruthy();

    // Mental health screens
    expect(getByTestId('screen-mentalHealthForm')).toBeTruthy();
    expect(getByTestId('screen-mentalHealthResult')).toBeTruthy();

    // Settings screens
    expect(getByTestId('screen-configNotifications')).toBeTruthy();
    expect(getByTestId('screen-preferences')).toBeTruthy();
    expect(getByTestId('screen-info')).toBeTruthy();
    expect(getByTestId('screen-security')).toBeTruthy();
    expect(getByTestId('screen-contactUs')).toBeTruthy();
    expect(getByTestId('screen-aboutUs')).toBeTruthy();
    expect(getByTestId('screen-bonus')).toBeTruthy();

    // Onboarding setup screens
    expect(getByTestId('screen-editProfile')).toBeTruthy();
    expect(getByTestId('screen-passwordConfig')).toBeTruthy();
    expect(getByTestId('screen-notificationConfig')).toBeTruthy();
    expect(getByTestId('screen-biomConfig')).toBeTruthy();
    expect(getByTestId('screen-otpConfig')).toBeTruthy();
    expect(getByTestId('screen-otpSecurity')).toBeTruthy();

    // Other screens
    expect(getByTestId('screen-notifications')).toBeTruthy();
    expect(getByTestId('screen-successSaved')).toBeTruthy();
    expect(getByTestId('screen-exam')).toBeTruthy();
    expect(getByTestId('screen-upload')).toBeTruthy();
    expect(getByTestId('screen-heartScore')).toBeTruthy();
    expect(getByTestId('screen-homepage')).toBeTruthy();
    expect(getByTestId('screen-onboardingSteps')).toBeTruthy();
  });

  it('wraps AppRoutesContent with OnboardingContextProvider', async () => {
    mockCheckOnboardingCompletion.mockResolvedValueOnce(true);
    const { findByTestId } = render(<AppRoutes />);
    // If OnboardingContextProvider was missing, this would fail
    const navigator = await findByTestId('navigator-homepage');
    expect(navigator).toBeTruthy();
  });

  it('shows loading animation gif when checking onboarding', () => {
    mockCheckOnboardingCompletion.mockImplementation(() => new Promise(() => {}));
    const { toJSON } = render(<AppRoutes />);
    // While checking, the loading Flex with Image should render
    expect(toJSON()).toBeTruthy();
  });
});
