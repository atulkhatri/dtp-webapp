import { useEffect, useRef } from 'react'
import L from 'leaflet'
import './leafletIcons'

export interface MapPin {
  id: string
  name: string
  lat: number
  lng: number
}

interface MapViewProps {
  pins: MapPin[]
  center?: [number, number]
  zoom?: number
  onSelect?: (id: string) => void
  height?: number | string
}

export function MapView({ pins, center, zoom = 13, onSelect, height = 360 }: MapViewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!ref.current || mapRef.current) return

    const mapCenter = center ?? (pins[0] ? ([pins[0].lat, pins[0].lng] as [number, number]) : ([49.2827, -123.1207] as [number, number]))
    const map = L.map(ref.current, { zoomControl: false }).setView(mapCenter, zoom)
    L.control.zoom({ position: 'topright' }).addTo(map)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const layer = L.layerGroup().addTo(map)
    pins.forEach((pin) => {
      const marker = L.marker([pin.lat, pin.lng]).addTo(layer)
      marker.bindPopup(pin.name)
      if (onSelect) marker.on('click', () => onSelect(pin.id))
    })

    if (pins.length > 1) {
      const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number]))
      map.fitBounds(bounds.pad(0.2))
    } else if (pins[0]) {
      map.setView([pins[0].lat, pins[0].lng], zoom)
    }

    return () => {
      layer.remove()
    }
  }, [pins, onSelect, zoom])

  return <div ref={ref} className="leaflet-container" style={{ height }} />
}
