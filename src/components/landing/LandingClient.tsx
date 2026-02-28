'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Zap, Shield, FileText, Globe, Target, ArrowRight, CheckCircle2, PlayCircle, Star, Download, Edit3, LayoutTemplate, Moon, Sun } from 'lucide-react'
import { HeroSection } from '@/components/ui/hero-1'
import { ShaderAnimation } from '@/components/ui/shader-animation'
import TwitterTestimonialCards from '@/components/ui/twitter-testimonial-cards'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { Announcement } from '@/components/ui/announcement'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function LandingClient({ user }: { user: any }) {
    const { scrollYProgress } = useScroll()
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

    // Fallback images from Unsplash (Professional, minimal, high-quality)
    const images = {
        heroAppId: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=2070",
        feature1: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=2070", // Person compiling resume
        feature2: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070", // Dashboard/Data Analytics
        feature3: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2070", // Person presenting (Pitch deck)
        avatar1: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        avatar2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        avatar3: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
    }

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
    }

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    }

    const logOutAction = async () => {
        await fetch('/auth/signout', { method: 'POST' })
        window.location.reload()
    }

    return (
        <div className="flex flex-col min-h-screen bg-black font-sans selection:bg-white selection:text-black overflow-hidden text-zinc-400">

            {/* TOP ANNOUNCEMENT BAR - SLEEK DARK */}
            <div className="w-full flex justify-center py-2 bg-black border-b border-white/5 absolute top-0 z-[60]">
                <div className="flex items-center gap-2 text-[11px] font-medium tracking-tight h-5">
                    <span className="bg-white/10 text-zinc-100 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border border-white/10">NEW</span>
                    <span className="text-zinc-400">Introducing CV Builder 2.0 —</span>
                    <Link href="/auth/signup" className="text-zinc-100 hover:text-white transition-colors flex items-center gap-1">
                        Enjoy 50% off Pro <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
            </div>

            {/* STICKY NAVBAR - LINEAR STYLE */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-9 w-full z-50 transition-all border-b border-white/5 bg-black/50 backdrop-blur-lg"
            >
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-12">
                    <Link className="flex items-center gap-2.5" href="/">
                        <div className="h-6 w-6 bg-white rounded flex items-center justify-center transform rotate-45 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            <Sparkles className="h-3 w-3 text-black -rotate-45" />
                        </div>
                        <span className="font-bold text-base tracking-tighter text-white uppercase">AI Resume</span>
                    </Link>

                    <nav className="flex gap-8 items-center">
                        <div className="hidden md:flex gap-7 items-center pr-8 border-r border-white/10">
                            <Link className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors" href="/#features">Product</Link>
                            <Link className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors" href="/#testimonials">Resources</Link>
                            <Link className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors" href="/#pricing">Pricing</Link>
                            <Link className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors" href="/#contact">Contact</Link>
                        </div>

                        {user ? (
                            <div className="flex items-center gap-6">
                                <Link className="text-[13px] font-medium text-white hover:opacity-80 transition-opacity" href="/dashboard">Dashboard</Link>
                                <form action="/auth/signout" method="POST">
                                    <button type="submit" className="text-[13px] font-medium text-zinc-400 hover:text-white">Sign Out</button>
                                </form>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors" href="/auth/signin">Log in</Link>
                                <Button size="sm" asChild className="rounded-lg px-4 bg-white hover:bg-zinc-200 text-black font-bold h-8 text-[12px] transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                    <Link href="/auth/signup">Sign up</Link>
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
            </motion.header>

            <main className="flex-1 w-full pt-24">
                {/* 1. COMPONENT HERO SECTION WITH SHADER */}
                <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <ShaderAnimation />
                    </div>
                    {/* Dark gradient overlay to ensure text readability over the shader */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black z-[1] pointer-events-none" />

                    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center flex flex-col items-center">
                        <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full border-white/10 bg-white/5 text-zinc-400 font-bold uppercase tracking-widest text-[9px] backdrop-blur-sm">
                            CV Builder 2.0 — Now Available
                        </Badge>
                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-[1.1] max-w-4xl drop-shadow-2xl">
                            Build a professional CV in minutes.
                        </h1>
                        <p className="text-lg sm:text-xl text-zinc-400 font-medium max-w-2xl mb-12 drop-shadow-lg">
                            Create ATS-friendly resumes with smart suggestions and instant downloads. Land your dream job faster.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <Button size="lg" asChild className="rounded-xl px-10 bg-white text-black hover:bg-zinc-200 font-bold h-14 shadow-2xl shadow-white/10 text-base border-none hover:scale-105 transition-all active:scale-95">
                                <Link href="/auth/signup">Create My CV <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                            <Button size="lg" asChild variant="outline" className="rounded-xl px-10 bg-white/5 border-white/10 text-white hover:bg-white/10 font-bold h-14 backdrop-blur-md text-base transition-all">
                                <Link href="#features">See Features</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* 2. SOCIAL PROOF MARQUEE */}
                <section className="py-16 border-y border-white/5 bg-black overflow-hidden flex flex-col items-center relative z-20">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-10">Trusted by candidates hired at</p>
                    <div className="flex gap-20 animate-marquee whitespace-nowrap opacity-40 hover:opacity-100 transition-opacity duration-700">
                        {['Google', 'Microsoft', 'Netflix', 'Amazon', 'Apple', 'Meta', 'Stripe', 'Airbnb'].map((company, i) => (
                            <span key={i} className="text-3xl font-black tracking-tighter text-white">{company}</span>
                        ))}
                    </div>
                </section>

                {/* 3. DEEP-DIVE FEATURES (STORYTELLING WITH MOCKUPS) */}
                <section id="features" className="py-24 px-6 lg:px-12 bg-black flex flex-col items-center justify-center border-b border-white/5">
                    <ContainerScroll
                        titleComponent={
                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
                                <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full border-white/10 bg-white/5 text-zinc-500 font-bold uppercase tracking-widest text-[9px]">The Platform</Badge>
                                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-[1.1]">Everything you need to stand out.</h1>
                                <p className="text-xl text-zinc-400 leading-relaxed font-medium">We replaced the manual, tedious process of writing resumes with an intelligent AI engine that positions you as the perfect candidate.</p>
                            </motion.div>
                        }
                    >
                        <div className="w-full h-full bg-[#0a0a0a] rounded-2xl p-8 overflow-y-auto space-y-32 border border-white/10 shadow-2xl">
                            {/* Feature 1: LinkedIn Sync */}
                            <div className="flex flex-col lg:flex-row items-center gap-16">
                                <div className="flex-1 space-y-8">
                                    <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                        <Zap className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]">One-click LinkedIn import.</h3>
                                    <p className="text-lg text-zinc-400 font-medium leading-relaxed">Paste your LinkedIn URL and watch as our AI instantly extracts, parses, and rebuilds your entire professional history into a highly polished, ATS-ready format.</p>
                                    <ul className="space-y-4">
                                        {['Instant data extraction', 'Auto-formats into best practices', 'Zero manual typing required'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-zinc-300 font-bold"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex-1 w-full">
                                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50 border border-white/10 aspect-video relative group">
                                        <img src={images.feature1} alt="One click import" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 2: ATS Matcher (Reversed) */}
                            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                                <div className="flex-1 space-y-8">
                                    <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                        <Target className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]">Beat the ATS algorithm.</h3>
                                    <p className="text-lg text-zinc-400 font-medium leading-relaxed">Stop guessing what recruiters want. Paste the link of the job you are applying to, and our Claude engine analyzes the post to score and inject missing keywords into your CV.</p>
                                    <ul className="space-y-4">
                                        {['Real-time match scoring', 'Automated keyword injection', 'Tailored summary rewriting'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-zinc-300 font-bold"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex-1 w-full">
                                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50 border border-white/10 aspect-video relative group">
                                        <img src={images.feature2} alt="ATS Analyzer dashboard" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Feature 3: Interactive Pitch Decks */}
                            <div className="flex flex-col lg:flex-row items-center gap-16">
                                <div className="flex-1 space-y-8">
                                    <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                        <PlayCircle className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]">Auto-generated Pitch Decks.</h3>
                                    <p className="text-lg text-zinc-400 font-medium leading-relaxed">Cover letters are dead. When you build a CV, our AI automatically generates a stunning, 4-slide interactive presentation summarizing why you are perfect for the role.</p>
                                    <ul className="space-y-4">
                                        {['Beautiful fullscreen presentation mode', '30-60-90 day planning slides', 'Public URLs with paywall tracking'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-zinc-300 font-bold"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex-1 w-full">
                                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50 border border-white/10 aspect-video relative group">
                                        <img src={images.feature3} alt="Presenting pitch deck" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ContainerScroll>
                </section>

                {/* 4. FAST FEATURES GRID */}
                <section className="py-32 bg-black text-white px-6 lg:px-12 relative overflow-hidden border-b border-white/5">
                    <div className="max-w-7xl mx-auto relative z-10">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-24">
                            <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight">Every detail perfected.</h2>
                            <p className="text-zinc-500 font-medium text-xl max-w-2xl mx-auto">We didn&apos;t just build a builder. We built an entire career operating system.</p>
                        </motion.div>

                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { title: "Smart CV Builder", desc: "Simple step-by-step builder with live preview.", icon: Edit3 },
                                { title: "Modern Templates", desc: "Minimal, corporate, creative and executive styles.", icon: LayoutTemplate },
                                { title: "Instant PDF Export", desc: "One-click high-quality PDF download.", icon: Download },
                                { title: "AI Writing Assistant", desc: "Generate summaries and improve bullet points automatically.", icon: Sparkles },
                                { title: "Multi-Language Ready", desc: "Structure ready for multi-language support.", icon: Globe },
                                { title: "Secure Cloud Sync", desc: "Encrypted storage and secure authentication.", icon: Shield },
                            ].map((item, i) => (
                                <motion.div key={i} variants={fadeInUp} className="bg-white/[0.02] border border-white/5 backdrop-blur-md p-10 rounded-3xl hover:bg-white/[0.05] transition-all flex flex-col items-start text-left group">
                                    <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center mb-8 border border-white/10 group-hover:border-white/20 transition-all">
                                        <item.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <h4 className="text-xl font-bold mb-3 text-white">{item.title}</h4>
                                    <p className="text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* HOW IT WORKS SECTION */}
                <section className="py-32 px-6 lg:px-12 bg-black border-b border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-24 text-balance">
                            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-6 italic">How It Works</h2>
                            <p className="text-xl text-zinc-500 font-medium max-w-2xl mx-auto">Build your professional CV in four simple steps and get ready to land your dream job.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
                            {/* Connecting Line */}
                            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-white/10"></div>

                            {[
                                { step: 1, title: 'Choose a Template', desc: 'Select from our recruiter-approved templates tailored to your industry.' },
                                { step: 2, title: 'Fill Your Information', desc: 'Easily enter your experience, education, and skills or import them.' },
                                { step: 3, title: 'Customize & Preview', desc: 'See your changes in real-time as you tweak colors, fonts, and layout.' },
                                { step: 4, title: 'Download Your CV', desc: 'Export instantly as a high-quality PDF, ready to send to employers.' }
                            ].map((item, i) => (
                                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative z-10 flex flex-col items-center text-center group">
                                    <div className="w-24 h-24 rounded-full bg-[#0a0a0a] border border-white/10 text-white flex items-center justify-center text-3xl font-black shadow-2xl mb-8 group-hover:border-white/20 transition-all">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                                    <p className="text-zinc-500 font-medium px-4 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. TESTIMONIALS */}
                <section id="testimonials" className="py-32 px-6 lg:px-12 bg-black border-b border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-24">
                            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-6">Wall of Love</h2>
                            <p className="text-xl text-zinc-500 font-medium">Join thousands of professionals landing their dream roles.</p>
                        </motion.div>

                        <TwitterTestimonialCards />
                    </div>
                </section>

                {/* 6. PRICING PREVIEW - Overhauled to Dark (Already modified but ensuring consistency) */}
                <section id="pricing" className="py-24 sm:py-32 px-6 lg:px-12 bg-black relative border-b border-white/5">
                    <div className="mx-auto max-w-7xl">
                        <div className="text-center mb-16">
                            <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full border-white/10 bg-white/5 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Pricing</Badge>
                            <h2 className="text-5xl sm:text-6xl font-black tracking-tight text-white mb-4 italic">The Right Plan for You.</h2>
                            <p className="text-xl text-zinc-500 font-medium">Simple, transparent pricing to help you build your career.</p>
                        </div>
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">

                            {/* Free Plan - Resend Styled */}
                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="w-full flex-1">
                                <div className="bg-[#0a0a0a] rounded-[3rem] p-12 border border-white/10 flex flex-col items-center text-center group hover:border-white/20 transition-all">
                                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8">Basic Foundation</h4>
                                    <div className="flex items-baseline gap-1 mb-10 text-white">
                                        <span className="text-7xl font-black tracking-tighter">$0</span>
                                        <span className="text-zinc-600 font-bold text-sm">/ forever</span>
                                    </div>
                                    <div className="w-full space-y-4 mb-12 text-left px-4">
                                        {['1 Active CV', 'Recruiter Templates', 'Standard PDF Export', 'Cloud Storage'].map((feat, i) => (
                                            <div key={i} className="flex items-center gap-3 text-sm font-bold text-zinc-400">
                                                <div className="h-5 w-5 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="h-3 w-3 text-zinc-600" />
                                                </div>
                                                {feat}
                                            </div>
                                        ))}
                                    </div>
                                    <Button asChild size="lg" variant="outline" className="w-full font-bold h-14 rounded-2xl text-base border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all">
                                        <Link href="/auth/signup">Get Started</Link>
                                    </Button>
                                </div>
                            </motion.div>

                            {/* Pro Plan - Resend Styled High Impact */}
                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="w-full flex-1">
                                <div className="bg-black rounded-[3rem] p-12 text-white border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.03)] relative overflow-hidden flex flex-col items-center text-center scale-105 z-10 transition-all hover:border-white/40">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Sparkles className="h-40 w-40 text-white transform rotate-12" />
                                    </div>
                                    <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        Unlimited Professional
                                    </h4>
                                    <div className="flex items-baseline gap-1 mb-10 text-white">
                                        <span className="text-7xl font-black tracking-tighter">$15</span>
                                        <span className="text-zinc-600 font-bold text-sm">/ month</span>
                                    </div>
                                    <div className="w-full space-y-4 mb-12 text-left px-4">
                                        {['Unlimited CVs', 'Magic AI Assistant', 'No Watermark', 'Interactive Pitch Decks', 'Batch Job Applications'].map((feat, i) => (
                                            <div key={i} className="flex items-center gap-3 text-sm font-bold text-white">
                                                <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="h-3 w-3 text-black fill-black" />
                                                </div>
                                                {feat}
                                            </div>
                                        ))}
                                    </div>
                                    <Button asChild size="lg" className="w-full bg-white text-black hover:bg-zinc-200 font-bold h-14 rounded-2xl shadow-2xl shadow-white/5 hover:scale-[1.02] transition-transform text-base border-none">
                                        <Link href="/dashboard/upgrade">Go Premium Now</Link>
                                    </Button>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </section>

                {/* 7. CTA BANNER */}
                <section className="py-32 px-6 lg:px-12 bg-black">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="max-w-7xl mx-auto bg-white rounded-[3rem] p-12 sm:p-24 text-center border border-white/10 overflow-hidden relative shadow-2xl">
                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-black mb-8 italic">Ready to upgrade your career?</h2>
                            <p className="text-zinc-600 text-xl font-medium mb-12 max-w-2xl mx-auto">Create an account today and build a Resume and Pitch Deck that makes you undeniably hirable.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button asChild size="lg" className="rounded-2xl px-12 bg-black text-white font-black h-16 text-lg hover:bg-zinc-900 hover:scale-105 transition-all shadow-2xl">
                                    <Link href="/auth/signup">Get Started Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                            </div>
                        </div>
                        {/* Background Decorations */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
                            <div className="absolute -top-64 -left-64 w-[500px] h-[500px] bg-black rounded-full mix-blend-overlay filter blur-[100px]"></div>
                            <div className="absolute -bottom-64 -right-64 w-[500px] h-[500px] bg-black rounded-full mix-blend-overlay filter blur-[100px]"></div>
                        </div>
                    </motion.div>
                </section>
            </main>

            <footer className="py-24 px-6 lg:px-12 border-t border-white/5 bg-black text-zinc-500">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 bg-white rounded flex items-center justify-center transform rotate-45">
                            <Sparkles className="h-3 w-3 text-black -rotate-45" />
                        </div>
                        <span className="font-bold text-lg tracking-tighter text-white uppercase">AI Resume</span>
                    </div>
                    <div className="flex gap-10 text-[13px] font-medium">
                        <Link href="/auth/signup" className="hover:text-white transition-colors">Register</Link>
                        <Link href="/auth/signin" className="hover:text-white transition-colors">Login</Link>
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                    <div className="text-[11px] font-medium tracking-wide text-zinc-600">© 2026 AI RESUME BUILDER. ALL RIGHTS RESERVED.</div>
                </div>
            </footer>

            {/* Custom Animations injected globally */}
            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
                
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    )
}
