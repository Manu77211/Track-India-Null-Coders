'use client'

import { motion } from 'framer-motion'
import { Target, Users, Database, Zap } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function About() {
  const { theme } = useTheme()
  
  const features = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To make India\'s development data accessible, predictive, and actionable through AI-powered insights.',
    },
    {
      icon: Database,
      title: 'Data Sources',
      description: 'Leveraging open data from data.gov.in and other government sources for accurate predictions.',
    },
    {
      icon: Zap,
      title: 'AI Technology',
      description: 'Advanced machine learning models for forecasting trends with confidence intervals.',
    },
    {
      icon: Users,
      title: 'For Everyone',
      description: 'Built for policymakers, researchers, and citizens to understand development trends.',
    },
  ]

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'} py-16 pt-24 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className={`text-5xl font-bold mb-4 ${theme === 'dark' ? 'bg-gradient-to-r from-white to-gray-400' : 'bg-gradient-to-r from-gray-900 to-gray-600'} bg-clip-text text-transparent`}>
            About Track India
          </h1>
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Empowering data-driven decisions for India&apos;s development through AI and open data
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`${theme === 'dark' ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300`}
            >
              <div className={`w-14 h-14 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-gray-200 to-gray-100'} rounded-2xl flex items-center justify-center mb-4`}>
                <feature.icon className={theme === 'dark' ? 'text-white' : 'text-gray-900'} size={28} />
              </div>
              <h3 className={`text-2xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
              <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* What We Cover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`${theme === 'dark' ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-8 rounded-2xl shadow-lg border mb-16`}
        >
          <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>What We Cover</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-100 border border-gray-300'}`}>
              <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Education</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Literacy rates, school infrastructure, enrollment data across districts</p>
            </div>
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-100 border border-gray-300'}`}>
              <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Health</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Hospital infrastructure, doctor availability, health outcomes by region</p>
            </div>
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-100 border border-gray-300'}`}>
              <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Water</h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Water availability, sanitation facilities, resource management</p>
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`text-center p-12 rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-gray-900 to-gray-800'}`}
        >
          <h2 className="text-3xl font-bold mb-4 text-white">Built by Null Coders</h2>
          <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-100'}`}>
            A passionate team building AI solutions for India&apos;s development challenges
          </p>
          <p className="text-white/90">
            Track India Hackathon Project • 2025
          </p>
        </motion.div>
      </div>
    </div>
  )
}