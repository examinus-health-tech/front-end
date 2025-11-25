import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Homepage, HealthWallet, HeartScore, UploadMain } from '@components/pages/Homepage';
import { AboutUs, ConfigNotifications, ContactUs, Info, MyAccount, Security } from '@components/pages/Settings';

import { ExamList, Exam } from '@components/pages/Exam';

import { createBottomTabNavigator, BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { ChartIcon, ChecklistIcon, ExaminusIcon, HomeIcon, UserIcon } from '@assets/icons';
import { Box, View } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { OnboardingSteps } from '@components/pages/OnboardingInfo/onboarding';
import { TabBarContextProvider } from '@contexts/TabBarContext';
import { useTabBar } from 'src/hooks/useTabBar';
import { useOnboarding } from 'src/hooks/useOnboarding';
import { useState, useEffect } from 'react';
import { Flex, Image } from 'native-base';

import { Weight, Tracker, Calories } from '@components/pages/Tracker';
import { Nutrition } from '@components/pages/Tracker/Nutrition/nutrition';
import {
  BiomConfig,
  EditProfile,
  NotificationConfig,
  OtpConfig,
  OtpSecurity,
  PasswordConfig,
} from '@components/pages/OnboardingSetup';
import { UploadType } from '@components/organisms';
import { NotificationsOld } from '@screens/Notifications/screens/notifications/notifications-old';
import { SuccessSaved } from '@components/pages/Settings/components/successSaved/successSaved';

export type AppRoutes = {
  gender: undefined;
  weight: undefined;
  age: undefined;
  upload: undefined;
  physical: undefined;
  humour: undefined;
  habits: undefined;
  score: undefined;
  homepage: undefined;
  myAccount: undefined;
  notifications: undefined;
  info: undefined;
  security: undefined;
  contactUs: undefined;
  aboutUs: undefined;
  configNotifications: undefined;
  successSaved: undefined;
  tracker: undefined;
  sleep: undefined;
  nutrition: undefined;
  calories: undefined;
  weightTracker: undefined;
  editProfile: undefined;
  passwordConfig: undefined;
  notificationConfig: undefined;
  biomConfig: undefined;
  otpConfig: undefined;
  uploadError: undefined;
  otpSecurity: undefined;
  healthWallet: undefined;
  heartScore: undefined;
  examList: undefined;
  exam: undefined;
  onboardingSteps: undefined;
  workingInProgress: undefined;
};

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AppRoutes>();

const Tab = createBottomTabNavigator<AppRoutes>();

const CustomTabExaminusButton = ({ children, onPress }: BottomTabBarButtonProps) => (
  <TouchableOpacity style={{}} onPress={onPress}>
    <View
      style={{
        top: -40,
        width: 68,
        height: 68,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 14,
        backgroundColor: '#0CC1AF',
        position: 'relative',
        shadowColor: '#0CC1AF',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 10,
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

function HomeTabsContent() {
  const { isTabBarVisible } = useTabBar();

  return (
    <Tab.Navigator
      initialRouteName="homepage"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: isTabBarVisible
          ? {
              height: 100,
              position: 'absolute',
              elevation: 0,
              backgroundColor: 'white',
              borderTopEndRadius: 40,
              borderTopStartRadius: 40,
              borderTopWidth: 0,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 12,
              paddingBottom: 8,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 0.08,
              shadowRadius: 12,
            }
          : {
              display: 'none',
            },
      }}
    >
      <Tab.Screen
        name="homepage"
        component={Homepage}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Box
                w={12}
                height={12}
                bg={focused ? '#E6F7F5' : 'transparent'}
                borderRadius={14}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <HomeIcon color={focused ? '#0CC1AF' : '#B0B8C1'} size={focused ? '28' : '26'} />
              </Box>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="examList"
        component={ExamList}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <View>
              <Box
                w={12}
                height={12}
                bg={focused ? '#E6F7F5' : 'transparent'}
                borderRadius={14}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <ChecklistIcon color={focused ? '#0CC1AF' : '#B0B8C1'} size={focused ? '28' : '26'} />
              </Box>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="upload"
        component={UploadMain}
        options={{
          unmountOnBlur: true,
          tabBarIcon: () => <ExaminusIcon />,
          tabBarButton: ({ children, onPress }) => (
            <View>
              <CustomTabExaminusButton children={children} onPress={onPress} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="healthWallet"
        component={HealthWallet}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <View>
              <Box
                w={12}
                height={12}
                bg={focused ? '#E6F7F5' : 'transparent'}
                borderRadius={14}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <ChartIcon color={focused ? '#0CC1AF' : '#B0B8C1'} size={focused ? '28' : '26'} />
              </Box>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="myAccount"
        component={MyAccount}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <View>
              <Box
                w={12}
                height={12}
                bg={focused ? '#E6F7F5' : 'transparent'}
                borderRadius={14}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <UserIcon color={focused ? '#0CC1AF' : '#B0B8C1'} size={focused ? '28' : '26'} />
              </Box>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function HomeTabs() {
  return (
    <TabBarContextProvider>
      <HomeTabsContent />
    </TabBarContextProvider>
  );
}

import { OnboardingContextProvider } from '@contexts/OnboardingContext';
import { Notifications } from '@screens/Notifications/screens/notifications/notifications';
import { useDeepLinking } from 'src/hooks/useDeepLinking';

function AppRoutesContent() {
  const { isOnboardingComplete, checkOnboardingCompletion } = useOnboarding();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Ativar deep linking apenas após o app estar pronto
  useDeepLinking();

  useEffect(() => {
    async function determineInitialRoute() {
      try {
        console.log('🚀 [APP_ROUTES] Determinando rota inicial após login...');
        console.log('📍 [APP_ROUTES] Timestamp:', new Date().toISOString());

        const isComplete = await checkOnboardingCompletion();
        console.log('📋 [APP_ROUTES] Resultado da verificação - onboarding completo:', isComplete);

        if (isComplete) {
          console.log('✅ [APP_ROUTES] Usuário possui dados de onboarding');
          console.log('➡️ [APP_ROUTES] Redirecionando para homepage');
          setInitialRoute('homepage');
        } else {
          console.log('⚠️ [APP_ROUTES] Usuário NÃO possui dados de onboarding');
          console.log('➡️ [APP_ROUTES] Redirecionando para onboardingSteps');
          setInitialRoute('onboardingSteps');
        }
      } catch (error) {
        console.log('❌ [APP_ROUTES] Erro ao determinar rota, redirecionando para onboarding:', error);
        setInitialRoute('onboardingSteps');
      } finally {
        console.log('✅ [APP_ROUTES] Verificação concluída, exibindo tela');
        setIsChecking(false);
      }
    }

    determineInitialRoute();
  }, [checkOnboardingCompletion]);

  // Mostrar loading enquanto determina a rota inicial
  if (isChecking || !initialRoute) {
    return (
      <Flex align="center" justify="center" h="100%" bgColor="gray.100">
        <Image source={require('@assets/png/logo-animado-2.gif')} style={{ width: 80, height: 80 }} alt="Loading" />
      </Flex>
    );
  }

  return (
    <Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
      {/** WELCOME */}
      <Screen name="onboardingSteps" component={OnboardingSteps} />

      {/** ONBOARDING */}
      <Screen name="editProfile" component={EditProfile} />
      <Screen name="passwordConfig" component={PasswordConfig} />
      <Screen name="notificationConfig" component={NotificationConfig} />
      <Screen name="biomConfig" component={BiomConfig} />
      <Screen name="otpConfig" component={OtpConfig} />
      <Screen name="otpSecurity" component={OtpSecurity} />

      {/** HOMEPAGE */}
      <Screen name="homepage" component={HomeTabs} />
      <Screen name="upload" component={UploadMain} />
      <Screen name="heartScore" component={HeartScore} />

      {/** EXAM */}
      {/* <Screen name="examList" component={ExamList} /> */}
      <Screen name="exam" component={Exam} />

      <Screen name="notifications" component={Notifications} />
      <Screen name="successSaved" component={SuccessSaved} />

      {/** SETTINGS */}
      {/* <Screen name="myAccount" component={MyAccount} /> */}
      <Screen name="configNotifications" component={ConfigNotifications} />
      <Screen name="info" component={Info} />
      <Screen name="security" component={Security} />
      <Screen name="contactUs" component={ContactUs} />
      <Screen name="aboutUs" component={AboutUs} />

      {/** FITNESS TRACKER */}
      <Screen name="tracker" component={Tracker} />
      <Screen name="weight" component={Weight} />
      <Screen name="nutrition" component={Nutrition} />
      <Screen name="calories" component={Calories} />

      {/* <Screen name="weightTracker" component={WeightTracker} /> */}
    </Navigator>
  );
}

export function AppRoutes() {
  return (
    <OnboardingContextProvider>
      <AppRoutesContent />
    </OnboardingContextProvider>
  );
}
