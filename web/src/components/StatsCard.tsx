import type { UserProfile } from '@shared/types'

interface StatsCardProps {
    userProfile: UserProfile
}

export function StatsCard({ userProfile }: StatsCardProps) {
    const stats = userProfile.stats

    return (
        <div className="card bg-[var(--color-pastel-blue)] mb-6 rotate-[-1deg]">
            <h2 className="text-2xl font-black mb-4 font-tiny5 border-b-3 border-black pb-2">
                LIFETIME STATS
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white neo-border p-3 neo-shadow-sm rotate-1 flex flex-col items-center">
                    <p className="text-xs font-black bg-black text-white px-2 py-1 mb-2">ACTIVITIES</p>
                    <p className="text-3xl font-black font-tiny5">{stats?.activitiesCount || 0}</p>
                </div>

                <div className="bg-[var(--color-pastel-yellow)] neo-border p-3 neo-shadow-sm rotate-[-1deg] flex flex-col items-center">
                    <p className="text-xs font-black bg-black text-white px-2 py-1 mb-2">DISTANCE</p>
                    <p className="text-2xl font-black font-tiny5">
                        {((stats?.totalDistance || 0) / 1000).toFixed(1)} <span className="text-sm">KM</span>
                    </p>
                </div>

                <div className="bg-[var(--color-pastel-green)] neo-border p-3 neo-shadow-sm flex flex-col items-center">
                    <p className="text-xs font-black bg-black text-white px-2 py-1 mb-2">TIME</p>
                    <p className="text-2xl font-black font-tiny5">
                        {((stats?.totalMovingTime || 0) / 3600).toFixed(1)} <span className="text-sm">HRS</span>
                    </p>
                </div>

                <div className="bg-[#fbcfe8] neo-border p-3 neo-shadow-sm rotate-1 flex flex-col items-center">
                    <p className="text-xs font-black bg-black text-white px-2 py-1 mb-2">ELEVATION</p>
                    <p className="text-2xl font-black font-tiny5">
                        {(stats?.totalElevationGain || 0).toLocaleString()} <span className="text-sm">M</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
