/**
 * DialoguePanel component - AI conversation interface
 * Following FR-009, FR-010, FR-011, FR-012
 */

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../../utils/animations'
import { useDialogue } from '../../hooks/useDialogue.tsx'
import type { KnowledgePoint } from '../../types/knowledge'

interface DialoguePanelProps {
  knowledgePoint: KnowledgePoint
}

export const DialoguePanel: React.FC<DialoguePanelProps> = ({ knowledgePoint }) => {
  const { getConversation, sendMessage, currentKnowledgePoint } = useDialogue()
  const [inputValue, setInputValue] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversation = currentKnowledgePoint
    ? getConversation(currentKnowledgePoint.id)
    : null

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  const handleSend = async () => {
    if (!inputValue.trim() || !currentKnowledgePoint || sending) return

    setSending(true)
    try {
      await sendMessage(currentKnowledgePoint, inputValue.trim())
      setInputValue('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
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
      {...fadeInUp}
      className="h-full flex flex-col glass rounded-lg"
    >
      <div className="p-4 border-b border-white/20">
        <h2 className="text-xl font-bold text-white">AI 对话</h2>
        {conversation?.messages.length === 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-400">你可以这样提问：</p>
            {prompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInputValue(prompt)}
                className="block w-full text-left px-3 py-2 text-sm glass rounded hover:bg-white/10 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation?.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-purple-500/20 text-white'
                  : 'glass text-white'
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入你的问题..."
            className="flex-1 px-4 py-2 glass rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={sending || !inputValue.trim()}
            className="px-6 py-2 bg-gradient-purple-pink rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
          >
            {sending ? '发送中...' : '发送'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

