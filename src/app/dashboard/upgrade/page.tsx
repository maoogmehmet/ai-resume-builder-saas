'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Sparkles, Zap, Shield, Globe, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function UpgradePage() {
    const [isLoading, setIsLoading] = useState(false)

    const handleUpgrade = async () => {
        setIsLoading(true)
        try {
            const resp = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
            const data = await resp.json()
            if (!resp.ok) throw new Error(data.error)

            if (data.url) {
                window.location.href = data.url
            }
        } catch (error: any) {
            toast.error('Checkout Error', { description: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#fafafa] w-full font-sans">
            <div className="max-w-7xl mx-auto w-full p-8 flex flex-col items-center">
                <div className="max-w-4xl w-full text-center space-y-4 mb-16">
                    <Badge variant="outline" className="px-4 py-1 rounded-full border-zinc-200 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                        Premium Access
                    </Badge>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900">
                        Unlock Your Professional <span className="text-zinc-400 italic">Potential.</span>
                    </h1>
                    <p className="text-zinc-500 text-lg sm:text-xl max-w-2xl mx-auto">
                        Join 5,000+ professionals using AI to land interviews at top companies.
                        Start your 7-day free trial today.
                    </p>
                </div>

                <div className="max-w-md w-full">
                    <Card className="relative p-8 sm:p-12 shadow-2xl border-zinc-900 bg-zinc-900 text-white rounded-[3rem] overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 bg-zinc-800 rounded-full blur-3xl opacity-20" />
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 bg-zinc-800 rounded-full blur-3xl opacity-20" />

                        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                            <div>
                                <span className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Annual Plan</span>
                                <div className="flex items-baseline justify-center gap-1 mt-2">
                                    <span className="text-5xl font-black tracking-tighter">$99</span>
                                    <span className="text-zinc-400 font-medium">/ year</span>
                                </div>
                            </div>

                            <div className="w-full h-px bg-zinc-800" />

                            <ul className="w-full space-y-4 text-left">
                                <li className="flex items-center gap-3">
                                    <div className="h-5 w-5 bg-white/10 rounded-full flex items-center justify-center text-green-400">
                                        <Check className="h-3 w-3" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-200">Unlimited AI Resume Generations</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="h-5 w-5 bg-white/10 rounded-full flex items-center justify-center text-green-400">
                                        <Check className="h-3 w-3" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-200">Unlimited PDF Downloads</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="h-5 w-5 bg-white/10 rounded-full flex items-center justify-center text-green-400">
                                        <Check className="h-3 w-3" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-200">Public Live Resume Link (Forever)</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="h-5 w-5 bg-white/10 rounded-full flex items-center justify-center text-green-400">
                                        <Check className="h-3 w-3" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-200">ATS Match Scoring & Optimization</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="h-5 w-5 bg-white/10 rounded-full flex items-center justify-center text-green-400">
                                        <Check className="h-3 w-3" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-200">7-Day Free Trial (Cancel Anytime)</span>
                                </li>
                            </ul>

                            <Button
                                onClick={handleUpgrade}
                                disabled={isLoading}
                                className="w-full h-16 rounded-[2rem] bg-white text-zinc-900 hover:bg-zinc-100 font-black text-lg shadow-xl shadow-white/5 group transition-all"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Start 7-Day Free Trial
                                        <Zap className="ml-2 h-5 w-5 fill-zinc-900 group-hover:scale-110 transition-transform" />
                                    </>
                                )}
                            </Button>

                            <p className="text-[10px] text-zinc-500 font-medium">
                                Secure payment by Stripe. No commitment.
                            </p>
                        </div>
                    </Card>
                </div>

                <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-5xl w-full">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-zinc-900 border border-zinc-100">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-900">Career Security</h3>
                            <p className="text-zinc-500 text-sm mt-1">Stand out in crowded applicant pools with data-backed profiles.</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-zinc-900 border border-zinc-100">
                            <Globe className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-900">Public Presence</h3>
                            <p className="text-zinc-500 text-sm mt-1">Share your live resume with recruiters across the globe instantly.</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-zinc-900 border border-zinc-100">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-900">AI Advantage</h3>
                            <p className="text-zinc-500 text-sm mt-1">Leverage Claude 3.5 Sonnet to craft the perfect professional story.</p>
                        </div>
                    </div>
                </div>

                <footer className="mt-32 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                    AI Resume Builder © 2025 • Premium Suite
                </footer>
            </div>
        </div>
    )
}
