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
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 origin-left z-50"
    />
  )
}