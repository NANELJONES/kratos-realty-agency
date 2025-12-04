'use client'

import React from 'react'

const RichTextRenderer = ({ content }) => {
  if (!content || !content.raw || !content.raw.children) {
    return null
  }

  const renderNode = (node, index) => {
    const { type, children, text, bold, italic, underline } = node

    if (text) {
      let textElement = text
      if (bold) textElement = <strong key={index}>{textElement}</strong>
      if (italic) textElement = <em key={index}>{textElement}</em>
      if (underline) textElement = <u key={index}>{textElement}</u>
      return textElement
    }

    if (!children) return null

    const renderedChildren = children.map((child, childIndex) => 
      renderNode(child, `${index}-${childIndex}`)
    )

    switch (type) {
      case 'heading-one':
        return <h1 key={index} className="text-3xl font-bold text-white mb-4 mt-6">{renderedChildren}</h1>
      case 'heading-two':
        return <h2 key={index} className="text-2xl font-bold text-white mb-3 mt-5">{renderedChildren}</h2>
      case 'heading-three':
        return <h3 key={index} className="text-xl font-bold text-white mb-2 mt-4">{renderedChildren}</h3>
      case 'paragraph':
        return <p key={index} className="text-white/80 mb-4 leading-relaxed">{renderedChildren}</p>
      case 'bulleted-list':
        return <ul key={index} className="list-disc list-inside text-white/80 mb-4 space-y-2 ml-4">{renderedChildren}</ul>
      case 'numbered-list':
        return <ol key={index} className="list-decimal list-inside text-white/80 mb-4 space-y-2 ml-4">{renderedChildren}</ol>
      case 'list-item':
        return <li key={index} className="mb-1">{renderedChildren}</li>
      case 'blockquote':
        return <blockquote key={index} className="border-l-4 border-secondary pl-4 italic text-white/70 my-4">{renderedChildren}</blockquote>
      default:
        return <div key={index}>{renderedChildren}</div>
    }
  }

  return (
    <div className="rich-text-content">
      {content.raw.children.map((node, index) => renderNode(node, index))}
    </div>
  )
}

export default RichTextRenderer

