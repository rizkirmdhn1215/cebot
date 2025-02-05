import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: "sb-vbfxtlllskbcsfngkkjz-auth-token",
        maxAge: 60 * 60 * 8,
        domain: "",
        path: "/",
        sameSite: "lax"
      }
    }
  ) 