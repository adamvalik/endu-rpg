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
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b-2 border-black p-4">
        <div className="container mx-auto max-w-4xl flex justify-between items-center">
          <h1 className="text-3xl font-bold font-tiny5">ENDU</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">{user?.email}</span>
            <button onClick={handleSignOut} className="btn-secondary text-sm py-2">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-black text-white">
        <div className="container mx-auto max-w-4xl flex">
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex-1 py-3 font-semibold ${
              activeTab === 'hero' ? 'bg-white text-black' : 'bg-black text-white'
            }`}
          >
            Hero
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`flex-1 py-3 font-semibold ${
              activeTab === 'journal' ? 'bg-white text-black' : 'bg-black text-white'
            }`}
          >
            Journal
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto max-w-4xl p-4">
        {activeTab === 'hero' ? (
          <div>
            <CharacterCard gameProfile={gameProfile} />
            <StatsCard userProfile={userProfile} />
          </div>
        ) : (
          <JournalTab onSyncComplete={handleRefresh} />
        )}
      </main>
    </div>
  )
}
