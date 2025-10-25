'use client'

import { useState } from 'react'
import TrendChart from './components/TrendChart'
import DriverChart from './components/DriverChart'
import Map from './components/Map'
import ExportButton from '@/components/ExportButton'
import DistrictSearch from '@/components/DistrictSearch'
import { Download, Filter } from 'lucide-react'
import jsPDF from 'jspdf'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

const stateDistrictData = {
  Karnataka: ['Bangalore', 'Mysuru', 'Mangalore', 'Hubli', 'Belgaum'],
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
}

export default function Dashboard() {
  const { theme } = useTheme()
  const [sector, setSector] = useState('Education')
  const [state, setState] = useState('Karnataka')
  const [district, setDistrict] = useState('Bangalore')
  const [isLoading, setIsLoading] = useState(false)

  const handleStateChange = (newState: string) => {
    setState(newState)
    setDistrict(stateDistrictData[newState as keyof typeof stateDistrictData][0])
  }

  const handlePredict = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleDownload = () => {
    const doc = new jsPDF()
    doc.text('Track India - Development Forecast Report', 20, 20)
    doc.text(`Sector: ${sector}`, 20, 40)
    doc.text(`State: ${state}`, 20, 50)
    doc.text(`District: ${district}`, 20, 60)
    doc.text('Forecast: Improving trends expected', 20, 70)
    doc.save(`report-${district}-${sector}.pdf`)
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'} py-8 pt-24 transition-colors duration-300`}>
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
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Analyze and forecast development trends across Indian districts</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Section - Fixed on Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className={`${theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-100'} backdrop-blur-sm p-6 rounded-2xl shadow-lg border fixed left-4 top-52 w-[calc((100%-3rem-2rem)/4)] max-h-[calc(100vh-14rem)] overflow-y-auto hidden lg:block`}>
              <div className="flex items-center gap-2 mb-6">
                <Filter className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} size={20} />
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Filters</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Sector</label>
                  <select 
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className={`w-full p-3 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  >
                    <option>Education</option>
                    <option>Health</option>
                    <option>Water</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>State</label>
                  <select 
                    value={state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className={`w-full p-3 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  >
                    <option>Karnataka</option>
                    <option>Maharashtra</option>
                    <option>Tamil Nadu</option>
                  </select>
                </div>
                <DistrictSearch 
                  districts={stateDistrictData[state as keyof typeof stateDistrictData]}
                  value={district}
                  onChange={setDistrict}
                />
                <button 
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Loading...' : 'Predict'}
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
              className={`${theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-100'} backdrop-blur-sm p-6 rounded-2xl shadow-lg border hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Forecasted Trends</h3>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{sector} - {district}</span>
                </div>
                <ExportButton targetId="trend-chart" filename={`trends-${district}-${sector}`} />
              </div>
              <div id="trend-chart">
                <TrendChart sector={sector} district={district} />
              </div>
            </motion.div>

            {/* Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`${theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-100'} backdrop-blur-sm p-6 rounded-2xl shadow-lg border hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Top 3 Drivers</h3>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{sector}</span>
                </div>
                <ExportButton targetId="driver-chart" filename={`drivers-${sector}`} />
              </div>
              <div id="driver-chart">
                <DriverChart sector={sector} />
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className={`${theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-100'} backdrop-blur-sm p-6 rounded-2xl shadow-lg border hover:shadow-xl transition-shadow duration-300`}
            >
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>District-Level Visualization</h3>
              <Map />
            </motion.div>

            {/* Data Sources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={`${theme === 'dark' ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50/80 border-blue-100'} backdrop-blur-sm p-6 rounded-2xl border`}
            >
              <h3 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Data Sources</h3>
              <div className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  • <a href="https://data.gov.in" target="_blank" rel="noopener noreferrer" className={theme === 'dark' ? 'text-blue-400 hover:underline' : 'text-blue-600 hover:underline'}>Open Government Data (OGD) Platform India</a>
                </p>
                <p>
                  • <a href="https://www.census2011.co.in" target="_blank" rel="noopener noreferrer" className={theme === 'dark' ? 'text-blue-400 hover:underline' : 'text-blue-600 hover:underline'}>Census of India 2011</a>
                </p>
                <p>
                  • <a href="https://niti.gov.in" target="_blank" rel="noopener noreferrer" className={theme === 'dark' ? 'text-blue-400 hover:underline' : 'text-blue-600 hover:underline'}>NITI Aayog - National Institution for Transforming India</a>
                </p>
                <p>
                  • <a href="https://www.mospi.gov.in" target="_blank" rel="noopener noreferrer" className={theme === 'dark' ? 'text-blue-400 hover:underline' : 'text-blue-600 hover:underline'}>Ministry of Statistics and Programme Implementation</a>
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-3`}>
                  Note: Currently using mock data for demonstration. Real data integration in progress.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}