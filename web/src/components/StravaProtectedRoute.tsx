import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { getUserProfile } from '@/services/firebase'
import { Spinner } from './Spinner'

export function StravaProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [stravaConnected, setStravaConnected] = useState(false)

  useEffect(() => {
    checkStravaConnection()
  }, [])

  const checkStravaConnection = async () => {
    try {
      const profile = await getUserProfile()
      setStravaConnected(profile.stravaConnected)
    } catch (error) {
      console.error('Error checking Strava connection:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!stravaConnected) {
    return <Navigate to="/strava/connect" replace />
  }

  return <>{children}</>
}
