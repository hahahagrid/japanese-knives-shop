'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { CartIcon } from './Cart/CartIcon'

const navLinks = [
  { href: '/in-stock', label: 'В наявності' },
  { href: '/custom-order', label: 'Під замовлення' },
  { href: '/about', label: 'Про нас' },
  { href: '/shipping', label: 'Доставка' },
  { href: '/blog', label: 'Блог' },
]

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const isAlwaysDark = pathname?.startsWith('/knives/') || pathname?.startsWith('/blog/') || pathname === '/contacts' || pathname === '/checkout'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll() // initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isDarkText = scrolled || isAlwaysDark

  const bgClass = scrolled 
    ? 'bg-[#fbfbfd]/75 backdrop-blur-md border-[var(--border)]' 
    : 'bg-transparent border-transparent'

  const textColorClass = isDarkText ? 'text-[#1d1d1f]' : 'text-white'
  const textMutedClass = isDarkText ? 'text-[#1d1d1f]/60' : 'text-white/60'
  const textHoverBase = isDarkText ? 'text-[#1d1d1f]/80 hover:text-[#1d1d1f]' : 'text-white/80 hover:text-white'

  return (
    <>
      {/* Background/Blur Layer */}
      <div className={`fixed top-0 left-0 z-[49] w-full h-20 transition-all duration-500 ease-in-out border-b pointer-events-none ${bgClass}`} />

      {/* Interactive Layer */}
      <header className={`fixed top-0 left-0 z-[50] w-full h-20 pointer-events-none transition-colors duration-500 ease-in-out ${textColorClass}`}>
        <div className="container relative mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl pointer-events-auto">
          {/* Left: Logo */}
          <div className="flex-1 flex justify-start">
            <Logo className="text-[20px]" />
          </div>

          {/* Center */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-max items-center justify-center">
            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[14px] font-medium transition-colors duration-300 relative group whitespace-nowrap cursor-pointer ${textHoverBase}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {/* Tablet Menu */}
            <div className="flex xl:hidden">
              <MobileMenu />
            </div>
          </div>

          {/* Right */}
          <div className="flex-1 flex justify-end items-center gap-4 xl:gap-6">
            <Link
              href="/contacts"
              className={`hidden xl:block text-[14px] font-medium transition-colors duration-300 whitespace-nowrap ${textHoverBase}`}
            >
              Контакти
            </Link>
            <CartIcon />
            <div className="flex md:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
