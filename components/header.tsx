import { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { LogOut, Settings } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export async function Header({ user }: { user: User }) {
  const handleSignOut = async () => {
    "use server"
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect("/auth")
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#FF4B4B]">AI Chat</span>
          <span className="hidden sm:inline-block text-sm text-gray-500">|</span>
          <span className="hidden sm:inline-block text-sm text-gray-500">{user.email}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/ai-settings">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2 hover:text-[#FF4B4B]"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">AI Settings</span>
            </Button>
          </Link>
          <form action={handleSignOut}>
            <Button 
              type="submit" 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2 hover:text-[#FF4B4B]"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
} 