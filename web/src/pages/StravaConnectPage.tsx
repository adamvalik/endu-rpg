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
        <div className="min-h-screen flex items-center justify-center p-5 font-sans">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <h1 className="text-6xl font-black font-tiny5 mb-2 tracking-wider drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                        ENDU
                    </h1>
                    <p className="text-xl font-bold bg-[#fc4c02] text-white neo-border inline-block px-4 py-1 rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-2">
                        Connect Your Activities
                    </p>
                </div>

                <div className="card bg-[var(--color-pastel-pink)]">
                    <h2 className="text-2xl font-black mb-4 font-tiny5 border-b-3 border-black pb-2">
                        Link Your Account
                    </h2>

                    <p className="text-sm font-bold mb-3 leading-relaxed">
                        ENDU uses your Strava activities to track your progress and award XP.
                    </p>

                    <p className="text-sm font-bold mb-6 leading-relaxed">
                        Connect your Strava account to start your adventure!
                    </p>

                    <div className="mb-8 space-y-3 bg-white neo-border p-4 neo-shadow-sm rotate-[-1deg]">
                        <div className="flex items-center font-bold">
                            <span className="text-xl mr-3">⚡</span>
                            <span>Automatic activity sync</span>
                        </div>
                        <div className="flex items-center font-bold">
                            <span className="text-xl mr-3">🎮</span>
                            <span>Earn XP and level up</span>
                        </div>
                        <div className="flex items-center font-bold">
                            <span className="text-xl mr-3">🔥</span>
                            <span>Build activity streaks</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <button onClick={handleConnect} className="inline-block hover:scale-105 neo-transition active:scale-95">
                            <img
                                src="/images/btn_strava_connect_with_orange.png"
                                alt="Connect with Strava"
                                onError={(e) => {
                                    // Fallback if orange button icon does not exist, use the original
                                    e.currentTarget.src = "/images/btn_strava_connect_with_white.png"
                                }}
                                className="w-56 h-auto neo-border neo-shadow-sm rounded-md"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
