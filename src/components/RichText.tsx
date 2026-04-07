import React from 'react'

export const RichText: React.FC<{ content: any; className?: string }> = ({ content, className }) => {
  if (!content) return null

  // If it's already a string, just render it
  if (typeof content === 'string') {
    return <div className={className}>{content}</div>
  }

  // Basic Lexical rendering logic (simplified for common nodes)
  const renderNode = (node: any, index: number): React.ReactNode => {
    if (!node) return null

    if (node.type === 'text') {
      let text = node.text
      if (node.format & 1) text = <strong key={index}>{text}</strong>
      if (node.format & 2) text = <em key={index}>{text}</em>
      if (node.format & 4) text = <u key={index}>{text}</u>
      if (node.format & 8) text = <code key={index}>{text}</code>
      return <span key={index}>{text}</span>
    }

    const children = node.children ? node.children.map(renderNode) : null

    switch (node.type) {
      case 'root':
        return <div key={index}>{children}</div>
      case 'paragraph': {
        const hasContent = node.children && node.children.some((child: any) => child.text && child.text.trim().length > 0)
        return (
          <p key={index} className={`mb-4 md:mb-6 leading-relaxed text-base md:text-[17px] text-black/85 last:mb-0 ${!hasContent ? 'min-h-[1.5em]' : ''}`}>
            {children || <br />}
          </p>
        )
      }
      case 'linebreak':
        return <br key={index} />
      case 'heading':
        const HeaderTag = (node.tag || 'h2') as React.ElementType
        return <HeaderTag key={index} className={`heading-${node.tag || 'h2'} mb-6 md:mb-8 mt-12 md:mt-16 first:mt-0 font-serif`}>{children}</HeaderTag>
      case 'horizontalrule':
        return <hr key={index} className="my-12 md:my-16 border-t border-[var(--border)] opacity-50" />
      case 'list': {
        const isOrdered = node.listType === 'number' || node.tag === 'ol'
        const ListTag = isOrdered ? 'ol' : 'ul'
        return (
          <ListTag key={index} className={`${isOrdered ? 'list-decimal' : 'list-disc'} ml-8 mb-6 space-y-2`}>
            {children}
          </ListTag>
        )
      }
      case 'listitem':
        return (
          <li key={index} className="leading-relaxed">
            {children}
          </li>
        )
      case 'quote':
        return <blockquote key={index} className="border-l-4 border-gold pl-4 italic my-8">{children}</blockquote>
      case 'link':
        return <a key={index} href={node.fields?.url} target="_blank" rel="noopener noreferrer" className="text-gold underline">{children}</a>
      case 'upload':
        const value = node.value
        if (node.relationTo === 'media' && value && typeof value === 'object') {
          return (
            <div key={index} className="mt-12 mb-4 md:mb-6">
              <figure className="relative aspect-video overflow-hidden border border-[var(--border)] shadow-sm bg-stone-50">
                <img
                  src={value.url}
                  alt={value.alt || 'Japanese Kitchen Knives Image'}
                  className="w-full h-full object-cover"
                  loading="lazy"
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
      default:
        return <React.Fragment key={index}>{children}</React.Fragment>
    }
  }

  return (
    <div className={`rich-text ${className}`}>
      {renderNode(content.root || content, 0)}
    </div>
  )
}
