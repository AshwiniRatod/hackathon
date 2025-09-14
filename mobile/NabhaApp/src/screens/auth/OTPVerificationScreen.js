import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOTP } from '../../store/slices/authSlice';

const { width } = Dimensions.get('window');

const OTPVerificationScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const { phoneNumber } = route.params;

  const inputRefs = useRef([]);

  React.useEffect(() => {
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
