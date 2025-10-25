import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import LoadingBar from '@/components/LoadingBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Track India - Null Coders',
  description: 'AI for Development Forecast + Chat with India',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadingBar />
        <Navbar />
        {children}
      </body>
    </html>
  )
}