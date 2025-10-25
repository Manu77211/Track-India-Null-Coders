'use client'

import TrendChart from './components/TrendChart'
import DriverChart from './components/DriverChart'
import Map from './components/Map'
import { Download, Filter } from 'lucide-react'
import jsPDF from 'jspdf'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const handleDownload = () => {
    const doc = new jsPDF()
    doc.text('Track India - Development Forecast Report', 20, 20)
    doc.text('Sector: Education', 20, 40)
    doc.text('District: Mysuru', 20, 50)
    doc.text('Forecast: Improving trends expected', 20, 60)
    doc.save('report.pdf')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            India Development Dashboard
          </h1>
          <p className="text-gray-600">Analyze and forecast development trends across Indian districts</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="text-blue-600" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Sector</label>
                  <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    <option>Education</option>
                    <option>Health</option>
                    <option>Water</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">State</label>
                  <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    <option>Karnataka</option>
                    <option>Maharashtra</option>
                    <option>Tamil Nadu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">District</label>
                  <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    <option>Mysuru</option>
                    <option>Bangalore</option>
                    <option>Mangalore</option>
                  </select>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Predict
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download Report
                </button>
              </div>
            </div>
          </motion.div>

          {/* Charts Section */}
          <div className="lg:col-span-3 space-y-8">
            {/* Line Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Forecasted Trends</h3>
              <TrendChart />
            </motion.div>

            {/* Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Top 3 Drivers</h3>
              <DriverChart />
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900">District-Level Visualization</h3>
              <Map />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}