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
        <div className="flex flex-col gap-24">
          {posts.map((post, i) => (
            <AnimatedSection delay={i * 0.1} key={post.id} className="border-t border-[var(--border)] pt-12 md:pt-16">
              <div className="flex flex-col md:flex-row gap-8 lg:gap-16 xl:gap-24 items-stretch">
                
                {/* Image Section (Fixed width on desktop, responsive on mobile) */}
                <Link href={`/blog/${post.slug}`} className="w-full md:w-[320px] lg:w-[460px] xl:w-[660px] md:order-last group flex-shrink-0">
                  <div className="relative w-full h-[250px] sm:h-[300px] md:h-auto md:aspect-[16/10] overflow-hidden border border-[var(--border)] shadow-sm">
                    {post.coverImage && typeof post.coverImage === 'object' ? (
                      <NextImage
                        src={(post.coverImage as any).url}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
                        <span className="font-serif text-3xl opacity-10">読</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-between py-1 md:py-2">
                  <Link href={`/blog/${post.slug}`} className="group flex flex-col">
                    {post.publishedDate && (
                      <time className="heading-display text-lg md:text-xl xl:text-2xl mb-2 md:mb-4 block text-[var(--gold)]">
                        {new Date(post.publishedDate).toLocaleDateString('uk-UA', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </time>
                    )}
                    
                    <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold mb-3 md:mb-6 leading-tight group-hover:opacity-70 transition-opacity">
                      {post.title}
                    </h2>

                    <div className="text-neutral-500 line-clamp-3 lg:line-clamp-4 leading-relaxed text-sm md:text-lg xl:text-xl italic font-serif">
                      Мистецтво виготовлення, догляд за лезом та філософія японської майстерності. 
                      Саме тут ми розкриваємо секрети ковалів та ділимося досвідом правильного обходження з преміальними інструментами...
                    </div>
                  </Link>

                  {/* Separate Social Links */}
                  <div className="flex gap-2 md:gap-3 lg:gap-4 mt-6 md:mt-10">
                    <a
                      href="#"
                      className="p-2.5 md:p-3 lg:p-3.5 xl:p-4 border border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-full group/icon"
                      aria-label="Instagram"
                    >
                      <svg className="h-3.5 md:h-4 lg:h-5 xl:h-6 w-3.5 md:w-4 lg:w-5 xl:w-6 text-neutral-600 group-hover/icon:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="p-2.5 md:p-3 lg:p-3.5 xl:p-4 border border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-full group/icon"
                      aria-label="Telegram"
                    >
                      <svg className="h-3.5 md:h-4 lg:h-5 xl:h-6 w-3.5 md:w-4 lg:w-5 xl:w-6 text-neutral-600 group-hover/icon:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="p-2.5 md:p-3 lg:p-3.5 xl:p-4 border border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-full group/icon"
                      aria-label="YouTube"
                    >
                      <svg className="h-3.5 md:h-4 lg:h-5 xl:h-6 w-3.5 md:w-4 lg:w-5 xl:w-6 text-neutral-600 group-hover/icon:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="m10 15 5-3-5-3v6Z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
