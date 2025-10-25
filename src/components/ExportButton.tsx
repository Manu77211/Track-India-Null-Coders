'use client'

import html2canvas from 'html2canvas'
import { Download } from 'lucide-react'

interface ExportButtonProps {
  targetId: string
  filename: string
}

export default function ExportButton({ targetId, filename }: ExportButtonProps) {
  const handleExport = async () => {
    const element = document.getElementById(targetId)
    if (!element) return

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
      })
      
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Error exporting chart:', error)
    }
  }

  return (
    <button
      onClick={handleExport}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      title="Export as image"
    >
      <Download size={18} className="text-gray-600" />
    </button>
  )
}