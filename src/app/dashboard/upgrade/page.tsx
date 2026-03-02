'use client'

import React, { useState, useRef } from 'react'
import { TimelineContent } from "@/components/ui/timeline-animation"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"
import AnimatedText from '@/components/ui/animated-text'
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
                delay: i * 0.2,
                duration: 0.4,
            },
        }),
        hidden: {
            filter: "blur(8px)",
            y: -10,
            opacity: 0,
        },
    }

    const plans = [
        {
            id: "starter",
            name: "Starter Rank",
            description: "Essential foundations for building your first professional resumes.",
            price: 0,
            buttonText: "Active Plan",
            popular: false,
            includes: [
                "2 CVs (Refreshes every 14 days)",
                "2 Letters (Refreshes every 14 days)",
                "Watermarked PDF Export",
                "Standard AI suggestions",
                "Draft Storage Access",
            ],
            locked: [
                "Unlimited Resume Building",
                "Clean Export (No Watermarks)",
                "Advanced Growth AI",
                "Priority AI Analysis",
            ]
        },
        {
            id: "pro",
            name: "Pro",
            description: "Unlimited power and AI-driven intelligence for serious career growth.",
            price: 99,
            popular: true,
            buttonText: "Upgrade Now",
            includes: [
                "Unlimited Resume Building",
                "No Watermarks (Premium Export)",
                "Advanced AI Optimization",
                "LinkedIn & Profile Analysis",
                "Priority AI Support",
                "Custom Public URL",
                "Early Access to Features",
            ],
        },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white p-4 sm:p-8 overflow-x-hidden relative" ref={pricingRef}>
            {/* Background Subtle Gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none opacity-20" />

            <div className="max-w-6xl mx-auto w-full space-y-8 pb-24 relative z-10">

                {/* Header Section (Compact V7) */}
                <article className="flex flex-col items-center text-center pb-8 relative z-10">
                    <AnimatedText text="Scale Your Career." className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4" animationType="words" />

                    <TimelineContent
                        as="p"
                        animationNum={0}
                        timelineRef={pricingRef}
                        customVariants={revealVariants}
                        className="text-zinc-500 text-sm md:text-base font-medium max-w-xl px-4"
                    >
                        Locked filters and AI optimization unlock immediately upon upgrade.
                        Join the elite tier for high-performance job seeking.
                    </TimelineContent>

                    <TimelineContent
                        as="div"
                        animationNum={1}
                        timelineRef={pricingRef}
                        customVariants={revealVariants}
                        className="mt-6"
                    >
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[8px] font-black uppercase tracking-[0.2em] shadow-lg">
                            <Sparkles className="h-2.5 w-2.5 text-emerald-500" />
                            Elite Access
                        </div>
                    </TimelineContent>
                </article>

                {/* Grid: Forced flex-row for side-by-side display */}
                <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 lg:gap-6 max-w-5xl mx-auto px-2 relative z-10">
                    {plans.map((plan, index) => (
                        <div key={plan.id} className="flex-1 flex flex-col max-w-[420px] w-full mx-auto md:mx-0">
                            <PricingCard.Card className={cn(
                                "h-full flex flex-col border border-white/[0.08] hover:border-white/[0.15] transition-all duration-500 bg-zinc-950/20 backdrop-blur-3xl rounded-[2rem]",
                                plan.popular && "ring-1 ring-white/20 shadow-[0_20px_60px_rgba(255,255,255,0.05)] bg-gradient-to-t from-black via-zinc-950/40 to-white/5"
                            )}>
                                <PricingCard.Header className="p-5 md:p-6 border-white/[0.05] rounded-[1.8rem]">
                                    <PricingCard.Plan>
                                        <PricingCard.PlanName className="text-white text-[11px]">
                                            <Zap className={cn("size-3.5 text-zinc-500", plan.popular && "text-emerald-500")} />
                                            {plan.name}
                                        </PricingCard.PlanName>
                                        {plan.popular && <PricingCard.Badge className="text-[8px] px-2 py-0.5">MOST POPULAR</PricingCard.Badge>}
                                    </PricingCard.Plan>

                                    <PricingCard.Price className="mb-2">
                                        <PricingCard.MainPrice className="text-white text-4xl md:text-5xl">
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
                                                className="font-black"
                                            />
                                        </PricingCard.MainPrice>
                                        <PricingCard.Period className="text-zinc-600 font-bold tracking-widest uppercase text-[10px]">/Year</PricingCard.Period>
                                    </PricingCard.Price>

                                    <PricingCard.Description className="text-zinc-500 font-medium text-[11px] leading-tight">
                                        {plan.description}
                                    </PricingCard.Description>
                                </PricingCard.Header>

                                <PricingCard.Body className="p-5 md:p-6 pt-0 flex-1 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <PricingCard.Separator className="text-zinc-800 text-[8px] font-black uppercase tracking-[0.2em]">Tier Features</PricingCard.Separator>
                                        <PricingCard.List className="space-y-2.5">
                                            {plan.includes.map((feature, i) => (
                                                <PricingCard.ListItem key={i} className="text-zinc-400 font-bold group/item text-[13px] flex items-center gap-2">
                                                    <CheckCheck className={cn("size-3.5 shrink-0 transition-all duration-300", plan.popular ? "text-emerald-500" : "text-white/40")} />
                                                    {feature}
                                                </PricingCard.ListItem>
                                            ))}

                                            {!plan.popular && plan.locked?.map((lock, i) => (
                                                <PricingCard.ListItem key={i} className="text-zinc-600 line-through font-medium text-[13px] flex items-center gap-2">
                                                    <CheckCheck className="size-3.5 shrink-0 text-zinc-800" />
                                                    {lock}
                                                </PricingCard.ListItem>
                                            ))}
                                        </PricingCard.List>
                                    </div>

                                    <div className="mt-8 pt-5 border-t border-white/[0.05]">
                                        <Button
                                            disabled={isLoading || !plan.popular}
                                            onClick={plan.popular ? handleUpgrade : undefined}
                                            className={cn(
                                                "w-full h-12 rounded-xl text-xs font-black transition-all active:scale-[0.98] shadow-2xl uppercase tracking-widest",
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
                </div>

                {/* Footer Section Removed */}
            </div>
        </div>
    )
}
