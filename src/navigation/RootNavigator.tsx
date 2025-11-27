import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, AppState, AppStateStatus } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { HomeScreen } from '../screens/HomeScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { StravaConnectScreen } from '../screens/StravaConnectScreen';
import { getUserProfile } from '../services/firebase';

/**
 * RootNavigator handles auth-based routing
 * Shows AuthScreen if user is not authenticated
 * Shows StravaConnectScreen if user is authenticated but Strava not connected
 * Shows HomeScreen if user is authenticated and Strava connected
 */
export const RootNavigator: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [stravaConnected, setStravaConnected] = useState<boolean | null>(null);
  const [checkingStrava, setCheckingStrava] = useState(true);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    checkStravaConnection();
  }, [user]);

  // Re-check Strava connection when app comes to foreground (after OAuth)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      // When app comes to foreground, re-check if needed
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        user
      ) {
        console.log('App came to foreground, re-checking Strava connection...');
        checkStravaConnection();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [user]);

  const checkStravaConnection = async () => {
    if (!user) {
      setStravaConnected(null);
      setCheckingStrava(false);
      return;
    }

    try {
      const profile = await getUserProfile();
      setStravaConnected(profile.profile.stravaConnected);
    } catch (error) {
      console.error('Error checking Strava connection:', error);
      setStravaConnected(false);
    } finally {
      setCheckingStrava(false);
    }
  };

  // Show loading indicator while checking auth state or Strava connection
  if (authLoading || (user && checkingStrava)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // Show appropriate screen based on auth state and Strava connection
  if (!user) {
    return <AuthScreen />;
  }

  if (!stravaConnected) {
    return <StravaConnectScreen />;
  }

  return <HomeScreen />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
