import { createClient } from '@/lib/supabase/server'
import { LandingClient } from '@/components/landing/LandingClient'

export const dynamic = 'force-dynamic'

export default async function Home() {
  let user = null
  try {
    const supabase = await createClient()
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()
    user = supabaseUser
  } catch (error) {
    console.error("Critical error in Home page auth fetch:", error)
  }

  return <LandingClient user={user} />
}
