'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts'
import { fetchPredictData } from '@/lib/api'

interface TrendChartProps {
  sector: string
  district: string
}

export default function TrendChart({ sector, district }: TrendChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const result = await fetchPredictData(sector, district)
        
        // Transform data for chart
        const chartData = result.trends.map((item: any) => ({
          year: item.year.toString(),
          value: item.value,
          lower: result.confidence[0],
          upper: result.confidence[1]
        }))
        
        setData(chartData)
      } catch (error) {
        console.error('Failed to load trend data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [sector, district])

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="upper"
            stackId="1"
            stroke="none"
            fill="#3b82f6"
            fillOpacity={0.2}
          />
          <Area
            type="monotone"
            dataKey="lower"
            stackId="1"
            stroke="none"
            fill="#ffffff"
            fillOpacity={1}
          />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}