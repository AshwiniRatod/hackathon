import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import EmergencySosButton from './EmergencySosButton';

const FloatingSOSProvider = ({ children }) => {
  const user = useSelector(state => state.auth.user);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  // Only show floating SOS button for authenticated patients and ASHA workers
  const shouldShowFloatingSOS = isAuthenticated && user && ['patient', 'asha'].includes(user.role);

  return (
    <View style={styles.container}>
      {children}
      
      {shouldShowFloatingSOS && (
        <EmergencySosButton
          size="medium"
          position="floating"
          userId={user.id}
          userProfile={user}
          style={styles.floatingSOS}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingSOS: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 1000,
  },
});

export default FloatingSOSProvider;
