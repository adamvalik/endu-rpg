import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStravaAuth } from '../hooks/useStravaAuth';

export const StravaConnectScreen: React.FC = () => {
  const { isLoading, startAuth, isAuthReady } = useStravaAuth();

  const handleStravaConnect = async () => {
    if (!isAuthReady) {
      Alert.alert('Please wait', 'Strava authentication is loading...');
      return;
    }
    startAuth();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>EnduRPG</Text>
          <Text style={styles.subtitle}>Connect Your Activities</Text>
        </View>

        {/* Main Content */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Connect to Strava</Text>
          <Text style={styles.cardText}>
            EnduRPG uses your Strava activities to track your progress and award XP.
          </Text>
          <Text style={styles.cardText}>
            Connect your Strava account to start your adventure!
          </Text>

          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureText}>Automatic activity sync</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎮</Text>
              <Text style={styles.featureText}>Earn XP and level up</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔥</Text>
              <Text style={styles.featureText}>Build activity streaks</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleStravaConnect}
            disabled={isLoading}
            style={styles.stravaButtonContainer}
          >
            <Image
              source={require('../../assets/btn_strava_connect_with_white.png')}
              style={styles.stravaButton}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#000" />
              <Text style={styles.connectingText}>Connecting...</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    padding: 24,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  features: {
    marginTop: 20,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#000',
  },
  stravaButtonContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  stravaButton: {
    width: 193,
    height: 48,
    borderWidth: 1,
    borderColor: '#000',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  connectingText: {
    fontSize: 14,
    color: '#666',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
