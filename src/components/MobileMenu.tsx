'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './Logo'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'Головна' },
  { href: '/knives/in-stock', label: 'Ножі в наявності' },
  { href: '/knives/custom-order', label: 'Ножі під замовлення' },
  { href: '/accessories', label: 'Аксесуари' },
  { href: '/about', label: 'Про нас' },
  { href: '/shipping', label: 'Доставка' },
  { href: '/blog', label: 'Блог' },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="xl:hidden p-2 -mr-2 text-inherit transition-opacity hover:opacity-60 relative z-50 pointer-events-auto"
        aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key="menu"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Menu className="h-5 w-5" />
          </motion.span>
        </AnimatePresence>
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {open && (
              <motion.div
                key="mobile-overlay"
                initial={{ y: '-100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="fixed inset-0 z-[200] bg-background flex flex-col px-6 pt-6 pb-8 text-foreground"
              >
              <div className="flex items-center justify-between mb-12">
                <Logo onClick={() => setOpen(false)} className="text-[18px]" />
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 -mr-2 text-foreground transition-opacity hover:opacity-60"
                  aria-label="Закрити меню"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.35, ease: 'easeOut' }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`block py-4 text-3xl font-serif font-bold border-b border-[var(--border)] hover:opacity-50 transition-opacity ${
                        pathname === link.href ? 'text-[#BC002D]' : 'text-foreground'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              
              <div className="mt-auto">
                <Link 
                  href="/contacts" 
                  onClick={() => setOpen(false)}
                  className="block w-full bg-black text-white text-center py-5 font-bold uppercase tracking-[0.2em] text-[11px] mt-8 group/btn overflow-hidden relative"
                >
                  <span className="relative z-10">Зв'язатись з нами</span>
                  <div className="absolute inset-0 bg-[#BC002D] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
