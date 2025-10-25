'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts'

const data = [
  { year: '2024', value: 75, lower: 70, upper: 80 },
  { year: '2025', value: 80, lower: 75, upper: 85 },
  { year: '2026', value: 85, lower: 80, upper: 90 },
  { year: '2027', value: 88, lower: 83, upper: 93 },
]

export default function TrendChart() {
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