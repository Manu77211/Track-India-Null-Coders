'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { fetchDriversData } from '@/lib/api'

interface DriverChartProps {
  sector: string
}

export default function DriverChart({ sector }: DriverChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(false)
      try {
        const result = await fetchDriversData(sector)
        
        // Transform data for chart - only show top 5
        const chartData = result.slice(0, 5).map((item: any) => ({
          driver: item.driver,
          impact: item.value
        }))
        
        setData(chartData)
      } catch (error) {
        console.error('Failed to load drivers data:', error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [sector])

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>No driver data available</p>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="driver" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="impact" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}