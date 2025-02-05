import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import ChatComponent from "@/components/chat-component"
import { ChatHistory } from "@/components/chat-history"
import { Header } from "@/components/header"

export default async function Home() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header user={user} />

      {/* Main Content with Sidebar */}
      <div className="flex-1 flex">
        {/* Sidebar with ChatHistory component */}
        <div className="w-64 bg-white border-r hidden md:flex flex-col h-[calc(100vh-4rem)]">
          <ChatHistory user={user} />
        </div>

        {/* Main Chat Area */}
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <ChatComponent user={user} />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-center">
          <p className="text-sm text-gray-500">
            © 2024 AI Chat. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

