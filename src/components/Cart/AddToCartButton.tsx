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
    type?: 'knife' | 'accessory'
  }
}

export function AddToCartButton({ knife }: AddToCartButtonProps) {
  const { addItem } = useCartStore()

  if (!knife.price) {
    return (
      <a
        href="/contacts"
        id="btn-learn-price"
        data-product-name={knife.title}
        className="w-full sm:flex-1 text-center bg-black text-white py-6 px-10 font-bold uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl shadow-black/10 active:scale-95 group/btn overflow-hidden relative"
      >
        <span className="relative z-10">Дізнатись ціну</span>
        <div className="absolute inset-0 bg-[#BC002D] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
      </a>
    )
  }

  if (knife.status === 'sold') {
    return (
      <button
        disabled
        className="w-full sm:flex-1 bg-neutral-200 text-neutral-500 py-6 px-10 font-bold uppercase tracking-[0.2em] text-[11px] cursor-not-allowed flex items-center justify-center gap-3"
      >
        <span>Розпродано</span>
      </button>
    )
  }

  return (
    <button
      id="btn-add-to-cart"
      data-product-name={knife.title}
      onClick={() =>
        addItem({
          id: knife.id,
          slug: knife.slug,
          title: knife.title,
          price: knife.price,
          status: knife.status,
          imageUrl: knife.imageUrl,
          type: knife.type || 'knife',
        })
      }
      className="w-full sm:flex-1 bg-black text-white py-6 px-10 font-bold uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center justify-center gap-3 group/btn overflow-hidden relative"
    >
      <span className="relative z-10">{knife.status === 'in_stock' ? 'У кошик' : 'Передзамовити'}</span>
      <ShoppingBag className="w-4 h-4 relative z-10 opacity-70 group-hover/btn:opacity-100 transition-opacity" />
      <div className="absolute inset-0 bg-[#BC002D] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
    </button>
  )
}
