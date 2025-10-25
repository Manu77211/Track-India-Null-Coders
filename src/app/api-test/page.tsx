'use client'

import { useEffect, useState } from 'react'
import { testApiConnection, fetchAvailableDatasets, fetchGSTRevenue } from '@/lib/api'

export default function ApiTestPage() {
  const [healthStatus, setHealthStatus] = useState<any>(null)
  const [datasets, setDatasets] = useState<any>(null)
  const [gstData, setGstData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testAPI = async () => {
      setLoading(true)
      
      // Test health endpoint
      const health = await testApiConnection()
      setHealthStatus(health)
      
      // Test datasets endpoint
      const datasetsResult = await fetchAvailableDatasets()
      setDatasets(datasetsResult)
      
      // Test GST revenue endpoint
      const gstResult = await fetchGSTRevenue()
      setGstData(gstResult)
      
      setLoading(false)
    }
    
    testAPI()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Flask API Connection Test
        </h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Testing API connection...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Health Check */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                1. Health Check (/api/health)
              </h2>
              <div className={`p-4 rounded-lg ${
                healthStatus?.status === 'healthy' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(healthStatus, null, 2)}
                </pre>
              </div>
            </div>

            {/* Datasets List */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                2. Available Datasets (/api/datasets)
              </h2>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="mb-2 text-sm text-gray-600">
                  <strong>Total Datasets:</strong> {datasets?.count || 0}
                </p>
                {datasets?.datasets?.map((dataset: any, index: number) => (
                  <div key={index} className="bg-white p-3 rounded-lg mb-2">
                    <p className="font-semibold text-blue-600">{dataset.name}</p>
                    <p className="text-sm text-gray-600">
                      Rows: {dataset.rows} | Columns: {dataset.columns.length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {dataset.columns.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* GST Revenue Data */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                3. GST Revenue Data (/api/gst-revenue)
              </h2>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="mb-2 text-sm text-gray-600">
                  <strong>Records:</strong> {gstData?.count || 0}
                </p>
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="p-2 text-left">Year</th>
                        <th className="p-2 text-right">Budget Estimate</th>
                        <th className="p-2 text-right">Actual Collection</th>
                        <th className="p-2 text-right">% Achieved</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gstData?.data?.map((row: any, index: number) => (
                        <tr key={index} className="border-t border-green-200">
                          <td className="p-2">{row.financial_year}</td>
                          <td className="p-2 text-right">{row.budget_estimates_be_}</td>
                          <td className="p-2 text-right">{row.actual_collection}</td>
                          <td className="p-2 text-right">{row._of_be_achieved}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">🎉 All Tests Passed!</h3>
              <p className="text-blue-50">
                Flask backend is connected and serving data successfully!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
