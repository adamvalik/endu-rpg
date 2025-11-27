import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StravaActivity } from '../types';
import { RoutePreview } from './RoutePreview';

interface ActivityTileProps {
  activity: StravaActivity;
}

export const ActivityTile: React.FC<ActivityTileProps> = ({ activity }) => {
  // Format distance (meters to km)
  const distanceKm = (activity.distance / 1000).toFixed(2);

  // Format time (seconds to HH:MM:SS or MM:SS)
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate pace (min/km) for running activities or speed (km/h) for others
  const isRunning = activity.type === 'Run' || activity.sport_type?.includes('Run');
  const paceOrSpeed = isRunning
    ? formatPace(activity.moving_time, activity.distance)
    : formatSpeed(activity.average_speed);

  function formatPace(seconds: number, meters: number): string {
    if (meters === 0) return '--:--';
    const paceSeconds = (seconds / meters) * 1000; // seconds per km
    const paceMinutes = Math.floor(paceSeconds / 60);
    const paceSecs = Math.floor(paceSeconds % 60);
    return `${paceMinutes}:${paceSecs.toString().padStart(2, '0')} /km`;
  }

  function formatSpeed(metersPerSecond: number): string {
    const kmh = (metersPerSecond * 3.6).toFixed(1);
    return `${kmh} km/h`;
  }

  // Format date
  const activityDate = new Date(activity.start_date_local);
  const dateStr = activityDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Get polyline for map preview
  const polyline = activity.map?.summary_polyline;

return (
    <View style={styles.container}>
      <View style={styles.contentRow}>
        {/* Left side: Info */}
        <View style={styles.infoSection}>
          {/* Header with name and date */}
          <View style={styles.header}>
            <Text style={styles.activityName} numberOfLines={1}>
              {activity.name}
            </Text>
            <Text style={styles.date}>{dateStr}</Text>
          </View>

          {/* Stats row */}
          <View style={polyline ? styles.statsRow : styles.statsRowWithoutMap}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Distance</Text>
              <Text style={styles.statValue}>{distanceKm} km</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Time</Text>
              <Text style={styles.statValue}>{formatTime(activity.moving_time)}</Text>
            </View>
            {/* <View style={styles.statBox}>
              <Text style={styles.statLabel}>{isRunning ? 'Pace' : 'Speed'}</Text>
              <Text style={styles.statValue}>{paceOrSpeed}</Text>
            </View> */}
          </View>

          {/* XP Badge */}
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{activity.xpEarned || 0} XP</Text>
          </View>
        </View>

        {/* Right side: Map */}
        { polyline && (
          <View style={styles.mapSection}>
            <RoutePreview
              encodedPolyline={polyline}
              width={135}
              height={175}
              strokeColor="#000"
              strokeWidth={2}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 12,
    overflow: 'hidden',
  },
  contentRow: {
    flexDirection: 'row',
  },
  infoSection: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  activityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statsRowWithoutMap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    width: '60%',
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  xpBadge: {
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#000',
    alignSelf: 'flex-start',
  },
  xpText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mapSection: {
    width: '40%',
    borderLeftWidth: 2,
    borderLeftColor: '#000',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 12,
    color: '#999',
  },
});
