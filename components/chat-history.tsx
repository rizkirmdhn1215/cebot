"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, MessageSquare, Trash2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function ChatHistory({ user }: { user: User }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentChatId = searchParams.get('chat')
  const [chats, setChats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadChats = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error loading chats:', error)
      return
    }

    setChats(data || [])
    setLoading(false)
  }

  // Load chats on mount and when router refreshes
  useEffect(() => {
    loadChats()
  }, [user.id, router.refresh])

  const createNewChat = async () => {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('chat_history')
      .insert({
        user_id: user.id,
        title: 'New conversation',
        last_message: null
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating chat:', error)
      return
    }

    await loadChats()
    router.push(`/?chat=${data.id}`)
  }

  const deleteChat = async (chatId: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      const supabase = createClient()
      console.log('Attempting to delete chat:', chatId)
      
      // First delete messages
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('chat_id', chatId)

      if (messagesError) {
        console.error('Error deleting messages:', messagesError)
        throw messagesError
      }
      
      // Then delete the chat
      const { error: chatError } = await supabase
        .from('chat_history')
        .delete()
        .eq('id', chatId)
        .eq('user_id', user.id)

      if (chatError) {
        console.error('Error deleting chat:', chatError)
        throw chatError
      }

      console.log('Chat deleted successfully')

      // Update local state
      setChats(prevChats => prevChats.filter(chat => chat.id !== chatId))

      // If we're deleting the current chat, clear the URL
      if (parseInt(currentChatId || '0') === chatId) {
        router.push('/')
      }

      router.refresh()
      await loadChats()

    } catch (error) {
      console.error('Failed to delete chat:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Button
        onClick={createNewChat}
        className="mb-4"
        variant="outline"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Chat
      </Button>

      <div className="space-y-2 overflow-y-auto flex-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={cn(
              "group flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors",
              parseInt(currentChatId || '0') === chat.id && "bg-accent"
            )}
          >
            <Link
              href={`/?chat=${chat.id}`}
              className="flex-1 flex items-center space-x-2 min-w-0"
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">
                  {chat.title || 'New conversation'}
                </p>
                {chat.last_message && (
                  <p className="truncate text-xs text-muted-foreground">
                    {chat.last_message.length > 60 
                      ? chat.last_message.slice(0, 60) + '...' 
                      : chat.last_message}
                  </p>
                )}
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              onClick={(e) => deleteChat(chat.id, e)}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
            </Button>
          </div>
        ))}

        {chats.length === 0 && (
          <div className="text-center text-muted-foreground p-4">
            No chats yet. Start a new conversation!
          </div>
        )}
      </div>
    </div>
  )
} 