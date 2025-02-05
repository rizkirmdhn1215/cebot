"use client"

import { useChat } from "ai/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { CodeBlock } from "@/components/code-block"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"
import type { User } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useSearchParams, useRouter } from "next/navigation"
import type { Components } from 'react-markdown'

export default function ChatComponent({ user }: { user: User }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const chatId = searchParams.get('chat')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const createNewChat = async (title: string) => {
    const supabase = createClient()
    
    // Get first sentence or first 40 characters
    const cleanTitle = title
      .split(/[.!?]/)[0] // Get first sentence
      .split(' ')
      .slice(0, 4) // Get first 4 words
      .join(' ')
      .trim()
      .slice(0, 40) + (title.length > 40 ? '...' : '')
    
    const { data, error } = await supabase
      .from('chat_history')
      .insert({
        user_id: user.id,
        title: cleanTitle,
        last_message: title // Store full message as last_message
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating chat:', error)
      throw error
    }

    router.refresh()
    return data.id
  }
  
  const { messages: aiMessages, input, handleInputChange, handleSubmit: originalHandleSubmit, setMessages: setAiMessages } = useChat({
    api: '/api/chat',
    id: chatId || undefined,
    onFinish: async (message) => {
      try {
        if (chatId) {
          const supabase = createClient()
          
          // Update last message
          await supabase
            .from('chat_history')
            .update({ 
              last_message: message.content,
              updated_at: new Date().toISOString()
            })
            .eq('id', parseInt(chatId))

          await handleMessage(message.content, 'assistant', chatId as string)
          
          // Refresh the navbar to update last messages
          router.refresh()
        }
      } catch (error) {
        console.error('Error in onFinish:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  })

  // Add message loading effect
  useEffect(() => {
    if (chatId) {
      loadChatMessages()
    } else {
      setAiMessages([])
    }
  }, [chatId])

  const loadChatMessages = async () => {
    if (!chatId) return
    
    const supabase = createClient()
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', parseInt(chatId))
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error loading messages:', error)
      return
    }

    if (messages) {
      setAiMessages(messages.map(msg => ({
        id: msg.id.toString(),
        content: msg.content,
        role: msg.role as 'user' | 'assistant'
      })))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const userInput = input.trim()
    
    if (!userInput) return
    
    try {
      setIsSubmitting(true)
      
      // Create new chat if none exists
      let currentChatId = chatId
      if (!currentChatId) {
        // Create new chat with the first message as title
        currentChatId = (await createNewChat(userInput)).toString()
        router.push(`/?chat=${currentChatId}`)
      }

      // Save user message
      await handleMessage(userInput, 'user', currentChatId as string)
      
      // Let useChat handle the streaming
      await originalHandleSubmit(e)
      
    } catch (err) {
      console.error('Submission error:', err)
      setError(err instanceof Error ? err.message : 'Failed to send message')
      setIsSubmitting(false)
    }
  }

  const handleMessage = async (content: string, role: 'user' | 'assistant', chatId: string) => {
    const supabase = createClient()
    console.log('Saving message:', { content, role, chatId })

    const { data, error: dbError } = await supabase
      .from('chat_messages')
      .insert({
        chat_id: parseInt(chatId),
        content: content,
        role: role
      })
      .select()

    if (dbError) {
      console.error('Database error:', dbError)
      throw dbError
    }

    console.log('Message saved:', data)
    return data
  }

  return (
    <Card className="w-full h-[calc(100vh-8rem)]">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="text-red-500 text-center p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
          {aiMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "rounded-lg px-4 py-2 max-w-[80%]",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      const inline = !match
                      if (inline) {
                        return <code className="bg-gray-800/10 rounded px-1" {...props}>{children}</code>
                      }
                      return (
                        <CodeBlock
                          language={match?.[1] || ''}
                          value={String(children).replace(/\n$/, '')}
                        />
                      )
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1"
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isSubmitting}
              onClick={() => console.log('Button clicked')}
              className="transition-all"
            >
              {isSubmitting ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
} 