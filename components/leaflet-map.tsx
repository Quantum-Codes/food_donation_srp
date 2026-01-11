"use client"

import { useEffect, useRef, useState } from "react"
import type { Donation } from "@/lib/mock-data"

// Extend Donation type with coordinates
export type DonationWithCoords = Donation & { lat: number; lng: number }

interface LeafletMapProps {
  donations: DonationWithCoords[]
  onMarkerClick: (donation: DonationWithCoords) => void
  center?: [number, number]
  zoom?: number
}

export function LeafletMap({ donations, onMarkerClick, center = [13.6288, 79.4192], zoom = 14 }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      link.crossOrigin = ""
      document.head.appendChild(link)
    }

    // Load Leaflet JS
    const loadLeaflet = async () => {
      if (typeof window !== "undefined" && !(window as any).L) {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        script.crossOrigin = ""
        script.onload = () => setIsLoaded(true)
        document.head.appendChild(script)
      } else if ((window as any).L) {
        setIsLoaded(true)
      }
    }

    loadLeaflet()
  }, [])

  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return

    const L = (window as any).L
    if (!L) return

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom)

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isLoaded, center, zoom])

  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return

    const L = (window as any).L
    const map = mapInstanceRef.current

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add markers for each donation
    donations.forEach((donation) => {
      const color = donation.priority === "high" ? "#ef4444" : donation.priority === "medium" ? "#f97316" : "#22c55e"

      // Create custom icon
      const icon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background-color: ${color};
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      })

      const marker = L.marker([donation.lat, donation.lng], { icon }).addTo(map)

      marker.on("click", () => {
        onMarkerClick(donation)
      })

      // Add popup with basic info
      marker.bindPopup(`
        <div style="min-width: 150px;">
          <strong>${donation.address}</strong><br/>
          <span style="color: #666;">${donation.volume} servings</span><br/>
          <span style="
            display: inline-block;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 500;
            background-color: ${color}20;
            color: ${color};
            margin-top: 4px;
          ">${donation.priority} priority</span>
        </div>
      `)

      markersRef.current.push(marker)
    })
  }, [isLoaded, donations, onMarkerClick])

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6a4f] mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-full" style={{ minHeight: "400px" }} />
}
