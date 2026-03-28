'use client'

import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useEffect, useState } from 'react'

export function CartIcon() {
  const { items, setCartOpen } = useCartStore()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch for local storage count
  useEffect(() => {
    setMounted(true)
  }, [])

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <button
      onClick={() => setCartOpen(true)}
      className="relative p-2 text-inherit hover:opacity-70 transition-opacity"
      aria-label="Корзина"
    >
      <ShoppingBag className="w-5 h-5" />
      {mounted && itemCount > 0 && (
        <span className="absolute top-0 right-0 w-4 h-4 bg-[#BC002D] text-white text-[9px] font-bold flex items-center justify-center rounded-full translate-x-1/4 -translate-y-1/4">
          {itemCount}
        </span>
      )}
    </button>
  )
}
