'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Truck, Wallet, ShieldCheck, HelpCircle, ChevronLeft, ChevronRight, Clock, Shield, RefreshCw } from 'lucide-react'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface ProductTabsProps {
  description?: React.ReactNode
  specifications?: React.ReactNode
}

export function ProductTabs({ description, specifications }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('description')
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const tabs: Tab[] = [
    {
      id: 'description',
      label: 'Опис',
      content: description,
    },
    {
      id: 'specs',
      label: 'Характеристики',
      content: specifications,
    },
    {
      id: 'shipping',
      label: 'Доставка',
      content: <ShippingInfo />,
    },
    {
      id: 'payment',
      label: 'Оплата',
      content: <PaymentInfo />,
    },
  ].filter(tab => tab.content)

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 5)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5)
    }
  }, [])

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [checkScroll, tabs])

  const scroll = (direction: 'left' | 'right', speed = 5) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += direction === 'left' ? -speed : speed
      checkScroll()
    }
  }

  const startScrolling = (direction: 'left' | 'right') => {
    if (intervalRef.current) return
    intervalRef.current = setInterval(() => scroll(direction, 10), 16)
  }

  const stopScrolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  if (tabs.length === 0) return null

  return (
    <div className="w-full mt-4 md:mt-6">
      {/* Tab Navigation Wrapper */}
      <div className="flex items-center border-b border-[var(--border)] mb-8">
        
        {/* Mobile Left Arrow */}
        <div className="md:hidden flex-shrink-0">
          <button 
            className={`px-4 py-6 transition-colors ${canScrollLeft ? 'text-black' : 'text-neutral-200'}`}
            onMouseDown={() => startScrolling('left')}
            onMouseUp={stopScrolling}
            onMouseLeave={stopScrolling}
            onTouchStart={() => startScrolling('left')}
            onTouchEnd={stopScrolling}
            onClick={() => scroll('left', 80)}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Area */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex-1 flex overflow-x-auto scrollbar-hide no-scrollbar scroll-smooth gap-1"
          style={{ 
            msOverflowStyle: 'none', 
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 md:flex-1 whitespace-nowrap md:whitespace-normal px-4 md:px-2 py-7 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative overflow-hidden ${
                activeTab === tab.id ? 'text-black' : 'text-[#B4B4B0] hover:text-black'
              }`}
            >
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Right Arrow */}
        <div className="md:hidden flex-shrink-0">
          <button 
            className={`px-4 py-6 transition-colors ${canScrollRight ? 'text-black' : 'text-neutral-200'}`}
            onMouseDown={() => startScrolling('right')}
            onMouseUp={stopScrolling}
            onMouseLeave={stopScrolling}
            onTouchStart={() => startScrolling('right')}
            onTouchEnd={stopScrolling}
            onClick={() => scroll('right', 80)}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in duration-500 pb-12">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
      
      {/* Inline styles for safety if tailwind classes fail for some reason */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

function ShippingInfo() {
  return (
    <div className="max-w-4xl">
      <div className="prose prose-neutral prose-lg max-w-none text-neutral-800 leading-relaxed">
        <ul className="space-y-4 list-none p-0 m-0">
          <li className="flex items-start gap-4">
            <span className="mt-[11px] w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
            <span>Нова Пошта (до відділення або поштомату)</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="mt-[11px] w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
            <span>Кур&apos;єрська доставка Нової Пошти</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="mt-[11px] w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
            <span>Міжнародна доставка (за індивідуальною домовленістю)</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

function PaymentInfo() {
  return (
    <div className="max-w-4xl">
      <div className="prose prose-neutral prose-lg max-w-none text-neutral-800 leading-relaxed">
        <ul className="space-y-4 list-none p-0 m-0">
          <li className="flex items-start gap-4">
            <span className="mt-[11px] w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
            <span>Оплата на карту, після підтвердження замовлення</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="mt-[11px] w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
            <span>Відправка товару виконується після повної або часткової оплати (страховий платіж)</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="mt-[11px] w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
            <span>Гарантуємо швидку обробку замовлення та надання ТТН одразу після відправки</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
