'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { driver: 'Funding', impact: 40 },
  { driver: 'Infrastructure', impact: 30 },
  { driver: 'Policy', impact: 20 },
]

export default function DriverChart() {
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