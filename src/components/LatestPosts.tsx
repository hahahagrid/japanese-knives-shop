import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatedSection } from './AnimatedSection'
import { ArrowRight } from 'lucide-react'

export async function LatestPosts() {
  const payload = await getPayload({ config })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    limit: 3,
    sort: '-publishedDate',
    overrideAccess: false,
  })

  if (posts.length === 0) return null

  return (
    <section className="py-12 border-t border-[var(--border)]">
      <AnimatedSection className="flex justify-between items-end mb-8">
        <div>
          <p className="text-label mb-2">Знання та досвід</p>
          <h2 className="heading-display text-3xl md:text-4xl">Корисне</h2>
        </div>
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-[10px] md:text-xs tracking-widest uppercase border-b border-foreground pb-0.5 hover:opacity-50 transition-opacity"
        >
          Читати все <ArrowRight className="w-3 h-3" />
        </Link>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
            <div className="aspect-[16/10] overflow-hidden relative mb-3 bg-neutral-100">
              {post.coverImage && typeof post.coverImage === 'object' && (
                <Image
                  src={(post.coverImage as any).sizes?.thumbnail?.url || (post.coverImage as any).url}
                  alt={post.title}
                  fill
                  className="object-cover lg:group-hover:scale-[1.05] transition-transform duration-1000 ease-out-expo"
                  sizes="400px"
                />
              )}
            </div>
            <h3 className="font-serif italic text-xl mb-3 lg:group-hover:text-[var(--accent)] transition-colors">
              {post.title}
            </h3>
            <p className="text-[10px] tracking-widest uppercase text-neutral-400 font-bold lg:group-hover:text-black transition-colors">
              Переглянути статтю
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
