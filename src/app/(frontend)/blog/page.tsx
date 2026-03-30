export const revalidate = 86400

import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import NextImage from 'next/image'
import { AnimatedSection } from '@/components/AnimatedSection'

export const metadata = {
  title: 'Блог | K N I V E S',
}

export default async function BlogPage() {
  const payload = await getPayload({ config })

  const { docs: posts } = await payload.find({
    collection: 'posts',
    sort: '-publishedDate',
    overrideAccess: false,
  })

  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <div className="bg-[#0A0A09] text-white pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="absolute right-[-5%] top-[50%] -translate-y-1/2 text-[20vw] font-serif opacity-[0.06] select-none pointer-events-none">
          読
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.5em] uppercase text-neutral-500 mb-4 font-bold">
              Натхнення
            </p>
            <h1 className="heading-display text-5xl md:text-6xl lg:text-8xl mb-6">
              Блог
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed font-light italic font-serif">
              Мистецтво виготовлення, догляд за лезом та філософія японської майстерності. Дізнайтеся
              більше про світ професійних інструментів.
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 md:py-24">

      {posts.length === 0 ? (
        <div className="py-24 text-center text-[var(--muted)] border-t border-[var(--border)]">
          <p className="font-serif italic text-xl">
            Статей поки немає. Ми готуємо цікавий матеріал для вас.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {posts.map((post, i) => (
            <AnimatedSection delay={i * 0.1} key={post.id}>
              <Link href={`/blog/${post.slug}`} className="group flex flex-col">
                <div className="aspect-[4/5] mb-6 overflow-hidden relative">
                  {post.coverImage && typeof post.coverImage === 'object' ? (
                    <NextImage
                      src={(post.coverImage as any).url}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105 will-change-transform"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-100 transition-transform duration-1000 group-hover:scale-105 will-change-transform" />
                  )}
                  <div className="absolute top-6 left-6">
                    <span className="text-[10px] bg-white px-3 py-1 font-bold tracking-widest uppercase shadow-sm">
                      Стаття
                    </span>
                  </div>
                </div>

                {post.publishedDate && (
                  <time className="text-[10px] tracking-widest uppercase text-[var(--muted)] mb-3 font-semibold">
                    {new Date(post.publishedDate).toLocaleDateString('uk-UA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                )}

                <h2 className="text-2xl font-serif font-bold mb-4 group-hover:text-[var(--gold)] transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h2>

                <div className="mt-auto pt-4 border-t border-[var(--border)] inline-flex items-center gap-2 group-hover:gap-4 transition-all w-fit">
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Читати далі
                  </span>
                  <div className="h-[1px] w-8 bg-black" />
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
