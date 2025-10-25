'use client'

import ReactMarkdown from 'react-markdown'
import { User } from 'lucide-react'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  chart?: any
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
          isUser ? 'bg-green-600' : 'bg-blue-600'
        }`}
      >
        {isUser ? <User size={16} /> : 'AI'}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[70%] rounded-lg p-4 ${
          isUser ? 'bg-green-100 text-gray-900' : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              table: ({ ...props }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full divide-y divide-gray-200" {...props} />
                </div>
              ),
              th: ({ ...props }) => (
                <th className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-700 uppercase" {...props} />
              ),
              td: ({ ...props }) => (
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900" {...props} />
              ),
              p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
              ul: ({ ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
              ol: ({ ...props }) => <ol className="list-decimal list-inside mb-2" {...props} />,
              strong: ({ ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}