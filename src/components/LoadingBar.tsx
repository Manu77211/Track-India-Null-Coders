'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function LoadingBar() {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-400 origin-left z-50"
    />
  )
}