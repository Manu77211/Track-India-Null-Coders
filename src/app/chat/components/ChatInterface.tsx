'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Send, Plus, Menu, X, Trash2, MessageSquare, Sparkles } from 'lucide-react'
import ChatMessage from './ChatMessage'
import { useTheme } from '@/contexts/ThemeContext'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  timestamp: Date
}

const examplePrompts = [
  "What are the latest infrastructure projects in India?",
  "Tell me about Smart Cities Mission updates",
  "What government initiatives are focused on water management?",
  "Show me recent developments in renewable energy sector"
]

export default function ChatInterface() {
  const { theme } = useTheme()
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'New Chat',
      messages: [],
      timestamp: new Date(),
    }
  ])
  const [currentConversationId, setCurrentConversationId] = useState('1')
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentConversation = conversations.find(c => c.id === currentConversationId)
  const messages = useMemo(() => currentConversation?.messages || [], [currentConversation])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [input])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: messages.length,
      role: 'user',
      content: input,
    }

    // Update conversation with user message
    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        const updatedMessages = [...conv.messages, userMessage]
        return {
          ...conv,
          messages: updatedMessages,
          title: conv.messages.length === 0 ? input.slice(0, 30) + '...' : conv.title
        }
      }
      return conv
    }))

    setInput('')
    setIsTyping(true)

    try {
      // Call RAG + Gemini API
      const response = await fetch('http://localhost:8010/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from AI')
      }

      const data = await response.json()
      
      // Format response with sources if available
      let content = data.response
      if (data.sources && data.sources.length > 0) {
        content += '\n\n**Sources:**\n'
        data.sources.forEach((source: any, index: number) => {
          content += `${index + 1}. ${source.title || source.description || 'Government Data'}\n`
        })
      }

      const aiMessage: Message = {
        id: messages.length + 1,
        role: 'assistant',
        content: content,
      }
      
      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, aiMessage]
          }
        }
        return conv
      }))
    } catch (error) {
      console.error('Error calling AI:', error)
      // Fallback to mock response if API fails
      const aiMessage: Message = {
        id: messages.length + 1,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to the data sources right now. Please make sure the Flask backend is running on port 8010.",
      }
      
      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, aiMessage]
          }
        }
        return conv
      }))
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const createNewChat = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      timestamp: new Date()
    }
    setConversations(prev => [newConv, ...prev])
    setCurrentConversationId(newConv.id)
  }

  const deleteConversation = (id: string) => {
    if (conversations.length === 1) return
    setConversations(prev => prev.filter(c => c.id !== id))
    if (currentConversationId === id) {
      setCurrentConversationId(conversations.find(c => c.id !== id)?.id || '')
    }
  }

  const handleExampleClick = (prompt: string) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  return (
    <div className={`flex h-[calc(100vh-64px)] ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'} border-r transition-all duration-300 flex flex-col overflow-hidden`}
      >
        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={createNewChat}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
              theme === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' 
                : 'bg-white hover:bg-gray-100 border border-gray-300'
            } transition-colors`}
          >
            <Plus size={18} />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setCurrentConversationId(conv.id)}
              className={`group relative flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer transition-all ${
                currentConversationId === conv.id
                  ? theme === 'dark'
                    ? 'bg-gray-800'
                    : 'bg-gray-200'
                  : theme === 'dark'
                  ? 'hover:bg-gray-800'
                  : 'hover:bg-gray-200'
              }`}
            >
              <MessageSquare size={16} className="flex-shrink-0" />
              <span className="flex-1 text-sm truncate">{conv.title}</span>
              {conversations.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteConversation(conv.id)
                  }}
                  className={`opacity-0 group-hover:opacity-100 p-1 rounded ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
                  } transition-opacity`}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2 text-xs">
            <Sparkles size={14} className="text-blue-500" />
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Track India AI
            </span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`flex items-center gap-3 px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            } transition-colors`}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Chat with India
          </h1>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="max-w-3xl w-full space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center">
                    <MessageSquare size={32} className="text-white" />
                  </div>
                  <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    How can I help you today?
                  </h2>
                  <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Ask me about government infrastructure, Smart Cities, and development projects across India
                  </p>
                </div>

                {/* Example Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {examplePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(prompt)}
                      className={`p-4 rounded-xl text-left transition-all ${
                        theme === 'dark'
                          ? 'bg-gray-900 hover:bg-gray-800 border border-gray-800'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <MessageSquare size={18} className="text-blue-500 flex-shrink-0 mt-1" />
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {prompt}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm bg-gradient-to-r from-blue-600 to-green-600`}>
                    AI
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-2xl px-4 py-3`}>
                    <div className="flex gap-1">
                      <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`} />
                      <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }} />
                      <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} p-4`}>
          <div className="max-w-3xl mx-auto">
            <div className={`flex gap-3 items-end p-2 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-gray-50 border border-gray-200'
            }`}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message Track India AI..."
                rows={1}
                className={`flex-1 bg-transparent border-none outline-none resize-none px-2 py-2 max-h-32 ${
                  theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-2.5 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0"
              >
                <Send size={20} />
              </button>
            </div>
            <p className={`text-xs text-center mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Track India AI can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
