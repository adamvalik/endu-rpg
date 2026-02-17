import { useMemo } from 'react'
import polyline from '@mapbox/polyline'

interface RoutePreviewProps {
  encodedPolyline: string
  width?: number
  height?: number
  strokeColor?: string
  strokeWidth?: number
}

export function RoutePreview({
  encodedPolyline,
  width = 200,
  height = 200,
  strokeColor = '#000',
  strokeWidth = 2,
}: RoutePreviewProps) {
  const svgPoints = useMemo(() => {
    if (!encodedPolyline) return ''

    try {
      const coordinates = polyline.decode(encodedPolyline)
      return projectToSVG(coordinates, width, height)
    } catch (error) {
      console.error('Error decoding polyline:', error)
      return ''
    }
  }, [encodedPolyline, width, height])

  if (!svgPoints) {
    return (
      <div
        className="bg-gray-100 flex items-center justify-center"
        style={{ width, height }}
      >
        <div className="w-5 h-5 bg-gray-300 rounded" />
      </div>
    )
  }

  return (
    <div className="bg-gray-50" style={{ width, height }}>
      <svg width={width} height={height}>
        <polyline
          points={svgPoints}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

function projectToSVG(
  coordinates: [number, number][],
  width: number,
  height: number,
  padding: number = 10
): string {
  if (coordinates.length === 0) return ''

  let minLat = coordinates[0][0]
  let maxLat = coordinates[0][0]
  let minLng = coordinates[0][1]
  let maxLng = coordinates[0][1]

  for (const [lat, lng] of coordinates) {
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
    minLng = Math.min(minLng, lng)
    maxLng = Math.max(maxLng, lng)
  }

  const latRange = maxLat - minLat
  const lngRange = maxLng - minLng

  const scale = Math.min(
    (width - padding * 2) / lngRange,
    (height - padding * 2) / latRange
  )

  const offsetX = (width - lngRange * scale) / 2
  const offsetY = (height - latRange * scale) / 2

  return coordinates
    .map(([lat, lng]) => {
      const x = (lng - minLng) * scale + offsetX
      const y = height - ((lat - minLat) * scale + offsetY)
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}
