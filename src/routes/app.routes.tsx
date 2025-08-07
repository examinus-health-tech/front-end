import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Homepage, HealthWallet, HeartScore, UploadMain } from '@components/pages/Homepage';
import { AboutUs, ConfigNotifications, ContactUs, Info, MyAccount, Security } from '@components/pages/Settings';

import { ExamList, Exam } from '@components/pages/Exam';

import { createBottomTabNavigator, BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { ChartIcon, ChecklistIcon, ExaminusIcon, HomeIcon, UserIcon } from '@assets/icons';
import { Box, View } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { OnboardingSteps } from '@components/pages/OnboardingInfo/onboarding';

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
        top: -52,
        width: 70,
        height: 70,
        marginLeft: 12,
        marginRight: 12,
        borderRadius: 14,
        backgroundColor: '#0CC1AF',
        position: 'relative',
        shadowColor: '#7F5DF0',
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="homepage"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 108,
          position: 'absolute',
          elevation: 0,
          backgroundColor: 'white',
          borderTopEndRadius: 35,
          borderTopStartRadius: 35,
          borderTopWidth: 0,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 20,
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
                bg={focused ? '#DDF4F2' : 'transparent'}
                borderRadius={10}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <HomeIcon color={focused ? '#0CC1AF' : '#BEC5D2'} />
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
                bg={focused ? '#DDF4F2' : 'transparent'}
                borderRadius={10}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <ChecklistIcon color={focused ? '#0CC1AF' : '#BEC5D2'} />
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
                bg={focused ? '#DDF4F2' : 'transparent'}
                borderRadius={10}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <ChartIcon color={focused ? '#0CC1AF' : '#BEC5D2'} />
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
                bg={focused ? '#DDF4F2' : 'transparent'}
                borderRadius={10}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <UserIcon color={focused ? '#0CC1AF' : '#BEC5D2'} />
              </Box>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
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
      {/* <Screen name="upload" component={UploadMain} /> */}
      <Screen name="heartScore" component={HeartScore} />

      {/** EXAM */}
      <Screen name="examList" component={ExamList} />
      <Screen name="exam" component={Exam} />

      {/* <Screen name="notifications" component={Notifications} />
      <Screen name="successSaved" component={SuccessSaved} /> */}

      {/** SETTINGS */}
      <Screen name="myAccount" component={MyAccount} />
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
