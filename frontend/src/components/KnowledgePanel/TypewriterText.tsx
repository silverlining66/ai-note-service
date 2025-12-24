/**
 * TypewriterText component - displays text with typing animation
 */

import React from 'react'
import { useTypewriter } from '../../hooks/useTypewriter'

interface TypewriterTextProps {
  text: string
  speed?: number
  delay?: number
  className?: string
  as?: 'p' | 'span' | 'div'
  showCursor?: boolean
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 20,
  delay = 0,
  className = '',
  as: Component = 'p',
  showCursor = true,
}) => {
  const displayedText = useTypewriter(text, { speed, delay })

  return (
    <Component className={className}>
      {displayedText}
      {showCursor && displayedText.length < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </Component>
  )
}

