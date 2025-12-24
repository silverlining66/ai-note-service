/**
 * DialoguePanel component - AI conversation interface
 * Following FR-009, FR-010, FR-011, FR-012
 */

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDialogue } from '../../hooks/useDialogue.tsx'
import { TypewriterMarkdownMessage } from './TypewriterMarkdownMessage'
import type { KnowledgePoint } from '../../types/knowledge'

interface DialoguePanelProps {
  knowledgePoint: KnowledgePoint
}

export const DialoguePanel: React.FC<DialoguePanelProps> = ({ knowledgePoint }) => {
  const { getConversation, sendMessage } = useDialogue()
  const [inputValue, setInputValue] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sendingRef = useRef(false)
  const [typingMessageIds, setTypingMessageIds] = useState<Set<string>>(new Set())
  const completedMessageIdsRef = useRef<Set<string>>(new Set())

  const conversation = getConversation(knowledgePoint.id)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  // Reset sending state when knowledge point changes
  useEffect(() => {
    setSending(false)
    sendingRef.current = false
    setTypingMessageIds(new Set())
    completedMessageIdsRef.current = new Set()
  }, [knowledgePoint.id])

  // Track new AI messages for typewriter effect
  useEffect(() => {
    if (conversation?.messages.length) {
      const lastMessage = conversation.messages[conversation.messages.length - 1]
      if (lastMessage.sender === 'ai') {
        // Only add to typing set if it's a truly new message (not in completed set)
        // This ensures messages loaded from storage don't get typewriter effect
        const messageAge = Date.now() - new Date(lastMessage.timestamp).getTime()
        const isVeryRecent = messageAge < 5000 // Within 5 seconds - truly new message
        
        if (isVeryRecent && !completedMessageIdsRef.current.has(lastMessage.id)) {
          setTypingMessageIds((prev) => {
            if (!prev.has(lastMessage.id)) {
              const newSet = new Set(prev)
              newSet.add(lastMessage.id)
              return newSet
            }
            return prev
          })
        }
      }
    }
  }, [conversation?.messages])

  // Callback when typewriter completes
  const handleTypewriterComplete = (messageId: string) => {
    setTypingMessageIds((prev) => {
      const newSet = new Set(prev)
      newSet.delete(messageId)
      return newSet
    })
    completedMessageIdsRef.current.add(messageId)
  }

  const handleSend = async () => {
    if (!inputValue.trim() || sending || sendingRef.current) return

    const messageToSend = inputValue.trim()
    setInputValue('')
    setSending(true)
    sendingRef.current = true

    try {
      // Use the knowledgePoint prop directly, not currentKnowledgePoint
      await sendMessage(knowledgePoint, messageToSend)
    } catch (error) {
      console.error('Failed to send message:', error)
      // Restore input value on error
      setInputValue(messageToSend)
    } finally {
      setSending(false)
      sendingRef.current = false
    }
  }

  const prompts = [
    '请详细解释一下这个知识点的核心概念',
    '这个知识点在实际应用中有哪些例子？',
    '学习这个知识点需要掌握哪些前置知识？',
    '这个知识点与其他知识点有什么联系？',
  ]

  return (
    <motion.div
      key={knowledgePoint.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-full flex flex-col glass rounded-lg"
    >
      <div className="p-4 border-b border-white/20">
        <h2 className="text-xl font-bold text-white">AI 对话</h2>
        {conversation?.messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="mt-4 space-y-2"
          >
            <p className="text-sm text-gray-400">你可以这样提问：</p>
            {prompts.map((prompt, index) => (
              <motion.button
                key={index}
                onClick={() => setInputValue(prompt)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 30 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full text-left px-3 py-2 text-sm glass rounded hover:bg-white/10 transition-colors"
              >
                {prompt}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {conversation?.messages.map((message, index) => {
            // Check if this message should use typewriter effect
            const isNewAIMessage = message.sender === 'ai' && typingMessageIds.has(message.id)

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  delay: index === conversation.messages.length - 1 ? 0.1 : 0,
                }}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.sender === 'user'
                      ? 'bg-purple-500/20 text-white'
                      : 'glass text-white'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <p className="text-gray-100">{message.content}</p>
                  ) : (
                    <TypewriterMarkdownMessage
                      content={message.content}
                      speed={15}
                      delay={200}
                      isNewMessage={isNewAIMessage}
                      onComplete={() => handleTypewriterComplete(message.id)}
                    />
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </motion.div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/20">
        <div className="flex gap-2">
          <motion.input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入你的问题..."
            className="flex-1 px-4 py-2 glass rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            disabled={sending}
            whileFocus={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          />
          <motion.button
            onClick={handleSend}
            disabled={sending || !inputValue.trim()}
            className="px-6 py-2 bg-gradient-purple-pink rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            whileHover={!sending && inputValue.trim() ? { scale: 1.05, boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)' } : {}}
            whileTap={!sending && inputValue.trim() ? { scale: 0.95 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {sending ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block"
                >
                  ⏳
                </motion.span>
                发送中...
              </span>
            ) : (
              '发送'
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

