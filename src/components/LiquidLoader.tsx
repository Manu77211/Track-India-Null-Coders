'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const LiquidLoader = () => {
  const [heights, setHeights] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [droplets, setDroplets] = useState([false, false, false, false, false, false, false]);
  const { theme } = useTheme();

  // Theme-aware colors - Black and White theme
  const lightColors = [
    'from-gray-900 to-gray-700',
    'from-gray-800 to-gray-600', 
    'from-gray-700 to-gray-500',
    'from-gray-600 to-gray-400',
    'from-gray-500 to-gray-300',
    'from-gray-400 to-gray-200',
    'from-gray-300 to-gray-100'
  ];

  const darkColors = [
    'from-white to-gray-200',
    'from-gray-100 to-gray-300', 
    'from-gray-200 to-gray-400',
    'from-gray-300 to-gray-500',
    'from-gray-400 to-gray-600',
    'from-gray-500 to-gray-700',
    'from-gray-600 to-gray-800'
  ];

  const colors = theme === 'dark' ? darkColors : lightColors;

  const shadowColors = [
    '#111827', // gray-900
    '#1f2937', // gray-800
    '#374151', // gray-700
    '#4b5563', // gray-600
    '#6b7280', // gray-500
    '#9ca3af', // gray-400
    '#d1d5db'  // gray-300
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(prev => prev.map((height, index) => {
        const maxHeight = 80;
        const delay = index * 0.8;
        const time = Date.now() * 0.001;
        
        const primaryWave = Math.sin(time + delay);
        const bounceWave = Math.sin(time * 4 + delay) * 0.15;
        const ripple = Math.sin(time * 8 + delay) * 0.05;
        const combinedWave = primaryWave + bounceWave + ripple;
        
        return maxHeight * combinedWave;
      }));

      setDroplets(prev => prev.map((_, index) => {
        const delay = index * 0.8;
        const time = Date.now() * 0.001;
        const waveValue = Math.sin(time + delay);
        return waveValue > 0.8;
      }));
    }, 32);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end space-x-4 p-8">
      {heights.map((height, index) => (
        <div key={index} className="relative flex flex-col items-center">
          {/* Droplet with liquid physics */}
          <div 
            className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors[index]} mb-3 transition-all duration-500 ease-out ${
              droplets[index] ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              animationDelay: `${index * 0.2}s`,
              filter: 'blur(0.5px)',
              transform: droplets[index] 
                ? `translateY(${Math.sin(Date.now() * 0.008 + index * 0.5) * 3}px) scale(${0.8 + Math.sin(Date.now() * 0.006 + index * 0.3) * 0.4})` 
                : 'translateY(10px) scale(0.5)',
              boxShadow: droplets[index] ? `0 0 15px ${shadowColors[index]}40` : 'none'
            }}
          />
          
          {/* Main liquid bar with enhanced physics */}
          <div
            className={`w-10 bg-gradient-to-t ${colors[index]} rounded-full transition-all duration-200 ease-out relative overflow-hidden shadow-lg`}
            style={{ 
              height: `${Math.abs(height)}px`,
              transform: height < 0 ? 'scaleY(-1)' : 'scaleY(1)',
              transformOrigin: 'bottom',
              filter: 'blur(0.3px)',
              boxShadow: `0 0 20px ${shadowColors[index]}50, inset 0 0 20px rgba(255,255,255,0.1)`
            }}
          >
            {/* Liquid surface tension effect */}
            <div 
              className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/40 to-transparent rounded-full"
              style={{
                transform: `translateY(${Math.sin(Date.now() * 0.003 + index * 0.5) * 1}px) scaleY(${0.8 + Math.sin(Date.now() * 0.004 + index * 0.3) * 0.3})`
              }}
            />
            
            {/* Liquid wave effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-t from-white/20 via-white/10 to-transparent rounded-full"
              style={{
                transform: `translateY(${Math.sin(Date.now() * 0.002 + index * 0.5) * 2}px)`,
                background: `linear-gradient(0deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)`
              }}
            />
            
            {/* Shimmer effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
              style={{
                transform: `translateX(${Math.sin(Date.now() * 0.0015 + index * 0.7) * 8}px)`,
                width: '140%',
                left: '-20%'
              }}
            />
            
            {/* Bubble effect */}
            <div 
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                top: `${20 + Math.sin(Date.now() * 0.003 + index * 0.8) * 10}%`,
                left: `${30 + Math.sin(Date.now() * 0.002 + index * 0.6) * 20}%`,
                transform: `scale(${0.5 + Math.sin(Date.now() * 0.004 + index * 0.4) * 0.5})`,
                opacity: Math.sin(Date.now() * 0.005 + index * 0.9) * 0.3 + 0.3
              }}
            />
          </div>
          
          {/* Enhanced base droplet with liquid physics */}
          <div 
            className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors[index]} mt-2 transition-all duration-300`}
            style={{
              opacity: Math.sin(Date.now() * 0.003 + index * 0.9) * 0.4 + 0.6,
              transform: `scale(${0.6 + Math.sin(Date.now() * 0.002 + index * 0.6) * 0.4}) translateY(${Math.sin(Date.now() * 0.004 + index * 0.8) * 1}px)`,
              filter: 'blur(0.2px)',
              boxShadow: `0 2px 8px ${shadowColors[index]}40`
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default LiquidLoader;
