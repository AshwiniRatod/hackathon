import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, clearError } from '../../store/slices/authSlice';
import { authAPI } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginRegisterScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleAuth = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    dispatch(loginStart());

    try {
      let response;
      if (isLogin) {
        response = await authAPI.login(phone, password);
      } else {
        response = await authAPI.register({
          phone,
          password,
          role: 'patient'
        });
      }

      const { token, user } = response.data;

      // Store token in AsyncStorage
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(user));

      // Dispatch success action
      dispatch(loginSuccess({ token, user }));

      // Navigate to main app
      // Navigation will automatically switch based on auth state
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = error.response?.data?.message || 'Authentication failed';
      dispatch(loginFailure(errorMessage));
      Alert.alert('Error', errorMessage);
    }
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    dispatch(clearError());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleAuth} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSwitchMode} disabled={loading}>
        <Text style={[styles.switchText, loading && styles.textDisabled]}>
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchText: {
    color: '#007bff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default LoginRegisterScreen;
