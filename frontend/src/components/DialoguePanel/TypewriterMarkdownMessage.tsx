/**
 * TypewriterMarkdownMessage component - displays markdown with typing animation
 */

import React from 'react'
import { useTypewriter } from '../../hooks/useTypewriter'
import { MarkdownMessage } from './MarkdownMessage'

interface TypewriterMarkdownMessageProps {
  content: string
  speed?: number
  delay?: number
  isNewMessage?: boolean
  onComplete?: () => void
}

export const TypewriterMarkdownMessage: React.FC<TypewriterMarkdownMessageProps> = ({
  content,
  speed = 15,
  delay = 0,
  isNewMessage = false,
  onComplete,
}) => {
  // Only apply typewriter effect if isNewMessage is true
  // For existing messages loaded from storage, show full content immediately
  const displayedText = isNewMessage 
    ? useTypewriter(content, { speed, delay, onComplete })
    : content

  const isTyping = isNewMessage && displayedText.length < content.length

  return (
    <div className="relative">
      <MarkdownMessage content={displayedText} />
      {isTyping && (
        <span className="inline-block ml-1 animate-pulse text-purple-400 font-bold">|</span>
      )}
    </div>
  )
}

