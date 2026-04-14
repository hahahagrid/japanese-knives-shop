'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Plus } from 'lucide-react'

interface ExpandableSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  id?: string
}

export function ExpandableSection({ 
  title, 
  children, 
  defaultOpen = false,
  id 
}: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="border-b border-[var(--border)] last:border-0 overflow-hidden group">
      <button
        id={id ? `btn-expand-${id}` : undefined}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-8 flex items-center justify-between text-left group/btn transition-colors hover:text-black"
      >
        <h2 className={`text-label-caps group-hover/btn:text-black transition-colors uppercase tracking-[0.2em] text-[11px] font-bold ${isOpen ? 'text-black' : 'text-[#B4B4B0]'}`}>
          {title}
        </h2>
        
        <div className={`relative w-8 h-8 flex items-center justify-center transition-transform duration-500 ease-out-expo ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
          <div className="absolute w-[1px] h-4 bg-black/20 group-hover/btn:bg-black transition-colors" />
          <div className="absolute h-[1px] w-4 bg-black/20 group-hover/btn:bg-black transition-colors" />
        </div>
      </button>

      <div 
        className={`grid transition-all duration-700 ease-out-expo ${
          isOpen ? 'grid-rows-[1fr] opacity-100 pb-12' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="animate-fade-in duration-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
