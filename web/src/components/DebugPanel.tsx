import { useState } from 'react'
import { addDebugXP } from '@/services/firebase'

interface DebugPanelProps {
    onUpdateComplete: () => void
}

export function DebugPanel({ onUpdateComplete }: DebugPanelProps) {
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [customXP, setCustomXP] = useState(100)

    // Only render in development mode
    if (import.meta.env.PROD) {
        return null
    }

    const handleAddXP = async (amount: number) => {
        setLoading(true)
        try {
            await addDebugXP(amount)
            onUpdateComplete() // Tell parent component to reload data
        } catch (error) {
            console.error('Debug XP Error:', error)
            alert('Failed to add XP: ' + (error instanceof Error ? error.message : String(error)))
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-50 btn-secondary bg-white text-xs px-2 py-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] opacity-50 hover:opacity-100 neo-transition"
            >
                🛠️ DEBUG
            </button>
        )
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-white neo-border p-4 shadow-[8px_8px_0_rgba(0,0,0,1)] max-w-xs animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-black">
                <h3 className="font-black font-tiny5 text-xl">🛠️ DEV TOOLS</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-black neo-transition font-bold px-2 py-0 border-2 border-transparent hover:border-black"
                >
                    X
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold block mb-1">QUICK XP</label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            disabled={loading}
                            onClick={() => handleAddXP(100)}
                            className="bg-[var(--color-pastel-green)] border-2 border-black px-2 py-1 text-xs font-bold hover:-translate-y-px hover:shadow-[2px_2px_0_rgba(0,0,0,1)] disabled:opacity-50"
                        >
                            +100
                        </button>
                        <button
                            disabled={loading}
                            onClick={() => handleAddXP(500)}
                            className="bg-[var(--color-pastel-green)] border-2 border-black px-2 py-1 text-xs font-bold hover:-translate-y-px hover:shadow-[2px_2px_0_rgba(0,0,0,1)] disabled:opacity-50"
                        >
                            +500
                        </button>
                        <button
                            disabled={loading}
                            onClick={() => handleAddXP(1000)}
                            className="bg-[var(--color-pastel-green)] border-2 border-black px-2 py-1 text-xs font-bold hover:-translate-y-px hover:shadow-[2px_2px_0_rgba(0,0,0,1)] disabled:opacity-50"
                        >
                            +1000
                        </button>
                        <button
                            disabled={loading}
                            onClick={() => handleAddXP(5000)}
                            className="bg-[var(--color-pastel-green)] border-2 border-black px-2 py-1 text-xs font-bold hover:-translate-y-px hover:shadow-[2px_2px_0_rgba(0,0,0,1)] disabled:opacity-50"
                        >
                            +5000
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold block mb-1">REMOVE XP</label>
                    <div className="flex gap-2">
                        <button
                            disabled={loading}
                            onClick={() => handleAddXP(-100)}
                            className="bg-[var(--color-pastel-pink)] border-2 border-black px-2 py-1 text-xs font-bold hover:-translate-y-px hover:shadow-[2px_2px_0_rgba(0,0,0,1)] disabled:opacity-50"
                        >
                            -100
                        </button>
                        <button
                            disabled={loading}
                            onClick={() => handleAddXP(-1000)}
                            className="bg-[var(--color-pastel-pink)] border-2 border-black px-2 py-1 text-xs font-bold hover:-translate-y-px hover:shadow-[2px_2px_0_rgba(0,0,0,1)] disabled:opacity-50"
                        >
                            -1000
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold block mb-1">CUSTOM XP</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            className="neo-input flex-1 py-1 px-2 text-sm"
                            value={customXP}
                            onChange={(e) => setCustomXP(Number(e.target.value))}
                        />
                        <button
                            disabled={loading}
                            onClick={() => handleAddXP(customXP)}
                            className="btn-primary py-1 px-3 text-sm bg-[var(--color-pastel-yellow)] shadow-[2px_2px_0_rgba(0,0,0,1)]"
                        >
                            SEND
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="text-center font-bold text-sm bg-[var(--color-pastel-blue)] border-2 border-black p-1 animate-pulse">
                        CONNECTING TO SERVER...
                    </div>
                )}
            </div>
        </div>
    )
}
