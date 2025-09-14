import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme, spacing, typography } from '../../utils/theme';

const OTPVerificationScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const { phoneNumber, isNewUser } = route.params;

  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, accept any 6-digit OTP
      // In production, verify with your backend API
      console.log('📱 OTP entered:', otpCode);
      console.log('📞 Phone number:', phoneNumber);
      
      // Simulate API call success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isNewUser) {
        // Navigate to role selection for new users
        navigation.navigate('RoleSelection', { phoneNumber });
      } else {
        // For existing users, navigate to main app
        await AsyncStorage.setItem('userToken', 'demo-token-123');
        navigation.replace('Main');
      }
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setResendTimer(30);
    try {
      // Resend OTP logic here
      console.log('📱 Resending OTP to:', phoneNumber);
      Alert.alert('Success', 'OTP sent successfully!');
    } catch (error) {
      console.error('Error resending OTP:', error);
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🔐 Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to
          </Text>
          <Text style={styles.phoneNumber}>+91 {phoneNumber}</Text>
          <Text style={styles.subtitlePunjabi}>
            ਕੋਡ ਦਾਖਲ ਕਰੋ
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => inputRefs.current[index] = ref}
              style={[
                styles.otpInput,
                digit ? styles.otpInputFilled : null
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity 
          style={[
            styles.verifyButton,
            otp.join('').length === 6 ? styles.verifyButtonActive : styles.verifyButtonInactive
          ]}
          onPress={handleVerifyOTP}
          disabled={loading || otp.join('').length !== 6}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.verifyButtonText}>
              Verify OTP / ਤਸਦੀਕ ਕਰੋ
            </Text>
          )}
        </TouchableOpacity>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Didn't receive the code?
          </Text>
          <TouchableOpacity 
            onPress={handleResendOTP}
            disabled={resendTimer > 0}
          >
            <Text style={[
              styles.resendLink,
              resendTimer > 0 ? styles.resendLinkDisabled : null
            ]}>
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Back to Phone Input */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>
            ← Change Phone Number
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl * 2,
  },
  title: {
    ...typography.headline2,
    color: theme.colors.onBackground,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body1,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  phoneNumber: {
    ...typography.body1,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginVertical: spacing.xs,
  },
  subtitlePunjabi: {
    ...typography.body2,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: theme.colors.outline,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    ...typography.headline3,
    color: theme.colors.onSurface,
  },
  otpInputFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryContainer,
  },
  verifyButton: {
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  verifyButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  verifyButtonInactive: {
    backgroundColor: theme.colors.outline,
  },
  verifyButtonText: {
    ...typography.button,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resendText: {
    ...typography.body2,
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  resendLink: {
    ...typography.body2,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  resendLinkDisabled: {
    color: theme.colors.onSurfaceVariant,
  },
  backButton: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  backButtonText: {
    ...typography.body2,
    color: theme.colors.primary,
  },
});

export default OTPVerificationScreen;
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter complete OTP');
      return;
    }

    try {
      await dispatch(verifyOTP({ phoneNumber, otp: otpCode })).unwrap();
      navigation.navigate('RoleSelection');
    } catch (error) {
      Alert.alert('Error', error.message || 'Invalid OTP');
    }
  };

  const handleResendOTP = () => {
    if (resendTimer === 0) {
      setResendTimer(30);
      // Add resend OTP logic here
      Alert.alert('Success', 'OTP sent successfully');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ਪੁਸ਼ਟੀ ਕਰੋ</Text>
        <Text style={styles.subtitle}>Verify OTP</Text>
        <Text style={styles.description}>
          {phoneNumber} ਤੇ ਭੇਜੇ ਗਏ 6 ਅੰਕਾਂ ਦਾ ਕੋਡ ਦਾਖਲ ਕਰੋ
        </Text>
        <Text style={styles.descriptionEn}>
          Enter the 6-digit code sent to {phoneNumber}
        </Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.otpInput,
              digit ? styles.otpInputFilled : null,
            ]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.verifyButton, loading && styles.disabledButton]}
        onPress={handleVerifyOTP}
        disabled={loading}
      >
        <Text style={styles.verifyButtonText}>
          {loading ? 'ਪੁਸ਼ਟੀ ਹੋ ਰਹੀ ਹੈ...' : 'ਪੁਸ਼ਟੀ ਕਰੋ'}
        </Text>
        <Text style={styles.verifyButtonTextEn}>
          {loading ? 'Verifying...' : 'Verify'}
        </Text>
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        {resendTimer > 0 ? (
          <Text style={styles.resendTimer}>
            ਦੁਬਾਰਾ ਭੇਜਣ ਲਈ {resendTimer} ਸਕਿੰਟ ਉਡੀਕ ਕਰੋ
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResendOTP}>
            <Text style={styles.resendText}>OTP ਦੁਬਾਰਾ ਭੇਜੋ</Text>
            <Text style={styles.resendTextEn}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c5aa0',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  descriptionEn: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: (width - 80) / 6,
    height: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#fff',
  },
  otpInputFilled: {
    borderColor: '#2c5aa0',
    backgroundColor: '#f0f7ff',
  },
  verifyButton: {
    backgroundColor: '#2c5aa0',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  verifyButtonTextEn: {
    color: '#fff',
    fontSize: 14,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendTimer: {
    fontSize: 14,
    color: '#666',
  },
  resendText: {
    fontSize: 16,
    color: '#2c5aa0',
    fontWeight: 'bold',
  },
  resendTextEn: {
    fontSize: 14,
    color: '#2c5aa0',
  },
});

export default OTPVerificationScreen;
