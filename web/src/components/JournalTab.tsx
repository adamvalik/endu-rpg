import { useState, useEffect, useRef, useCallback } from 'react'
import { getUserActivities, syncStravaActivities } from '@/services/firebase'
import type { StravaActivity } from '@shared/types'
import { ActivityTile } from './ActivityTile'
import { ActivitySkeleton } from './ActivitySkeleton'
import { Spinner } from './Spinner'

interface JournalTabProps {
    onSyncComplete?: () => void
}

export function JournalTab({ onSyncComplete }: JournalTabProps) {
    const [activities, setActivities] = useState<StravaActivity[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [syncing, setSyncing] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const observerTarget = useRef<HTMLDivElement>(null)

    useEffect(() => {
        loadActivities(1)
    }, [])

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    loadMoreActivities()
                }
            },
            { threshold: 0.1 }
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => observer.disconnect()
    }, [hasMore, loadingMore, page])

    const loadActivities = async (pageNum: number, useCache = true) => {
        try {
            setLoading(pageNum === 1)
            const newActivities = await getUserActivities(pageNum, 10, useCache)

            if (pageNum === 1) {
                setActivities(newActivities)
            } else {
                setActivities(prev => [...prev, ...newActivities])
            }

            setHasMore(newActivities.length === 10)
            setPage(pageNum)
        } catch (error) {
            console.error('Error loading activities:', error)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    const loadMoreActivities = useCallback(() => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true)
            loadActivities(page + 1)
        }
    }, [page, hasMore, loadingMore])

    const handleSync = async () => {
        setSyncing(true)
        try {
            await syncStravaActivities(1, 3)
            await loadActivities(1, false)
            onSyncComplete?.()
        } catch (error) {
            console.error('Error syncing:', error)
            alert('Failed to sync activities')
        } finally {
            setSyncing(false)
        }
    }

    const handleRefresh = () => {
        loadActivities(1, false)
    }

    if (loading) {
        return (
            <div>
                {[1, 2, 3].map(i => (
                    <ActivitySkeleton key={i} />
                ))}
            </div>
        )
    }

    return (
        <div>
            {/* Actions */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handleRefresh}
                    className="btn-secondary text-base py-2 font-black rotate-[-1deg] shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    disabled={syncing}
                >
                    REFRESH
                </button>
                <button
                    onClick={handleSync}
                    className="btn-primary bg-[var(--color-pastel-blue)] text-black text-base py-2 font-black rotate-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                    disabled={syncing}
                >
                    {syncing ? 'SYNCING...' : 'SYNC STRAVA'}
                </button>
            </div>

            {/* Activity List */}
            {activities.length === 0 ? (
                <div className="card text-center py-10 bg-[var(--color-pastel-yellow)] mt-4">
                    <p className="text-black font-bold mb-4">No activities yet in your journal.</p>
                    <button onClick={handleSync} className="btn-primary text-black bg-white">
                        Sync from Strava
                    </button>
                </div>
            ) : (
                <>
                    {activities.map(activity => (
                        <ActivityTile key={activity.id} activity={activity} />
                    ))}

                    {/* Infinite scroll trigger */}
                    <div ref={observerTarget} className="py-4 text-center">
                        {loadingMore && <Spinner />}
                        {!hasMore && activities.length > 0 && (
                            <p className="text-text-secondary">No more activities</p>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
