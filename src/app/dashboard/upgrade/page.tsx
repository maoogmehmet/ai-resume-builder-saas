'use client'

import React, { useState, useRef } from 'react'
import { TimelineContent } from "@/components/ui/timeline-animation"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"
import * as PricingCard from "@/components/ui/pricing-card"
import { Button } from '@/components/ui/button'
import { CheckCheck, Sparkles, Loader2, Shield, Zap as ZapIcon, Globe, Zap } from 'lucide-react'
import { toast } from 'sonner'
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
                delay: i * 0.3,
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
            name: "Starter Rank",
            description: "Essential foundations for building your first professional resumes.",
            price: 0,
            buttonText: "Active Rank",
            popular: false,
            includes: [
                "Active foundations:",
                "2 CVs (Refreshes every 14 days)",
                "2 Letters (Refreshes every 14 days)",
                "Watermarked PDF Export",
                "Standard AI suggestions",
            ],
            locked: [
                "Unlimited Resume Building",
                "Clean Export (No Watermarks)",
                "Advanced Growth AI",
            ]
        },
        {
            id: "pro",
            name: "Pro Elite",
            description: "Unlimited power and AI-driven intelligence for serious career growth.",
            price: 99,
            popular: true,
            buttonText: "Upgrade Now",
            includes: [
                "Elite Rank features:",
                "Unlimited Resume Building",
                "No Watermarks (Premium Export)",
                "Advanced AI Optimization",
                "LinkedIn & Profile Analysis",
                "Priority AI Support",
            ],
        },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white p-6 sm:p-12 overflow-x-hidden relative" ref={pricingRef}>
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none opacity-30" />

            <div className="max-w-6xl mx-auto w-full space-y-16 pb-24 relative z-10">

                {/* Header Section (Compact V6) */}
                <article className="flex flex-col items-center text-center pb-12 relative z-10">
                    <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter text-white mb-6">
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
                        className="text-zinc-500 text-base md:text-lg font-medium max-w-2xl px-4"
                    >
                        Locked filters and AI optimization unlock immediately upon upgrade.
                        The professional tools you need, all in one yearly plan.
                    </TimelineContent>

                    <TimelineContent
                        as="div"
                        animationNum={1}
                        timelineRef={pricingRef}
                        customVariants={revealVariants}
                        className="mt-8"
                    >
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                            <Sparkles className="h-3 w-3 text-emerald-500" />
                            Elite Access
                        </div>
                    </TimelineContent>
                </article>

                {/* Grid: Forced Grid-Cols-2 for side-by-side */}
                <TimelineContent
                    as="div"
                    animationNum={2}
                    timelineRef={pricingRef}
                    customVariants={revealVariants}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto relative z-10"
                >
                    {plans.map((plan, index) => (
                        <div key={plan.id} className="h-full">
                            <PricingCard.Card className={cn(
                                "h-full flex flex-col border border-white/[0.08] hover:border-white/[0.15] transition-all duration-500 bg-zinc-950/20 backdrop-blur-3xl rounded-[2.5rem]",
                                plan.popular && "ring-1 ring-white/20 shadow-[0_20px_60px_rgba(255,255,255,0.05)] bg-gradient-to-t from-black via-zinc-950/40 to-white/5 scale-[1.02]"
                            )}>
                                <PricingCard.Header className="p-6 md:p-8 border-white/[0.05] rounded-[2rem]">
                                    <PricingCard.Plan>
                                        <PricingCard.PlanName className="text-white">
                                            <Zap className={cn("size-3.5 text-zinc-500", plan.popular && "text-emerald-500")} />
                                            {plan.name}
                                        </PricingCard.PlanName>
                                        {plan.popular && <PricingCard.Badge className="text-[9px]">Elite Tier</PricingCard.Badge>}
                                    </PricingCard.Plan>

                                    <PricingCard.Price>
                                        <PricingCard.MainPrice className="text-white italic">
                                            $
                                            <NumberFlow
                                                format={{
                                                    currency: "USD",
                                                    currencySign: "standard",
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                    currencyDisplay: "narrowSymbol"
                                                }}
                                                value={plan.price}
                                                className="text-5xl md:text-6xl font-black"
                                            />
                                        </PricingCard.MainPrice>
                                        <PricingCard.Period className="text-zinc-600 font-bold tracking-widest uppercase text-xs">/Year</PricingCard.Period>
                                    </PricingCard.Price>

                                    <PricingCard.Description className="text-zinc-500 font-medium italic text-xs">
                                        {plan.description}
                                    </PricingCard.Description>
                                </PricingCard.Header>

                                <PricingCard.Body className="p-6 md:p-8 pt-0 flex-1 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <PricingCard.Separator className="text-zinc-700 text-[9px]">{plan.includes[0]}</PricingCard.Separator>
                                        <PricingCard.List className="space-y-3">
                                            {plan.includes.slice(1).map((feature, i) => (
                                                <PricingCard.ListItem key={i} className="text-zinc-400 font-bold group/item text-xs">
                                                    <CheckCheck className={cn("size-3.5 shrink-0 mt-0.5 transition-all duration-300", plan.popular ? "text-emerald-500" : "text-white/40")} />
                                                    {feature}
                                                </PricingCard.ListItem>
                                            ))}

                                            {!plan.popular && plan.locked?.map((lock, i) => (
                                                <PricingCard.ListItem key={i} className="text-zinc-800 line-through opacity-30 font-medium text-xs">
                                                    <CheckCheck className="size-3.5 shrink-0 mt-0.5 text-zinc-900" />
                                                    {lock}
                                                </PricingCard.ListItem>
                                            ))}
                                        </PricingCard.List>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/[0.05]">
                                        <Button
                                            disabled={isLoading || !plan.popular}
                                            onClick={plan.popular ? handleUpgrade : undefined}
                                            className={cn(
                                                "w-full h-14 rounded-xl text-sm font-black transition-all active:scale-[0.98] shadow-2xl uppercase tracking-widest",
                                                plan.popular
                                                    ? "bg-white text-black hover:bg-zinc-200 shadow-white/10"
                                                    : "bg-white/5 text-zinc-700 cursor-not-allowed border border-white/5 shadow-none"
                                            )}
                                        >
                                            {isLoading && plan.popular ? <Loader2 className="h-5 w-5 animate-spin" /> : plan.buttonText}
                                        </Button>
                                    </div>
                                </PricingCard.Body>
                            </PricingCard.Card>
                        </div>
                    ))}
                </TimelineContent>

                {/* Footer Section (Consistent V6) */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto border-t border-white/[0.08] pt-16 relative z-10 text-center md:text-left">
                    {[
                        { icon: Shield, title: "Vault Privacy", desc: "Your data is encrypted at rest and in transit. Payments via Stripe." },
                        { icon: ZapIcon, title: "Velocity Boost", desc: "Unlimited AI optimization and premium template access instantly." },
                        { icon: Globe, title: "Universal Brand", desc: "Optimized for the global ATS standards. Built for high performance." }
                    ].map((item, i) => (
                        <div key={i} className="space-y-3">
                            <div className="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:scale-110 transition-transform group shadow-[0_0_20px_rgba(255,255,255,0.05)] mx-auto md:mx-0">
                                <item.icon className="h-5 w-5 text-white group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{item.title}</h3>
                            <p className="text-zinc-500 text-[12px] leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
