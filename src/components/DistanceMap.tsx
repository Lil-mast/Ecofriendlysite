import React, { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, useMap, CircleMarker } from 'react-leaflet'
import L from 'leaflet'

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function FitBoundsOnce({ path }: { path: [number, number][] }) {
  const map = useMap()
  const fitted = useRef(false)
  useEffect(() => {
    if (path.length < 2) fitted.current = false
    else if (!fitted.current) {
      fitted.current = true
      const bounds = L.latLngBounds(path)
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 16 })
    }
  }, [path])
  return null as React.ReactNode
}

const DistanceMap: React.FC = () => {
  const [tracking, setTracking] = useState(false)
  const [path, setPath] = useState<[number, number][]>([])
  const [distanceKm, setDistanceKm] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const watchIdRef = useRef<number | null>(null)

  const startTracking = () => {
    setError(null)
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }
    setPath([])
    setDistanceKm(0)
    setTracking(true)
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const point: [number, number] = [latitude, longitude]
        setPath((prev) => {
          const next = [...prev, point]
          if (prev.length > 0) {
            const last = prev[prev.length - 1]
            const seg = haversineKm(last[0], last[1], latitude, longitude)
            setDistanceKm((d) => d + seg)
          }
          return next
        })
      },
      (err) => {
        setError(err.message || 'Location unavailable')
        setTracking(false)
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    )
  }

  const stopTracking = () => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setTracking(false)
  }

  useEffect(() => {
    return () => {
      if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current)
    }
  }, [])

  const hasPath = path.length > 0
  const center: [number, number] = path.length
    ? path[Math.floor(path.length / 2)]
    : [40.7, -74.0]

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {!tracking ? (
          <button
            type="button"
            onClick={startTracking}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
            disabled={!navigator.geolocation}
          >
            Start tracking
          </button>
        ) : (
          <button
            type="button"
            onClick={stopTracking}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
          >
            Stop tracking
          </button>
        )}
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          Distance: {distanceKm.toFixed(2)} km
        </span>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      <div className="h-80 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 z-0 relative">
        <MapContainer
          center={center}
          zoom={hasPath ? 14 : 10}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {path.length > 0 && <Polyline positions={path} color="#16a34a" weight={4} />}
          {path.length > 0 && (
            <CircleMarker
              center={path[path.length - 1]}
              radius={8}
              pathOptions={{ color: '#15803d', fillColor: '#22c55e', weight: 2 }}
            />
          )}
          {/* FitBoundsOnce - conditional to avoid StrictMode double-mount */}
          {path.length >= 2 && path.every(p => p[0] && p[1]) && <FitBoundsOnce path={path} />}

        </MapContainer>
      </div>
    </div>
  )
}

export default DistanceMap
