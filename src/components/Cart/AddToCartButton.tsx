'use client'

import { useCartStore } from '@/store/cartStore'
import { ShoppingBag } from 'lucide-react'

interface AddToCartButtonProps {
  knife: {
    id: string
    slug: string
    title: string
    price: number
    status: string
    imageUrl: string | null
  }
}

export function AddToCartButton({ knife }: AddToCartButtonProps) {
  const { addItem } = useCartStore()

  if (!knife.price) {
    return (
      <a
        href="/contacts"
        className="flex-1 text-center bg-black text-white py-6 px-10 font-bold uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl shadow-black/10 active:scale-95 group/btn overflow-hidden relative"
      >
        <span className="relative z-10">Дізнатись ціну</span>
        <div className="absolute inset-0 bg-[#BC002D] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
      </a>
    )
  }

  return (
    <button
      onClick={() =>
        addItem({
          id: knife.id,
          slug: knife.slug,
          title: knife.title,
          price: knife.price,
          status: knife.status,
          imageUrl: knife.imageUrl,
        })
      }
      className="flex-1 bg-black text-white py-6 px-10 font-bold uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center justify-center gap-3 group/btn overflow-hidden relative"
    >
      <span className="relative z-10">{knife.status === 'in_stock' ? 'У кошик' : 'Передзамовити'}</span>
      <ShoppingBag className="w-4 h-4 relative z-10 opacity-70 group-hover/btn:opacity-100 transition-opacity" />
      <div className="absolute inset-0 bg-[#BC002D] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
    </button>
  )
}
