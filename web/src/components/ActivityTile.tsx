import type { StravaActivity } from '@shared/types'
import { RoutePreview } from './RoutePreview'
import { formatDistance, formatTime, formatDate } from '@shared/utils/formatters'

interface ActivityTileProps {
  activity: StravaActivity
}

export function ActivityTile({ activity }: ActivityTileProps) {
  const polyline = activity.map?.summary_polyline

  return (
    <div className="card mb-3 overflow-hidden">
      <div className="flex">
        <div className={`flex-1 p-4 ${polyline ? '' : 'w-3/5'}`}>
          <div className="mb-3">
            <h3 className="text-lg font-bold truncate">{activity.name}</h3>
            <p className="text-xs text-text-secondary">
              {formatDate(activity.start_date_local)}
            </p>
          </div>

          <div className="flex justify-between mb-3 pb-3 border-b border-gray-300">
            <div>
              <p className="text-xs text-text-secondary uppercase mb-1">Distance</p>
              <p className="text-sm font-semibold">{formatDistance(activity.distance)}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase mb-1">Time</p>
              <p className="text-sm font-semibold">{formatTime(activity.moving_time)}</p>
            </div>
          </div>

          <div className="inline-flex bg-black text-white px-3 py-1.5 border border-black text-sm font-bold">
            +{activity.xpEarned || 0} XP
          </div>
        </div>

        {polyline && (
          <div className="w-2/5 border-l-2 border-border">
            <RoutePreview
              encodedPolyline={polyline}
              width={200}
              height={200}
            />
          </div>
        )}
      </div>
    </div>
  )
}
