'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '../ui/Logo'
import { MobileMenu } from './MobileMenu'
import { CartIcon } from '../Cart/CartIcon'
import { ChevronDown } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Головна' },
  { 
    label: 'Ножі', 
    href: '/knives/in-stock',
    children: [
      { href: '/knives/in-stock', label: 'В наявності' },
      { href: '/knives/custom-order', label: 'Під замовлення' },
    ]
  },
  { href: '/accessories', label: 'Аксесуари' },
  { href: '/about', label: 'Про нас' },
  { href: '/shipping', label: 'Доставка' },
  { href: '/blog', label: 'Блог' },
]

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const transparentHeadPaths = [
    '/',
    '/knives/in-stock',
    '/knives/custom-order',
    '/accessories',
    '/about',
    '/shipping',
    '/blog'
  ]

  const isAlwaysDark = !transparentHeadPaths.includes(pathname || '')

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
    : isAlwaysDark 
      ? 'bg-transparent border-transparent' // Transparent for clean pages like Contacts/404
      : 'bg-transparent border-transparent' // Transparent for Hero pages

  const textColorClass = isDarkText ? 'text-[#1d1d1f]' : 'text-white'
  const textMutedClass = isDarkText ? 'text-[#1d1d1f]/60' : 'text-white/60'
  const textHoverBase = isDarkText ? 'text-[#1d1d1f]/80 hover:text-[#1d1d1f]' : 'text-white/80 hover:text-white'
  const dropdownBgClass = isDarkText ? 'bg-white shadow-[0_20px_40px_rgba(0,0,0,0.1)]' : 'bg-[#0A0A09] shadow-[0_20px_40px_rgba(0,0,0,0.4)]'
  const dropdownItemHoverClass = isDarkText ? 'hover:bg-neutral-50' : 'hover:bg-white/5'

  return (
    <>
      {/* Background/Blur Layer */}
      <div className={`fixed top-0 left-0 z-[49] w-full h-20 transition-[background-color,backdrop-filter,border-color] duration-500 ease-in-out border-b pointer-events-none ${bgClass}`} />

      {/* Interactive Layer */}
      <header className={`fixed top-0 left-0 z-[50] w-full h-20 pointer-events-none transition-[color] duration-500 ease-in-out ${textColorClass}`}>
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
                <div key={link.label} className="relative group p-4 -m-4">
                  {link.children ? (
                    <>
                      <div className={`flex items-center gap-1 text-nav transition-colors duration-300 whitespace-nowrap cursor-pointer ${textHoverBase}`}>
                        {link.label}
                        <ChevronDown className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                      </div>
                      
                      {/* Dropdown Menu */}
                      <div className={`absolute top-[full] left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out-expo translate-y-2 group-hover:translate-y-0`}>
                        <div className={`w-48 overflow-hidden rounded-none ${dropdownBgClass}`}>
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block px-6 py-3 text-nav font-medium transition-all duration-300 ${textHoverBase} ${dropdownItemHoverClass}`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href!}
                      className={`text-nav transition-colors duration-300 whitespace-nowrap cursor-pointer ${textHoverBase}`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
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

