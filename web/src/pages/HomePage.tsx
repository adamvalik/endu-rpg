import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from '@/services/auth'
import { getUserProfile, getGameProfile } from '@/services/firebase'
import type { UserProfile, GameProfile } from '@shared/types'
import { CharacterCard } from '@/components/CharacterCard'
import { StatsCard } from '@/components/StatsCard'
import { JournalTab } from '@/components/JournalTab'
import { Spinner } from '@/components/Spinner'
import { LevelUpModal } from '@/components/LevelUpModal'
import { DebugPanel } from '@/components/DebugPanel'

export function HomePage() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState<'hero' | 'journal'>('hero')
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [gameProfile, setGameProfile] = useState<GameProfile | null>(null)
    const [loading, setLoading] = useState(true)

    // Level up tracking
    const previousLevelRef = useState<number | null>(null)
    const [showLevelUp, setShowLevelUp] = useState(false)
    const [levelUpData, setLevelUpData] = useState<{ newLevel: number } | null>(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async (forceRefresh = false) => {
        try {
            const [profile, game] = await Promise.all([
                getUserProfile(!forceRefresh),
                getGameProfile(!forceRefresh),
            ])
            setUserProfile(profile)

            // Handle logical level up
            if (previousLevelRef[0] !== null && game.level > previousLevelRef[0]) {
                setLevelUpData({ newLevel: game.level })
                setShowLevelUp(true)
            }
            previousLevelRef[1](game.level)

            setGameProfile(game)
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = () => {
        loadData(true)
    }

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    if (loading || !userProfile || !gameProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-app-bg)]">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[var(--color-app-bg)] font-sans">
            {showLevelUp && levelUpData && (
                <LevelUpModal
                    newLevel={levelUpData.newLevel}
                    onClose={() => setShowLevelUp(false)}
                />
            )}

            {/* Header */}
            <header className="bg-white border-b-3 border-black p-4 neo-shadow-sm sticky top-0 z-10">
                <div className="layout-container flex justify-between items-center py-2">
                    <h1 className="text-4xl font-black font-tiny5 tracking-wider">ENDU</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold hidden sm:inline-block">{user?.email}</span>
                        <button onClick={handleSignOut} className="btn-secondary text-sm py-1.5 px-3">
                            SIGN OUT
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Layout Area */}
            <main className="layout-container py-6">
                {/* Tab Navigation */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('hero')}
                        className={`flex-1 py-3 text-xl font-black tracking-wider font-tiny5 neo-transition rounded-sm ${activeTab === 'hero' ? 'bg-[var(--color-pastel-pink)] text-black neo-border shadow-[4px_4px_0_rgba(0,0,0,1)] translate-y-[-2px]' : 'bg-white text-black neo-border shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:bg-[var(--color-pastel-yellow)]'
                            }`}
                    >
                        HERO VANGUARD
                    </button>
                    <button
                        onClick={() => setActiveTab('journal')}
                        className={`flex-1 py-3 text-xl font-black tracking-wider font-tiny5 neo-transition rounded-sm ${activeTab === 'journal' ? 'bg-[var(--color-pastel-blue)] text-black neo-border shadow-[4px_4px_0_rgba(0,0,0,1)] translate-y-[-2px]' : 'bg-white text-black neo-border shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:bg-[var(--color-pastel-yellow)]'
                            }`}
                    >
                        ACTIVITY DECK
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'hero' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CharacterCard gameProfile={gameProfile} />
                        <StatsCard userProfile={userProfile} />
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <JournalTab onSyncComplete={handleRefresh} />
                    </div>
                )}
            </main>

            <DebugPanel onUpdateComplete={handleRefresh} />
        </div>
    )
}
