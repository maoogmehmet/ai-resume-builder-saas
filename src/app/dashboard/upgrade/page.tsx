'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckIcon, XIcon, Shield, Zap, Globe, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from "framer-motion"
import NumberFlow from "@number-flow/react"
import { cn } from "@/lib/utils"

type Plan = "monthly" | "annually"

export default function UpgradePage() {
    const [isLoading, setIsLoading] = useState(false)
    const [billPlan, setBillPlan] = useState<Plan>("annually")

    const handleSwitch = () => {
        setBillPlan((prev) => (prev === "monthly" ? "annually" : "monthly"));
    };

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
        { text: "2 CVs (Resets every 14 days)", included: true },
        { text: "2 Cover Letters (Resets every 14 days)", included: true },
        { text: "2 Daily Job Searches", included: true },
        { text: "PDF Export (Watermarked)", included: true },
        { text: "No Watermark", included: false },
        { text: "Advanced AI Optimization", included: false },
        { text: "LinkedIn Analysis & Integration", included: false },
    ]

    const proFeatures = [
        { text: "Unlimited CVs & Cover Letters", included: true },
        { text: "Unlimited Job Searches", included: true },
        { text: "No Watermark", included: true },
        { text: "Access to All History (No Locking)", included: true },
        { text: "Advanced AI Optimization", included: true },
        { text: "LinkedIn Analysis & Integration", included: true },
        { text: "PDF & Word Export", included: true },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white p-6 sm:p-12 overflow-x-hidden">
            <div className="max-w-6xl mx-auto w-full space-y-20 pb-24">

                {/* Header Section (Ruixen Style) */}
                <div className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-7xl font-black tracking-tighter text-white italic"
                    >
                        Scale Your Career.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-zinc-500 font-medium mt-6"
                    >
                        Get full access to AI optimization and professional branding.
                    </motion.p>

                    <div className="flex items-center justify-center space-x-4 mt-10">
                        <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", billPlan === 'monthly' ? "text-white" : "text-zinc-600")}>Monthly</span>
                        <button onClick={handleSwitch} className="relative rounded-full focus:outline-none group">
                            <div className="w-12 h-6 transition rounded-full shadow-md outline-none bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-500/40 transition-all"></div>
                            <div
                                className={cn(
                                    "absolute inline-flex items-center justify-center w-4 h-4 transition-all duration-500 ease-in-out top-1 left-1 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
                                    billPlan === "annually" ? "translate-x-6" : "translate-x-0"
                                )}
                            />
                        </button>
                        <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", billPlan === 'annually' ? "text-white" : "text-zinc-600")}>Annually</span>
                    </div>
                </div>

                {/* Pricing Grid (Ruixen Style) */}
                <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto items-stretch">

                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col relative rounded-[2rem] lg:rounded-[3rem] transition-all bg-[#050505] items-start w-full border border-white/[0.04] overflow-hidden group hover:border-white/[0.08]"
                    >
                        <div className="p-8 md:p-12 flex flex-col items-start w-full relative">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-10">
                                Starter Plan
                            </span>
                            <h3 className="mt-3 text-7xl font-black md:text-8xl italic tracking-tighter text-white opacity-20">
                                FREE
                            </h3>
                            <p className="text-sm md:text-base text-zinc-500 font-medium mt-6 leading-relaxed min-h-[48px]">
                                Essential foundations for building your first professional resumes.
                            </p>
                        </div>

                        <div className="flex flex-col items-start w-full px-8 md:px-12 mb-8">
                            <Button
                                variant="ghost"
                                disabled
                                className="w-full h-16 rounded-2xl bg-white/5 border border-white/5 text-zinc-700 font-black text-base cursor-not-allowed uppercase tracking-widest"
                            >
                                Active Plan
                            </Button>
                        </div>

                        <div className="h-px w-full bg-white/[0.04] mb-8" />

                        <div className="flex flex-col items-start w-full p-8 md:p-12 pt-0 gap-y-5 flex-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2">
                                Current Features:
                            </span>
                            {freeFeatures.map((f, i) => (
                                <div key={i} className="flex items-center justify-start gap-4">
                                    <div className={cn(
                                        "h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                                        f.included ? "bg-white/5 text-emerald-500" : "bg-white/5 text-zinc-800"
                                    )}>
                                        {f.included ? <CheckIcon className="size-3" /> : <XIcon className="size-3" />}
                                    </div>
                                    <span className={cn("text-sm font-bold", f.included ? "text-zinc-500" : "text-zinc-800")}>
                                        {f.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col relative rounded-[2rem] lg:rounded-[3rem] transition-all bg-[#050505] items-start w-full border border-emerald-500/20 ring-1 ring-emerald-500/10 shadow-[0_40px_100px_rgba(16,185,129,0.08)] overflow-hidden group hover:border-emerald-500/40"
                    >
                        <div className="absolute top-1/2 inset-x-0 mx-auto h-12 -rotate-45 w-full bg-emerald-600 rounded-full blur-[8rem] -z-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>

                        <div className="p-8 md:p-12 flex flex-col items-start w-full relative">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-10">
                                Pro Elite
                            </span>
                            <h3 className="mt-3 text-7xl font-black md:text-8xl italic tracking-tighter text-white">
                                <NumberFlow
                                    value={billPlan === 'monthly' ? 99 : 99} // Based on user request $99 senelik
                                    suffix={billPlan === 'monthly' ? "/mo" : "/yr"}
                                    format={{
                                        currency: "USD",
                                        style: "currency",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                        currencyDisplay: "narrowSymbol"
                                    }}
                                />
                            </h3>
                            <p className="text-sm md:text-base text-zinc-500 font-medium mt-6 leading-relaxed min-h-[48px]">
                                Unlimited power and AI-driven intelligence for serious career growth.
                            </p>
                        </div>

                        <div className="flex flex-col items-start w-full px-8 md:px-12 mb-8">
                            <Button
                                onClick={handleUpgrade}
                                disabled={isLoading}
                                className="w-full h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all text-base active:scale-[0.98]"
                            >
                                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Upgrade to Pro'}
                            </Button>
                            <div className="h-8 overflow-hidden w-full mx-auto">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={billPlan}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="text-[10px] font-black uppercase tracking-widest text-center text-zinc-700 mt-4 mx-auto block"
                                    >
                                        Billed in one annual payment
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="h-px w-full bg-white/[0.04] mb-8" />

                        <div className="flex flex-col items-start w-full p-8 md:p-12 pt-0 gap-y-5 flex-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2">
                                Premium Features Included:
                            </span>
                            {proFeatures.map((f, i) => (
                                <div key={i} className="flex items-center justify-start gap-4">
                                    <div className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 bg-emerald-500/20 text-emerald-500">
                                        <CheckIcon className="size-3" />
                                    </div>
                                    <span className="text-sm font-bold text-zinc-200">
                                        {f.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Features Footer (Consistent Icons) */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto border-t border-white/[0.04] pt-20">
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
