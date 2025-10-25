'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import ChatMessage from './ChatMessage'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  chart?: any
}

const mockResponses = [
  {
    content: "Based on the data from Karnataka's education sector, the literacy rate in Mysuru district is currently at 87.5% and is projected to reach 92% by 2027. The key drivers are:\n\n1. **Increased funding** for primary education\n2. **Infrastructure development** in rural areas\n3. **Teacher training programs**\n\nWould you like me to show you a detailed forecast?",
  },
  {
    content: "The health infrastructure in Maharashtra shows significant improvement. Here are the key metrics:\n\n| District | Hospitals | Doctors | Improvement |\n|----------|-----------|---------|-------------|\n| Mumbai | 245 | 12,500 | +15% |\n| Pune | 178 | 8,200 | +12% |\n| Nagpur | 142 | 6,800 | +18% |\n\nThe data suggests a positive trend in healthcare accessibility.",
  },
  {
    content: "I can help you analyze district-level data across education, health, and water sectors. Try asking:\n\n- What is the literacy rate in [district]?\n- Show me health infrastructure data for [state]\n- Compare water availability between districts\n- Forecast education trends for next 5 years",
  },
]

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      content: "Hello! I'm your AI assistant for India's development data. Ask me anything about education, health, or water sectors across Indian districts.",
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: messages.length,
      role: 'user',
      content: input,
    }

    setMessages([...messages, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
      const aiMessage: Message = {
        id: messages.length + 1,
        role: 'assistant',
        content: randomResponse.content,
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">
              AI
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white/50 backdrop-blur-sm rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about India's development data..."
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}