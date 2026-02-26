import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { signout } from '@/app/auth/actions'
import Hero from '@/components/hero'
import { Check, Sparkles, Zap, Shield, FileText, Globe, Target, ArrowRight } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const features = [
    {
      title: "LinkedIn to Resume",
      description: "Import your entire professional history with a single link. No more manual data entry.",
      icon: Zap,
    },
    {
      title: "AI ATS Optimization",
      description: "Our Claude 3.5 powered AI tailors every bullet point to pass modern tracking systems.",
      icon: Target,
    },
    {
      title: "Real-time PDF Preview",
      description: "See exactly how your resume looks as you edit. Minimal, ATS-friendly templates.",
      icon: FileText,
    },
    {
      title: "Job Match Analysis",
      description: "Compare your resume against any job description to get a match score and suggestions.",
      icon: Sparkles,
    },
    {
      title: "Public Shareable Links",
      description: "Get a professional URL for your resume that you can share with recruiters instantly.",
      icon: Globe,
    },
    {
      title: "Secure & Private",
      description: "Your data is encrypted and secure. You own your data and can delete it anytime.",
      icon: Shield,
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-zinc-900 selection:text-white">
      <header className="fixed top-0 w-full z-50 transition-all border-b border-zinc-100 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
          <Link className="flex items-center justify-center font-black text-2xl tracking-tighter text-zinc-900" href="/">
            AI RESUME.
          </Link>
          <nav className="flex gap-4 sm:gap-8 items-center">
            <Link className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors hidden md:block" href="#features">Features</Link>
            <Link className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors hidden md:block" href="#pricing">Pricing</Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link className="text-sm font-bold text-zinc-900" href="/dashboard">Dashboard</Link>
                <form action={signout}>
                  <Button variant="outline" size="sm" className="font-bold border-zinc-200">Sign out</Button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link className="text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors" href="/auth/signin">Log In</Link>
                <Button size="sm" asChild className="rounded-xl px-6 bg-zinc-900 hover:bg-black font-bold h-10 shadow-lg shadow-zinc-200">
                  <Link href="/auth/signup">Get Started Free</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full pt-16">
        <Hero />

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 sm:py-32 px-6 lg:px-12 bg-zinc-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-16">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">Elite Features</h2>
              <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 mb-6">Designed for modern careers.</h3>
              <p className="text-lg text-zinc-500 leading-relaxed font-medium">We built the tools you actually need to land interviews in a competitive market.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="group p-8 bg-white border border-zinc-200 rounded-3xl hover:border-zinc-900 hover:shadow-2xl hover:shadow-zinc-200 transition-all duration-500">
                  <div className="h-12 w-12 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h4>
                  <p className="text-zinc-500 leading-relaxed font-medium">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING PREVIEW SECTION */}
        <section id="pricing" className="py-24 sm:py-32 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-5xl sm:text-7xl font-black tracking-tight text-zinc-900">One Plan. Unlimited Success.</h2>
              <p className="text-xl text-zinc-500 leading-relaxed max-w-lg">Simple, transparent pricing. Try everything free for 7 days, then upgrade to keep your advantage.</p>
              <ul className="space-y-4">
                {['Unlimited AI Generations', 'Full PDF Exports', 'Priority ATS Matcher', 'Custom Public URLs'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-zinc-700">
                    <div className="h-6 w-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full max-w-md">
              <div className="bg-zinc-900 rounded-[2.5rem] p-12 text-white shadow-3xl shadow-zinc-400 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8">
                  <Sparkles className="h-12 w-12 text-zinc-800 rotate-12" />
                </div>
                <h4 className="text-zinc-400 font-bold uppercase tracking-widest text-sm mb-4">Professional Plan</h4>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-7xl font-black">$99</span>
                  <span className="text-zinc-500 font-bold">/year</span>
                </div>
                <Button asChild size="lg" className="w-full bg-white text-zinc-900 hover:bg-zinc-100 font-black h-14 rounded-2xl shadow-lg ring-4 ring-white/10 group-hover:scale-[1.02] transition-transform">
                  <Link href="/auth/signup">Start 7-Day Free Trial</Link>
                </Button>
                <p className="text-center text-zinc-500 text-xs font-bold mt-6">Cancel anytime. 100% Secure via Stripe.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto bg-zinc-50 rounded-[3rem] p-12 sm:p-24 text-center border border-zinc-200">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-zinc-900 mb-8">Ready to land your dream job?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="rounded-2xl px-12 bg-zinc-900 text-white font-black h-16 text-lg hover:scale-105 transition-transform">
                <Link href="/auth/signup">Get Started for Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-2xl px-12 font-bold h-16 text-lg border-zinc-200">
                See Examples
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 lg:px-12 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-black text-xl tracking-tighter">AI RESUME.</div>
          <div className="flex gap-8 text-sm font-bold text-zinc-500">
            <Link href="#" className="hover:text-zinc-900">Privacy</Link>
            <Link href="#" className="hover:text-zinc-900">Terms</Link>
            <Link href="#" className="hover:text-zinc-900">Support</Link>
            <Link href="#" className="hover:text-zinc-900">Twitter</Link>
          </div>
          <div className="text-xs font-bold text-zinc-400">© 2024 AI Resume Builder. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
