// components/BottomNav.tsx - CYLINDER GLASSMORPHIC NAV
'use client';
import { useState } from 'react';

export default function BottomNav() {
  const [activeNav, setActiveNav] = useState('home');

  const navItems = [
    { 
      id: 'home', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: 'Home'
    },
    { 
      id: 'shop', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      label: 'Shop'
    },
    { 
      id: 'garage', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      label: 'Garage',
      isCenter: true
    },
    { 
      id: 'guides', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      label: 'Guides'
    },
    { 
      id: 'profile', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: 'Profile'
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      {/* Main Cylinder Container */}
      <div className="relative">
        {/* Glassmorphic Background */}
        <div className="
          bg-black/40 backdrop-blur-2xl 
          border border-white/10
          rounded-full
          px-6 py-4
          shadow-2xl shadow-black/50
        ">
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`
                  relative group
                  ${item.isCenter ? 'w-14 h-14' : 'w-12 h-12'}
                  rounded-full
                  flex items-center justify-center
                  transition-all duration-500
                  ${activeNav === item.id 
                    ? 'bg-white text-black scale-110' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }
                  ${item.isCenter ? 'bg-white text-black shadow-lg shadow-white/20' : ''}
                `}
              >
                {item.icon}
                
                {/* Active Indicator */}
                {activeNav === item.id && !item.isCenter && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                )}

                {/* Tooltip */}
                <div className="
                  absolute -top-14 left-1/2 -translate-x-1/2
                  bg-black/90 backdrop-blur-xl
                  border border-white/10
                  rounded-xl
                  px-3 py-2
                  opacity-0 group-hover:opacity-100
                  pointer-events-none
                  transition-all duration-300
                  whitespace-nowrap
                ">
                  <span className="text-white text-xs font-light">{item.label}</span>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-white/10 rotate-45"></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Subtle Glow */}
        <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl -z-10"></div>
        
        {/* Bottom Reflection */}
        <div className="absolute top-full left-0 right-0 h-8 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-xl -z-20"></div>
      </div>
    </div>
  );
}
