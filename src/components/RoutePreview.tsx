import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

interface RoutePreviewProps {
  encodedPolyline: string;
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

/**
 * Decodes a Google Encoded Polyline into an array of [lat, lng] coordinates
 * Based on: https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 */
function decodePolyline(encoded: string): [number, number][] {
  const coordinates: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte;

    // Decode latitude
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    shift = 0;
    result = 0;

    // Decode longitude
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    coordinates.push([lat / 1e5, lng / 1e5]);
  }

  return coordinates;
}

/**
 * Converts latitude/longitude coordinates to SVG viewport coordinates
 * Automatically fits and centers the route within the viewport
 */
function projectToSVG(
  coordinates: [number, number][],
  width: number,
  height: number,
  padding: number = 10
): string {
  if (coordinates.length === 0) return '';

  // Find bounds
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

  const latRange = maxLat - minLat;
  const lngRange = maxLng - minLng;

  // Calculate scale to fit in viewport with padding
  const scale = Math.min(
    (width - padding * 2) / lngRange,
    (height - padding * 2) / latRange
  );

  // Center the route
  const offsetX = (width - lngRange * scale) / 2;
  const offsetY = (height - latRange * scale) / 2;

  // Convert to SVG points string
  return coordinates
    .map(([lat, lng]) => {
      const x = (lng - minLng) * scale + offsetX;
      const y = height - ((lat - minLat) * scale + offsetY); // Flip Y axis
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

export const RoutePreview: React.FC<RoutePreviewProps> = ({
  encodedPolyline,
  width = 150,
  height = 150,
  strokeColor = '#000',
  strokeWidth = 2,
}) => {
  const svgPoints = useMemo(() => {
    if (!encodedPolyline) return '';

    try {
      const coordinates = decodePolyline(encodedPolyline);
      return projectToSVG(coordinates, width, height);
    } catch (error) {
      console.error('Error decoding polyline:', error);
      return '';
    }
  }, [encodedPolyline, width, height]);

  if (!svgPoints) {
    return (
      <View style={[styles.container, { width, height }]}>
        <View style={styles.placeholder} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} style={styles.svg}>
        <Polyline
          points={svgPoints}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    backgroundColor: 'transparent',
  },
  placeholder: {
    width: 20,
    height: 20,
    backgroundColor: '#e0e0e0',
  },
});
