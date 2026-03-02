import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUpOrLogIn } from '@/services/auth'
import { Spinner } from '@/components/Spinner'

export function AuthPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signUpOrLogIn(email, password, displayName || undefined)
            navigate('/home')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to authenticate')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-5 font-sans">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <h1 className="text-6xl font-black font-tiny5 mb-2 tracking-wider drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                        ENDU
                    </h1>
                    <p className="text-xl font-bold bg-white neo-border inline-block px-4 py-1 rotate-[-2deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-2">
                        Your Fitness RPG Adventure
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="card bg-[var(--color-pastel-blue)]">
                    <h2 className="text-2xl font-black mb-6 font-tiny5 tracking-wide border-b-3 border-black pb-2">
                        Sign In / Sign Up
                    </h2>

                    <div className="mb-5">
                        <label className="block text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full neo-border px-4 py-3 neo-shadow-sm focus:outline-none focus:neo-shadow neo-transition bg-white"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full neo-border px-4 py-3 neo-shadow-sm focus:outline-none focus:neo-shadow neo-transition bg-white"
                            required
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-bold mb-2">
                            Display Name (optional)
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full neo-border px-4 py-3 neo-shadow-sm focus:outline-none focus:neo-shadow neo-transition bg-white"
                            placeholder="Hero Name"
                        />
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 neo-border font-bold text-red-700 neo-shadow-sm rotate-2">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center text-lg py-3"
                    >
                        {loading ? <Spinner /> : 'ENTER THE REALM'}
                    </button>
                </form>

                <div className="mt-8 text-center bg-white neo-border inline-block px-4 py-2 rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto w-full">
                    <img
                        src="/images/api_logo_cptblWith_strava_horiz_black.png"
                        alt="Compatible with Strava"
                        className="h-8 mx-auto"
                    />
                </div>
            </div>
        </div>
    )
}
