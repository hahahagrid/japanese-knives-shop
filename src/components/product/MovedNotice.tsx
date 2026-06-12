'use client'

import { useSearchParams } from 'next/navigation'

/**
 * Banner shown after the smart status redirect (?moved=1).
 * Reads the query string on the client so the product page itself
 * stays statically generated — `searchParams` in the server component
 * would force dynamic rendering of the whole route.
 */
export function MovedNotice({ inStock }: { inStock: boolean }) {
  const searchParams = useSearchParams()

  if (searchParams.get('moved') !== '1') return null

  return (
    <div className="mb-8 p-6 bg-stone-50 border border-black/5 text-center">
      <p className="text-xs md:text-sm uppercase tracking-widest text-black/60 font-serif italic">
        {inStock
          ? 'Цей товар знову є в наявності, у нас на складі'
          : 'Цей товар було продано, але ми можемо доставити його вам під замовлення'}
      </p>
    </div>
  )
}
