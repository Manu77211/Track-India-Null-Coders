'use client'

import ChatInterface from './components/ChatInterface'
import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function Chat() {
  const { theme } = useTheme()
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'} py-8 pt-24 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <MessageSquare className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} size={32} />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Chat with India
            </h1>
          </div>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Ask questions about education, health, and water sectors across Indian districts
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ChatInterface />
        </motion.div>
      </div>
    </div>
  )
}