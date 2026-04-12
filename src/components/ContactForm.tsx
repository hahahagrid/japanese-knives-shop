'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      message: formData.get('message'),
      honeypot: formData.get('honeypot'), // Include honeypot field
    }

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Не вдалося надіслати форму. Спробуйте пізніше.')
      }

      setStatus('success')
    } catch (err: any) {
      setErrorMessage(err.message)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-[var(--border)] p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
      >
        <CheckCircle2 className="h-16 w-16 text-green-600 mb-6" />
        <h2 className="text-2xl font-serif font-bold mb-4">Дякуємо!</h2>
        <p className="text-neutral-500 max-w-sm">
          Ваше повідомлення отримано. Ми зв&apos;яжемося з вами найближчим часом.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-8 text-xs tracking-widest uppercase border-b border-black pb-1 hover:opacity-50 transition-opacity"
        >
          Надіслати ще раз
        </button>
      </motion.div>
    )
  }

  return (
    <div className="bg-white border border-neutral-100 p-8 md:p-12 shadow-sm rounded-sm relative overflow-hidden group/form">
      <h2 className="text-2xl font-serif font-bold mb-10 tracking-tight">Напишіть нам</h2>

      <form id="form-contact" onSubmit={handleSubmit} className="space-y-10 relative z-10">
        <div className="relative group">
          <label
            htmlFor="name"
            className="block text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-2 font-bold transition-colors group-focus-within:text-[var(--accent)]"
          >
            Ваше ім&apos;я
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            minLength={2}
            maxLength={50}
            pattern="^[A-Za-zА-Яа-яІіЇїЄєҐґ\s'’ʼ‘’\`´.\-–—−]+$"
            title="Ім'я може містити літери, пробіли, дефіси та апострофи"
            className="w-full px-0 py-2 bg-transparent border-b border-neutral-200 focus:outline-none focus:border-black transition-all text-base placeholder:text-neutral-300 placeholder:italic placeholder:font-light"
            placeholder="Василь Симоненко"
          />
        </div>

        <div className="relative group">
          <label
            htmlFor="phone"
            className="block text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-2 font-bold transition-colors group-focus-within:text-[var(--accent)]"
          >
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
          <label
            htmlFor="email"
            className="block text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-2 font-bold transition-colors group-focus-within:text-[var(--accent)]"
          >
            Email (необов'язково)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            maxLength={100}
            pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
            title="Введіть коректний email (наприклад: example@mail.com)"
            className="w-full px-0 py-2 bg-transparent border-b border-neutral-200 focus:outline-none focus:border-black transition-all text-base placeholder:text-neutral-300 placeholder:italic placeholder:font-light"
            placeholder="example@mail.com"
          />
        </div>

        <div className="relative group">
          <label
            htmlFor="message"
            className="block text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-2 font-bold transition-colors group-focus-within:text-[var(--accent)]"
          >
            Ваше запитання
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            className="w-full px-0 py-2 bg-transparent border-b border-neutral-200 focus:outline-none focus:border-black transition-all text-base resize-none placeholder:text-neutral-300 placeholder:italic placeholder:font-light"
            placeholder="Опишіть ваше питання чи деталі замовлення..."
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

        <div className="pt-4">
          <button
            id="btn-contact-submit"
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-black text-white py-6 font-bold uppercase tracking-[0.3em] text-[11px] transition-all disabled:bg-neutral-300 disabled:cursor-not-allowed group/btn overflow-hidden relative shadow-lg shadow-black/5"
          >
            <span className="relative z-10">
              {status === 'loading' ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                'Відправити запит'
              )}
            </span>
            <div className="absolute inset-0 bg-[#BC002D] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          </button>
          <p className="text-center text-[10px] text-neutral-400 mt-6 leading-relaxed">
            Натискаючи «Відправити запит», ви погоджуєтесь з{' '}
            <Link href="/privacy" className="underline hover:text-black transition-colors">
              Політикою конфіденційності
            </Link>{' '}
            та обробкою персональних даних.
          </p>
        </div>
      </form>

      {/* Decorative Japanese Character */}
      <div className="absolute -bottom-6 -right-6 opacity-[0.05] pointer-events-none select-none group-hover/form:scale-110 transition-transform duration-1000">
        <span className="font-serif text-[240px] leading-none text-white">信</span>
      </div>
    </div>
  )
}
