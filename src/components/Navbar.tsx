'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/chat', label: 'Chat with India' },
    { href: '/about', label: 'About' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">
        <div className="flex justify-between items-center py-6">
          {/* Professional Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              {/* Logo Icon */}
              <svg 
                width="40" 
                height="40" 
                viewBox="0 0 40 40" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:scale-110"
              >
                {/* Outer Circle */}
                <circle 
                  cx="20" 
                  cy="20" 
                  r="18" 
                  className={theme === 'dark' ? 'stroke-white' : 'stroke-gray-900'}
                  strokeWidth="2"
                  fill="none"
                />
                {/* India Map Silhouette - Simplified */}
                <path 
                  d="M20 8 L24 12 L26 14 L28 18 L28 22 L26 26 L24 28 L20 32 L16 28 L14 26 L12 22 L12 18 L14 14 L16 12 Z" 
                  className={theme === 'dark' ? 'fill-white' : 'fill-gray-900'}
                  opacity="0.9"
                />
                {/* Center Dot */}
                <circle 
                  cx="20" 
                  cy="20" 
                  r="2" 
                  className={theme === 'dark' ? 'fill-blue-400' : 'fill-blue-600'}
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                TrackIndia
              </span>
              <span className={`text-[10px] tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                DATA ANALYTICS
              </span>
            </div>
          </Link>
          
          {/* Desktop Menu - Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive(link.href)
                      ? theme === 'dark'
                        ? 'bg-white text-black'
                        : 'bg-gray-900 text-white'
                      : theme === 'dark'
                        ? 'text-white hover:bg-white/10'
                        : 'text-gray-900 hover:bg-gray-900/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/20 text-yellow-300'
                  : 'bg-gray-900/10 hover:bg-gray-900/20 text-gray-900'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-white/10 text-yellow-300'
                  : 'hover:bg-gray-900/10 text-gray-900'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-white/10 text-white'
                  : 'hover:bg-gray-900/10 text-gray-900'
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block py-3 px-4 rounded-lg transition-colors ${
                  isActive(link.href)
                    ? theme === 'dark'
                      ? 'bg-white/10 text-white font-semibold'
                      : 'bg-gray-900/10 text-gray-900 font-semibold'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-white/5'
                      : 'text-gray-700 hover:bg-gray-900/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}