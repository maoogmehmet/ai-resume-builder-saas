'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Zap, Shield, FileText, Globe, Target, ArrowRight, CheckCircle2, PlayCircle, Star, Quote } from 'lucide-react'
import { HeroSection } from '@/components/ui/hero-1'

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

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    }

    const staggerContainer = {
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
        <div className="flex flex-col min-h-screen bg-[#FDFDFD] font-sans selection:bg-zinc-900 selection:text-white overflow-hidden">

            {/* STICKY NAVBAR */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="fixed top-0 w-full z-50 transition-all border-b border-zinc-100 bg-white/70 backdrop-blur-xl"
            >
                <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
                    <Link className="flex items-center gap-2" href="/">
                        <div className="h-8 w-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-black text-xl tracking-tighter text-zinc-900">AI RESUME.</span>
                    </Link>
                    <nav className="flex gap-4 sm:gap-8 items-center">
                        <Link className="text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors hidden md:block" href="#features">Platform</Link>
                        <Link className="text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors hidden md:block" href="#testimonials">Reviews</Link>
                        <Link className="text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors hidden md:block" href="#pricing">Pricing</Link>

                        {user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-zinc-200">
                                <Link className="text-sm font-bold text-zinc-900 hover:text-blue-600 transition-colors" href="/dashboard">Dashboard</Link>
                                <form action="/auth/signout" method="POST">
                                    <Button type="submit" variant="ghost" size="sm" className="font-bold text-zinc-500 hover:text-zinc-900">Sign Out</Button>
                                </form>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 pl-4 border-l border-zinc-200">
                                <Link className="text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors" href="/auth/signin">Log In</Link>
                                <Button size="sm" asChild className="rounded-xl px-5 bg-blue-600 hover:bg-blue-700 font-bold h-10 shadow-lg shadow-blue-600/20 text-white">
                                    <Link href="/auth/signup">Get Started</Link>
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
            </motion.header>

            <main className="flex-1 w-full pt-20">
                {/* 1. COMPONENT HERO SECTION */}
                <HeroSection />

                {/* 2. SOCIAL PROOF MARQUEE */}
                <section className="py-12 border-y border-zinc-100 bg-zinc-50/50 overflow-hidden flex flex-col items-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Trusted by candidates hired at</p>
                    <div className="flex gap-16 animate-marquee whitespace-nowrap opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Google', 'Microsoft', 'Netflix', 'Amazon', 'Apple', 'Meta', 'Stripe', 'Airbnb'].map((company, i) => (
                            <span key={i} className="text-2xl font-black tracking-tighter text-zinc-800">{company}</span>
                        ))}
                    </div>
                </section>

                {/* 3. DEEP-DIVE FEATURES (STORYTELLING WITH MOCKUPS) */}
                <section id="features" className="py-24 sm:py-32 px-6 lg:px-12 bg-white">
                    <div className="max-w-7xl mx-auto space-y-32">

                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
                                <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full border-blue-200 bg-blue-50 text-blue-600 font-bold uppercase tracking-widest text-[10px]">The Platform</Badge>
                                <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 mb-6 leading-[1.1]">Everything you need to stand out.</h2>
                                <p className="text-xl text-zinc-500 leading-relaxed font-medium">We replaced the manual, tedious process of writing resumes with an intelligent AI engine that positions you as the perfect candidate.</p>
                            </motion.div>
                        </div>

                        {/* Feature 1: LinkedIn Sync */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="flex-1 space-y-8">
                                <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <Zap className="h-7 w-7 text-blue-600" />
                                </div>
                                <h3 className="text-4xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-[1.1]">One-click LinkedIn import.</h3>
                                <p className="text-lg text-zinc-500 font-medium leading-relaxed">Paste your LinkedIn URL and watch as our AI instantly extracts, parses, and rebuilds your entire professional history into a highly polished, ATS-ready format.</p>
                                <ul className="space-y-4">
                                    {['Instant data extraction', 'Auto-formats into best practices', 'Zero manual typing required'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-zinc-700 font-bold"><CheckCircle2 className="h-5 w-5 text-blue-500" /> {item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-1 w-full">
                                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 border border-zinc-200/50 aspect-video relative">
                                    <img src={images.feature1} alt="One click import" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-transparent"></div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Feature 2: ATS Matcher (Reversed) */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="flex flex-col lg:flex-row-reverse items-center gap-16">
                            <div className="flex-1 space-y-8">
                                <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                    <Target className="h-7 w-7 text-emerald-600" />
                                </div>
                                <h3 className="text-4xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-[1.1]">Beat the ATS algorithm.</h3>
                                <p className="text-lg text-zinc-500 font-medium leading-relaxed">Stop guessing what recruiters want. Paste the link of the job you are applying to, and our Claude 3.5 engine analyzes the post to score and inject missing keywords into your CV.</p>
                                <ul className="space-y-4">
                                    {['Real-time match scoring', 'Automated keyword injection', 'Tailored summary rewriting'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-zinc-700 font-bold"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> {item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-1 w-full">
                                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/10 border border-zinc-200/50 aspect-video relative">
                                    <img src={images.feature2} alt="ATS Analyzer dashboard" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/20 to-transparent"></div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Feature 3: Interactive Pitch Decks */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="flex-1 space-y-8">
                                <div className="h-14 w-14 bg-purple-50 rounded-2xl flex items-center justify-center">
                                    <PlayCircle className="h-7 w-7 text-purple-600" />
                                </div>
                                <h3 className="text-4xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-[1.1]">Auto-generated Pitch Decks.</h3>
                                <p className="text-lg text-zinc-500 font-medium leading-relaxed">Cover letters are dead. When you build a CV, our AI automatically generates a stunning, 4-slide interactive presentation summarizing why you are perfect for the role.</p>
                                <ul className="space-y-4">
                                    {['Beautiful fullscreen presentation mode', '30-60-90 day planning slides', 'Public URLs with paywall access tracking'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-zinc-700 font-bold"><CheckCircle2 className="h-5 w-5 text-purple-500" /> {item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-1 w-full">
                                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-purple-900/10 border border-zinc-200/50 aspect-video relative">
                                    <img src={images.feature3} alt="Presenting pitch deck" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-transparent"></div>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </section>

                {/* 4. FAST FEATURES GRID */}
                <section className="py-24 bg-zinc-900 text-white px-6 lg:px-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
                        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
                            <h2 className="text-3xl sm:text-5xl font-black mb-4">Every detail perfected.</h2>
                            <p className="text-zinc-400 font-medium text-lg">We didn't just build a builder. We built an entire career operating system.</p>
                        </motion.div>

                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { title: "Live PDF Export", desc: "Pixel-perfect PDFs generated instantly in the cloud.", icon: FileText },
                                { title: "Custom Public Links", desc: "Shareable ai-resume.com/r/your-name links.", icon: Globe },
                                { title: "Secure Cloud Sync", desc: "Never lose a version again with Supabase storage.", icon: Shield },
                            ].map((item, i) => (
                                <motion.div key={i} variants={fadeInUp} className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-md p-8 rounded-3xl hover:bg-zinc-800 transition-colors">
                                    <item.icon className="h-8 w-8 text-blue-400 mb-6" />
                                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                                    <p className="text-zinc-400 font-medium">{item.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* 5. TESTIMONIALS */}
                <section id="testimonials" className="py-24 sm:py-32 px-6 lg:px-12 bg-zinc-50">
                    <div className="max-w-7xl mx-auto">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
                            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 mb-6">Wall of Love</h2>
                            <p className="text-lg text-zinc-500 font-medium">Join thousands of professionals landing their dream roles.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: "Sarah Jenkins", role: "Product Manager @ Airbnb", img: images.avatar1, text: "I imported my LinkedIn, applied the Modern template, and used the ATS optimizer. I got 3 interviews in my first week of applying." },
                                { name: "David Chen", role: "Sr. Software Engineer @ Meta", img: images.avatar2, text: "The interactive Pitch Deck feature completely blew the hiring manager away. It was the deciding factor that got me the offer." },
                                { name: "Emily Rodriguez", role: "Marketing Director @ Stripe", img: images.avatar3, text: "Finally, a resume builder that actually looks like it was designed in this decade. It's incredibly fast, and the AI rewriting is shockingly good." },
                            ].map((review, i) => (
                                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/50 flex flex-col justify-between">
                                    <div>
                                        <div className="flex gap-1 mb-6 text-yellow-400">
                                            {[...Array(5)].map((_, j) => <Star key={j} className="h-5 w-5 fill-current" />)}
                                        </div>
                                        <p className="text-zinc-700 font-medium text-lg leading-relaxed mb-8">"{review.text}"</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <img src={review.img} alt={review.name} className="h-12 w-12 rounded-full object-cover border-2 border-zinc-100" />
                                        <div>
                                            <div className="font-bold text-zinc-900">{review.name}</div>
                                            <div className="text-xs font-bold text-zinc-400">{review.role}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. PRICING PREVIEW */}
                <section id="pricing" className="py-24 sm:py-32 px-6 lg:px-12 bg-white relative border-t border-zinc-100">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex-1 space-y-8">
                                <Badge variant="outline" className="px-4 py-1.5 rounded-full border-blue-200 bg-blue-50 text-blue-600 font-bold uppercase tracking-widest text-[10px]">Simple Pricing</Badge>
                                <h2 className="text-5xl sm:text-7xl font-black tracking-tight text-zinc-900 leading-[0.9]">One Plan. <br /><span className="text-zinc-400">Unlimited Success.</span></h2>
                                <p className="text-xl text-zinc-500 leading-relaxed font-medium">No complex tiers. Everything you need to land your next elite role, wrapped in one simple subscription.</p>
                            </motion.div>
                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="w-full max-w-md">
                                <div className="bg-zinc-900 rounded-[3rem] p-12 text-white shadow-2xl shadow-zinc-900/30 relative overflow-hidden group border border-zinc-800 hover:border-zinc-700 transition-colors">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Sparkles className="h-32 w-32 text-white transform rotate-12" />
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div> Lifetime Professional</h4>
                                        <div className="flex items-baseline gap-2 mb-10 text-white">
                                            <span className="text-7xl sm:text-8xl font-black tracking-tighter">$99</span>
                                        </div>
                                        <ul className="space-y-4 mb-10">
                                            {['Unlimited AI Tokens', 'Unlimited CV & PDFs', 'Unlimited Pitch Decks', 'Interactive Public Links'].map((feat, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm font-bold text-zinc-300"><CheckCircle2 className="h-5 w-5 text-blue-500" /> {feat}</li>
                                            ))}
                                        </ul>
                                        <Button asChild size="lg" className="w-full bg-white text-zinc-900 hover:bg-zinc-100 font-black h-16 rounded-2xl shadow-xl hover:scale-105 transition-transform text-lg">
                                            <Link href="/auth/signup">Start Building Today</Link>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 7. CTA BANNER */}
                <section className="py-24 px-6 lg:px-12 bg-white">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="max-w-7xl mx-auto bg-blue-600 rounded-[3rem] p-12 sm:p-24 text-center border overflow-hidden relative shadow-2xl shadow-blue-600/20">
                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white mb-8">Ready to upgrade your career?</h2>
                            <p className="text-blue-100 text-xl font-medium mb-12 max-w-2xl mx-auto">Create an account today and build a Resume and Pitch Deck that makes you undeniably hirable.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button asChild size="lg" className="rounded-2xl px-12 bg-white text-blue-600 font-black h-16 text-lg hover:bg-zinc-50 hover:scale-105 transition-transform shadow-2xl">
                                    <Link href="/auth/signup">Get Started Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
                                </Button>
                            </div>
                        </div>
                        {/* Background Decorations */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                            <div className="absolute -top-64 -left-64 w-[500px] h-[500px] bg-white rounded-full mix-blend-overlay filter blur-[100px]"></div>
                            <div className="absolute -bottom-64 -right-64 w-[500px] h-[500px] bg-white rounded-full mix-blend-overlay filter blur-[100px]"></div>
                        </div>
                    </motion.div>
                </section>
            </main>

            <footer className="py-12 pb-24 px-6 lg:px-12 border-t border-zinc-100 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-zinc-900 rounded-md flex items-center justify-center">
                            <Sparkles className="h-3 w-3 text-white" />
                        </div>
                        <span className="font-black text-xl tracking-tighter text-zinc-900">AI RESUME.</span>
                    </div>
                    <div className="flex gap-8 text-sm font-bold text-zinc-500">
                        <Link href="/auth/signup" className="hover:text-zinc-900 transition-colors">Register</Link>
                        <Link href="/auth/signin" className="hover:text-zinc-900 transition-colors">Login</Link>
                        <Link href="#" className="hover:text-zinc-900 transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-zinc-900 transition-colors">Terms</Link>
                    </div>
                    <div className="text-xs font-bold text-zinc-400">© 2026 AI Resume Builder.</div>
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
