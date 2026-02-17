import type { GameProfile } from '@shared/types'

interface CharacterCardProps {
  gameProfile: GameProfile
}

export function CharacterCard({ gameProfile }: CharacterCardProps) {
  const progressPercent = (gameProfile.currentLevelXP / gameProfile.nextLevelXP) * 100

  return (
    <div className="card mb-4">
      <h2 className="text-lg font-bold mb-3">Character</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="badge">Level {gameProfile.level}</div>
        <div className="badge">{gameProfile.tier}</div>
        {gameProfile.streakActive && (
          <div className="badge">🔥 {gameProfile.streakCount}d</div>
        )}
      </div>

      <div className="progress-bar mb-2">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="text-sm text-text-secondary">
        {gameProfile.currentLevelXP.toLocaleString()} / {gameProfile.nextLevelXP.toLocaleString()} XP
      </p>
    </div>
  )
}
