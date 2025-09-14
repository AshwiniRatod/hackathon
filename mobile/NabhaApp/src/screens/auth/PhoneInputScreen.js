import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, spacing, typography } from '../../utils/theme';

const PhoneInputScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone Input Screen</Text>
      <Text style={styles.subtitle}>
        This will contain phone number input with country code picker
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: spacing.lg,
  },
  title: {
    ...typography.headline2,
    color: theme.colors.onBackground,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body1,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
});

export default PhoneInputScreen;
