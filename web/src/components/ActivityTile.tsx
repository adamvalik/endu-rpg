import type { StravaActivity } from '@shared/types'
import { RoutePreview } from './RoutePreview'
import { formatDistance, formatTime, formatDate } from '@shared/utils/formatters'

interface ActivityTileProps {
    activity: StravaActivity
}

export function ActivityTile({ activity }: ActivityTileProps) {
    const polyline = activity.map?.summary_polyline

    return (
        <div className="bg-white neo-border neo-shadow-sm mb-4 overflow-hidden relative group hover:neo-shadow hover:-translate-y-1 neo-transition">
            <div className="flex">
                <div className={`flex-1 p-4 ${polyline ? '' : 'w-3/5'}`}>
                    <div className="mb-4">
                        <h3 className="text-xl font-black truncate">{activity.name}</h3>
                        <p className="text-sm font-bold text-text-secondary">
                            {formatDate(activity.start_date_local)}
                        </p>
                    </div>

                    <div className="flex justify-between mb-4 pb-4 border-b-2 border-black">
                        <div>
                            <p className="text-xs font-black bg-black text-white px-2 py-1 mb-1 inline-block">DISTANCE</p>
                            <p className="text-base font-bold">{formatDistance(activity.distance)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-black bg-black text-white px-2 py-1 mb-1 inline-block">TIME</p>
                            <p className="text-base font-bold">{formatTime(activity.moving_time)}</p>
                        </div>
                    </div>

                    <div className="inline-flex bg-[var(--color-pastel-green)] text-black px-3 py-1.5 neo-border shadow-[2px_2px_0_rgba(0,0,0,1)] text-sm font-black">
                        +{activity.xpEarned || 0} XP
                    </div>
                </div>

                {polyline && (
                    <div className="w-2/5 border-l-3 border-black bg-[var(--color-app-bg)] relative overflow-hidden flex items-center justify-center filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
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
