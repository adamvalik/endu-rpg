import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StravaAuthData } from '../types';

interface WelcomeViewProps {
  stravaData: StravaAuthData;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ stravaData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>
        Welcome, {stravaData.data.athlete.firstname}!
      </Text>
      <Text style={styles.text}>You are connected!</Text>
      <Text style={styles.text}>
        Access Token: {stravaData.data.access_token.substring(0, 10)}...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0f3460',
    borderRadius: 0,
    borderWidth: 4,
    borderColor: '#4a5568',
    width: '100%',
  },
  helloText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFD700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
    color: '#b8b8d1',
  },
});
