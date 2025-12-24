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
      
      // Get or create conversation
      let conversation = conversations.get(knowledgePointId)
      if (!conversation) {
        conversation = getConversation(knowledgePointId)
      }
      if (!conversation) return

      // Create user message
      const userMessage: Message = {
        id: `msg-${Date.now()}-${Math.random()}`,
        sender: 'user',
        content: message,
        timestamp: new Date(),
        status: 'sending',
      }

      // Add user message immediately
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
        // Use conversation messages before adding user message for history
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

        // Update conversation with AI response atomically
        setConversations((prev) => {
          const current = prev.get(knowledgePointId)
          if (!current) return prev

          // Update user message status to sent
          const updatedUserMessage = { ...userMessage, status: 'sent' as const }

          // Create AI message
          const aiMessage: Message = {
            id: `msg-${Date.now()}-${Math.random()}`,
            sender: 'ai',
            content: response.message,
            timestamp: typeof response.timestamp === 'string' 
              ? new Date(response.timestamp) 
              : response.timestamp,
          }

          const finalConversation: Conversation = {
            ...current,
            messages: current.messages.map((m: Message) =>
              m.id === userMessage.id ? updatedUserMessage : m
            ).concat(aiMessage),
            updatedAt: new Date(),
          }

          const next = new Map(prev)
          next.set(knowledgePointId, finalConversation)
          
          // Save to localStorage
          storage.saveDialogue(knowledgePointId, finalConversation)
          
          return next
        })
      } catch (error) {
        // Update user message status to error
        setConversations((prev) => {
          const current = prev.get(knowledgePointId)
          if (!current) return prev

          const updatedUserMessage = { ...userMessage, status: 'error' as const }
          const next = new Map(prev)
          next.set(knowledgePointId, {
            ...current,
            messages: current.messages.map((m: Message) =>
              m.id === userMessage.id ? updatedUserMessage : m
            ),
          })
          return next
        })
        throw error
      }
    },
    [conversations, getConversation]
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

