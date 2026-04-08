export const revalidate = 86400

import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { AnimatedSection } from '@/components/AnimatedSection'
import { RichText } from '@/components/RichText'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageVersion } from '@/components/PageVersion'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 1,
  })
  if (!docs.length) return { title: 'Not Found' }
  const post = docs[0]
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://japanese-kitchen-knives.com.ua'
  const pageUrl = `${siteUrl}/blog/${slug}`

  // SEO plugin fields take priority, fallback to coverImage / default text
  const meta = post.meta as any
  const metaTitle = meta?.title || `${post.title} | Блог | Japanese Kitchen Knives`
  const description = meta?.description || `Читайте статтю «${post.title}» у блозі Japanese Kitchen Knives. Все про японські кухонні ножі, догляд, вибір та використання.`

  const metaImage = meta?.image as any
  const coverImage = post.coverImage as any
  const ogImageUrl = metaImage?.url ?? coverImage?.url ?? `${siteUrl}/images/hero_knife-1920.webp`

  return {
    title: metaTitle,
    description,
    openGraph: {
      title: meta?.title || post.title,
      description,
      url: pageUrl,
      siteName: 'Japanese Kitchen Knives',
      images: [{ url: ogImageUrl, width: 1200, height: 800, alt: post.title }],
      locale: 'uk_UA',
      type: 'article',
      publishedTime: (post as any).publishedDate ?? undefined,
    },
  }
}


export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  
  // 1. Find the current post
  const { docs: currentDocs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    overrideAccess: false,
  })

  if (!currentDocs.length) {
    notFound()
  }

  const post = currentDocs[0]
  
  // 2. Fetch all posts in the SAME order as the blog list page (-publishedDate)
  const { docs: allPosts } = await payload.find({
    collection: 'posts',
    sort: '-publishedDate', 
    limit: 300, 
    overrideAccess: false,
  })

  // 3. Find neighbors in the array
  const currentIndex = allPosts.findIndex(p => p.id === post.id)
  
  /**
   * Logical Flip for "Feed-style" navigation:
   * Next (Наступна) = Older (Next article in the descending list) -> Index + 1
   * Previous (Попередня) = Newer (Previous article in the descending list) -> Index - 1
   */
  const newerPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null; // Newer
  const olderPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null; // Older

  const prevPost = newerPost; // Newer is Previous (back to top of list)
  const nextPost = olderPost; // Older is Next (further down the list)

  const settings = await payload.findGlobal({
    slug: 'site-settings',
    overrideAccess: false,
  })

  return (
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12 lg:py-24">
      <PageVersion />
      <Link href="/blog" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-12 hover:opacity-50 transition-opacity">
        <ChevronLeft className="h-3 w-3" />
        Назад до блогу
      </Link>

      <AnimatedSection>
        <header className="mb-16">
          {post.publishedDate && (
            <time className="text-[10px] tracking-widest uppercase text-[var(--muted)] mb-4 block font-semibold">
              {new Date(post.publishedDate).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          )}
          <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl mb-12 leading-[1.1]">
            {post.title}
          </h1>
          <div className="mx-auto bg-stone-50 overflow-hidden relative border border-[var(--border)] shadow-md">
            {post.coverImage && typeof post.coverImage === 'object' ? (
              <img
                src={(post.coverImage as any).url}
                alt={post.title}
                className="w-full h-auto block"
              />
            ) : (
              <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-sm bg-neutral-900 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.08]">
                  <span className="font-serif text-[40vw] text-white">読</span>
                </div>
              </div>
            )}
          </div>
        </header>
        
        <div className="prose prose-neutral prose-lg mx-auto text-neutral-800">
          <RichText content={post.content} />
        </div>
      </AnimatedSection>

      {(prevPost || nextPost) && (
        <div className="w-full py-12 mt-4 text-center">
          <div className={`flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-0 relative ${!prevPost || !nextPost ? 'md:max-w-xl mx-auto' : ''}`}>
            
            {/* Previous Post (Newer) */}
            {prevPost && (
              <div className={`flex-1 flex flex-col ${nextPost ? 'border-b md:border-b-0 border-black/5 pb-8 md:pb-0 md:pr-12 lg:pr-24' : 'items-center text-center'}`}>
                <Link 
                  href={`/blog/${prevPost.slug}`} 
                  className={`flex flex-col group transition-all duration-700 items-center text-center ${nextPost ? 'md:items-end md:text-right' : ''}`}
                >
                  <p className="text-[10px] tracking-[0.4em] uppercase text-black/30 mb-4 font-bold flex items-center gap-4 group-hover:text-[var(--gold)] transition-colors">
                    <ChevronLeft className="h-3 w-3" />
                    Попередня стаття
                  </p>
                  <h4 className="font-serif italic text-xl md:text-2xl text-black/80 group-hover:text-black transition-colors duration-500 leading-snug">
                    {prevPost.title}
                  </h4>
                  <div className="h-[1px] w-0 group-hover:w-full bg-[var(--gold)] mt-3 transition-all duration-700 opacity-50" />
                </Link>
              </div>
            )}

            {/* Central Divider - only if both exist */}
            {prevPost && nextPost && (
                <div className="hidden md:block w-[1px] bg-black/5 self-stretch" />
            )}

            {/* Next Post (Older) */}
            {nextPost && (
              <div className={`flex-1 flex flex-col ${prevPost ? 'pt-8 md:pt-0 md:pl-12 lg:pl-24' : 'items-center text-center'}`}>
                <Link 
                  href={`/blog/${nextPost.slug}`} 
                  className={`flex flex-col group transition-all duration-700 items-center text-center ${prevPost ? 'md:items-start md:text-left' : ''}`}
                >
                  <p className="text-[10px] tracking-[0.4em] uppercase text-black/30 mb-4 font-bold flex items-center gap-4 group-hover:text-[var(--gold)] transition-colors">
                    Наступна стаття
                    <ChevronRight className="h-3 w-3" />
                  </p>
                  <h4 className="font-serif italic text-xl md:text-2xl text-black/80 group-hover:text-black transition-colors duration-500 leading-snug">
                    {nextPost.title}
                  </h4>
                  <div className="h-[1px] w-0 group-hover:w-full bg-[var(--gold)] mt-3 transition-all duration-700 opacity-50" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Footer Details */}
      <div className="mt-4 pt-12 border-t border-black/5 text-center flex flex-col items-center">
        {/* Social Links */}
        <div className="flex gap-4 mb-10">
          {settings?.instagramUrl && (
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-full group/icon"
              aria-label="Instagram"
            >
              <svg className="h-5 w-5 text-neutral-600 group-hover/icon:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
          )}
          {settings?.telegramUrl && (
            <a
              href={settings.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-full group/icon"
              aria-label="Telegram"
            >
              <svg className="h-5 w-5 text-neutral-600 group-hover/icon:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </a>
          )}
          {settings?.youtubeUrl && (
            <a
              href={settings.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-full group/icon"
              aria-label="YouTube"
            >
              <svg className="h-5 w-5 text-neutral-600 group-hover/icon:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="m10 15 5-3-5-3v6Z" />
              </svg>
            </a>
          )}
        </div>

        <h3 className="text-xl font-serif italic mb-6">Бажаєте дізнатися більше?</h3>
        <Link href="/contacts" className="inline-block bg-black text-white py-4 px-10 font-bold uppercase tracking-widest text-[10px] transition-all group/btn overflow-hidden relative">
          <span className="relative z-10">Отримати консультацію</span>
          <div className="absolute inset-0 bg-[#BC002D] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
        </Link>
      </div>
    </article>
  )
}
