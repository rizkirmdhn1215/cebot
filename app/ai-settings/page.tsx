import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function AISettings() {
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

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">AI Settings</h1>
          
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Model</Label>
              <Select defaultValue="gpt-4">
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Temperature</Label>
              <Input 
                type="range" 
                min="0" 
                max="2" 
                step="0.1" 
                defaultValue="1"
              />
              <div className="text-sm text-muted-foreground">
                Controls randomness: Lower values are more focused, higher values are more creative
              </div>
            </div>

            <div className="space-y-2">
              <Label>System Prompt</Label>
              <textarea 
                className="w-full h-32 p-2 border rounded-md"
                placeholder="You are a helpful assistant..."
                defaultValue="You are a helpful assistant..."
              />
              <div className="text-sm text-muted-foreground">
                Sets the behavior and context for the AI
              </div>
            </div>

            <Button className="w-full">Save Settings</Button>
          </Card>
        </div>
      </main>
    </div>
  )
} 