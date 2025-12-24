/**
 * Conclusion component - displays final summary
 */

import React from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../../utils/animations'
import { TypewriterText } from './TypewriterText'

interface ConclusionProps {
  content: string
}

export const Conclusion: React.FC<ConclusionProps> = ({ content }) => {
  return (
    <motion.div {...fadeInUp} className="space-y-3">
      <h2 className="text-xl font-bold text-white mb-4">总结</h2>
      <div className="glass rounded-lg p-6 border border-white/20">
        <TypewriterText
          text={content}
          speed={15}
          delay={200}
          className="text-gray-300 leading-relaxed whitespace-pre-line"
          as="p"
        />
      </div>
    </motion.div>
  )
}

