import type { GameProfile } from '@shared/types'

interface AvatarProfileProps {
    gameProfile: GameProfile
}

export function AvatarProfile({ gameProfile }: AvatarProfileProps) {
    const getAvatarPath = () => {
        const level = gameProfile.level || 1

        if (level < 10) return '/images/avatar_novice.png' // 1-9
        if (level < 25) return '/images/avatar_adventurer.png' // 10-24
        if (level < 50) return '/images/avatar_warrior.png' // 25-49
        return '/images/avatar_hero.png' // 50+
    }

    const getTierColor = () => {
        const tier = gameProfile.tier?.toLowerCase() || 'novice'
        switch (tier) {
            case 'bronze': return 'bg-orange-200'
            case 'silver': return 'bg-gray-200'
            case 'gold': return 'bg-yellow-300'
            case 'platinum': return 'bg-blue-200'
            default: return 'bg-white'
        }
    }

    return (
        <div className={`w-28 h-28 relative flex-shrink-0 neo-border neo-shadow-sm ${getTierColor()}`}>
            {/* Container to enforce square shape and crop out excessive whitespace from generation if needed */}
            <img
                src={getAvatarPath()}
                alt={`Level ${gameProfile.level} Avatar`}
                className="w-full h-full object-cover p-1 pixelated"
                style={{ imageRendering: 'pixelated' }}
                onError={(e) => {
                    e.currentTarget.src = 'https://api.dicebear.com/7.x/pixel-art/svg?seed=hero&backgroundColor=transparent'
                }}
            />
        </div>
    )
}
