import React from 'react'
import Image from 'next/image'
import './RichText.css'

type LexicalNode = {
  type?: string
  text?: string
  // Numeric bitmask for text nodes; string ('center', 'left', ...) for block nodes.
  format?: number | string
  tag?: string
  listType?: string
  fields?: { url?: string }
  relationTo?: string
  value?: LexicalMedia
  children?: LexicalNode[]
  root?: LexicalNode
  [key: string]: unknown
}

type LexicalMedia = {
  url?: string
  alt?: string
  width?: number
  height?: number
  caption?: string
  sizes?: Record<string, { url?: string } | undefined>
}

type RichTextContent = LexicalNode | { root?: LexicalNode } | string | null | undefined

export const RichText: React.FC<{ content: RichTextContent; className?: string }> = ({
  content,
  className,
}) => {
  if (!content) return null

  if (typeof content === 'string') {
    return <div className={className}>{content}</div>
  }

  const renderNode = (node: LexicalNode | undefined, index: number): React.ReactNode => {
    if (!node) return null

    if (node.type === 'text') {
      let text: React.ReactNode = node.text ?? ''
      const format = typeof node.format === 'number' ? node.format : 0
      if (format & 1) text = <strong key={index}>{text}</strong>
      if (format & 2) text = <em key={index}>{text}</em>
      if (format & 4) text = <u key={index}>{text}</u>
      if (format & 8) text = <code key={index}>{text}</code>
      return <span key={index}>{text}</span>
    }

    const children = node.children ? node.children.map(renderNode) : null

    switch (node.type) {
      case 'root':
        return <div key={index}>{children}</div>
      case 'paragraph': {
        const hasContent = node.children?.some((child) => child.text && child.text.trim().length > 0)
        return (
          <p key={index} className={!hasContent ? 'min-h-[1.5em]' : ''}>
            {children || <br />}
          </p>
        )
      }
      case 'linebreak':
        return <br key={index} />
      case 'heading': {
        const HeaderTag = (node.tag || 'h2') as React.ElementType
        return (
          <HeaderTag key={index} className="font-serif">
            {children}
          </HeaderTag>
        )
      }
      case 'horizontalrule':
        return <hr key={index} className="opacity-50" />
      case 'list': {
        const isOrdered = node.listType === 'number' || node.tag === 'ol'
        const ListTag = isOrdered ? 'ol' : 'ul'
        return <ListTag key={index}>{children}</ListTag>
      }
      case 'listitem':
        return <li key={index}>{children}</li>
      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-accent pl-4">
            {children}
          </blockquote>
        )
      case 'link':
        return (
          <a
            key={index}
            href={node.fields?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline"
          >
            {children}
          </a>
        )
      case 'upload': {
        const value = node.value
        if (node.relationTo === 'media' && value && typeof value === 'object') {
          const imgUrl = value.sizes?.tablet?.url || value.sizes?.card?.url || value.url
          if (!imgUrl) return null
          return (
            <div key={index} className="mt-8 mb-4 md:mt-12 md:mb-8">
              <figure className="relative border border-[var(--border)] shadow-sm bg-stone-50 overflow-hidden">
                <Image
                  src={imgUrl}
                  alt={value.alt || 'Japanese Kitchen Knives Image'}
                  width={value.width || 1200}
                  height={value.height || 800}
                  className="w-full h-auto block"
                  sizes="(max-width: 1024px) 100vw, 850px"
                  quality={75}
                />
                {value.caption && (
                  <figcaption className="p-4 text-xs italic text-[var(--muted)] border-t border-[var(--border)]">
                    {value.caption}
                  </figcaption>
                )}
              </figure>
            </div>
          )
        }
        return null
      }
      default:
        return <React.Fragment key={index}>{children}</React.Fragment>
    }
  }

  const root: LexicalNode | undefined =
    'root' in (content as { root?: LexicalNode }) && (content as { root?: LexicalNode }).root
      ? (content as { root?: LexicalNode }).root
      : (content as LexicalNode)

  return <div className={`rich-text ${className ?? ''}`}>{renderNode(root, 0)}</div>
}
