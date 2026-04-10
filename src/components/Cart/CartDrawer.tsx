'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export function CartDrawer() {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, getTotal } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!mounted) return null

  const total = getTotal()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-neutral-100">
              <h2 className="text-xl font-serif font-bold tracking-tight">Ваше замовлення</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 -mr-2 text-neutral-400 hover:text-black hover:-rotate-90 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                    <span className="text-[4rem] font-serif font-bold italic text-neutral-200">K</span>
                  </div>
                  <p className="text-lg text-neutral-400 font-serif italic">Ваша корзина порожня</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="text-[10px] tracking-[0.2em] uppercase font-bold border-b border-black pb-1 hover:opacity-60 transition-opacity"
                  >
                    Повернутися до каталогу
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-6 group">
                      <div className="relative w-24 h-32 bg-neutral-100 shrink-0 overflow-hidden">
                        {item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="96px"
                          />
                        )}
                      </div>
                      <div className="flex flex-col flex-1 py-1">
                        <Link
                          href={item.type === 'accessory' 
                            ? `/accessories/${item.slug}` 
                            : `/knives/${item.status === 'in_stock' ? 'in-stock' : 'custom-order'}/${item.slug}`
                          }
                          onClick={() => setCartOpen(false)}
                          className="font-serif font-bold text-lg leading-snug hover:text-[var(--gold)] transition-colors mb-1 line-clamp-2"
                        >
                          {item.title}
                        </Link>
                        <span className="text-xs text-neutral-400 mb-4">{item.status === 'custom_order' ? 'Під замовлення' : 'В наявності'}</span>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-3 border border-neutral-200 px-2 py-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-1 text-neutral-400 hover:text-black disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-neutral-400 hover:text-black transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <span className="font-bold whitespace-nowrap">
                              {(item.price * item.quantity).toLocaleString('uk-UA')} ₴
                            </span>
                            <button
                              id="btn-remove-from-cart"
                              data-product-name={item.title}
                              onClick={() => removeItem(item.id)}
                              className="text-[10px] uppercase tracking-wider text-neutral-400 hover:text-red-500 transition-colors"
                            >
                              Видалити
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 md:p-8 bg-neutral-50 border-t border-neutral-100">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-neutral-500">
                    Разом
                  </span>
                  <span className="text-2xl font-serif font-bold">
                    {total.toLocaleString('uk-UA')} ₴
                  </span>
                </div>
                <Link
                  href="/checkout"
                  id="btn-go-to-checkout"
                  onClick={() => setCartOpen(false)}
                  className="w-full bg-black text-white py-5 flex items-center justify-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] transition-colors group/btn relative overflow-hidden"
                >
                  <span className="relative z-10 transition-transform duration-300 group-hover/btn:-translate-x-2">
                    Оформити замовлення
                  </span>
                  <ArrowRight className="w-4 h-4 relative z-10 opacity-0 -translate-x-4 transition-all duration-300 group-hover/btn:opacity-100 group-hover/btn:translate-x-0" />
                  <div className="absolute inset-0 bg-[#BC002D] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
