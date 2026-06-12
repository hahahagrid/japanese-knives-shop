export default function Loading() {
  return (
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pt-32 pb-20 md:pt-48 md:pb-32 animate-pulse">
      <div className="h-3 w-36 bg-neutral-100 mb-12" />
      <div className="h-3 w-44 bg-neutral-100 mb-6" />
      <div className="h-10 md:h-14 w-5/6 bg-neutral-100 mb-4" />
      <div className="h-10 md:h-14 w-2/3 bg-neutral-100 mb-12" />
      <div className="aspect-video w-full bg-neutral-100 mb-16" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`h-4 bg-neutral-100 ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </article>
  )
}
