'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Track India
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/chat" className="text-gray-700 hover:text-blue-600 transition-colors">
              Chat with India
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/chat" className="block py-2 text-gray-700 hover:text-blue-600">
              Chat with India
            </Link>
            <Link href="/about" className="block py-2 text-gray-700 hover:text-blue-600">
              About
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}