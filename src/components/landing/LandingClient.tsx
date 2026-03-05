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


            </main>

            <Footer />
        </div>
    )
}
