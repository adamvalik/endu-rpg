import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, Animated } from 'react-native';
import { ActivityTile } from '../components';
import { getUserActivities, syncStravaActivities } from '../services/firebase';
import { StravaActivity } from '../types';

interface JournalScreenProps {
  onSyncComplete?: () => void;
}

export const JournalScreen: React.FC<JournalScreenProps> = ({ onSyncComplete }) => {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async (resetPagination = true, useCache = true) => {
    try {
      setLoading(true);
      const response = await getUserActivities(1, 10, useCache);
      if (response && response.activities) {
        setActivities(response.activities);
        setHasMore(response.activities.length === 10);
        if (resetPagination) {
          setPage(1);
        }
      }
    } catch (err) {
      console.error('Error loading activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSync = async () => {
    try {
      setSyncing(true);
      // sync from Strava (this invalidates cache)
      await syncStravaActivities(1, 3);
      // reload activities from Firestore (skip cache to get fresh data)
      await loadActivities(true, false);
      // notify HomeScreen to refresh stats
      onSyncComplete?.();
    } catch (err) {
      Alert.alert('Error', 'Failed to sync activities. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleInitialManualSync = async () => {
    try {
      setSyncing(true);
      // sync from Strava (this invalidates cache)
      await syncStravaActivities(1, 30);
      // reload activities from Firestore (skip cache to get fresh data)
      await loadActivities(true, false);
      // notify HomeScreen to refresh stats
      onSyncComplete?.();
    } catch (err) {
      Alert.alert('Error', 'Failed to sync activities. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      // reload activities from Firestore (skip cache for pull-to-refresh)
      await loadActivities(true, false);
      // notify HomeScreen to refresh stats
      onSyncComplete?.();
    } catch (err) {
      console.error('Error refreshing:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const loadMoreActivities = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await getUserActivities(nextPage, 10);

      if (response && response.activities) {
        if (response.activities.length > 0) {
          setActivities([...activities, ...response.activities]);
          setPage(nextPage);
          setHasMore(response.activities.length === 10);
        } else {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error('Error loading more activities:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const SkeletonActivityTile = () => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);

    const opacity = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    return (
      <View style={styles.skeletonCard}>
        <View style={styles.skeletonContentRow}>
          {/* Left side: Info */}
          <View style={styles.skeletonInfoSection}>
            {/* Header - activity name and date */}
            <View style={styles.skeletonHeader}>
              <Animated.View style={[styles.skeletonTitle, { opacity }]} />
              <Animated.View style={[styles.skeletonDate, { opacity }]} />
            </View>

            {/* Stats row */}
            <View style={styles.skeletonStatsRow}>
              <View style={styles.skeletonStatBox}>
                <Animated.View style={[styles.skeletonStatLabel, { opacity }]} />
                <Animated.View style={[styles.skeletonStatValue, { opacity }]} />
              </View>
              <View style={styles.skeletonStatBox}>
                <Animated.View style={[styles.skeletonStatLabel, { opacity }]} />
                <Animated.View style={[styles.skeletonStatValue, { opacity }]} />
              </View>
            </View>

            {/* XP Badge */}
            <Animated.View style={[styles.skeletonXpBadge, { opacity }]} />
          </View>

          {/* Right side: Map placeholder */}
          <View style={styles.skeletonMapSection}>
            <Animated.View style={[styles.skeletonMap, { opacity }]} />
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Journal</Text>
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <SkeletonActivityTile />
          <SkeletonActivityTile />
          <SkeletonActivityTile />
          <SkeletonActivityTile />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Journal</Text>
      </View>

      {activities.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No activities yet</Text>
          <Text style={styles.emptySubtext}>Sync your activities to see them here</Text>
          <TouchableOpacity
            style={[styles.syncButton, syncing && styles.syncButtonDisabled]}
            onPress={handleInitialManualSync}
            disabled={syncing}
          >
            <Text style={styles.syncButtonText}>
              {syncing ? 'Syncing...' : 'Sync Activities'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#000"
                colors={['#000']}
              />
            }
            onScroll={({ nativeEvent }) => {
              const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
              const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
              if (isCloseToBottom && hasMore && !loadingMore) {
                loadMoreActivities();
              }
            }}
            scrollEventThrottle={400}
          >
            {activities.map((activity) => (
              <ActivityTile key={activity.id} activity={activity} />
            ))}
            {loadingMore && (
              <View style={styles.loadingMore}>
                <ActivityIndicator size="small" color="#000" />
                <Text style={styles.loadingMoreText}>Loading more...</Text>
              </View>
            )}
            {!hasMore && activities.length > 0 && (
              <View style={styles.endMessage}>
                <Text style={styles.endMessageText}>No more activities</Text>
              </View>
            )}
          </ScrollView>
          <View style={styles.syncFooter}>
            <TouchableOpacity
              style={[styles.syncButtonSmall, syncing && styles.syncButtonDisabled]}
              onPress={handleManualSync}
              disabled={syncing}
            >
              <Text style={styles.syncButtonTextSmall}>
                {syncing ? 'Syncing...' : '↻ Sync'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  syncButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#000',
  },
  syncButtonDisabled: {
    opacity: 0.5,
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  syncFooter: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  syncButtonSmall: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#000',
  },
  syncButtonTextSmall: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 14,
    color: '#666',
  },
  endMessage: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endMessageText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  skeletonCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 12,
    overflow: 'hidden',
  },
  skeletonContentRow: {
    flexDirection: 'row',
  },
  skeletonInfoSection: {
    flex: 1,
    padding: 16,
  },
  skeletonHeader: {
    marginBottom: 12,
  },
  skeletonTitle: {
    height: 18,
    backgroundColor: '#ddd',
    marginBottom: 4,
    width: '70%',
  },
  skeletonDate: {
    height: 12,
    backgroundColor: '#ddd',
    width: '40%',
  },
  skeletonStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    width: '60%',
  },
  skeletonStatBox: {
    flex: 1,
  },
  skeletonStatLabel: {
    height: 11,
    backgroundColor: '#ddd',
    marginBottom: 4,
    width: '60%',
  },
  skeletonStatValue: {
    height: 14,
    backgroundColor: '#ddd',
    width: '80%',
  },
  skeletonXpBadge: {
    height: 26,
    backgroundColor: '#ddd',
    width: 70,
  },
  skeletonMapSection: {
    width: '40%',
    borderLeftWidth: 2,
    borderLeftColor: '#000',
  },
  skeletonMap: {
    width: '100%',
    height: 175,
    backgroundColor: '#f0f0f0',
  },
});
