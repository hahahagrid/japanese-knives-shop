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
      case 'paragraph':
        return <p key={index} className="mb-4">{children}</p>
      case 'linebreak':
        return <br key={index} />
      case 'heading':
        const HeaderTag = (node.tag || 'h2') as React.ElementType
        return <HeaderTag key={index} className={`heading-${node.tag || 'h2'} mb-4 mt-8`}>{children}</HeaderTag>
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
        return <blockquote key={index} className="border-l-4 border-gold pl-4 italic my-6">{children}</blockquote>
      case 'link':
        return <a key={index} href={node.fields?.url} target="_blank" rel="noopener noreferrer" className="text-gold underline">{children}</a>
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
