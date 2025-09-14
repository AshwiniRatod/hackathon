import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { theme, spacing, typography } from '../../utils/theme';

const roles = [
  {
    id: 'patient',
    title: 'ਮਰੀਜ਼',
    titleEn: 'Patient',
    description: 'ਇਲਾਜ ਲਈ ਡਾਕਟਰਾਂ ਨਾਲ ਸੰਪਰਕ ਕਰੋ',
    descriptionEn: 'Connect with doctors for treatment',
    icon: '🏥',
    color: '#4CAF50',
  },
  {
    id: 'asha',
    title: 'ASHA ਵਰਕਰ',
    titleEn: 'ASHA Worker',
    description: 'ਕਮਿਊਨਿਟੀ ਸਿਹਤ ਸੇਵਾਵਾਂ',
    descriptionEn: 'Community health services',
    icon: '👩‍🌾',
    color: '#FF9800',
  },
];

const RoleSelectionScreen = ({ navigation, route }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const { phoneNumber } = route.params;

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleContinue = async () => {
    if (!selectedRole) {
      Alert.alert('Error', 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਭੂਮਿਕਾ ਚੁਣੋ / Please select a role');
      return;
    }

    setLoading(true);
    try {
      console.log('📱 Role selected:', selectedRole);
      console.log('📞 Phone number:', phoneNumber);
      
      // Navigate to profile setup
      navigation.navigate('ProfileSetup', { 
        role: selectedRole, 
        phoneNumber: phoneNumber 
      });
      
    } catch (error) {
      console.error('Error selecting role:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🎭 Select Your Role</Text>
          <Text style={styles.subtitle}>
            ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ
          </Text>
          <Text style={styles.description}>
            Choose how you'll use the app
          </Text>
        </View>

        {/* Role Cards */}
        <View style={styles.rolesContainer}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleCard,
                selectedRole === role.id && styles.roleCardSelected,
                { borderLeftColor: role.color }
              ]}
              onPress={() => handleRoleSelect(role.id)}
              activeOpacity={0.8}
            >
              <View style={styles.roleContent}>
                <View style={styles.roleIcon}>
                  <Text style={styles.roleIconText}>{role.icon}</Text>
                </View>
                
                <View style={styles.roleInfo}>
                  <Text style={styles.roleTitle}>{role.titleEn}</Text>
                  <Text style={styles.roleTitlePunjabi}>{role.title}</Text>
                  <Text style={styles.roleDescription}>{role.descriptionEn}</Text>
                  <Text style={styles.roleDescriptionPunjabi}>{role.description}</Text>
                </View>
                
                <View style={styles.roleSelector}>
                  <View style={[
                    styles.radioButton,
                    selectedRole === role.id && styles.radioButtonSelected
                  ]}>
                    {selectedRole === role.id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          style={[
            styles.continueButton,
            selectedRole ? styles.continueButtonActive : styles.continueButtonInactive
          ]}
          onPress={handleContinue}
          disabled={loading || !selectedRole}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.continueButtonText}>
              Continue / ਜਾਰੀ ਰੱਖੋ
            </Text>
          )}
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>
            ← Back to OTP
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
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  title: {
    ...typography.headline2,
    color: theme.colors.onBackground,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body1,
    color: theme.colors.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...typography.body2,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  rolesContainer: {
    flex: 1,
    marginBottom: spacing.lg,
  },
  roleCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.outline,
    borderLeftWidth: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roleCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryContainer,
  },
  roleContent: {
    flexDirection: 'row',
    padding: spacing.lg,
    alignItems: 'center',
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  roleIconText: {
    fontSize: 28,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    ...typography.headline3,
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  roleTitlePunjabi: {
    ...typography.body1,
    color: theme.colors.primary,
    marginBottom: spacing.sm,
  },
  roleDescription: {
    ...typography.body2,
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  roleDescriptionPunjabi: {
    ...typography.caption,
    color: theme.colors.onSurfaceVariant,
  },
  roleSelector: {
    marginLeft: spacing.sm,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: theme.colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  continueButton: {
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  continueButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  continueButtonInactive: {
    backgroundColor: theme.colors.outline,
  },
  continueButtonText: {
    ...typography.button,
    color: '#FFFFFF',
    fontWeight: 'bold',
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

export default RoleSelectionScreen;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ</Text>
        <Text style={styles.subtitle}>Select Your Role</Text>
        <Text style={styles.description}>
          ਆਪਣੇ ਲਈ ਸਭ ਤੋਂ ਢੁਕਵੀਂ ਭੂਮਿਕਾ ਚੁਣੋ
        </Text>
        <Text style={styles.descriptionEn}>
          Choose the role that best describes you
        </Text>
      </View>

      <View style={styles.rolesContainer}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={[
              styles.roleCard,
              selectedRole === role.id && styles.selectedRoleCard,
              { borderColor: role.color },
            ]}
            onPress={() => handleRoleSelect(role.id)}
          >
            <View style={styles.roleHeader}>
              <Text style={styles.roleIcon}>{role.icon}</Text>
              <View style={styles.roleTitles}>
                <Text style={[styles.roleTitle, { color: role.color }]}>
                  {role.title}
                </Text>
                <Text style={[styles.roleTitleEn, { color: role.color }]}>
                  {role.titleEn}
                </Text>
              </View>
            </View>
            <Text style={styles.roleDescription}>{role.description}</Text>
            <Text style={styles.roleDescriptionEn}>{role.descriptionEn}</Text>
            {selectedRole === role.id && (
              <View style={[styles.selectedIndicator, { backgroundColor: role.color }]}>
                <Text style={styles.selectedText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          selectedRole && styles.continueButtonActive,
          loading && styles.disabledButton,
        ]}
        onPress={handleContinue}
        disabled={!selectedRole || loading}
      >
        <Text style={styles.continueButtonText}>
          {loading ? 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...' : 'ਜਾਰੀ ਰੱਖੋ'}
        </Text>
        <Text style={styles.continueButtonTextEn}>
          {loading ? 'Loading...' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40,
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
    marginBottom: 15,
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
  rolesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  roleCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  selectedRoleCard: {
    borderWidth: 3,
    backgroundColor: '#f8f9ff',
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  roleIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  roleTitles: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  roleTitleEn: {
    fontSize: 16,
    fontWeight: '600',
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  roleDescriptionEn: {
    fontSize: 12,
    color: '#888',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#ccc',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#2c5aa0',
  },
  disabledButton: {
    backgroundColor: '#ddd',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueButtonTextEn: {
    color: '#fff',
    fontSize: 14,
  },
});

export default RoleSelectionScreen;
