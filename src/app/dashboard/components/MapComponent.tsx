'use client'

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { useEffect, useState } from 'react'

const indiaCenter: [number, number] = [20.5937, 78.9629]

interface DistrictData {
  [key: string]: number
}

const mockDistrictData: DistrictData = {
  'Mysuru': 85,
  'Bangalore': 90,
  'Mangalore': 80,
  // Add more as needed
}

export default function MapComponent() {
  const [geoData, setGeoData] = useState(null)

  useEffect(() => {
    // Load India districts GeoJSON
    fetch('https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson')
      .then(response => response.json())
      .then(data => setGeoData(data))
      .catch(error => console.error('Error loading GeoJSON:', error))
  }, [])

  const getColor = (value: number) => {
    return value > 85 ? '#10b981' : value > 75 ? '#f59e0b' : '#ef4444'
  }

  const style = (feature: any) => {
    const districtName = feature.properties.NAME_2
    const value = mockDistrictData[districtName] || 50
    return {
      fillColor: getColor(value),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7,
    }
  }

  return (
    <div className="h-96 w-full">
      <MapContainer center={indiaCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoData && <GeoJSON data={geoData} style={style} />}
      </MapContainer>
    </div>
  )
}