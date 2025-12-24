/**
 * Typewriter effect hook
 * Creates a typing animation effect for text content
 */

import { useState, useEffect, useRef } from 'react'

interface UseTypewriterOptions {
  speed?: number // milliseconds per character
  delay?: number // delay before starting
  onComplete?: () => void
}

export const useTypewriter = (
  text: string,
  options: UseTypewriterOptions = {}
): string => {
  const { speed = 20, delay = 0, onComplete } = options
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const indexRef = useRef(0)

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('')
    setIsComplete(false)
    indexRef.current = 0

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (!text) {
      setIsComplete(true)
      return
    }

    // Initial delay
    const startTimeout = setTimeout(() => {
      const typeNextChar = () => {
        if (indexRef.current < text.length) {
          setDisplayedText(text.slice(0, indexRef.current + 1))
          indexRef.current += 1
          timeoutRef.current = setTimeout(typeNextChar, speed)
        } else {
          setIsComplete(true)
          if (onComplete) {
            onComplete()
          }
        }
      }

      typeNextChar()
    }, delay)

    return () => {
      clearTimeout(startTimeout)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text, speed, delay, onComplete])

  return displayedText
}

