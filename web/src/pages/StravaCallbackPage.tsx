import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { exchangeStravaCode } from '@/services/firebase'
import { Spinner } from '@/components/Spinner'

export function StravaCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')

    if (errorParam) {
      setError('Authorization denied')
      setTimeout(() => navigate('/strava/connect'), 3000)
      return
    }

    if (!code) {
      setError('No authorization code received')
      setTimeout(() => navigate('/strava/connect'), 3000)
      return
    }

    handleCodeExchange(code)
  }, [searchParams, navigate])

  const handleCodeExchange = async (code: string) => {
    try {
      await exchangeStravaCode(code)
      navigate('/home')
    } catch (err: any) {
      console.error('Error exchanging code:', err)
      setError(err.message || 'Failed to connect Strava')
      setTimeout(() => navigate('/strava/connect'), 3000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-red-600 text-lg mb-2">{error}</p>
            <p className="text-text-secondary">Redirecting...</p>
          </>
        ) : (
          <>
            <Spinner />
            <p className="mt-4 text-text-secondary">Connecting Strava...</p>
          </>
        )}
      </div>
    </div>
  )
}
