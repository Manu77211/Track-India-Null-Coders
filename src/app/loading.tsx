'use client'

import { motion } from 'framer-motion'
import LiquidLoader from '@/components/LiquidLoader'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <LiquidLoader />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-8">Loading...</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Please wait while we prepare your data</p>
      </motion.div>
    </div>
  )
}