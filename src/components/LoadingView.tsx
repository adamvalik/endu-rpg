import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export const LoadingView: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FC4C02" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
