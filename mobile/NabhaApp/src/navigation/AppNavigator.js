import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Auth Screens
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import PhoneInputScreen from '../screens/auth/PhoneInputScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';

// Patient Screens
import PatientDashboard from '../screens/patient/PatientDashboardScreen';
import SymptomCheckerScreen from '../screens/patient/SymptomCheckerScreen';
import DoctorSearchScreen from '../screens/patient/DoctorSearchScreen';
import BookConsultationScreen from '../screens/patient/BookConsultationScreen';
import HealthRecordsScreen from '../screens/patient/HealthRecordsScreen';
import PrescriptionsScreen from '../screens/patient/PrescriptionsScreen';
import ProfileScreen from '../screens/patient/ProfileScreen';

// Emergency Screens
import SOSScreen from '../screens/emergency/SOSScreen';
import EmergencyContactsScreen from '../screens/emergency/EmergencyContactsScreen';

// ASHA Screens
import ASHADashboard from '../screens/asha/ASHADashboard';
import FieldVisitsScreen from '../screens/asha/FieldVisitsScreen';
import ReportsScreen from '../screens/asha/ReportsScreen';

// Common Screens
import ConsultationScreen from '../screens/common/ConsultationScreen';
import SettingsScreen from '../screens/common/SettingsScreen';
import NotificationsScreen from '../screens/common/NotificationsScreen';

import { theme } from '../utils/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack Navigator
const AuthNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background }
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="PhoneInput" component={PhoneInputScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
};

// Patient Tab Navigator
const PatientTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Health') {
            iconName = 'favorite';
          } else if (route.name === 'Consult') {
            iconName = 'video-call';
          } else if (route.name === 'Records') {
            iconName = 'folder';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
      })}
    >
      <Tab.Screen name="Dashboard" component={PatientDashboard} />
      <Tab.Screen name="Health" component={SymptomCheckerScreen} />
      <Tab.Screen name="Consult" component={DoctorSearchScreen} />
      <Tab.Screen name="Records" component={HealthRecordsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// ASHA Tab Navigator
const ASHATabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Visits') {
            iconName = 'location-on';
          } else if (route.name === 'Reports') {
            iconName = 'assessment';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
      })}
    >
      <Tab.Screen name="Dashboard" component={ASHADashboard} />
      <Tab.Screen name="Visits" component={FieldVisitsScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user?.role === 'patient' && (
        <Stack.Screen name="PatientMain" component={PatientTabNavigator} />
      )}
      {user?.role === 'asha' && (
        <Stack.Screen name="ASHAMain" component={ASHATabNavigator} />
      )}
      
      {/* Common Screens */}
      <Stack.Screen 
        name="BookConsultation" 
        component={BookConsultationScreen}
        options={{ headerShown: true, title: 'Book Consultation' }}
      />
      <Stack.Screen 
        name="Consultation" 
        component={ConsultationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Prescriptions" 
        component={PrescriptionsScreen}
        options={{ headerShown: true, title: 'Prescriptions' }}
      />
      <Stack.Screen 
        name="SOS" 
        component={SOSScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="EmergencyContacts" 
        component={EmergencyContactsScreen}
        options={{ headerShown: true, title: 'Emergency Contacts' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ headerShown: true, title: 'Settings' }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ headerShown: true, title: 'Notifications' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
