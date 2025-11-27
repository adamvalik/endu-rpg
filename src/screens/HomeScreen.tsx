import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../services/auth';
import { getUserProfile, getGameProfile } from '../services/firebase';
import { JournalScreen } from './JournalScreen';
import { UserProfile, GameProfile, DailyQuest } from '../types';

type TabType = 'hero' | 'journal';

export const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [gameProfile, setGameProfile] = useState<GameProfile | null>(null);
  const [activeQuests, setActiveQuests] = useState<DailyQuest[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const profile = (await getUserProfile()).profile;
      setUserProfile(profile);

      if (profile.stravaConnected) {
        const game = await getGameProfile();
        setGameProfile(game.game);
        setActiveQuests(game.activeQuests);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const renderHeroTab = () => (
    <View style={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>EnduRPG</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Game Profile Card */}
      {gameProfile && (
        <View style={styles.card}>
              <Text style={styles.cardTitle}>Character</Text>
              <View style={styles.row}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Level {gameProfile.level}</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{gameProfile.tier}</Text>
                </View>
                {gameProfile.streakActive && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>🔥 {gameProfile.streakCount}d</Text>
                  </View>
                )}
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(gameProfile.currentLevelXP / gameProfile.nextLevelXP) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.xpText}>
                {gameProfile.currentLevelXP} / {gameProfile.nextLevelXP} XP
              </Text>
        </View>
      )}

      {/* Daily Quests */}
      {/* {activeQuests.length > 0 && gameProfile && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Quests</Text>
          {activeQuests.map((quest) => {
            const completed = gameProfile.completedQuestsToday.includes(quest.id);
            return (
              <View key={quest.id} style={styles.questItem}>
                <Text style={styles.questText}>
                  {completed ? '✅' : '⬜'} {quest.name}
                </Text>
                <Text style={styles.questReward}>+{quest.reward} XP</Text>
              </View>
            );
          })}
        </View>
      )} */}

      {/* Stats Summary */}
      {userProfile?.stats && userProfile.stats.activitiesCount > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Statistics</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{userProfile.stats.activitiesCount}</Text>
                  <Text style={styles.statLabel}>Activities</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>
                    {(userProfile.stats.totalDistance / 1000).toFixed(1)}
                  </Text>
                  <Text style={styles.statLabel}>km</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>
                    {Math.floor(userProfile.stats.totalMovingTime / 3600)}
                  </Text>
                  <Text style={styles.statLabel}>hours</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>
                    {Math.round(userProfile.stats.totalElevationGain)}
                  </Text>
                  <Text style={styles.statLabel}>elevation (m)</Text>
                </View>
            </View>
          </View>
        )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {activeTab === 'hero' ? renderHeroTab() : <JournalScreen onSyncComplete={loadData} />}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'hero' && styles.navButtonActive]}
          onPress={() => setActiveTab('hero')}
        >
          <Text style={[styles.navText, activeTab === 'hero' && styles.navTextActive]}>
            Hero
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'journal' && styles.navButtonActive]}
          onPress={() => setActiveTab('journal')}
        >
          <Text style={[styles.navText, activeTab === 'journal' && styles.navTextActive]}>
            Journal
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  signOutText: {
    fontSize: 14,
    color: '#000',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  progressBar: {
    height: 24,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
  },
  xpText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  questItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  questText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  questReward: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  backButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    padding: 16,
    backgroundColor: '#fff',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#000',
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  navButtonActive: {
    backgroundColor: '#000',
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  navTextActive: {
    color: '#fff',
  },
});
