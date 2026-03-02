import { useEffect, useState } from 'react'

interface LevelUpModalProps {
    newLevel: number
    onClose: () => void
}

export function LevelUpModal({ newLevel, onClose }: LevelUpModalProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Trigger animation after mount
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div
                className={`transform transition-all duration-500 ease-out ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
                    } max-w-sm w-full bg-[var(--color-pastel-yellow)] neo-border shadow-[8px_8px_0_rgba(0,0,0,1)] p-8 text-center`}
            >
                <h2 className="text-4xl font-black font-tiny5 mb-2 text-black">
                    LEVEL UP!
                </h2>

                <div className="text-6xl font-black font-tiny5 my-6 text-[var(--color-pastel-pink)] drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                    {newLevel}
                </div>

                <p className="font-bold mb-8 neo-border bg-white py-2 px-3 shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    Your power has grown!
                </p>

                <button
                    onClick={onClose}
                    className="w-full py-3 bg-[var(--color-pastel-blue)] text-black font-black font-tiny5 text-xl neo-border shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-y-[2px] transition-all"
                >
                    CONTINUE
                </button>
            </div>
        </div>
    )
}
