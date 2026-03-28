import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import NextImage from 'next/image'
import { AnimatedSection } from '@/components/AnimatedSection'
import { RichText } from '@/components/RichText'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
  })
  if (!docs.length) return { title: 'Not Found' }
  return { title: `${docs[0].title} | Блог | K N I V E S` }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    overrideAccess: false,
  })

  if (!docs.length) {
    notFound()
  }

  const post = docs[0]

  return (
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12 lg:py-24">
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
          <div className="aspect-[21/9] bg-stone-50 overflow-hidden relative border border-[var(--border)]">
            {post.coverImage && typeof post.coverImage === 'object' ? (
              <NextImage
                src={(post.coverImage as any).url}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            ) : (
              <>
                <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-sm bg-neutral-900 mb-12 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.08]">
                    <span className="font-serif text-[40vw] text-white">読</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>
        
        <div className="prose prose-neutral prose-lg mx-auto leading-relaxed text-neutral-700">
          <p className="font-serif italic text-xl mb-8 border-l-2 border-[var(--gold)] pl-8 py-2">
            Детальний погляд на мистецтво та традиції японського ковальства.
          </p>
          <RichText content={post.content} className="text-lg leading-relaxed" />
        </div>
      </AnimatedSection>
      
      <div className="mt-24 pt-12 border-t border-[var(--border)] text-center">
        <h3 className="text-xl font-serif italic mb-6">Бажаєте дізнатися більше?</h3>
        <Link href="/contacts" className="inline-block bg-black text-white py-4 px-10 font-bold uppercase tracking-widest text-[10px] transition-all group/btn overflow-hidden relative">
          <span className="relative z-10">Отримати консультацію</span>
          <div className="absolute inset-0 bg-[#BC002D] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
        </Link>
      </div>
    </article>
  )
}
