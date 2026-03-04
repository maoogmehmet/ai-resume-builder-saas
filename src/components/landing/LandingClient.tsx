'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Zap, Target, ArrowRight, Sparkles, Globe, Shield, Zap as ZapIcon } from 'lucide-react'
import { HeaderPremium } from './HeaderPremium'
import { TestimonialsSection } from './TestimonialsSection'
import { PricingPremium } from './PricingPremium'
import LogoCloud from '@/components/ui/new-logo-cloud'
import { Footer } from '@/components/ui/footer-section'
import { BlurTextEffect } from '@/components/ui/blur-text-effect'
import { SmartEditorFeature } from './SmartEditorFeature'
import { LandingStats } from './LandingStats'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
import { Button } from '@/components/ui/button'

const ShaderAnimation = dynamic(
    () => import('@/components/ui/shader-animation').then(mod => mod.ShaderAnimation),
    { ssr: false, loading: () => <div className="w-full h-full min-h-[400px] bg-black" /> }
)

export function LandingClient({ user }: { user: any }) {
    const testimonials = [
        {
            author: {
                name: "Sarah Jenkins",
                handle: "@sarahj_dev",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
            },
            text: "The AI optimizer is a game changer. I landed a Senior Dev role at a top-tier fintech in just 2 weeks after using Novatypalcv. The ATS score doesn't lie!",
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

    return (
        <div className="flex flex-col min-h-screen bg-black font-sans selection:bg-white/10 selection:text-white overflow-hidden text-zinc-500">

            <HeaderPremium user={user} />
            <main className="flex-1 w-full pt-4 sm:pt-10">
                {/* 1. HERO SECTION - CLEAN & PREMIUM */}
                <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-20">
                    <div className="absolute inset-0 z-0">
                        <ShaderAnimation />
                    </div>
                    <div className="absolute inset-0 bg-black/40 z-[1] pointer-events-none" />
                    {/* Seamless fade from header */}
                    <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black via-black/80 to-transparent z-[2] pointer-events-none" />

                    <div className="relative z-10 max-w-6xl mx-auto px-6 text-center flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="mb-12"
                        >
                            <Badge variant="outline" className="px-8 py-3 rounded-full border-white/5 bg-white/[0.02] text-zinc-600 font-black uppercase tracking-[0.4em] text-[10px] backdrop-blur-3xl italic">
                                Reimagining the high-performance resume
                            </Badge>
                        </motion.div>

                        <h1 className="text-6xl sm:text-8xl lg:text-[7rem] font-bold tracking-tighter text-white mb-12 leading-[0.9] drop-shadow-2xl">
                            The Career <br />
                            <span className="text-white">Operating System.</span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-zinc-400 font-medium max-w-3xl mb-16 leading-tight">
                            The ultimate ATS-optimized builder for elite professionals. <br className="hidden sm:block" />
                            Stop applying, start being recruited with AI narratives.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-10 items-center">
                            <Button asChild className="rounded-2xl shadow-2xl h-16 px-12 font-bold text-lg bg-white text-black hover:bg-zinc-100 border-none transition-all hover:scale-105 !bg-white !text-black" size="lg">
                                <a href="/auth/signup">
                                    GET STARTED
                                    <ArrowRight className="size-5 ms-2" />
                                </a>
                            </Button>
                            <Link href="#features" className="text-zinc-500 hover:text-white transition-all font-bold text-lg">
                                EXPLORE FEATURES
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 2. LOGO CLOUD - FLAT BLACK AREA */}
                <div className="bg-black py-32 border-y border-white/5 relative z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0,transparent_70%)] pointer-events-none" />
                    <LogoCloud />
                </div>

                {/* 3. HYPER-PREMIUM BENTO FEATURES SECTION */}
                <section id="features" className="py-48 bg-black overflow-hidden relative">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                        <div className="text-center mb-32 space-y-6">
                            <h2 className="text-5xl sm:text-8xl font-black italic tracking-tighter text-white lowercase">
                                everything you need to <br /> <span className="text-zinc-600">conquer the market.</span>
                            </h2>
                            <p className="text-zinc-600 text-xl sm:text-2xl max-w-3xl mx-auto leading-tight font-black italic lowercase opacity-60">
                                We've engineered the ultimate neural pipeline for elite candidates. Stop guessing. start failing upward with data-backed narratives.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 auto-rows-[350px] sm:auto-rows-[400px]">
                            <div className="md:col-span-4 md:row-span-2 group relative rounded-[4rem] bg-black border border-white/5 overflow-hidden shadow-2xl transition-all duration-700 hover:border-white/10">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="p-12 flex flex-col h-full relative z-10">
                                    <div className="flex-1 flex items-center justify-center relative">
                                        <div className="w-full max-w-lg bg-black/60 rounded-[2.5rem] border border-white/5 p-10 backdrop-blur-3xl relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-1000 shadow-3xl">
                                            <div className="flex items-center gap-6 mb-8">
                                                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                                                    <ZapIcon className="h-8 w-8 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="h-2.5 w-32 bg-white/20 rounded-full mb-3" />
                                                    <div className="h-2 w-20 bg-white/10 rounded-full" />
                                                </div>
                                                <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[9px] font-black tracking-[0.3em] uppercase animate-pulse italic">Neural Sync...</div>
                                            </div>
                                            <div className="space-y-4">
                                                {[85, 95, 70, 90].map((w, i) => (
                                                    <motion.div key={i} className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-white/40 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${w}%` }}
                                                            transition={{ duration: 2.5, delay: i * 0.2, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
                                                            viewport={{ once: true }}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <div className="absolute -right-10 -bottom-10 h-48 w-48 bg-white/10 blur-[100px] rounded-full" />
                                        </div>
                                    </div>
                                    <div className="mt-12">
                                        <h3 className="text-4xl font-black italic tracking-tighter text-white mb-4 lowercase">ai linkedin protocol</h3>
                                        <p className="text-zinc-600 text-xl leading-snug max-w-md font-black italic lowercase opacity-60">
                                            One click to pull your entire professional history. Our neural engine reconstructs your identity into a high-performance narrative.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 md:row-span-1 group relative rounded-[4rem] bg-black border border-white/5 overflow-hidden shadow-2xl transition-all duration-700 hover:border-white/10">
                                <div className="p-12 flex flex-col items-center text-center justify-center h-full relative z-10">
                                    <div className="relative mb-10">
                                        <div className="h-32 w-32 rounded-full border-[10px] border-white/5 flex items-center justify-center relative shadow-[0_0_50px_rgba(255,255,255,0.02)] group-hover:scale-110 transition-transform duration-700">
                                            <span className="text-5xl font-black italic tracking-tighter text-white animate-pulse">98</span>
                                            <div className="absolute -inset-3 rounded-full border-[2px] border-white/5 border-t-white animate-spin-slow" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-3 italic lowercase">ats matcher</h3>
                                    <p className="text-zinc-600 text-[11px] font-black uppercase tracking-[0.2em] leading-relaxed opacity-60 italic">Real-time scoring against Fortune 500 neural requirements.</p>
                                </div>
                            </div>

                            <div className="md:col-span-2 md:row-span-1 group relative rounded-[4rem] bg-black border border-white/5 overflow-hidden shadow-2xl transition-all duration-700 hover:border-white/10">
                                <div className="p-12 flex items-center justify-between h-full bg-gradient-to-br from-transparent to-white/[0.01] relative z-10">
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-black text-white italic lowercase">export everywhere</h3>
                                        <div className="flex gap-3">
                                            <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-zinc-500 uppercase tracking-widest italic group-hover:text-white transition-colors">PDF</div>
                                            <div className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-zinc-500 uppercase tracking-widest italic group-hover:text-white transition-colors">JSON</div>
                                        </div>
                                    </div>
                                    <div className="h-20 w-20 rounded-[1.8rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shadow-2xl group-hover:bg-white/10">
                                        <Target className="h-10 w-10 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-3 md:row-span-1 group relative rounded-[4rem] bg-black border border-white/5 overflow-hidden shadow-2xl transition-all duration-700 hover:border-white/10">
                                <div className="p-12 flex flex-col h-full relative z-10">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg">
                                            <Sparkles className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-3xl font-black italic tracking-tighter text-white lowercase">smart pitch decks</h3>
                                    </div>
                                    <p className="text-zinc-600 text-lg leading-snug mb-auto font-black italic lowercase opacity-60">Generate professional visual segments for your interviews automatically from your neural career data.</p>
                                    <div className="flex -space-x-10 mt-12 px-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-28 w-44 rounded-2xl bg-black border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] transform translate-y-0 group-hover:-translate-y-8 transition-all duration-1000 relative overflow-hidden group/card" style={{ transitionDelay: `${i * 150}ms` }}>
                                                <div className="absolute top-3 left-3 right-3 h-1 bg-white/10 rounded-full" />
                                                <div className="absolute top-7 left-3 h-1 w-16 bg-white/5 rounded-full" />
                                                <div className="absolute top-11 left-3 h-1 w-24 bg-white/5 rounded-full" />
                                                <div className="absolute bottom-3 right-3 h-6 w-6 rounded-lg bg-white/5 flex items-center justify-center group-hover/card:bg-white/10 transition-colors">
                                                    <Sparkles className="h-3 w-3 text-white" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-3 md:row-span-1 group relative rounded-[4rem] bg-black border border-white/5 overflow-hidden shadow-2xl transition-all duration-700 hover:border-white/10">
                                <div className="absolute inset-0 bg-gradient-to-bl from-white/5 via-transparent to-transparent opacity-30" />
                                <div className="p-12 flex flex-col h-full bg-gradient-to-t from-black/80 to-transparent relative z-10">
                                    <div className="flex justify-between items-start mb-12">
                                        <div>
                                            <h3 className="text-3xl font-black italic tracking-tighter text-white mb-2 lowercase">live signals</h3>
                                            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] italic opacity-60">Track recruiter interaction patterns.</p>
                                        </div>
                                        <div className="text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-all group-hover:scale-110 duration-700">12.4k</div>
                                    </div>
                                    <div className="h-32 flex items-end gap-1.5 group-hover:gap-2 transition-all duration-700">
                                        {[40, 70, 45, 90, 65, 100, 80, 50, 75, 60, 85, 45, 95, 55, 80, 40, 60, 30].map((h, i) => (
                                            <div key={i} className="flex-1 bg-white/[0.03] rounded-t-lg group-hover:bg-white/20 transition-all duration-1000 relative" style={{ height: `${h}%` }}>
                                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>


                {/* 4. TESTIMONIALS */}
                <TestimonialsSection
                    title="Neural feedback"
                    description="Novatypalcv is architecting remarkable candidate nodes with high-performance success data."
                    testimonials={testimonials}
                />

                <PricingPremium />

            </main>

            <Footer />
        </div>
    )
}
