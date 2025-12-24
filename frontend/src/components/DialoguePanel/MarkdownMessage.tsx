/**
 * MarkdownMessage component - renders markdown with math support
 * Supports:
 * - Standard Markdown (headings, lists, bold, italic, code blocks, etc.)
 * - LaTeX math formulas (inline: $formula$, block: $$formula$$)
 * - GitHub Flavored Markdown (tables, strikethrough, etc.)
 */

import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import type { Components } from 'react-markdown'

interface MarkdownMessageProps {
  content: string
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => {
  // @ts-ignore
    // @ts-ignore
    const components: Components = {
    // Headings
    h1: ({ children }) => (
          <h1 className="text-2xl font-bold mb-3 mt-4 text-white border-b border-white/20 pb-2">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold mb-2 mt-3 text-white">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold mb-2 mt-2 text-purple-300">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-base font-semibold mb-1 mt-2 text-purple-200">
            {children}
          </h4>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="mb-3 leading-relaxed text-gray-100">
            {children}
          </p>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-3 space-y-1 text-gray-100">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-100">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="ml-4 text-gray-100">
            {children}
          </li>
        ),

        // Code
        code: ({ node, inline, className, children, ...props }) => {
          if (inline) {
            return (
              <code className="px-1.5 py-0.5 bg-purple-500/20 rounded text-purple-200 font-mono text-sm" {...props}>
                {children}
              </code>
            )
          }
          return (
            <code className="block p-3 bg-black/30 rounded-lg my-2 overflow-x-auto font-mono text-sm text-green-300" {...props}>
              {children}
            </code>
          )
        },
        pre: ({ children }) => (
          <pre className="mb-3 overflow-x-auto">
            {children}
          </pre>
        ),

        // Blockquote
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-purple-500 pl-4 py-2 mb-3 text-gray-200 italic bg-purple-500/5">
            {children}
          </blockquote>
        ),

        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            {children}
          </a>
        ),

        // Horizontal rule
        hr: () => (
          <hr className="my-4 border-white/20" />
        ),

        // Strong (bold)
        strong: ({ children }) => (
          <strong className="font-bold text-white">
            {children}
          </strong>
        ),

        // Emphasis (italic)
        em: ({ children }) => (
          <em className="italic text-gray-100">
            {children}
          </em>
        ),

        // Table
        table: ({ children }) => (
          <div className="overflow-x-auto mb-3">
            <table className="min-w-full border border-white/20">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-purple-500/20">
            {children}
          </thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-white/10">
            {children}
          </tbody>
        ),
        tr: ({ children }) => (
          <tr>
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2 text-left text-sm font-semibold text-white border border-white/20">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 text-sm text-gray-200 border border-white/20">
            {children}
          </td>
        ),
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      className="markdown-body"
      components={components}
    >
      {content}
    </ReactMarkdown>
  )
}

