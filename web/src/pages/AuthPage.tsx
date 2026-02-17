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
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold font-tiny5 mb-2">ENDU</h1>
          <p className="text-lg text-text-secondary">Your Fitness RPG Adventure</p>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <h2 className="text-xl font-bold mb-5">Sign In / Sign Up</h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Display Name (optional)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border-2 border-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center"
          >
            {loading ? <Spinner /> : 'Continue'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <img
            src="/images/api_logo_cptblWith_strava_horiz_black.png"
            alt="Compatible with Strava"
            className="h-8 mx-auto opacity-50"
          />
        </div>
      </div>
    </div>
  )
}
