'use client'

import React from 'react'

export const ScrollToTop: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-3 bg-[#0A0A09] px-6 transition-all duration-300 hover:text-[var(--gold)] group"
      aria-label="Back to top"
    >
      {children}
    </button>
  )
}
