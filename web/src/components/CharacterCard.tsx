import type { GameProfile } from '@shared/types'

interface CharacterCardProps {
    gameProfile: GameProfile
}

export function CharacterCard({ gameProfile }: CharacterCardProps) {
    const progressPercent = (gameProfile.currentLevelXP / gameProfile.nextLevelXP) * 100

    return (
        <div className="card bg-[var(--color-pastel-pink)] mb-6 rotate-1">
            <h2 className="text-2xl font-black mb-4 font-tiny5 border-b-3 border-black pb-2">
                HERO PROFILE
            </h2>

            <div className="flex flex-wrap gap-3 mb-6">
                <div className="badge bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">LVL {gameProfile.level}</div>
                <div className="badge bg-[var(--color-pastel-yellow)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">{gameProfile.tier}</div>
                {gameProfile.streakActive && (
                    <div className="badge bg-[var(--color-pastel-blue)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        🔥 {gameProfile.streakCount} DAY STREAK
                    </div>
                )}
            </div>

            <div className="progress-bar mb-3">
                <div
                    className="progress-fill"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            <p className="text-sm font-bold bg-white neo-border inline-block px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg]">
                {gameProfile.currentLevelXP.toLocaleString()} / {gameProfile.nextLevelXP.toLocaleString()} XP
            </p>
        </div>
    )
}
