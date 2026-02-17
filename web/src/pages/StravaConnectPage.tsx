export function StravaConnectPage() {
  const handleConnect = () => {
    const clientId = import.meta.env.VITE_STRAVA_CLIENT_ID
    const redirectUri = import.meta.env.VITE_STRAVA_REDIRECT_URI
    const scope = 'read,activity:read_all'

    const authUrl = new URL('https://www.strava.com/oauth/authorize')
    authUrl.searchParams.append('client_id', clientId)
    authUrl.searchParams.append('redirect_uri', redirectUri)
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('scope', scope)
    authUrl.searchParams.append('approval_prompt', 'auto')

    window.location.href = authUrl.toString()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-tiny5 mb-2">ENDU</h1>
          <p className="text-lg text-text-secondary">Connect Your Activities</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Connect to Strava</h2>

          <p className="text-sm text-text-secondary mb-3 leading-relaxed">
            ENDU uses your Strava activities to track your progress and award XP.
          </p>

          <p className="text-sm text-text-secondary mb-5 leading-relaxed">
            Connect your Strava account to start your adventure!
          </p>

          <div className="mb-6">
            <div className="flex items-center mb-3">
              <span className="text-xl mr-3">⚡</span>
              <span className="text-sm">Automatic activity sync</span>
            </div>
            <div className="flex items-center mb-3">
              <span className="text-xl mr-3">🎮</span>
              <span className="text-sm">Earn XP and level up</span>
            </div>
            <div className="flex items-center mb-3">
              <span className="text-xl mr-3">🔥</span>
              <span className="text-sm">Build activity streaks</span>
            </div>
          </div>

          <div className="text-center">
            <button onClick={handleConnect} className="inline-block">
              <img
                src="/images/btn_strava_connect_with_white.png"
                alt="Connect with Strava"
                className="w-56 h-auto border border-black hover:opacity-80 transition-opacity"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
