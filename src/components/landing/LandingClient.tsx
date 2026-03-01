'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Target, ArrowRight, Sparkles } from 'lucide-react'
import { ShaderAnimation } from '@/components/ui/shader-animation'
import { HeaderPremium } from './HeaderPremium'
import { TestimonialsSection } from './TestimonialsSection'
import { PricingPremium } from './PricingPremium'
import { LogoCloud } from '@/components/ui/logo-cloud'
import { Footer } from '@/components/ui/footer-section'

export function LandingClient({ user }: { user: any }) {
    // ... rest of imports/setup
    const testimonials = [
        {
            author: {
                name: "Sarah Jenkins",
                handle: "@sarahj_dev",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
            },
            text: "The AI optimizer is a game changer. I landed a Senior Dev role at a top-tier fintech in just 2 weeks after using AI Resume Builder. The ATS score doesn't lie!",
        },
        {
            author: {
                name: "Michael Chen",
                handle: "@mikechen_ux",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
            },
            text: "I was skeptical about AI resumes, but this tool actually understands design roles. The pitch deck feature blew my interviewers away. Highly recommend!",
        },
        {
            author: {
                name: "Elena Rodriguez",
                handle: "@elena_prod",
                avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
            },
            text: "Importing from LinkedIn was so smooth. It took me 5 minutes to create a professional CV that usually takes hours of tweaking. The dark UI is just beautiful too.",
        },
        {
            author: {
                name: "David Smith",
                handle: "@dsmith_marketing",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
            },
            text: "The keyword optimization really works. My response rate from job applications increased significantly. Worth every penny for the Pro plan.",
        }
    ]

    const logos = [
        { src: "https://storage.efferd.com/logo/nvidia-wordmark.svg", alt: "Nvidia Logo" },
        { src: "https://storage.efferd.com/logo/supabase-wordmark.svg", alt: "Supabase Logo" },
        { src: "https://storage.efferd.com/logo/openai-wordmark.svg", alt: "OpenAI Logo" },
        { src: "https://storage.efferd.com/logo/turso-wordmark.svg", alt: "Turso Logo" },
        { src: "https://storage.efferd.com/logo/vercel-wordmark.svg", alt: "Vercel Logo" },
        { src: "https://storage.efferd.com/logo/github-wordmark.svg", alt: "GitHub Logo" },
        { src: "https://storage.efferd.com/logo/claude-wordmark.svg", alt: "Claude AI Logo" },
        { src: "https://storage.efferd.com/logo/clerk-wordmark.svg", alt: "Clerk Logo" },
    ]

    const pricingPlans = [
        {
            name: "Starter Foundation",
            description: "Perfect for students and early-career professionals needing a clean, simple CV.",
            price: "FREE",
            yearlyPrice: "FREE",
            period: "forever",
            buttonText: "Get Started",
            href: "/auth/signup",
            features: [
                "1 Professional Resume",
                "Standard PDF Download",
                "Manual Resume Editor",
                "Access to Basic Templates",
                "Community Support"
            ]
        },
        {
            name: "Professional Elite",
            description: "The ultimate tool for ambitious candidates who want to beat the competition.",
            price: "99",
            yearlyPrice: "79",
            period: "month",
            buttonText: "Go Premium Now",
            href: "/dashboard/upgrade",
            isPopular: true,
            features: [
                "Unlimited Smart Resumes",
                "AI Resume Optimizer (Claude 3.5)",
                "AI Cover Letter Generator",
                "Smart LinkedIn Import",
                "Interactive Pitch Decks",
                "Paywall & Tracking Analytics",
                "Priority 24/7 Support"
            ]
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-black font-sans selection:bg-white selection:text-black overflow-hidden text-zinc-400">

            <HeaderPremium user={user} />
            <main className="flex-1 w-full pt-4 sm:pt-10">
                {/* 1. HERO SECTION - CLEAN & PREMIUM */}
                <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center pt-10 sm:pt-20">
                    <div className="absolute inset-0 z-0">
                        <ShaderAnimation />
                    </div>
                    <div className="absolute inset-0 bg-black/20 z-[1] pointer-events-none" />

                    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="mb-10"
                        >
                            <Badge variant="outline" className="px-6 py-2 rounded-full border-white/5 bg-white/[0.03] text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] backdrop-blur-md">
                                Reimagining the modern resume
                            </Badge>
                        </motion.div>

                        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-medium tracking-tighter text-white mb-10 leading-[0.85] drop-shadow-2xl">
                            The Career <br /> <span className="italic font-serif">Operating System.</span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-zinc-400 font-medium max-w-2xl mb-16 leading-relaxed opacity-80">
                            The ultimate ATS-optimized builder for elite professionals. <br className="hidden sm:block" />
                            Stop applying, start being recruited with AI narratives.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-8 items-center">
                            <Button size="lg" asChild className="rounded-xl px-12 bg-white text-black hover:bg-zinc-200 font-black h-16 shadow-[0_0_50px_rgba(255,255,255,0.1)] text-lg border-none transition-all active:scale-95">
                                <Link href="/auth/signup" className="flex items-center">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
                            </Button>
                            <Link href="#features" className="text-zinc-500 hover:text-white transition-all font-bold text-sm border-b border-transparent hover:border-white/20 pb-1">
                                Explore Features
                            </Link>
                        </div>

                    </div>
                </section>

                {/* 2. LOGO CLOUD - SEAMLESS TRANSITION */}
                <div className="mt-12 sm:mt-20 py-10 sm:py-14 bg-black">
                    <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Trusted by candidates from world-class companies</p>
                    </div>
                    <LogoCloud logos={logos} />
                </div>

                {/* 3. HYPER-PREMIUM BENTO FEATURES SECTION */}
                <section id="features" className="py-32 bg-black overflow-hidden relative">
                    <div className="absolute top-1/4 -left-1/4 w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-1/4 -right-1/4 w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                        <div className="text-center mb-24 space-y-4">
                            <h2 className="text-4xl sm:text-7xl font-medium tracking-tight text-white">
                                Everything you need to <br /> <span className="italic font-serif">conquer the market.</span>
                            </h2>
                            <p className="text-zinc-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                                We've built the ultimate toolset for elite candidates. Stop guessing, start winning with data-backed narratives.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[300px] sm:auto-rows-[350px]">
                            <div className="md:col-span-4 md:row-span-2 group relative rounded-[2.5rem] bg-[#080808] border border-white/5 overflow-hidden shadow-2xl transition-all hover:border-white/10">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="p-10 flex flex-col h-full">
                                    <div className="flex-1 flex items-center justify-center relative">
                                        <div className="w-full max-w-md bg-black/40 rounded-3xl border border-white/5 p-6 backdrop-blur-xl relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="h-12 w-12 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                                                    <Zap className="h-6 w-6 text-blue-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="h-2 w-24 bg-white/20 rounded-full mb-2" />
                                                    <div className="h-1.5 w-16 bg-white/10 rounded-full" />
                                                </div>
                                                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold tracking-widest uppercase animate-pulse">Syncing...</div>
                                            </div>
                                            <div className="space-y-3">
                                                {[85, 95, 70].map((w, i) => (
                                                    <motion.div key={i} className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-emerald-500/40"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${w}%` }}
                                                            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <div className="absolute -right-4 -bottom-4 h-32 w-32 bg-emerald-500/20 blur-3xl rounded-full" />
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <h3 className="text-3xl font-bold text-white mb-3">AI LinkedIn Sync</h3>
                                        <p className="text-zinc-500 text-lg leading-relaxed max-w-md">
                                            One click to pull your entire history. Our AI reconstructs your profile into a high-impact narrative optimized for recruiters.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 md:row-span-1 group relative rounded-[2.5rem] bg-[#080808] border border-white/5 overflow-hidden shadow-2xl transition-all hover:border-white/10">
                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="p-8 flex flex-col items-center text-center justify-center h-full">
                                    <div className="relative mb-6">
                                        <div className="h-32 w-32 rounded-full border-[8px] border-zinc-900 flex items-center justify-center">
                                            <span className="text-4xl font-black italic tracking-tighter text-emerald-500 animate-pulse">98</span>
                                            <div className="absolute inset-0 rounded-full border-[8px] border-emerald-500/40 border-t-transparent animate-spin-slow" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">ATS Matcher</h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed">Real-time scoring against Fortune 500 algorithm requirements.</p>
                                </div>
                            </div>

                            <div className="md:col-span-2 md:row-span-1 group relative rounded-[2.5rem] bg-[#080808] border border-white/5 overflow-hidden shadow-2xl transition-all hover:border-white/10">
                                <div className="p-8 flex items-center justify-between h-full bg-gradient-to-br from-transparent to-white/[0.02]">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-white">Export Everywhere</h3>
                                        <div className="flex gap-2">
                                            <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">PDF</div>
                                            <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">JSON</div>
                                        </div>
                                    </div>
                                    <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl">
                                        <Target className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-3 md:row-span-1 group relative rounded-[2.5rem] bg-[#080808] border border-white/10 overflow-hidden shadow-2xl transition-all shadow-blue-500/5 lg:bg-gradient-to-tr lg:from-blue-500/10 lg:to-transparent">
                                <div className="p-10 flex flex-col h-full">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                            <Sparkles className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Smart Pitch Decks</h3>
                                    </div>
                                    <p className="text-zinc-500 leading-relaxed mb-auto">Generate professional presentation slides for your interviews automatically from your career data.</p>
                                    <div className="flex -space-x-4 mt-8">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-20 w-32 rounded-xl bg-[#111] border border-white/10 shadow-lg transform translate-y-0 group-hover:-translate-y-4 transition-transform duration-500" style={{ transitionDelay: `${i * 100}ms` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-3 md:row-span-1 group relative rounded-[2.5rem] bg-[#080808] border border-white/5 overflow-hidden shadow-2xl transition-all hover:border-white/10">
                                <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/5 via-transparent to-transparent" />
                                <div className="p-10 flex flex-col h-full bg-gradient-to-t from-black/60 to-transparent">
                                    <div className="flex justify-between items-start mb-10">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Live Engagement</h3>
                                            <p className="text-zinc-500 text-sm">Track how recruiters view your profile.</p>
                                        </div>
                                        <div className="text-4xl font-black italic tracking-tighter text-white">12.4k</div>
                                    </div>
                                    <div className="h-24 flex items-end gap-1.5 group-hover:gap-2 transition-all">
                                        {[40, 70, 45, 90, 65, 100, 80, 50, 75, 60, 85, 45, 95, 55].map((h, i) => (
                                            <div key={i} className="flex-1 bg-white/10 rounded-t-sm group-hover:bg-emerald-500/40 transition-all duration-700" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-48 flex flex-col items-center text-center">
                            <div className="relative mb-20 group">
                                <div className="absolute inset-0 bg-emerald-500/40 blur-[100px] rounded-full animate-pulse group-hover:bg-purple-500/40 transition-colors duration-1000" />
                                <div className="relative h-64 w-64 rounded-full border border-white/20 flex flex-col items-center justify-center backdrop-blur-3xl shadow-2xl">
                                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center p-8 shadow-[0_0_50px_rgba(52,211,153,0.3)]">
                                        <Zap className="h-full w-full text-black" />
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        {[1, 2, 3].map(i => <div key={i} className="h-1.5 w-1.5 bg-white/40 rounded-full" />)}
                                    </div>
                                </div>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -inset-10 pointer-events-none">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-10 w-10 bg-black border border-white/10 rounded-xl flex items-center justify-center shadow-lg"><Sparkles className="h-5 w-5 text-emerald-500" /></div>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-10 w-10 bg-black border border-white/10 rounded-xl flex items-center justify-center shadow-lg"><Target className="h-5 w-5 text-purple-500" /></div>
                                </motion.div>
                            </div>
                            <h2 className="text-4xl sm:text-6xl font-medium tracking-tight text-white mb-8">
                                One core. <span className="italic font-serif">Infinite possibilities.</span>
                            </h2>
                            <p className="text-zinc-500 text-lg sm:text-xl max-w-2xl leading-relaxed">
                                Our AI engine is constantly learning from millions of successful candidate journeys to give you the ultimate edge.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 4. WALL OF LOVE (Testimonials) */}
                <TestimonialsSection
                    title="Wall of Love"
                    description="Join 10,000+ candidates landing roles at Stripe, Vercel, and Linear."
                    testimonials={testimonials}
                />

                <PricingPremium
                    plans={pricingPlans}
                    title="Professional Plans"
                    description="Invest in your future. ROI is one interview away."
                />

                {/* CTA BANNER */}
                <section className="py-32 px-6 lg:px-12 bg-black">
                    <motion.div initial={{ scale: 0.98, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="max-w-7xl mx-auto bg-white rounded-[4rem] p-16 sm:p-32 text-center border border-white/10 overflow-hidden relative shadow-[0_0_100px_rgba(255,255,255,0.1)]">
                        <div className="relative z-10">
                            <h2 className="text-5xl sm:text-8xl font-black tracking-tighter text-black mb-10 italic leading-[0.9]">Ready to <br />become hirable?</h2>
                            <p className="text-zinc-600 text-xl font-bold mb-16 max-w-2xl mx-auto">Create your account today and experience the future of career growth.</p>
                            <Button asChild size="lg" className="rounded-[2rem] px-16 bg-black text-white font-black h-20 text-xl hover:bg-zinc-900 hover:scale-105 transition-all shadow-2xl active:scale-95 group">
                                <Link href="/auth/signup" className="flex items-center">Start Building Free <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" /></Link>
                            </Button>
                        </div>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
