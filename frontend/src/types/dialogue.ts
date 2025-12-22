/**
 * Type definitions for Dialogue domain entities
 * Based on data-model.md
 */

export interface Message {
  id: string
  sender: 'user' | 'ai'
  content: string
  timestamp: Date
  status?: 'sending' | 'sent' | 'error'
}

export interface Conversation {
  knowledgePointId: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface DialogueResponse {
  message: string
  timestamp: string | Date
}

