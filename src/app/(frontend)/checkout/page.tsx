'use client'

import { useCartStore } from '@/store/cartStore'
import { AnimatedSection } from '@/components/AnimatedSection'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, AlertCircle, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CheckoutPage() {
  const { items, getTotal, clearCart, removeItem } = useCartStore()
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [orderNumber, setOrderNumber] = useState('')

  const subtotal = getTotal()
  // Can add shipping cost later if needed
  const total = subtotal

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (items.length === 0) return

    setStatus('loading')
    const formData = new FormData(e.currentTarget)
    
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      deliveryInfo: formData.get('deliveryInfo'),
      message: formData.get('message'),
      honeypot: formData.get('honeypot'), // Bot trap
      items: items.map(item => ({
        productId: String(item.id),
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      total: total,
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Щось пішло не так при оформленні замовлення.')
      }

      const resData = await res.json()
      setOrderNumber(resData.orderNumber)
      setStatus('success')
      clearCart()
    } catch (err: any) {
      setErrorMessage(err.message)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="container mx-auto px-4 min-h-[70dvh] flex flex-col items-center justify-center text-center pt-28">
        <AnimatedSection className="max-w-xl">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600 border border-green-100">
             <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
             </svg>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-6">Замовлення прийнято</h1>
          <div className="bg-neutral-50 border border-neutral-100 py-6 px-10 rounded-sm mb-8 inline-block">
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-2 font-bold">Номер вашого замовлення</p>
            <p className="text-4xl font-serif font-bold">{orderNumber}</p>
          </div>
          <p className="text-neutral-500 mb-10 text-lg max-w-md mx-auto">
            Дякуємо за ваш вибір! Ми зв&apos;яжемося з вами найближчим часом для підтвердження деталей оплати та доставки.
          </p>
          <Link href="/" className="text-[11px] font-bold uppercase tracking-[0.2em] border-b border-black pb-1 hover:opacity-60 transition-opacity">
            Повернутися на головну
          </Link>
        </AnimatedSection>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-28 pb-16 md:pt-32 md:pb-24 relative z-10">
      <AnimatedSection>
        <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--muted)] mb-3">ОФОРМЛЕННЯ</p>
        <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-12 lg:mb-16">
          Ваше замовлення
        </h1>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        {/* Left: Form - Order 2 on Mobile */}
        <AnimatedSection delay={0.1} className="lg:col-span-7 xl:col-span-6 order-2 lg:order-1">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-8">
              <h2 className="text-xl font-serif font-bold border-b border-black/10 pb-4">Контактні дані</h2>
              
              <div className="relative group">
                <label htmlFor="name" className="block text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-2 font-bold transition-colors group-focus-within:text-[var(--gold)]">
                  Прізвище та Ім&apos;я *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  minLength={2}
                  maxLength={50}
                  pattern="^[A-Za-zА-Яа-яІіЇїЄєҐґ\s\-]+$"
                  title="Ім'я може містити лише літери, пробіли та дефіси"
                  className="w-full px-0 py-2 bg-transparent border-b border-neutral-200 focus:outline-none focus:border-black transition-all text-base placeholder:text-neutral-300 placeholder:italic placeholder:font-light"
                  placeholder="Василь Симоненко"
                />
              </div>

              <div className="relative group">
                <label htmlFor="phone" className="block text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-2 font-bold transition-colors group-focus-within:text-[var(--gold)]">
                  Телефон *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  minLength={10}
                  maxLength={20}
                  pattern="^\+?[0-9\s\-\(\)]+$"
                  title="Введіть коректний номер телефону"
                  className="w-full px-0 py-2 bg-transparent border-b border-neutral-200 focus:outline-none focus:border-black transition-all text-base placeholder:text-neutral-300 placeholder:italic placeholder:font-light"
                  placeholder="+380..."
                />
              </div>

              <div className="relative group">
                <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-2 font-bold transition-colors group-focus-within:text-[var(--gold)]">
                  Email (необов&apos;язково)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  maxLength={100}
                  pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                  title="Введіть коректний email (наприклад: example@mail.com)"
                  className="w-full px-0 py-2 bg-transparent border-b border-neutral-200 focus:outline-none focus:border-black transition-all text-base placeholder:text-neutral-300 placeholder:italic placeholder:font-light"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="space-y-8 pt-6">
              <h2 className="text-xl font-serif font-bold border-b border-black/10 pb-4">Доставка</h2>
              
              <div className="relative group">
                <label htmlFor="deliveryInfo" className="block text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-2 font-bold transition-colors group-focus-within:text-[var(--gold)]">
                  Місто та відділення (Нова Пошта) *
                </label>
                <textarea
                  id="deliveryInfo"
                  name="deliveryInfo"
                  required
                  rows={2}
                  className="w-full px-0 py-2 bg-transparent border-b border-neutral-200 focus:outline-none focus:border-black transition-all text-base resize-none placeholder:text-neutral-300 placeholder:italic placeholder:font-light"
                  placeholder="м. Київ, Відділення №1"
                />
              </div>

              <div className="relative group">
                <label htmlFor="message" className="block text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-2 font-bold transition-colors group-focus-within:text-[var(--gold)]">
                  Коментар до замовлення (необов&apos;язково)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={2}
                  className="w-full px-0 py-2 bg-transparent border-b border-neutral-200 focus:outline-none focus:border-black transition-all text-base resize-none placeholder:text-neutral-300 placeholder:italic placeholder:font-light"
                  placeholder="Особливі побажання..."
                />
              </div>

              {/* Honeypot field (hidden from humans) - Bot trap */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  placeholder="Do not fill this field"
                />
              </div>
            </div>

            <AnimatePresence>
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 text-red-500 text-xs font-medium bg-red-50 p-4 rounded-sm"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-8">
              <button
                type="submit"
                disabled={status === 'loading' || items.length === 0}
                className="w-full bg-black text-white py-6 font-bold uppercase tracking-[0.3em] text-[11px] transition-all disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-4 group/btn overflow-hidden relative shadow-lg shadow-black/5"
              >
                <span className="relative z-10">
                  {status === 'loading' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Підтвердити замовлення'
                  )}
                </span>
                <div className="absolute inset-0 bg-[#BC002D] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              </button>
              <p className="text-center text-[10px] text-neutral-400 mt-6 leading-relaxed">
                Натискаючи «Підтвердити замовлення», ви погоджуєтесь з <Link href="/privacy" className="underline hover:text-black transition-colors">Політикою конфіденційності</Link> та обробкою персональних даних.
              </p>
              <div className="mt-8 p-4 bg-neutral-50 border border-neutral-100 rounded-sm">
                <p className="text-center text-[11px] text-neutral-600 font-medium leading-relaxed">
                  Оплата здійснюється після підтвердження замовлення нашим менеджером.
                </p>
              </div>
            </div>
          </form>
        </AnimatedSection>

        {/* Right: Summary - Order 1 on Mobile */}
        <AnimatedSection delay={0.2} className="lg:col-span-5 xl:col-start-8 order-1 lg:order-2">
          <div className="bg-neutral-50/50 p-8 border border-neutral-100 rounded-sm lg:sticky lg:top-32">
            <h2 className="text-xl font-serif font-bold border-b border-black/10 pb-4 mb-8">Ваш кошик</h2>
            
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-400 mb-4 italic font-serif">Ваша корзина порожня</p>
                <Link href="/knives/in-stock" className="text-[10px] font-bold uppercase tracking-widest text-black border-b border-black pb-1 hover:opacity-60 transition-opacity">
                  До каталогу ножів
                </Link>
                <div className="h-4" />
                <Link href="/accessories" className="text-[10px] font-bold uppercase tracking-widest text-black border-b border-black pb-1 hover:opacity-60 transition-opacity">
                  До аксесуарів
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 mb-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="relative w-20 h-24 bg-neutral-100 shrink-0 overflow-hidden">
                        {item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="80px"
                          />
                        )}
                      </div>
                      <div className="flex flex-col flex-1 py-1">
                        <Link
                          href={item.type === 'accessory' 
                            ? `/accessories/${item.slug}` 
                            : `/knives/${item.status === 'in_stock' ? 'in-stock' : 'custom-order'}/${item.slug}`
                          }
                          className="font-serif font-bold text-base leading-snug hover:text-[var(--gold)] transition-colors line-clamp-2 pr-4"
                        >
                          {item.title}
                        </Link>
                        <div className="text-[10px] text-neutral-400 mt-1 uppercase tracking-widest">
                          К-сть: {item.quantity}
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="font-bold text-sm">
                            {(item.price * item.quantity).toLocaleString('uk-UA')} ₴
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-300 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-black/10 pt-6 space-y-4">
                  <div className="flex justify-between text-sm text-neutral-500">
                    <span>Товари ({items.reduce((acc, item) => acc + item.quantity, 0)})</span>
                    <span>{subtotal.toLocaleString('uk-UA')} ₴</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-500">
                    <span>Доставка</span>
                    <span>За тарифом перевізника</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-black/10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">До сплати</span>
                    <span className="text-3xl font-serif font-bold">{total.toLocaleString('uk-UA')} ₴</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
