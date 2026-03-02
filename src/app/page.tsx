import { createClient } from '@/lib/supabase/server'
import { LandingClient } from '@/components/landing/LandingClient'

export default async function Home() {
  let user = null
  try {
    const supabase = await createClient()
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()
    user = supabaseUser
  } catch (error) {
    console.error("Failed to fetch user in root page:", error)
  }

  return <LandingClient user={user} />
}
