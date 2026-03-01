'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Zap, Target, ArrowRight } from 'lucide-react'
import { ShaderAnimation } from '@/components/ui/shader-animation'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { Announcement } from '@/components/ui/announcement'
import { HeaderPremium } from './HeaderPremium'
import { LogoCloudPremium } from './LogoCloudPremium'
import { TestimonialsSection } from './TestimonialsSection'
import { PricingPremium } from './PricingPremium'
import { FooterPremium } from './FooterPremium'

export function LandingClient({ user }: { user: any }) {
    // ... existing logic ...

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
        { alt: "Google", label: "Google", src: "" },
        { alt: "Microsoft", label: "Microsoft", src: "" },
        { alt: "Amazon", label: "Amazon", src: "" },
        { alt: "Netflix", label: "Netflix", src: "" },
        { alt: "Meta", label: "Meta", src: "" },
        { alt: "Stripe", label: "Stripe", src: "" },
        { alt: "Apple", label: "Apple", src: "" },
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

            <Announcement
                title="Grand Launch"
                description="CV Builder 2.0 is now live with Claude 3.5 AI. Experience the future of career growth."
            />
            <HeaderPremium user={user} />

            <main className="flex-1 w-full pt-24">
                {/* 1. HERO SECTION */}
                <section className="relative w-full h-[95vh] min-h-[700px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <ShaderAnimation />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black z-[1] pointer-events-none" />

                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center flex flex-col items-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <Badge variant="outline" className="mb-8 px-5 py-2 rounded-full border-white/10 bg-white/5 text-zinc-400 font-bold uppercase tracking-widest text-[10px] backdrop-blur-sm animate-pulse">
                                Introducing CV Builder 2.0 — Live Now
                            </Badge>
                        </motion.div>
                        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-8 leading-[0.95] max-w-5xl drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] italic">
                            Build Your Legacy.
                        </h1>
                        <p className="text-xl sm:text-2xl text-zinc-400 font-medium max-w-2xl mb-12 drop-shadow-lg leading-relaxed">
                            Stop applying. Start standing out. Build ATS-proof resumes with Claude-powered optimization.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                            <Button size="lg" asChild className="rounded-2xl px-12 bg-white text-black hover:bg-zinc-200 font-black h-16 shadow-2xl shadow-white/20 text-lg border-none hover:scale-105 transition-all active:scale-95 group">
                                <Link href="/auth/signup" className="flex items-center">Get Started Free <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></Link>
                            </Button>
                            <Button size="lg" asChild variant="outline" className="rounded-2xl px-12 bg-white/5 border-white/10 text-white hover:bg-white/10 font-black h-16 backdrop-blur-md text-lg transition-all hover:border-white/20">
                                <Link href="#features">See The Platform</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <LogoCloudPremium logos={logos} />

                {/* FEATURES SECTION - STATIC & CLEAN */}
                <section id="features" className="py-32 px-6 lg:px-12 bg-black flex flex-col items-center">
                    <div className="text-center max-w-4xl mx-auto mb-24">
                        <h2 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-8 leading-[1.1] italic">
                            The Career Operating System.
                        </h2>
                        <p className="text-2xl text-zinc-500 leading-relaxed font-bold">
                            Unfair advantages for candidates who want to lead.
                        </p>
                    </div>

                    <div className="w-full max-w-6xl bg-zinc-950/50 backdrop-blur-3xl rounded-[3rem] p-8 sm:p-16 border border-white/5 shadow-2xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

                        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
                            <div className="flex-1 space-y-10 order-2 lg:order-1">
                                <div className="h-16 w-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center border border-white/10 shadow-2xl">
                                    <Zap className="h-8 w-8 text-white animate-pulse" />
                                </div>
                                <h3 className="text-5xl sm:text-6xl font-black text-white tracking-tighter leading-[1.1] italic">
                                    Import. Sync. Win.
                                </h3>
                                <p className="text-xl text-zinc-500 font-bold leading-relaxed">
                                    Paste your LinkedIn URL and watch our AI instantly reconstruct your entire career into a high-impact narrative.
                                </p>
                                <ul className="space-y-6">
                                    {['Instant Profile Parsing', 'Auto-Experience Mapping'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-4 text-zinc-300 font-black text-xs uppercase tracking-widest leading-none">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex-1 w-full order-1 lg:order-2">
                                <div className="rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)] border border-white/10 aspect-[4/3] relative bg-[#0a0a0a]">
                                    <img
                                        src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=2070"
                                        alt="Modern Workspace"
                                        className="w-full h-full object-cover grayscale opacity-50 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent"></div>

                                    {/* Mock decorative UI element to match user's screenshot vibe */}
                                    <div className="absolute bottom-6 right-6 left-6 p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center">
                                        <div className="h-1 w-24 bg-white/20 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-emerald-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

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

            <FooterPremium />
        </div>
    )
}
