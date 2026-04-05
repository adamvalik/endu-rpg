'use client';

import { useMemo } from 'react';

function decodePolyline(encoded: string): [number, number][] {
  const coordinates: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lng += result & 1 ? ~(result >> 1) : result >> 1;

    coordinates.push([lat / 1e5, lng / 1e5]);
  }

  return coordinates;
}

function projectToSVG(
  coordinates: [number, number][],
  width: number,
  height: number,
  padding: number = 8,
): string {
  if (coordinates.length === 0) return '';

  let minLat = coordinates[0][0];
  let maxLat = coordinates[0][0];
  let minLng = coordinates[0][1];
  let maxLng = coordinates[0][1];

  for (const [lat, lng] of coordinates) {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  }

  const latRange = maxLat - minLat || 0.001;
  const lngRange = maxLng - minLng || 0.001;

  const scale = Math.min((width - padding * 2) / lngRange, (height - padding * 2) / latRange);

  const offsetX = (width - lngRange * scale) / 2;
  const offsetY = (height - latRange * scale) / 2;

  return coordinates
    .map(([lat, lng]) => {
      const x = (lng - minLng) * scale + offsetX;
      const y = height - ((lat - minLat) * scale + offsetY);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

interface RoutePreviewProps {
  encodedPolyline: string;
  width?: number;
  height?: number;
}

export function RoutePreview({ encodedPolyline, width = 120, height = 120 }: RoutePreviewProps) {
  const points = useMemo(() => {
    try {
      const coords = decodePolyline(encodedPolyline);
      return projectToSVG(coords, width, height);
    } catch {
      return '';
    }
  }, [encodedPolyline, width, height]);

  if (!points) return null;

  return (
    <svg width={width} height={height} className="rounded-md bg-neutral-50 dark:bg-neutral-900">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-neutral-800 dark:text-neutral-200"
      />
    </svg>
  );
}
