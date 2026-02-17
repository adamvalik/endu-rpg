import type { UserProfile } from '@shared/types'

interface StatsCardProps {
  userProfile: UserProfile
}

export function StatsCard({ userProfile }: StatsCardProps) {
  const stats = userProfile.stats

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-3">Statistics</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-text-secondary uppercase mb-1">Activities</p>
          <p className="text-xl font-bold">{stats?.activitiesCount || 0}</p>
        </div>

        <div>
          <p className="text-xs text-text-secondary uppercase mb-1">Distance</p>
          <p className="text-xl font-bold">
            {((stats?.totalDistance || 0) / 1000).toFixed(1)} km
          </p>
        </div>

        <div>
          <p className="text-xs text-text-secondary uppercase mb-1">Time</p>
          <p className="text-xl font-bold">
            {((stats?.totalMovingTime || 0) / 3600).toFixed(1)} hrs
          </p>
        </div>

        <div>
          <p className="text-xs text-text-secondary uppercase mb-1">Elevation</p>
          <p className="text-xl font-bold">
            {(stats?.totalElevationGain || 0).toLocaleString()} m
          </p>
        </div>
      </div>
    </div>
  )
}
