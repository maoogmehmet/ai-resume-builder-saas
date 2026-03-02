'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { TimelineContent } from "@/components/ui/timeline-animation"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"
import { Button } from '@/components/ui/button'
import { CheckCheck, Sparkles, Loader2, Shield, Zap, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from "framer-motion"
import NumberFlow from "@number-flow/react"
import { cn } from "@/lib/utils"

export default function UpgradePage() {
    const [isLoading, setIsLoading] = useState(false)
    const pricingRef = useRef<HTMLDivElement>(null)

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

    const revealVariants = {
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                delay: i * 0.2,
                duration: 0.5,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            y: -20,
            opacity: 0,
        },
    }

    const plans = [
        {
            id: "starter",
            name: "Current Plan",
            description: "Essential foundations for building your first professional resumes.",
            price: 0,
            buttonText: "Starter Active",
            buttonVariant: "outline" as const,
            popular: false,
            features: [
                "2 CVs (Resets every 14 days)",
                "2 Cover Letters (Resets every 14 days)",
                "2 Daily Job Searches",
                "PDF Export (Watermarked)",
            ],
            locked: [
                "No Watermark",
                "Advanced AI Optimization",
                "LinkedIn Integration",
            ],
        },
        {
            id: "pro",
            name: "Pro Elite",
            description: "Unlimited power and AI-driven intelligence for serious career growth.",
            price: 99,
            popular: true,
            buttonText: "Upgrade Now",
            buttonVariant: "default" as const,
            features: [
                "Unlimited CVs & Letters",
                "Unlimited Job Searches",
                "No Watermark (Clean PDF)",
                "Advanced AI Optimization",
                "LinkedIn Analysis & Integration",
                "Access to All History",
                "Priority Support",
            ],
        },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white p-6 sm:p-12 overflow-x-hidden" ref={pricingRef}>
            <div className="max-w-6xl mx-auto w-full space-y-20 pb-24 relative">

                {/* Background Glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

                {/* Header Section (uilayout Style) */}
                <article className="flex flex-col items-center justify-center text-center relative z-10">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                        >
                            <Sparkles className="h-3 w-3" />
                            Premium Access
                        </motion.div>

                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white italic mb-6">
                            <VerticalCutReveal
                                splitBy="words"
                                staggerDuration={0.15}
                                staggerFrom="first"
                                reverse={true}
                                containerClassName="justify-center"
                            >
                                Scale Your Career.
                            </VerticalCutReveal>
                        </h1>

                        <TimelineContent
                            as="p"
                            animationNum={0}
                            timelineRef={pricingRef}
                            customVariants={revealVariants}
                            className="text-zinc-500 text-lg md:text-xl font-medium"
                        >
                            Get full access to AI optimization and professional branding.
                            Locked features unlock immediately after upgrade.
                        </TimelineContent>
                    </div>
                </article>

                {/* Pricing Grid (uilayout Style) */}
                <TimelineContent
                    as="div"
                    animationNum={2}
                    timelineRef={pricingRef}
                    customVariants={revealVariants}
                    className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto relative z-10 p-4 sm:p-8 rounded-[3rem] bg-zinc-950/50 border border-white/[0.04] backdrop-blur-sm"
                >
                    {plans.map((plan, index) => (
                        <div key={plan.id} className="h-full">
                            <Card
                                className={cn(
                                    "relative flex-col flex justify-between h-full border-none shadow-none rounded-[2.5rem] transition-all duration-500 overflow-hidden",
                                    plan.popular
                                        ? "bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 shadow-[0_40px_100px_rgba(16,185,129,0.1)]"
                                        : "bg-black/50 border border-white/[0.04] hover:border-white/[0.08]"
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute top-1/2 inset-x-0 mx-auto h-24 -rotate-45 w-full bg-emerald-500/20 rounded-full blur-[6rem] -z-10 opacity-30 pointer-events-none" />
                                )}

                                <CardContent className="p-8 md:p-12 pb-0">
                                    <div className="space-y-4 pb-8">
                                        {plan.popular && (
                                            <div className="mb-4">
                                                <span className="bg-emerald-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                                    Elite Member
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-baseline gap-2">
                                            <span className="text-6xl md:text-8xl font-black italic tracking-tighter text-white">
                                                $
                                                <NumberFlow
                                                    format={{
                                                        currency: "USD",
                                                        currencySign: "standard",
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 0,
                                                        currencyDisplay: "narrowSymbol"
                                                    }}
                                                    value={plan.price === 0 ? 0 : 99}
                                                    className="text-6xl md:text-8xl font-black"
                                                />
                                            </span>
                                            <span className="text-zinc-600 font-bold uppercase tracking-widest text-xs">/ year</span>
                                        </div>

                                        <h3 className="text-3xl font-black italic tracking-tight text-white">{plan.name}</h3>
                                        <p className="text-sm font-medium text-zinc-500 leading-relaxed min-h-[48px]">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <div className="space-y-6 pt-8 border-t border-white/[0.04]">
                                        <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-4">
                                            Plan Details:
                                        </h4>
                                        <ul className="space-y-5">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-center group">
                                                    <span
                                                        className={cn(
                                                            "h-6 w-6 rounded-full flex items-center justify-center shrink-0 mr-4 transition-all duration-300",
                                                            plan.popular
                                                                ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                                                : "bg-white/5 text-emerald-500 border border-white/5"
                                                        )}
                                                    >
                                                        <CheckCheck className="h-3.5 w-3.5" />
                                                    </span>
                                                    <span className={cn(
                                                        "text-sm font-bold transition-colors",
                                                        plan.popular ? "text-zinc-100" : "text-zinc-500"
                                                    )}>
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}

                                            {!plan.popular && plan.locked?.map((lock, i) => (
                                                <li key={i} className="flex items-center opacity-20 grayscale">
                                                    <span className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 mr-4 bg-white/5 text-zinc-800 border border-white/5">
                                                        <CheckCheck className="h-3.5 w-3.5" />
                                                    </span>
                                                    <span className="text-sm font-bold text-zinc-800 line-through">
                                                        {lock}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-8 md:p-12">
                                    <Button
                                        disabled={isLoading || !plan.popular}
                                        onClick={plan.popular ? handleUpgrade : undefined}
                                        className={cn(
                                            "w-full h-16 rounded-[1.25rem] text-base font-black transition-all active:scale-[0.98] shadow-2xl uppercase tracking-widest",
                                            plan.popular
                                                ? "bg-white text-black hover:bg-zinc-200"
                                                : "bg-white/5 text-zinc-700 cursor-not-allowed border border-white/5"
                                        )}
                                    >
                                        {isLoading && plan.popular ? <Loader2 className="h-6 w-6 animate-spin" /> : plan.buttonText}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    ))}
                </TimelineContent>

                {/* Features Footer Section */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto border-t border-white/[0.04] pt-20 relative z-10">
                    {[
                        { icon: Shield, title: "Secure Checkout", desc: "Enterprise-grade encryption via Stripe for all transactions." },
                        { icon: Zap, title: "Instant Power", desc: "Unlock all AI templates and filters immediately upon upgrade." },
                        { icon: Globe, title: "Professional URL", desc: "Share your success with a permanent, professional public presence." }
                    ].map((item, i) => (
                        <div key={i} className="space-y-4">
                            <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform group">
                                <item.icon className="h-6 w-6 text-emerald-500" />
                            </div>
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">{item.title}</h3>
                            <p className="text-zinc-500 text-[13px] leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
