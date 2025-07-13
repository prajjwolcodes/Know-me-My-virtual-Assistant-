

"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Plus, Mic, MoreHorizontal, Maximize2, Send } from "lucide-react"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback } from "../components/ui/avatar"


export default function Reply() {
const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateAIResponse = (userMessage) => {
    const responses = [
      "I understand your question. Let me help you with that.",
      "That's an interesting point. Here's what I think about it...",
      "I'd be happy to assist you with that. Based on what you've asked...",
      "Great question! Let me break this down for you.",
      "I can help you with that. Here's my response...",
      "Thanks for asking! Here's what I can tell you about that topic.",
    ]

    if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi")) {
      return "Hello! How can I assist you today?"
    }

    if (userMessage.toLowerCase().includes("how are you")) {
      return "I'm doing well, thank you for asking! I'm here and ready to help you with any questions or tasks you might have."
    }

    return (
      responses[Math.floor(Math.random() * responses.length)] +
      " " +
      "This is a simulated response to demonstrate the chat functionality. In a real implementation, this would be connected to an AI service."
    )
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(
      () => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          content: simulateAIResponse(inputValue),
          role: "assistant",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 2000,
    ) // Random delay between 1-3 seconds
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-[#2f2f2f] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium">ChatGPT</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

        <Button className="bg-[#6366f1] hover:bg-[#5855eb] text-white px-4 py-2 rounded-lg font-medium">
          ✨ Get Plus
        </Button>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-green-600 text-white text-sm font-medium">P</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h1 className="text-2xl font-normal text-gray-200 mb-8">Ready when you are.</h1>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6">
              {messages.map((message) => (
                <div key={message.id} className="mb-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {message.role === "user" ? (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-green-600 text-white text-sm font-medium">P</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 h-8 bg-[#10a37f] rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142-.0852 4.783-2.7582a.7712.7712 0 0 0 .7806 0l5.8428 3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zm-2.4569-1.6235a4.4708 4.4708 0 0 1 2.3445-1.9728v5.3963a.7664.7664 0 0 0 .3927.6813l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.4569 13.2352zm16.5630 3.9464a4.4708 4.4708 0 0 1-.5346-3.0137l.142-.0852 4.783-2.7582a.7712.7712 0 0 0 .7806 0l5.8428 3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-400 mb-1">{message.role === "user" ? "You" : "ChatGPT"}</div>
                      <div className="text-gray-100 leading-relaxed">{message.content}</div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="mb-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-[#10a37f] rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142-.0852 4.783-2.7582a.7712.7712 0 0 0 .7806 0l5.8428 3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zm-2.4569-1.6235a4.4708 4.4708 0 0 1 2.3445-1.9728v5.3963a.7664.7664 0 0 0 .3927.6813l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.4569 13.2352zm16.5630 3.9464a4.4708 4.4708 0 0 1-.5346-3.0137l.142-.0852 4.783-2.7582a.7712.7712 0 0 0 .7806 0l5.8428 3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-400 mb-1">ChatGPT</div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-600 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center bg-[#40414f] rounded-xl border border-gray-600 px-4 py-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-600 mr-2 h-8 w-8"
              >
                <Plus className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-gray-600 text-sm font-normal px-3 py-1 h-8 mr-3"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
                Tools
              </Button>

              <input
                ref={inputRef}
                type="text"
                placeholder="Ask anything"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-base"
                disabled={isTyping}
              />

              <div className="flex items-center gap-2 ml-3">
                {inputValue.trim() ? (
                  <Button
                    onClick={handleSend}
                    disabled={isTyping}
                    size="icon"
                    className="bg-white text-black hover:bg-gray-200 h-8 w-8 rounded-lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white hover:bg-gray-600 h-8 w-8"
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white hover:bg-gray-600 h-8 w-8"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
