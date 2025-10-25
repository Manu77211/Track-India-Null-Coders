'use client'

import ReactMarkdown from 'react-markdown'
import { User, Bot } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { theme } = useTheme()
  const isUser = message.role === 'user'

  return (
    <div className="flex items-start gap-4 group">
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 ${
          isUser ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-blue-600 to-green-600'
        }`}
      >
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>

      {/* Message Content */}
      <div className="flex-1 space-y-2 max-w-none">
        <div className={`font-semibold text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {isUser ? 'You' : 'Track India AI'}
        </div>
        <div className={`prose prose-sm max-w-none ${
          theme === 'dark' 
            ? 'prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-code:text-gray-300' 
            : 'prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900'
        }`}>
          <ReactMarkdown
            components={{
              table: ({ ...props }) => (
                <div className="overflow-x-auto my-4">
                  <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`} {...props} />
                </div>
              ),
              thead: ({ ...props }) => (
                <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} {...props} />
              ),
              th: ({ ...props }) => (
                <th className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`} {...props} />
              ),
              td: ({ ...props }) => (
                <td className={`px-4 py-2 whitespace-nowrap text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                }`} {...props} />
              ),
              tr: ({ ...props }) => (
                <tr className={theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'} {...props} />
              ),
              p: ({ ...props }) => <p className="mb-2 last:mb-0 leading-7" {...props} />,
              ul: ({ ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
              ol: ({ ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
              li: ({ ...props }) => <li className="ml-2" {...props} />,
              strong: ({ ...props }) => <strong className="font-semibold" {...props} />,
              code: ({ ...props }) => (
                <code className={`px-1.5 py-0.5 rounded text-sm font-mono ${
                  theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'
                }`} {...props} />
              ),
              pre: ({ ...props }) => (
                <pre className={`p-4 rounded-lg overflow-x-auto my-4 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`} {...props} />
              ),
              blockquote: ({ ...props }) => (
                <blockquote className={`border-l-4 pl-4 italic my-4 ${
                  theme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-600'
                }`} {...props} />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
