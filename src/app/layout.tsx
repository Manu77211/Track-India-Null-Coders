import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import LoadingBar from '@/components/LoadingBar'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ClerkProvider } from '@clerk/nextjs'

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
    <ClerkProvider>
      <html lang="en" className="overflow-x-hidden scroll-smooth" suppressHydrationWarning>
        <body className={`${inter.className} overflow-x-hidden`} suppressHydrationWarning>
          <ThemeProvider>
            <LoadingBar />
            <Navbar />
            <div className="relative">
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}