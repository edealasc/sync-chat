"use client"

import type React from "react"
import { useState } from "react"
import { Bot, MessageCircle, X, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
  satisfaction?: boolean | null // true = up, false = down, null = not rated
}

interface ChatWidgetProps {
  primaryColor?: string
  secondaryColor?: string
}

function ChatWidget({ primaryColor = "#a8c69f", secondaryColor = "#96b88a" }: ChatWidgetProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      isBot: true,
      timestamp: new Date(),
      satisfaction: null,
    },
  ])
  const [isTyping, setIsTyping] = useState(false)

  const botResponses = [
    "That's a great question! Let me help you with that.",
    "I understand what you're looking for. Here's what I can suggest...",
    "Thanks for reaching out! I'm here to assist you.",
    "Let me think about that for a moment...",
    "I'd be happy to help you with that request!",
    "That's an interesting point. Here's my perspective...",
  ]

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: message,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")

    setIsTyping(true)

    setTimeout(
      () => {
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]
        const botMessage: Message = {
          id: Date.now() + 1,
          text: randomResponse,
          isBot: true,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1500 + Math.random() * 1000,
    ) // Random delay between 1.5-2.5 seconds
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSatisfaction = (msgId: number, value: boolean) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === msgId ? { ...msg, satisfaction: value } : msg)),
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isChatOpen && (
        <Card className="mb-4 w-80 h-[500px] shadow-xl border-0">
          <CardContent className="p-0 h-full flex flex-col">
            {/* Chat Header */}
            <div
              className="p-4 rounded-t-lg"
              style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  </Avatar>
                  <div>
                    <h3 className="text-white font-medium text-sm">SyncChat AI</h3>
                    <p className="text-white/80 text-xs">Online</p>
                  </div>
                </div>
                {/* Close (X) icon */}
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="ml-2 p-1 rounded-full hover:bg-white/20 transition"
                  aria-label="Close chat"
                  type="button"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2 ${msg.isBot ? "" : "flex-row-reverse space-x-reverse"}`}
                  >
                    {msg.isBot && (
                      <Avatar className="w-6 h-6">
                        <AvatarFallback
                          className="text-white text-xs"
                          style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}
                        >
                          <Bot className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div
                        className={`rounded-lg px-3 py-2 shadow-sm max-w-[200px] ${
                          msg.isBot ? "bg-white text-gray-800" : "text-white"
                        }`}
                        style={
                          !msg.isBot
                            ? { background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }
                            : {}
                        }
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      {/* Satisfaction rating for bot messages */}
                      {msg.isBot && (
                        <div className="flex items-center mt-1 space-x-1">
                          <button
                            className={`p-1 rounded-full bg-transparent hover:bg-transparent transition ${
                              msg.satisfaction === true ? "cursor-default" : "cursor-pointer"
                            }`}
                            aria-label="Thumbs up"
                            onClick={() => handleSatisfaction(msg.id, true)}
                            disabled={msg.satisfaction === true}
                          >
                            <ThumbsUp
                              className="w-4 h-4"
                              color={msg.satisfaction === true ? "#22c55e" : "#a3a3a3"}
                              fill="none"
                            />
                          </button>
                          <button
                            className={`p-1 rounded-full bg-transparent hover:bg-transparent transition ${
                              msg.satisfaction === false ? "cursor-default" : "cursor-pointer"
                            }`}
                            aria-label="Thumbs down"
                            onClick={() => handleSatisfaction(msg.id, false)}
                            disabled={msg.satisfaction === false}
                          >
                            <ThumbsDown
                              className="w-4 h-4"
                              color={msg.satisfaction === false ? "#ef4444" : "#a3a3a3"}
                              fill="none"
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback
                        className="text-white text-xs"
                        style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}
                      >
                        <Bot className="w-3 h-3" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                      <div className="flex space-x-1">
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
                )}
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="text-white px-3"
                  style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }} // Dynamic button colors
                >
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Toggle Button (only show if chat is closed) */}
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="w-14 h-14 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}
    </div>
  )
}

export default function HomePage() {
  const chatColors = {
    primaryColor: "#a8c69f", // Change this to your desired primary color
    secondaryColor: "#96b88a", // Change this to your desired secondary color
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: `linear-gradient(to bottom right, ${chatColors.primaryColor}, ${chatColors.secondaryColor})`,
            }}
          >
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SyncChat</h1>
          <p className="text-gray-600">Your intelligent chat assistant</p>
        </div>
      </div>

      <ChatWidget {...chatColors} />
    </div>
  )
}
