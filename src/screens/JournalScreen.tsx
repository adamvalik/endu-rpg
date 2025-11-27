import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
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

  const loadActivities = async (resetPagination = true) => {
    try {
      setLoading(true);
      const response = await getUserActivities(1, 10);
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
      // sync from Strava
      await syncStravaActivities(1, 3);
      // reload activities from Firestore
      await loadActivities();
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
      // sync from Strava
      await syncStravaActivities(1, 30);
      // reload activities from Firestore
      await loadActivities();
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
      // reload activities from Firestore
      await loadActivities();
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

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Journal</Text>
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading activities...</Text>
        </View>
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
});
