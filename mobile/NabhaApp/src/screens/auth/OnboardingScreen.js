import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setFirstLaunch } from '../../store/slices/authSlice';
import { theme, spacing, typography } from '../../utils/theme';

const OnboardingScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched) {
        // Skip onboarding and go to phone input
        navigation.replace('PhoneInput');
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
    }
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasLaunched', 'true');
      dispatch(setFirstLaunch(false));
      navigation.navigate('PhoneInput');
    } catch (error) {
      console.error('Error setting first launch:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      <View style={styles.content}>
        {/* Logo and Title */}
        <View style={styles.headerSection}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🏥</Text>
          </View>
          <Text style={styles.title}>ਨਾਭਾ ਸਿਹਤ</Text>
          <Text style={styles.subtitle}>Nabha Health</Text>
          <Text style={styles.tagline}>
            ਤੁਹਾਡੀ ਸਿਹਤ, ਸਾਡੀ ਜ਼ਿੰਮੇਵਾਰੀ
          </Text>
          <Text style={styles.taglineEn}>
            Your Health, Our Responsibility
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🏥</Text>
            <Text style={styles.featureText}>Free Teleconsultation</Text>
            <Text style={styles.featureSubtext}>मुफ्त टेली परामर्श</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🚨</Text>
            <Text style={styles.featureText}>Emergency SOS</Text>
            <Text style={styles.featureSubtext}>आपातकालीन SOS</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureText}>Works Offline</Text>
            <Text style={styles.featureSubtext}>ऑफलाइन काम करता है</Text>
          </View>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity 
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedText}>ਸ਼ੁਰੂ ਕਰੋ / Get Started</Text>
        </TouchableOpacity>

        {/* Language Note */}
        <Text style={styles.languageNote}>
          Available in English, ਪੰਜਾਬੀ, हिंदी
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.onPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.onPrimary,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: 16,
    color: theme.colors.onPrimary,
    textAlign: 'center',
    opacity: 0.9,
  },
  taglineEn: {
    fontSize: 14,
    color: theme.colors.onPrimary,
    textAlign: 'center',
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  featuresSection: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
  featureSubtext: {
    fontSize: 12,
    color: theme.colors.onPrimary,
    opacity: 0.8,
  },
  getStartedButton: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSecondary,
    textAlign: 'center',
  },
  languageNote: {
    fontSize: 12,
    color: theme.colors.onPrimary,
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default OnboardingScreen;
