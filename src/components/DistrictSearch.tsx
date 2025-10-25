'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface DistrictSearchProps {
  districts: string[]
  value: string
  onChange: (value: string) => void
}

export default function DistrictSearch({ districts, value, onChange }: DistrictSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)

  const filteredDistricts = districts.filter((district) =>
    district.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (district: string) => {
    onChange(district)
    setSearch('')
    setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium mb-2 text-gray-700">District</label>
      <div className="relative">
        <input
          type="text"
          value={isOpen ? search : value}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search district..."
          className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        {search && isOpen && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredDistricts.length > 0 ? (
            filteredDistricts.map((district) => (
              <button
                key={district}
                onClick={() => handleSelect(district)}
                className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
              >
                {district}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 text-sm">No districts found</div>
          )}
        </div>
      )}
    </div>
  )
}