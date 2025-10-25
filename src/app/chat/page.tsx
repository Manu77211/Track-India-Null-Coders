'use client'

import ChatInterface from './components/ChatInterface'
import { useTheme } from '@/contexts/ThemeContext'

export default function Chat() {
  const { theme } = useTheme()
  
  return (
    <div className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} pt-16 transition-colors duration-300`}>
      <ChatInterface />
    </div>
  )
}
