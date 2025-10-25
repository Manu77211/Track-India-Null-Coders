'use client'

import dynamic from 'next/dynamic'

const DynamicMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="h-96 w-full bg-gray-100 rounded flex items-center justify-center">Loading map...</div>,
})

export default DynamicMap