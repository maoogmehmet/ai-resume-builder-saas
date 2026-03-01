'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Zap, Shield, Globe, Loader2, CircleCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { motion } from "framer-motion"

export default function UpgradePage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isMonthly, setIsMonthly] = useState(true)

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

    const freeFeatures = [
        "1 Professional Resume",
        "Basic PDF Download",
        "Manual Resume Editor",
        "Standard Processing",
        "Public Share Link (7 Days)",
    ]

    const proFeatures = [
        "Unlimited Smart Resumes",
        "AI Resume Optimizer",
        "AI Cover Letter Generator",
        "Premium PDF Downloads",
        "Permanent Public Links",
        "Priority 24/7 Support",
    ]

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white p-8 pt-12">
            <div className="max-w-6xl mx-auto w-full space-y-12 pb-24">

                {/* Header */}
                <div className="flex flex-col items-center gap-6 text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black tracking-tighter text-white italic"
                    >
                        Upgrade Your Career
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-zinc-500 font-medium max-w-2xl"
                    >
                        Scale with professional tools and AI-powered insights. ROI is one interview away.
                    </motion.p>

                    {/* Pricing Toggle */}
                    <div className="flex items-center gap-4 mt-4 bg-white/[0.03] border border-white/5 p-1.5 rounded-2xl backdrop-blur-xl">
                        <button
                            onClick={() => setIsMonthly(true)}
                            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isMonthly ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-white"
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsMonthly(false)}
                            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${!isMonthly ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-white"
                                }`}
                        >
                            Annual
                            <span className="absolute -top-3 -right-3 bg-emerald-500 text-black text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                                -20%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">

                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col rounded-[3rem] border border-white/5 bg-black p-12 text-left relative group hover:border-white/10 transition-all duration-500"
                    >
                        <div>
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-10 block">Starter Foundation</span>
                            <div className="flex items-baseline gap-2 mb-4">
                                <h4 className="text-7xl font-black text-white tracking-tighter italic text-zinc-400">FREE</h4>
                            </div>
                            <p className="text-sm font-bold text-zinc-500 leading-relaxed mb-10 min-h-[40px]">
                                Perfect for getting started and building your first professional resume.
                            </p>
                        </div>

                        <div className="h-px w-full bg-white/5 mb-10" />

                        <ul className="space-y-6 mb-16 flex-1">
                            {freeFeatures.map((f) => (
                                <li key={f} className="flex items-start text-sm font-bold text-zinc-500 group">
                                    <div className="mr-4 mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 bg-white/5 text-zinc-700 transition-transform group-hover:scale-110">
                                        <CircleCheck className="h-3 w-3" />
                                    </div>
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>

                        <Button
                            variant="ghost"
                            disabled
                            className="w-full h-16 rounded-2xl bg-white/5 border-white/5 text-zinc-500 font-black text-base cursor-not-allowed"
                        >
                            Current Plan
                        </Button>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col rounded-[3rem] border border-emerald-500/30 bg-[#0a0a0a] p-12 text-left relative shadow-[0_40px_100px_rgba(16,185,129,0.08)] ring-1 ring-emerald-500/10 transition-all duration-500"
                    >
                        <div className="absolute top-0 right-12 -translate-y-1/2">
                            <Badge className="bg-emerald-500 text-black font-black uppercase tracking-widest px-4 py-1.5 rounded-full border-none shadow-xl">
                                Professional Elite
                            </Badge>
                        </div>

                        <div>
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-10 block">Most Popular</span>
                            <div className="flex items-baseline gap-2 mb-4">
                                <h4 className="text-7xl font-black text-white tracking-tighter italic">
                                    ${isMonthly ? "99" : "79"}
                                </h4>
                                <span className="text-zinc-600 font-bold uppercase tracking-widest text-xs">/ month</span>
                            </div>
                            <p className="text-sm font-bold text-zinc-500 leading-relaxed mb-10 min-h-[40px]">
                                Full access to AI optimization, unlimited resumes, and permanent public presence.
                            </p>
                        </div>

                        <div className="h-px w-full bg-emerald-500/10 mb-10" />

                        <ul className="space-y-6 mb-16 flex-1">
                            {proFeatures.map((f) => (
                                <li key={f} className="flex items-start text-sm font-bold text-zinc-300 group">
                                    <div className="mr-4 mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 bg-emerald-500/20 text-emerald-500 transition-transform group-hover:scale-110">
                                        <CircleCheck className="h-3 w-3" />
                                    </div>
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>

                        <Button
                            onClick={handleUpgrade}
                            disabled={isLoading}
                            className="w-full h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all text-base active:scale-[0.98]"
                        >
                            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Upgrade to Pro'}
                        </Button>
                    </motion.div>
                </div>

                {/* Features Footer */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto border-t border-white/5 pt-20">
                    {[
                        { icon: Shield, title: "Secure Payments", desc: "Processing via Stripe ensures your payment data is fully encrypted and protected." },
                        { icon: Zap, title: "Instant Access", desc: "Get immediate access to all premium filters, templates, and AI features after upgrade." },
                        { icon: Globe, title: "Public Branding", desc: "Publish your CV to a custom domain or a permanent public link that never expires." }
                    ].map((item, i) => (
                        <div key={i} className="space-y-4">
                            <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform group">
                                <item.icon className="h-6 w-6 text-emerald-500" />
                            </div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">{item.title}</h3>
                            <p className="text-zinc-500 text-[13px] leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
