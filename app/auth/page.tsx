"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; content: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        router.push("/")
      }
    }
    checkUser()
  }, [router, supabase.auth])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (isLogin) {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage({ type: "error", content: error.message })
      } else if (data?.user) {
        router.push("/")
        router.refresh()
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setMessage({ type: "error", content: error.message })
      } else {
        setMessage({
          type: "success",
          content: "Registration successful! Please check your email to confirm your account.",
        })
        setIsLogin(true)
      }
    }

    setIsLoading(false)
  }

  const handleSocialAuth = async (provider: "google") => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        setMessage({ type: "error", content: error.message })
      }
    } catch (error) {
      setMessage({ type: "error", content: "An error occurred during authentication" })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-3xl overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row h-[600px] relative">
          {/* Sliding Overlay Panel */}
          <div 
            className={`absolute top-0 md:w-1/2 h-full bg-[#FF4B4B] transition-transform duration-500 ease-in-out z-10
              ${isLogin ? 'md:translate-x-full' : 'md:translate-x-0'}`}
          >
            <div className="flex flex-col items-center justify-center text-center h-full text-white p-8">
              {isLogin ? (
                <>
                  <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
                  <p className="mb-8 text-sm opacity-90">
                    Don't have an account yet? Sign up now!
                  </p>
                  <Button
                    onClick={() => setIsLogin(false)}
                    variant="outline"
                    className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#FF4B4B] transition-colors"
                  >
                    Create Account
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                  <p className="mb-8 text-sm opacity-90">
                    Already have an account? Sign in here
                  </p>
                  <Button
                    onClick={() => setIsLogin(true)}
                    variant="outline"
                    className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#FF4B4B] transition-colors"
                  >
                    Back to Login
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Login Form - Always on the left */}
          <div className="md:w-1/2 p-8 bg-white h-full">
            <CardHeader className="p-0 mb-6">
              <CardTitle>Sign in</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex gap-4 mb-6">
                <Button 
                  variant="outline" 
                  className="flex-1 flex items-center justify-center gap-2" 
                  onClick={() => handleSocialAuth("google")}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => handleSocialAuth("facebook")}>
                  Facebook
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => handleSocialAuth("linkedin")}>
                  LinkedIn
                </Button>
              </div>
              
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or use your email</span>
                </div>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-50 border-0"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-50 border-0"
                />
                <div className="text-right">
                  <Button variant="link" className="p-0 h-auto text-sm text-gray-500">
                    Forgot your password?
                  </Button>
                </div>
                {message && (
                  <Alert variant={message.type === "error" ? "destructive" : "default"}>
                    <AlertTitle>{message.type === "error" ? "Error" : "Success"}</AlertTitle>
                    <AlertDescription>{message.content}</AlertDescription>
                  </Alert>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-[#FF4B4B] hover:bg-[#FF3B3B] text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </CardContent>
          </div>

          {/* Register Form - Always on the right */}
          <div className="md:w-1/2 p-8 bg-white h-full">
            <CardHeader className="p-0 mb-6">
              <CardTitle>Sign up</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex gap-4 mb-6">
                <Button 
                  variant="outline" 
                  className="flex-1 flex items-center justify-center gap-2" 
                  onClick={() => handleSocialAuth("google")}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => handleSocialAuth("facebook")}>
                  Facebook
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => handleSocialAuth("linkedin")}>
                  LinkedIn
                </Button>
              </div>
              
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or use your email</span>
                </div>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-50 border-0"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-50 border-0"
                />
                {message && (
                  <Alert variant={message.type === "error" ? "destructive" : "default"}>
                    <AlertTitle>{message.type === "error" ? "Error" : "Success"}</AlertTitle>
                    <AlertDescription>{message.content}</AlertDescription>
                  </Alert>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-[#FF4B4B] hover:bg-[#FF3B3B] text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing up..." : "Sign up"}
                </Button>
              </form>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  )
}

