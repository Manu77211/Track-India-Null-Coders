'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const { theme } = useTheme()
  const panels = useRef<(HTMLElement | null)[]>([])
  const workCards = useRef<(HTMLElement | null)[]>([])
  const skillBadges = useRef<(HTMLSpanElement | null)[]>([])
  const floatingElements = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    // Hero entrance animation on load
    if (panels.current[0]) {
      gsap.fromTo(panels.current[0], { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: 'power2.out' })
    }
    
    const heroHeading = panels.current[0]?.querySelector('.hero-heading')
    const heroSub = panels.current[0]?.querySelector('.hero-sub')
    const heroVisual = panels.current[0]?.querySelector('.hero-visual')
    
    if (heroHeading) {
      gsap.fromTo(heroHeading, { x: -80, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.3, delay: 0.2, ease: 'power3.out' })
    }
    if (heroSub) {
      gsap.fromTo(heroSub, { x: -60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.2, delay: 0.4, ease: 'power3.out' })
    }
    if (heroVisual) {
      gsap.fromTo(heroVisual, { scale: 0.85, autoAlpha: 0, rotate: -5 }, { scale: 1, autoAlpha: 1, rotate: 0, duration: 1.4, delay: 0.5, ease: 'power3.out' })

      // Floating animation for hero visual
      gsap.to(heroVisual, {
        y: -20,
        duration: 10,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      })
    }

    // Full-page section reveals on scroll with different directions
    panels.current.slice(1).forEach((panel, index) => {
      if (!panel) return
      const direction = index % 2 === 0 ? 60 : -60
      gsap.fromTo(panel, { autoAlpha: 0, x: direction, y: 30 }, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: panel,
          start: 'top 75%',
          end: 'top 40%',
          toggleActions: 'play none none reverse'
        }
      })
    })

    // Stagger work cards with rotation
    workCards.current.forEach((card, i) => {
      if (!card) return
      gsap.fromTo(card, { y: 40, autoAlpha: 0, rotation: -5 }, {
        y: 0,
        autoAlpha: 1,
        rotation: 0,
        duration: 0.9,
        delay: i * 0.15,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        }
      })

      // Hover animation for cards
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { scale: 1.05, duration: 0.3, ease: 'power2.out' })
      })
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' })
      })
    })

    // Skill badges stagger animation
    skillBadges.current.forEach((badge, i) => {
      if (!badge) return
      gsap.fromTo(badge, { scale: 0, autoAlpha: 0 }, {
        scale: 1,
        autoAlpha: 1,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: badge,
          start: 'top 85%',
        }
      })
    })

    // Floating elements continuous animation
    floatingElements.current.forEach((el, i) => {
      if (!el) return
      gsap.to(el, {
        y: -30 + (i * 10),
        x: 20 - (i * 10),
        duration: 2 + (i * 0.5),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      })
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div className={`${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'} overflow-x-hidden transition-colors duration-300`}>
      {/* Panel 1: Hero full-bleed */}
      <section id="hero" ref={el => { panels.current[0] = el }} className="min-h-screen flex items-center px-8 md:px-16 pt-32 overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 lg:col-span-7 relative">
            <div className="absolute -left-10 top-0 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl" ref={el => { floatingElements.current[0] = el }}></div>
            <h1 className="hero-heading text-[80px] md:text-[120px] lg:text-[140px] leading-[0.85] font-black tracking-tight mb-8">
              Track
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
                India
              </span>
            </h1>
            <p className={`hero-sub text-2xl md:text-4xl lg:text-5xl ${theme === 'dark' ? 'text-gray-300/90' : 'text-gray-600'} font-light leading-tight max-w-2xl mb-8`}>
              AI-powered insights into India&apos;s development trends.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className={`px-4 py-2 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-300'} backdrop-blur-sm border rounded-full text-sm`}>Data Analytics</span>
              <span className={`px-4 py-2 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-300'} backdrop-blur-sm border rounded-full text-sm`}>AI Predictions</span>
              <span className={`px-4 py-2 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-300'} backdrop-blur-sm border rounded-full text-sm`}>Interactive Maps</span>
            </div>
          </div>
          <div className="md:col-span-6 lg:col-span-5 relative">
            <div className="absolute -right-10 bottom-10 w-32 h-32 bg-pink-600/20 rounded-full blur-3xl hidden md:block" ref={el => { floatingElements.current[1] = el }}></div>
            <div className="hero-visual w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 shadow-2xl shadow-purple-900/30 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-white/80 text-sm font-medium">Development Analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Panel 2: Work intro and large images */}
      <section id="work" ref={el => { panels.current[1] = el }} className="min-h-screen flex items-center px-8 md:px-16 py-20 overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
          <div className="md:col-span-5">
            <h2 className="text-[64px] md:text-[96px] lg:text-[120px] font-bold leading-[0.9] tracking-tight mb-6">
              Key
              <br />
              Features
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-lg max-w-md`}>
              Comprehensive tools for tracking and predicting India&apos;s development across education, health, and water sectors.
            </p>
          </div>
          <div className="md:col-span-7 grid grid-cols-2 gap-6">
            <div ref={el => { workCards.current[0] = el }}>
              <Link href="/dashboard" prefetch={true} className="block aspect-[4/5] rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl overflow-hidden relative group cursor-pointer">
                <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                  <svg className="w-24 h-24 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className={`p-6 ${theme === 'dark' ? 'bg-gradient-to-t from-black via-black/80' : 'bg-gradient-to-t from-white via-white/90'} to-transparent absolute bottom-0 w-full`}>
                  <p className="text-base font-semibold mb-1">Interactive Dashboard</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3`}>Real-time Analytics • Data Visualization</p>
                  <div className="flex gap-2">
                    <span className="text-[10px] px-2 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">Next.js</span>
                    <span className="text-[10px] px-2 py-1 bg-pink-500/20 rounded-full border border-pink-500/30">Recharts</span>
                  </div>
                </div>
              </Link>
            </div>
            <div ref={el => { workCards.current[1] = el }}>
              <Link href="/chat" prefetch={true} className="block aspect-[4/5] rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl overflow-hidden relative group cursor-pointer">
                <div className="w-full h-full bg-gradient-to-br from-green-600/20 to-blue-600/20 flex items-center justify-center">
                  <svg className="w-24 h-24 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className={`p-6 ${theme === 'dark' ? 'bg-gradient-to-t from-black via-black/80' : 'bg-gradient-to-t from-white via-white/90'} to-transparent absolute bottom-0 w-full`}>
                  <p className="text-base font-semibold mb-1">Chat with India</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3`}>AI Assistant • Natural Language</p>
                  <div className="flex gap-2">
                    <span className="text-[10px] px-2 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">GPT-4</span>
                    <span className="text-[10px] px-2 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">RAG</span>
                  </div>
                </div>
              </Link>
            </div>
            <div ref={el => { workCards.current[2] = el }} className="aspect-[4/5] rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl overflow-hidden relative group cursor-pointer col-span-2">
              <div className="w-full h-full bg-gradient-to-br from-orange-600/20 to-pink-600/20 flex items-center justify-center">
                <svg className="w-32 h-32 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div className={`p-6 ${theme === 'dark' ? 'bg-gradient-to-t from-black via-black/80' : 'bg-gradient-to-t from-white via-white/90'} to-transparent absolute bottom-0 w-full`}>
                <p className="text-xl font-semibold mb-1">District-Level Maps</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3`}>Interactive Maps • Geospatial Data</p>
                <div className="flex gap-2">
                  <span className="text-xs px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">Leaflet</span>
                  <span className="text-xs px-3 py-1 bg-pink-500/20 rounded-full border border-pink-500/30">GeoJSON</span>
                  <span className="text-xs px-3 py-1 bg-orange-500/20 rounded-full border border-orange-500/30">React</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Panel 3: About & Skills */}
      <section id="about" ref={el => { panels.current[2] = el }} className="min-h-screen flex items-center px-8 md:px-16 py-20 overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-5xl md:text-6xl font-bold">About Project</h3>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
            <p className={`text-xl md:text-2xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} leading-relaxed font-light`}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 font-semibold">Track India</span> is an <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI-powered analytics platform</span> that provides <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">predictive insights</span> into India&apos;s development trends across education, health, and water sectors.
            </p>
            <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
              Our platform combines machine learning, geospatial visualization, and conversational AI to help policymakers, researchers, and citizens understand and predict development patterns across Indian districts.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">650+</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Districts Covered</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">3</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Key Sectors</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-7 space-y-8">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20 relative">
              <div className="w-full h-full bg-gradient-to-br from-purple-600/30 via-pink-600/30 to-orange-600/30 flex items-center justify-center">
                <svg className="w-64 h-64 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
            <div>
              <h4 className="text-2xl font-semibold mb-6">Technologies Used</h4>
              <div className="flex flex-wrap gap-3">
                {['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'GSAP', 'Leaflet', 'Recharts', 'Python', 'FastAPI', 'Machine Learning', 'OpenAI', 'Zustand'].map((skill, i) => (
                  <span 
                    key={skill}
                    ref={el => { skillBadges.current[i] = el }}
                    className="px-5 py-3 bg-gradient-to-r from-purple-600/10 to-pink-600/10 backdrop-blur-sm border border-purple-500/20 rounded-full text-sm font-medium hover:border-purple-500/40 transition-all duration-300 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Panel 4: Contact & Services */}
      <section id="contact" ref={el => { panels.current[3] = el }} className="min-h-screen flex items-center px-8 md:px-16 py-20 overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-20">
            <div className="md:col-span-6 space-y-8">
              <div>
                <h2 className="text-[64px] md:text-[96px] font-bold leading-[0.9] tracking-tight mb-6">
                  Get
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
                    Started
                  </span>
                </h2>
                <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed max-w-xl`}>
                  Explore India&apos;s development data with our powerful analytics platform. Start your journey today.
                </p>
              </div>
              
              <div className="space-y-4">
                <Link href="/dashboard" prefetch={true} className="flex items-center gap-4 text-lg group">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className={`${theme === 'dark' ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'} transition-colors`}>View Dashboard</span>
                </Link>
                
                <Link href="/chat" prefetch={true} className="flex items-center gap-4 text-lg group">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className={`${theme === 'dark' ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'} transition-colors`}>Chat with India</span>
                </Link>

                <div className="flex gap-4 pt-4">
                  {['GitHub', 'Documentation', 'API', 'Support'].map((social, i) => (
                    <a 
                      key={social}
                      href="#" 
                      ref={el => { floatingElements.current[i + 2] = el }}
                      className={`px-6 py-3 ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' : 'bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400'} backdrop-blur-sm border rounded-full text-sm transition-all duration-300`}
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-6 space-y-6">
              <h3 className="text-3xl font-bold mb-8">Key Capabilities</h3>
              <div className="space-y-4">
                {[
                  { title: 'Predictive Analytics', desc: 'AI-powered forecasts for education, health, and water sectors', icon: '📊' },
                  { title: 'District Insights', desc: 'Granular data visualization across 650+ Indian districts', icon: '🗺️' },
                  { title: 'Interactive Maps', desc: 'Explore development trends with intuitive geospatial tools', icon: '🌏' },
                  { title: 'Conversational AI', desc: 'Ask questions about India in natural language', icon: '💬' }
                ].map((service) => (
                  <div 
                    key={service.title}
                    className={`p-6 ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' : 'bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400'} backdrop-blur-sm border rounded-2xl transition-all duration-300 group`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{service.icon}</span>
                      <div>
                        <h4 className="text-xl font-semibold mb-2">{service.title}</h4>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{service.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} pt-12 pb-8`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} text-sm`}>© 2025 Track India - Null Coders. All rights reserved.</p>
              <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} text-sm`}>Built with ❤️ for India&apos;s Development</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}