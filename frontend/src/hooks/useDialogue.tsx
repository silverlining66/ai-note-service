/**
 * React Hook for dialogue management
 * Following FR-015, FR-016, FR-017
 */

import React, { createContext, useContext, useState, useCallback } from 'react'
import { apiService } from '../services/api'
import { storage } from '../utils/storage'
import type { Conversation, Message } from '../types/dialogue'
import type { KnowledgePoint } from '../types/knowledge'

interface DialogueContextType {
  conversations: Map<string, Conversation>
  getConversation: (knowledgePointId: string) => Conversation | null
  sendMessage: (
    knowledgePoint: KnowledgePoint,
    message: string
  ) => Promise<void>
  switchKnowledgePoint: (knowledgePoint: KnowledgePoint) => void
  currentKnowledgePoint: KnowledgePoint | null
}

const DialogueContext = createContext<DialogueContextType | null>(null)

export const DialogueProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [conversations, setConversations] = useState<Map<string, Conversation>>(
    new Map()
  )
  const [currentKnowledgePoint, setCurrentKnowledgePoint] = useState<
    KnowledgePoint | null
  >(null)

  // Load conversation from localStorage
  const loadConversation = useCallback((knowledgePointId: string): Conversation | null => {
    const stored = storage.loadDialogue<Conversation>(knowledgePointId)
    if (stored) {
      // Convert date strings back to Date objects
      stored.createdAt = new Date(stored.createdAt)
      stored.updatedAt = new Date(stored.updatedAt)
      stored.messages = stored.messages.map((msg: Message) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }))
      return stored
    }
    return null
  }, [])

  // Get or create conversation
  const getConversation = useCallback(
    (knowledgePointId: string): Conversation | null => {
      // Check in-memory first
      if (conversations.has(knowledgePointId)) {
        return conversations.get(knowledgePointId) || null
      }

      // Load from localStorage
      const loaded = loadConversation(knowledgePointId)
      if (loaded) {
        setConversations((prev) => {
          const next = new Map(prev)
          next.set(knowledgePointId, loaded)
          return next
        })
        return loaded
      }

      // Create new conversation
      const newConversation: Conversation = {
        knowledgePointId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setConversations((prev) => {
        const next = new Map(prev)
        next.set(knowledgePointId, newConversation)
        return next
      })
      return newConversation
    },
    [conversations, loadConversation]
  )

  // Send message
  const sendMessage = useCallback(
    async (knowledgePoint: KnowledgePoint, message: string) => {
      const knowledgePointId = knowledgePoint.id
      const conversation = getConversation(knowledgePointId)
      if (!conversation) return

      // Add user message
      const userMessage: Message = {
        id: `msg-${Date.now()}-user`,
        sender: 'user',
        content: message,
        timestamp: new Date(),
        status: 'sending',
      }

      const updatedConversation: Conversation = {
        ...conversation,
        messages: [...conversation.messages, userMessage],
        updatedAt: new Date(),
      }

      setConversations((prev) => {
        const next = new Map(prev)
        next.set(knowledgePointId, updatedConversation)
        return next
      })

      try {
        // Get AI response with knowledge point info
        const response = await apiService.getDialogueResponse(
          knowledgePointId,
          message,
          conversation.messages.map((m: Message) => ({
            sender: m.sender,
            content: m.content,
          })),
          knowledgePoint.title,
          knowledgePoint.description
        )

        // Update user message status
        userMessage.status = 'sent'

        // Add AI message
        const aiMessage: Message = {
          id: `msg-${Date.now()}-ai`,
          sender: 'ai',
          content: response.message,
          timestamp: typeof response.timestamp === 'string' 
            ? new Date(response.timestamp) 
            : response.timestamp,
        }

        const finalConversation: Conversation = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, aiMessage],
          updatedAt: new Date(),
        }

        setConversations((prev) => {
          const next = new Map(prev)
          next.set(knowledgePointId, finalConversation)
          return next
        })

        // Save to localStorage
        storage.saveDialogue(knowledgePointId, finalConversation)
      } catch (error) {
        // Update user message status to error
        userMessage.status = 'error'
        setConversations((prev) => {
          const next = new Map(prev)
          const existing = next.get(knowledgePointId)
          if (existing) {
            next.set(knowledgePointId, {
              ...existing,
              messages: existing.messages.map((m: Message) =>
                m.id === userMessage.id ? userMessage : m
              ),
            })
          }
          return next
        })
        throw error
      }
    },
    [getConversation]
  )

  // Switch knowledge point
  const switchKnowledgePoint = useCallback(
    (knowledgePoint: KnowledgePoint) => {
      setCurrentKnowledgePoint(knowledgePoint)
      const knowledgePointId = knowledgePoint.id
      // Load conversation if not in memory
      if (!conversations.has(knowledgePointId)) {
        const loaded = loadConversation(knowledgePointId)
        if (loaded) {
          setConversations((prev) => {
            const next = new Map(prev)
            next.set(knowledgePointId, loaded)
            return next
          })
        }
      }
    },
    [conversations, loadConversation]
  )

  return (
    <DialogueContext.Provider
      value={{
        conversations,
        getConversation,
        sendMessage,
        switchKnowledgePoint,
        currentKnowledgePoint,
      }}
    >
      {children}
    </DialogueContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDialogue = (): DialogueContextType => {
  const context = useContext(DialogueContext)
  if (!context) {
    throw new Error('useDialogue must be used within DialogueProvider')
  }
  return context
}

