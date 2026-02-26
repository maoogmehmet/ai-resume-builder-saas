import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { signout } from '@/app/auth/actions'
import Hero from '@/components/hero'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="fixed top-0 w-full z-50 transition-all border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center justify-center font-bold text-xl tracking-tight" href="/">
            AI Resume Builder
          </Link>
          <nav className="flex gap-4 sm:gap-6 items-center">
            {user ? (
              <>
                <Link className="text-sm font-medium hover:text-zinc-600 transition-colors" href="/dashboard">
                  Dashboard
                </Link>
                <form action={signout}>
                  <Button variant="ghost" size="sm" className="font-medium">Sign out</Button>
                </form>
              </>
            ) : (
              <>
                <Link className="text-sm font-medium hover:text-zinc-600 transition-colors" href="/auth/signin">
                  Log In
                </Link>
                <Button size="sm" asChild className="rounded-full px-5">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full pt-16">
        <Hero />
      </main>
    </div>
  )
}
