export function formatDistance(meters: number): string {
  return (meters / 1000).toFixed(2) + ' km'
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatPace(meters: number, seconds: number): string {
  const km = meters / 1000
  const minutesPerKm = seconds / 60 / km
  const min = Math.floor(minutesPerKm)
  const sec = Math.floor((minutesPerKm - min) * 60)
  return `${min}:${sec.toString().padStart(2, '0')}/km`
}
