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
                {/* 1. HERO SECTION - CLEAN & PREMIUM */}
                <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center pt-20">
                    <div className="absolute inset-0 z-0">
                        <ShaderAnimation />
                    </div>
                    <div className="absolute inset-0 bg-black/40 z-[1] pointer-events-none" />

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

                        <p className="text-xl sm:text-2xl text-zinc-500 font-medium max-w-2xl mb-16 leading-relaxed">
                            A high-end platform for elite candidates. Stop applying, start being recruited with AI-powered narratives.
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

                {/* 2. LOGO CLOUD */}
                <LogoCloudPremium logos={logos} />

                {/* 3. RESEND-STYLE FEATURES SECTION */}
                <section id="features" className="py-24 bg-black overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-48">

                        {/* FEATURE 1: INTEGRATE THIS WEEKEND (LinkedIn Sync) */}
                        <div className="flex flex-col items-center text-center">
                            <h2 className="text-4xl sm:text-7xl font-medium tracking-tight text-white mb-6">
                                Sync <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-emerald-400 to-blue-500">this weekend</span>
                            </h2>
                            <p className="text-zinc-500 text-lg sm:text-xl max-w-2xl mb-16 leading-relaxed">
                                A simple, elegant interface so you can start optimizing in minutes. It fits right into your workflow with 1-click imports from your professional profiles.
                            </p>

                            {/* Source Grid */}
                            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 sm:gap-8 mb-20 w-full max-w-4xl">
                                {[
                                    { name: "LinkedIn", icon: <Zap className="h-5 w-5" /> },
                                    { name: "PDF", icon: <Target className="h-5 w-5" /> },
                                    { name: "Docx", icon: <Sparkles className="h-5 w-5" /> },
                                    { name: "Text", icon: <Zap className="h-5 w-5" /> },
                                    { name: "JSON", icon: <Target className="h-5 w-5" /> },
                                    { name: "Web", icon: <Sparkles className="h-5 w-5" /> },
                                    { name: "API", icon: <Zap className="h-5 w-5" /> },
                                    { name: "Auto", icon: <Target className="h-5 w-5" /> }
                                ].map((source, i) => (
                                    <div key={i} className="flex flex-col items-center gap-3 group cursor-pointer">
                                        <div className="h-12 w-12 rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:border-white/10 transition-all shadow-xl group-hover:shadow-white/5">
                                            {source.icon}
                                        </div>
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 group-hover:text-zinc-400">{source.name}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Code/Sync Block */}
                            <div className="w-full max-w-5xl rounded-3xl border border-white/5 bg-[#0a0a0a] overflow-hidden shadow-2xl relative group">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
                                <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-black/40">
                                    <div className="flex gap-1.5 ml-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
                                    </div>
                                    <div className="ml-4 flex gap-4 text-[11px] font-bold tracking-widest uppercase text-zinc-500">
                                        <span className="text-white border-b border-emerald-500 pb-1">Sync</span>
                                        <span>Optimize</span>
                                        <span>Deploy</span>
                                    </div>
                                </div>
                                <div className="p-8 text-left font-mono text-sm sm:text-base overflow-x-auto">
                                    <div className="flex gap-4">
                                        <span className="text-zinc-600 select-none">1</span>
                                        <p className="text-zinc-400 capitalize underline decoration-emerald-500/50 underline-offset-4 decoration-2"># Import your career history from LinkedIn</p>
                                    </div>
                                    <div className="flex gap-4 mt-1">
                                        <span className="text-zinc-600 select-none">2</span>
                                        <p className="text-zinc-300">USER_URL = <span className="text-emerald-400">"linkedin.com/in/johndoe"</span></p>
                                    </div>
                                    <div className="flex gap-4 mt-1">
                                        <span className="text-zinc-600 select-none">3</span>
                                        <p className="text-zinc-300">PROCESS_MODE = <span className="text-emerald-400">'high_impact_narrative'</span></p>
                                    </div>
                                    <div className="flex gap-4 mt-6">
                                        <span className="text-zinc-600 select-none">4</span>
                                        <p className="text-zinc-400 capitalize"># Claude 3.5 AI starts reconstructing...</p>
                                    </div>
                                    <div className="flex gap-4 mt-1 pl-4">
                                        <span className="text-zinc-600 select-none">5</span>
                                        <p className="text-zinc-300">with <span className="text-purple-400 font-bold italic">ai_optimizer</span>(USER_URL):</p>
                                    </div>
                                    <div className="flex gap-4 mt-1 pl-8">
                                        <span className="text-zinc-600 select-none">6</span>
                                        <p className="text-zinc-300">result = <span className="text-blue-400">reconstruct</span>(</p>
                                    </div>
                                    <div className="flex gap-4 mt-1 pl-12">
                                        <span className="text-zinc-600 select-none">7</span>
                                        <p className="text-zinc-300 whitespace-nowrap">ats_score: <span className="text-emerald-400">92</span>,</p>
                                    </div>
                                    <div className="flex gap-4 mt-1 pl-12">
                                        <span className="text-zinc-600 select-none">8</span>
                                        <p className="text-zinc-300 whitespace-nowrap">keywords: [<span className="text-emerald-400">"LLM"</span>, <span className="text-emerald-400">"SaaS"</span>, <span className="text-emerald-400">"Scale"</span>],</p>
                                    </div>
                                    <div className="flex gap-4 mt-1 pl-12">
                                        <span className="text-zinc-600 select-none">9</span>
                                        <p className="text-zinc-300 whitespace-nowrap">tone: <span className="text-yellow-400">'visionary'</span></p>
                                    </div>
                                    <div className="flex gap-4 mt-1 pl-8">
                                        <span className="text-zinc-600 select-none">10</span>
                                        <p className="text-zinc-300">).<span className="text-purple-400">build</span>()</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FEATURE 2: FIRST-CLASS CANDIDATE EXPERIENCE (Dual Cards) */}
                        <div className="space-y-16">
                            <div className="max-w-3xl">
                                <h2 className="text-4xl sm:text-6xl font-medium tracking-tight text-white mb-6">
                                    First-class <br />candidate experience
                                </h2>
                                <p className="text-zinc-500 text-lg leading-relaxed">
                                    We are a team of recruiters who love building tools for candidates. Our goal is to create the career platform we've always wished we had — one that <span className="italic font-serif">just works.</span>
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Test Mode / AI Optimizer */}
                                <div className="group rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 p-12 hover:border-white/10 transition-all flex flex-col justify-between min-h-[500px] relative overflow-hidden shadow-2xl shadow-emerald-500/5">
                                    <div className="relative z-10 w-full mb-12">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex gap-2 p-1 bg-black/40 rounded-full border border-white/5">
                                                <div className="px-4 py-1.5 rounded-full bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-widest">Optimized</div>
                                                <div className="px-4 py-1.5 rounded-full text-zinc-500 text-[10px] font-bold uppercase tracking-widest">v1.2.0</div>
                                            </div>
                                            <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                                <Zap className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="space-y-4 font-mono text-[12px] text-zinc-500">
                                            <div className="flex gap-4"><span>CLAUDE 3.5:</span> <span className="text-emerald-400">"Match found: 98%"</span></div>
                                            <div className="flex gap-4"><span>ATS BOT:</span> <span className="text-emerald-400">"Parsed successfully"</span></div>
                                            <div className="flex gap-4 border-l border-emerald-500/30 pl-4 py-2 bg-emerald-500/5 rounded-r-lg text-emerald-300">
                                                <span>{`{ "status": "Ready", "quality": "Professional" }`}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-bold text-white mb-4">AI Optimizer</h3>
                                        <p className="text-zinc-500 leading-relaxed max-w-sm mb-6">
                                            Simulate how recruiters and ATS bots see your resume. Experiment with different tones without the risk of sounding robotic.
                                        </p>
                                        <Link href="#" className="text-white text-sm font-bold border-b border-white/10 hover:border-white/40 transition-all pb-1">Learn more</Link>
                                    </div>
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
                                </div>

                                {/* Modular Webhooks / Smart Tracking */}
                                <div className="group rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 p-12 hover:border-white/10 transition-all flex flex-col justify-between min-h-[500px] relative overflow-hidden shadow-2xl shadow-blue-500/5">
                                    <div className="relative z-10 w-full mb-12">
                                        <div className="space-y-6">
                                            {[
                                                { label: "Viewed", time: "12:08:06", location: "NYC, US", color: "bg-blue-500" },
                                                { label: "Downloaded", time: "12:09:42", location: "SF, US", color: "bg-purple-500" },
                                            ].map((status, i) => (
                                                <div key={i} className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                                                    <div className={`h-2 w-2 rounded-full ${status.color}`} />
                                                    <span className="text-[11px] font-bold text-white uppercase tracking-widest">{status.label}</span>
                                                    <span className="text-zinc-600 text-[10px] ml-auto">{status.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-bold text-white mb-4">Smart Tracking</h3>
                                        <p className="text-zinc-500 leading-relaxed max-w-sm mb-6">
                                            Receive real-time notifications directly to your phone. Every time your resume is viewed, downloaded, or shared by a recruiter.
                                        </p>
                                        <Link href="#" className="text-white text-sm font-bold border-b border-white/10 hover:border-white/40 transition-all pb-1">Learn more</Link>
                                    </div>
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* FEATURE 3: GO BEYOND RESUME EDITING (Analytics/Management) */}
                        <div className="space-y-16">
                            <div className="max-w-3xl">
                                <h2 className="text-4xl sm:text-6xl font-medium tracking-tight text-white mb-6">
                                    Go beyond editing
                                </h2>
                                <p className="text-zinc-500 text-lg leading-relaxed">
                                    Manage your candidates pipeline in a simple and intuitive way. Straightforward analytics and reporting tools that will help you land jobs faster.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Audience / Pipeline */}
                                <div className="group rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 p-12 hover:border-white/10 transition-all min-h-[450px] flex flex-col justify-between relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="bg-black/40 rounded-3xl border border-white/5 p-8 mb-12">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-white/10 flex items-center justify-center">
                                                    <Target className="h-6 w-6 text-emerald-500" />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold text-lg">Active Applications</div>
                                                    <div className="text-zinc-500 text-[11px] uppercase tracking-widest font-bold">24 Positions</div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-8">
                                                {[
                                                    { label: "Interviews", value: "8" },
                                                    { label: "Offers", value: "2" },
                                                    { label: "Reach", value: "1.2k" }
                                                ].map((stat, i) => (
                                                    <div key={i}>
                                                        <div className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest mb-1">{stat.label}</div>
                                                        <div className="text-white text-2xl font-black italic tracking-tighter">{stat.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-bold text-white mb-4">Pipeline Manager</h3>
                                        <p className="text-zinc-500 leading-relaxed max-w-sm mb-6">Manage all your applications from one place. Get full visibility of each interview stage.</p>
                                        <Link href="#" className="text-white text-sm font-bold border-b border-white/10 hover:border-white/40 transition-all pb-1">Learn more</Link>
                                    </div>
                                </div>

                                {/* Analytics / Engagement */}
                                <div className="group rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 p-12 hover:border-white/10 transition-all min-h-[450px] flex flex-col justify-between relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="bg-black/40 rounded-3xl border border-white/5 p-8 mb-12">
                                            <div className="text-white font-bold mb-6 flex justify-between items-center">
                                                <span>Engagement Score</span>
                                                <span className="text-emerald-400 text-3xl font-black italic uppercase tracking-tighter">98%</span>
                                            </div>
                                            <div className="h-24 flex items-end gap-2 group-hover:gap-3 transition-all">
                                                {[30, 60, 45, 90, 100, 70, 85, 40].map((h, i) => (
                                                    <div key={i} className="flex-1 bg-gradient-to-t from-emerald-500/20 to-emerald-500/40 rounded-t-lg transition-all duration-700" style={{ height: `${h}%` }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-bold text-white mb-4">Deep Analytics</h3>
                                        <p className="text-zinc-500 leading-relaxed max-w-sm mb-6">Unlock powerful insights and understand exactly how recruiters are interacting with your resume.</p>
                                        <Link href="#" className="text-white text-sm font-bold border-b border-white/10 hover:border-white/40 transition-all pb-1">Learn more</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FEATURE 4: DEVELOP RESUMES USING AI (Templates Mockup) */}
                        <div className="flex flex-col items-center text-center">
                            <h2 className="text-4xl sm:text-7xl font-medium tracking-tight text-white mb-6">
                                Build resumes <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">using AI</span>
                            </h2>
                            <p className="text-zinc-500 text-lg sm:text-xl max-w-2xl mb-16 leading-relaxed">
                                Create beautiful, high-converting templates without having to deal with formatting and alignment. Powered by Claude 3.5, our open-source template library.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 mb-16">
                                <Button size="lg" className="rounded-xl px-12 bg-white text-black font-black h-14 hover:scale-105 transition-all">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Button>
                                <Button variant="ghost" size="lg" className="text-white border border-white/10 rounded-xl px-12 h-14 hover:bg-white/5">Check the Templates</Button>
                            </div>

                            <div className="w-full max-w-6xl rounded-[3rem] border border-white/5 bg-[#0a0a0a] overflow-hidden shadow-2xl relative shadow-purple-500/5 group">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
                                <div className="flex flex-col md:flex-row border-b border-white/5">
                                    <div className="w-full md:w-64 border-r border-white/5 p-6 bg-black/40">
                                        <div className="space-y-4">
                                            {["senior-dev.tsx", "product-mnger.tsx", "designer.pdf", "marketing.docx"].map((file, i) => (
                                                <div key={i} className={`flex items-center gap-3 text-[11px] font-bold tracking-widest uppercase ${i === 0 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-emerald-400' : 'bg-zinc-800'}`} />
                                                    {file}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1 p-8 text-left font-mono text-sm overflow-hidden hidden md:block">
                                        <p className="text-purple-400 italic">const <span className="text-blue-400 font-bold">ResumeElite</span> = () =&gt; {"{"}</p>
                                        <p className="pl-6 text-zinc-400 italic mt-2">// Perfectly formatted for Fortune 500 ATS bots</p>
                                        <p className="pl-6 text-emerald-400 mt-2">return (</p>
                                        <p className="pl-12 text-zinc-300">&lt;Header name="Alex Thompson" /&gt;</p>
                                        <p className="pl-12 text-zinc-300">&lt;Experience data={`{AI_OPTIMIZED_HISTORY}`} /&gt;</p>
                                        <p className="pl-12 text-zinc-300">&lt;Skills high_impact={`{true}`} /&gt;</p>
                                        <p className="pl-6 text-emerald-400 mt-2">)</p>
                                        <p className="text-purple-400 italic font-bold leading-none">{"}"}</p>
                                    </div>
                                    <div className="flex-1 bg-gradient-to-br from-[#0d0d0d] to-black p-8 flex items-center justify-center">
                                        <div className="w-full h-80 rounded-2xl bg-white p-6 shadow-2xl scale-95 group-hover:scale-100 transition-transform duration-700">
                                            <div className="h-8 w-1/2 bg-zinc-950/10 rounded mb-4" />
                                            <div className="h-4 w-1/4 bg-emerald-500/20 rounded mb-8" />
                                            <div className="space-y-4">
                                                <div className="h-2 w-full bg-zinc-900/5 rounded" />
                                                <div className="h-2 w-full bg-zinc-900/5 rounded" />
                                                <div className="h-2 w-[80%] bg-zinc-900/5 rounded" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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

            <FooterPremium />
        </div>
    )
}
