import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

export const linking: LinkingOptions<any> = {
  prefixes: [
    prefix,
    'examinus://',
    'https://examinus.app',
    'https://www.examinus.app',
  ],
  config: {
    screens: {
      // Auth screens
      onboardingSteps: 'onboarding',

      // Main screens
      homepage: {
        path: 'home',
        screens: {
          homepage: '',
          examList: 'exams',
          upload: 'upload',
          healthWallet: 'wallet',
          myAccount: 'account',
        },
      },

      // Exam screens
      exam: 'exam/:id?',
      examList: 'exams',

      // Upload
      upload: 'upload',

      // Health
      healthWallet: 'wallet',
      heartScore: 'heart-score',

      // Settings
      myAccount: 'account',
      configNotifications: 'settings/notifications',
      info: 'settings/info',
      security: 'settings/security',
      contactUs: 'settings/contact',
      aboutUs: 'settings/about',

      // Profile
      editProfile: 'profile/edit',
      passwordConfig: 'profile/password',
      notificationConfig: 'profile/notifications',
      biomConfig: 'profile/biometric',
      otpConfig: 'profile/otp',
      otpSecurity: 'profile/otp-security',

      // Notifications
      notifications: 'notifications',

      // Success
      successSaved: 'success',

      // Tracker
      tracker: 'tracker',
      weight: 'tracker/weight',
      nutrition: 'tracker/nutrition',
      calories: 'tracker/calories',
    },
  },
};
