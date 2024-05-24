import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

/** NEW */
import {
  Gender,
  Weight,
  Age,
  Physical,
  Humour,
  Habits,
  Upload,
  UploadError,
  Score,
} from '@components/pages/OnboardingInfo';
import {
  BiomConfig,
  EditProfile,
  NotificationConfig,
  OtpConfig,
  PasswordConfig,
  OtpSecurity,
} from '@components/pages/OnboardingSetup';
import { Homepage, HealthWallet, HeartScore } from '@components/pages/Homepage';
import { Exam, ExamList } from '@components/pages/Exam';

import { Tabs } from '../navigation/tabs';
import {
  createBottomTabNavigator,
  BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs';
import {
  ChartIcon,
  ChecklistIcon,
  ExaminusIcon,
  HomeIcon,
  UserIcon,
} from '@assets/icons';
import { Box, useDisclose, View } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { ActionSheetUpload } from '@components/organisms';
import { OnboardingSteps } from '@components/pages/OnboardingInfo/onboarding';

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
};

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AppRoutes>();

const Tab = createBottomTabNavigator<AppRoutes>();

const CustomTabExaminusButton = ({
  children,
  onPress,
}: BottomTabBarButtonProps) => (
  <TouchableOpacity style={{}} onPress={onPress}>
    <View
      style={{
        top: -50,
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
  const { isOpen, onClose } = useDisclose();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 100,
          position: 'absolute',
          elevation: 0,
          backgroundColor: 'white',
          borderTopEndRadius: 35,
          borderTopStartRadius: 35,
          borderTopWidth: 0,
          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 20,
        },
      }}
    >
      <Tab.Screen
        name="homepage"
        component={Homepage}
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
                <HomeIcon color={focused ? '#0CC1AF' : '#BEC5D2'} />
              </Box>
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
                <ChecklistIcon color={focused ? '#0CC1AF' : '#BEC5D2'} />
              </Box>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="upload"
        component={ActionSheetUpload}
        options={{
          unmountOnBlur: true,
          tabBarIcon: () => <ExaminusIcon />,
          tabBarButton: ({ children, onPress }) => (
            <CustomTabExaminusButton children={children} onPress={onPress} />
          ),
        }}
      />
      <Tab.Screen
        name="Homepage3"
        component={Homepage}
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
        name="info"
        component={Homepage}
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
      {/* <Screen name="gender" component={Gender} />
      <Screen name="weight" component={Weight} />
      <Screen name="age" component={Age} />
      <Screen name="physical" component={Physical} />
      <Screen name="humour" component={Humour} />
      <Screen name="habits" component={Habits} />
      <Screen name="upload" component={Upload} />
      <Screen name="uploadError" component={UploadError} />
      <Screen name="score" component={Score} /> */}

      {/** ONBOARDING */}
      {/* <Screen name="editProfile" component={EditProfile} />
      <Screen name="passwordConfig" component={PasswordConfig} />
      <Screen name="notificationConfig" component={NotificationConfig} />
      <Screen name="biomConfig" component={BiomConfig} />
      <Screen name="otpConfig" component={OtpConfig} />
      <Screen name="otpSecurity" component={OtpSecurity} /> */}

      {/** HOMEPAGE */}
      {/* <Screen name="homepage" component={HomeTabs} /> */}
      {/*  <Screen name="healthWallet" component={HomeTabs} /> 
      <Screen name="heartScore" component={HeartScore} />*/}

      {/** EXAM */}
      {/* <Screen name="examList" component={ExamList} /> */}
      {/* <Screen name="exam" component={Exam} /> */}

      {/* <Screen name="notifications" component={Notifications} />
      <Screen name="successSaved" component={SuccessSaved} /> */}

      {/* <Screen name="myAccount" component={MyAccount} />
      <Screen name="configNotifications" component={ConfigNotifications} />
      <Screen name="info" component={Info} />
      <Screen name="security" component={Security} />
      <Screen name="contactUs" component={ContactUs} /> */}
      {/* <Screen name="aboutUs" component={AboutUs} /> */}
      {/* <Screen name="tracker" component={Tracker} /> */}
      {/* <Screen name="weightTracker" component={WeightTracker} /> */}
    </Navigator>
  );
}
