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
                    <div className="flex flex-col border border-white/5 rounded-[3rem] bg-[#0a0a0a] overflow-hidden group hover:border-white/10 transition-all">
                        <div className="p-14 pb-8 space-y-5 text-center">
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600">Starter Foundation</p>
                            <div className="flex items-center justify-center">
                                <span className="text-7xl font-black text-white tracking-tighter">FREE</span>
                            </div>
                        </div>

                        <div className="px-14 py-10 flex-1">
                            <div className="h-px w-full bg-white/5 mb-10" />
                            <ul className="space-y-6">
                                <PlanFeature text="1 Professional Resume" />
                                <PlanFeature text="Basic PDF Download" />
                                <PlanFeature text="Manual Resume Editor" />
                                <PlanFeature text="Standard Processing" />
                                <PlanFeature text="AI Assistant" included={false} />
                                <PlanFeature text="Priority Support" included={false} />
                            </ul>
                        </div>

                        <div className="p-10 pt-0">
                            <Button
                                variant="outline"
                                className="w-full h-16 rounded-2xl bg-white/5 border-white/5 hover:bg-white/10 text-white font-bold transition-all text-base"
                                asChild
                            >
                                <Link href="/dashboard">Current Active Plan</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="flex flex-col border border-emerald-500/20 rounded-[3rem] bg-[#0a0a0a] overflow-hidden relative group shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                        <div className="absolute top-0 right-0 p-6 z-20">
                            <div className="bg-emerald-500 text-black text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                                Best Value
                            </div>
                        </div>

                        <div className="p-14 pb-8 space-y-5 text-center relative z-10">
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center justify-center gap-2">
                                <Sparkles className="h-3.5 w-3.5" /> Professional Elite
                            </p>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-7xl font-black text-white tracking-tighter">$99</span>
                                <span className="text-zinc-600 font-black uppercase tracking-widest text-[11px]">/ mo</span>
                            </div>
                        </div>

                        <div className="px-14 py-10 flex-1 relative z-10">
                            <div className="h-px w-full bg-white/5 mb-10" />
                            <ul className="space-y-6">
                                <PlanFeature text="Unlimited Smart Resumes" />
                                <PlanFeature text="AI Resume Optimizer" />
                                <PlanFeature text="AI Cover Letter Generator" />
                                <PlanFeature text="Premium PDF Downloads" />
                                <PlanFeature text="Permanent Public Links" />
                                <PlanFeature text="Priority 24/7 Support" />
                            </ul>
                        </div>

                        <div className="p-10 pt-0 relative z-10">
                            <Button
                                onClick={handleUpgrade}
                                disabled={isLoading}
                                className="w-full h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all text-base active:scale-[0.98]"
                            >
                                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Upgrade to Pro'}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl w-full border-t border-white/5 pt-20">
                    <div className="space-y-4">
                        <div className="h-10 w-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                            <Shield className="h-5 w-5 text-emerald-500" />
                        </div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Secure Payments</h3>
                        <p className="text-zinc-500 text-[13px] leading-relaxed font-medium">Processing via Stripe ensures your data and payment information are encrypted and protected.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="h-10 w-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                            <Zap className="h-5 w-5 text-emerald-500" />
                        </div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Instant Activation</h3>
                        <p className="text-zinc-500 text-[13px] leading-relaxed font-medium">Upgrade now and get immediate access to all premium filters, templates, and AI features.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="h-10 w-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                            <Globe className="h-5 w-5 text-emerald-500" />
                        </div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Public Branding</h3>
                        <p className="text-zinc-500 text-[13px] leading-relaxed font-medium">Publish your CV to a custom domain or a permanent public link that never expires.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
