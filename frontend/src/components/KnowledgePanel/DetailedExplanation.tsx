/**
 * DetailedExplanation component - displays complete explanation of the image
 */

import React from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../../utils/animations'
import { TypewriterText } from './TypewriterText'

interface DetailedExplanationProps {
  content: string
}

export const DetailedExplanation: React.FC<DetailedExplanationProps> = ({
  content,
}) => {
  return (
    <motion.div {...fadeInUp} className="space-y-3">
      <h2 className="text-xl font-bold text-white mb-4">知识点详解</h2>
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

