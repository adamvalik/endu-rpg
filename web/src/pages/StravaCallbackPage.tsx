import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { exchangeStravaCode } from '@/services/firebase'
import { Spinner } from '@/components/Spinner'

export function StravaCallbackPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const hasExchanged = useRef(false)

    useEffect(() => {
        // Prevent duplicate exchanges
        if (hasExchanged.current) return

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

        hasExchanged.current = true
        handleCodeExchange(code)
    }, [searchParams, navigate])

    const handleCodeExchange = async (code: string) => {
        try {
            await exchangeStravaCode(code)
            navigate('/home')
        } catch (err) {
            console.error('Error exchanging code:', err)
            setError(err instanceof Error ? err.message : 'Failed to connect Strava')
            setTimeout(() => navigate('/strava/connect'), 3000)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-5 font-sans bg-[var(--color-app-bg)]">
            <div className="max-w-md w-full text-center">
                <div className="card bg-[var(--color-pastel-yellow)]">
                    {error ? (
                        <div className="bg-white neo-border p-6 neo-shadow-sm">
                            <p className="font-black text-red-600 text-2xl mb-2 font-tiny5 tracking-wide">
                                ERROR!
                            </p>
                            <p className="font-bold mb-4">{error}</p>
                            <p className="text-sm font-bold bg-black text-white inline-block px-3 py-1 neo-border">
                                Redirecting...
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white neo-border p-8 neo-shadow-sm flex flex-col items-center">
                            <Spinner />
                            <p className="mt-6 font-black text-xl font-tiny5 tracking-widest animate-pulse">
                                ESTABLISHING CONNECTION...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
