/**
 * FunExamples component - displays fun examples for key knowledge points
 */

import React from 'react'
import { motion } from 'framer-motion'
import { fadeInScale, hoverGlow } from '../../utils/animations'
import { TypewriterText } from './TypewriterText'
import type { FunExample } from '../../types'

interface FunExamplesProps {
  examples: FunExample[]
}

export const FunExamples: React.FC<FunExamplesProps> = ({ examples }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-white mb-4">趣味示例</h2>
      <div className="space-y-4">
        {examples.map((example, index) => (
          <motion.div
            key={example.knowledgePointId}
            initial={fadeInScale.initial}
            animate={fadeInScale.animate}
            whileHover={hoverGlow.whileHover}
            transition={{ ...fadeInScale.transition, delay: index * 0.1 }}
            className="glass rounded-lg p-5 border border-white/20"
          >
            <TypewriterText
              text={example.title}
              speed={30}
              delay={index * 150 + 50}
              className="font-semibold text-white mb-2"
              as="h3"
            />
            <TypewriterText
              text={example.content}
              speed={20}
              delay={index * 150 + example.title.length * 30 + 100}
              className="text-sm text-gray-300 leading-relaxed"
              as="p"
            />
            {example.imageUrl && (
              <img
                src={example.imageUrl}
                alt={example.title}
                className="mt-3 rounded-lg max-w-full h-auto"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

