'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Zap, Shield, Globe, Sparkles, Loader2, Minus } from 'lucide-react'
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

    const PlanFeature = ({ text, included = true }: { text: string; included?: boolean }) => (
        <li className="flex items-center gap-3 text-sm font-medium">
            <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${included ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-zinc-700'}`}>
                {included ? <Check className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            </div>
            <span className={included ? 'text-zinc-200' : 'text-zinc-500'}>{text}</span>
        </li>
    )

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white">
            <div className="max-w-7xl mx-auto w-full p-8 px-12 pb-24 flex flex-col items-center">

                <div className="w-full max-w-5xl mt-12 mb-20">
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Upgrade Plan</h1>
                    <p className="text-zinc-500 text-sm">Scale your career with professional tools and AI-powered insights.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">

                    {/* Free Plan */}
                    <div className="flex flex-col border border-white/10 rounded-[2rem] bg-[#0a0a0a] overflow-hidden group">
                        <div className="p-12 pb-6 space-y-4 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Free</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-6xl font-black text-white">$0</span>
                                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">/ mo</span>
                            </div>
                        </div>

                        <div className="px-12 py-8 flex-1">
                            <div className="h-px w-full bg-white/5 mb-8" />
                            <p className="text-zinc-400 text-sm font-bold text-center mb-8 uppercase tracking-widest">3 Resumes / mo</p>
                            <div className="h-px w-full bg-white/5 mb-8" />

                            <ul className="space-y-4">
                                <PlanFeature text="Basic Templates" />
                                <PlanFeature text="Manual Entry" />
                                <PlanFeature text="7-day Data Retention" />
                                <PlanFeature text="1 Public Domain" />
                                <PlanFeature text="Standard Processing" included={false} />
                                <PlanFeature text="AI Assistant" included={false} />
                            </ul>
                        </div>

                        <div className="p-8 pt-0">
                            <Button
                                variant="outline"
                                className="w-full h-12 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold transition-all"
                                asChild
                            >
                                <Link href="/dashboard">Current Plan</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="flex flex-col border border-white/10 rounded-[2rem] bg-[#0a0a0a] overflow-hidden relative group">
                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="p-12 pb-6 space-y-4 text-center relative z-10">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500 flex items-center justify-center gap-2">
                                <Sparkles className="h-3 w-3" /> Pro
                            </p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-6xl font-black text-white">$15</span>
                                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">/ mo</span>
                            </div>
                        </div>

                        <div className="px-12 py-8 flex-1 relative z-10">
                            <div className="h-px w-full bg-white/5 mb-8" />
                            <p className="text-zinc-200 text-sm font-bold text-center mb-4 uppercase tracking-widest">Unlimited Resumes / mo</p>
                            <p className="text-zinc-500 text-[10px] font-bold text-center mb-8 uppercase tracking-[0.2em]">Extra AI: $0.90 / 1,000 tokens</p>
                            <div className="h-px w-full bg-white/5 mb-8" />

                            <ul className="space-y-4">
                                <PlanFeature text="Premium Templates" />
                                <PlanFeature text="AI-Powered Writing" />
                                <PlanFeature text="Permanent Public Links" />
                                <PlanFeature text="ATS Score Analysis" />
                                <PlanFeature text="Custom Domains" />
                                <PlanFeature text="Priority 24/7 Support" />
                            </ul>
                        </div>

                        <div className="p-8 pt-0 relative z-10">
                            <Button
                                onClick={handleUpgrade}
                                disabled={isLoading}
                                className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Get started'}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl w-full border-t border-white/5 pt-16">
                    <div className="space-y-3">
                        <Shield className="h-5 w-5 text-emerald-500" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Secure Payments</h3>
                        <p className="text-zinc-500 text-xs leading-relaxed">Processing via Stripe ensures your data and payment information are encrypted and protected.</p>
                    </div>
                    <div className="space-y-3">
                        <Zap className="h-5 w-5 text-emerald-500" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Instant Activation</h3>
                        <p className="text-zinc-500 text-xs leading-relaxed">Upgrade now and get immediate access to all premium filters, templates, and AI features.</p>
                    </div>
                    <div className="space-y-3">
                        <Globe className="h-5 w-5 text-emerald-500" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Public Branding</h3>
                        <p className="text-zinc-500 text-xs leading-relaxed">Publish your CV to a custom domain or a permanent public link that never expires.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
