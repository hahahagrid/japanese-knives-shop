/**
 * Instant loading state for product pages (knives & accessories).
 * Mirrors the real layout: breadcrumbs, 4:5 gallery, title/price/buttons.
 */
export function ProductSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24 pb-16 md:pt-32 md:pb-32 animate-pulse">
      {/* Breadcrumbs */}
      <div className="h-3 w-56 bg-neutral-100 mb-12" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Gallery */}
        <div>
          <div className="aspect-[4/5] bg-neutral-100" />
          <div className="mt-4 grid grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-square bg-neutral-100" />
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="h-3 w-32 bg-neutral-100 mb-6" />
          <div className="h-12 md:h-16 w-3/4 bg-neutral-100 mb-4" />
          <div className="h-12 md:h-16 w-1/2 bg-neutral-100 mb-10" />
          <div className="h-8 w-44 bg-neutral-100 mb-12" />
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-[60px] w-full sm:flex-1 bg-neutral-100" />
            <div className="h-[60px] w-full sm:flex-1 bg-neutral-100" />
          </div>
        </div>
      </div>
    </div>
  )
}
