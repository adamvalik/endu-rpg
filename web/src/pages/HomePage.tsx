import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from '@/services/auth'
import { getUserProfile, getGameProfile } from '@/services/firebase'
import type { UserProfile, GameProfile } from '@shared/types'
import { CharacterCard } from '@/components/CharacterCard'
import { StatsCard } from '@/components/StatsCard'
import { JournalTab } from '@/components/JournalTab'
import { Spinner } from '@/components/Spinner'

export function HomePage() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState<'hero' | 'journal'>('hero')
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [gameProfile, setGameProfile] = useState<GameProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [profile, game] = await Promise.all([
                getUserProfile(),
                getGameProfile(),
            ])
            setUserProfile(profile)
            setGameProfile(game)
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = () => {
        loadData()
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

            {/* Tab Navigation */}
            <div className="bg-black text-white sticky top-[85px] z-10 neo-shadow-sm border-b-3 border-black">
                <div className="layout-container flex p-0">
                    <button
                        onClick={() => setActiveTab('hero')}
                        className={`flex-1 py-4 font-black tracking-wider text-xl font-tiny5 ${activeTab === 'hero' ? 'bg-[var(--color-pastel-pink)] text-black border-r-3 border-black' : 'bg-black text-white hover:bg-gray-900 border-r-3 border-black'
                            }`}
                    >
                        HERO VANGUARD
                    </button>
                    <button
                        onClick={() => setActiveTab('journal')}
                        className={`flex-1 py-4 font-black tracking-wider text-xl font-tiny5 ${activeTab === 'journal' ? 'bg-[var(--color-pastel-blue)] text-black' : 'bg-black text-white hover:bg-gray-900'
                            }`}
                    >
                        ACTIVITY DECK
                    </button>
                </div>
            </div>

            {/* Content */}
            <main className="layout-container py-8">
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
        </div>
    )
}
