'use client'

import React, { useState, useRef } from 'react'
import { TimelineContent } from "@/components/ui/timeline-animation"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"
import * as PricingCard from "@/components/ui/pricing-card"
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
                delay: i * 0.4,
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
            buttonText: "Active Plan",
            popular: false,
            includes: [
                "Current foundations:",
                "2 CVs per 14 days",
                "2 Letters per 14 days",
                "Watermarked PDF Export",
                "Standard AI Tools",
            ],
            locked: [
                "No Watermarks",
                "Unlimited Resume Building",
                "Advanced Profile AI",
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
                "Premium access:",
                "Unlimited Resume Building",
                "No Watermarks (Premium Export)",
                "Advanced AI Optimization",
                "LinkedIn & Profile Analysis",
                "Priority AI Support",
            ],
        },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white p-6 sm:p-12 overflow-x-hidden" ref={pricingRef}>
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/5 rounded-full blur-[150px] pointer-events-none opacity-50" />

            <div className="max-w-7xl mx-auto w-full space-y-20 pb-24 relative z-10">

                {/* Header Section (V5 Design) */}
                <article className="flex sm:flex-row flex-col sm:pb-20 pb-12 sm:items-center items-start justify-between relative z-10">
                    <div className="text-left mb-6">
                        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white mb-6">
                            <VerticalCutReveal
                                splitBy="words"
                                staggerDuration={0.15}
                                staggerFrom="first"
                                reverse={true}
                                containerClassName="justify-start"
                            >
                                Scale Your Career.
                            </VerticalCutReveal>
                        </h1>

                        <TimelineContent
                            as="p"
                            animationNum={0}
                            timelineRef={pricingRef}
                            customVariants={revealVariants}
                            className="text-zinc-500 text-lg md:text-xl font-medium w-[80%]"
                        >
                            High-fidelity tools. One yearly access.
                            Locked filters and AI optimization unlock instantly upon upgrade.
                        </TimelineContent>
                    </div>

                    <TimelineContent
                        as="div"
                        animationNum={1}
                        timelineRef={pricingRef}
                        customVariants={revealVariants}
                    >
                        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                            <Sparkles className="h-4 w-4 text-emerald-500" />
                            Premium Tier
                        </div>
                    </TimelineContent>
                </article>

                {/* Pricing Grid (V5 Design) */}
                <TimelineContent
                    as="div"
                    animationNum={2}
                    timelineRef={pricingRef}
                    customVariants={revealVariants}
                    className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto relative z-10"
                >
                    {plans.map((plan, index) => (
                        <div key={plan.id} className="h-full">
                            <PricingCard.Card className={cn(
                                "h-full flex flex-col border border-white/[0.08] hover:border-white/[0.15] transition-all duration-500 bg-zinc-950/20 backdrop-blur-3xl rounded-[2.5rem]",
                                plan.popular && "ring-2 ring-white/20 shadow-[0_40px_100px_rgba(255,255,255,0.05)] bg-gradient-to-t from-black via-zinc-950/40 to-white/5"
                            )}>
                                <PricingCard.Header className="p-8 md:p-10 border-white/[0.05] rounded-[2rem]">
                                    <PricingCard.Plan>
                                        <PricingCard.PlanName className="text-white">
                                            <Zap className={cn("size-4 text-zinc-500", plan.popular && "text-emerald-500")} />
                                            {plan.name}
                                        </PricingCard.PlanName>
                                        {plan.popular && <PricingCard.Badge>Elite Member</PricingCard.Badge>}
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
                                                className="text-6xl md:text-7xl font-black"
                                            />
                                        </PricingCard.MainPrice>
                                        <PricingCard.Period className="text-zinc-600 font-bold tracking-widest uppercase text-xs">/Year</PricingCard.Period>
                                    </PricingCard.Price>

                                    <PricingCard.Description className="text-zinc-500 font-medium italic">
                                        {plan.description}
                                    </PricingCard.Description>
                                </PricingCard.Header>

                                <PricingCard.Body className="p-8 md:p-10 pt-0 flex-1 flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <PricingCard.Separator className="text-zinc-700">{plan.includes[0]}</PricingCard.Separator>
                                        <PricingCard.List>
                                            {plan.includes.slice(1).map((feature, i) => (
                                                <PricingCard.ListItem key={i} className="text-zinc-400 font-bold group/item">
                                                    <CheckCheck className={cn("size-4 shrink-0 mt-0.5 transition-all duration-300", plan.popular ? "text-emerald-500" : "text-white/40 group-hover/item:text-white")} />
                                                    {feature}
                                                </PricingCard.ListItem>
                                            ))}

                                            {!plan.popular && plan.locked?.map((lock, i) => (
                                                <PricingCard.ListItem key={i} className="text-zinc-800 line-through opacity-30 font-medium">
                                                    <CheckCheck className="size-4 shrink-0 mt-0.5 text-zinc-900" />
                                                    {lock}
                                                </PricingCard.ListItem>
                                            ))}
                                        </PricingCard.List>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-white/[0.05]">
                                        <Button
                                            disabled={isLoading || !plan.popular}
                                            onClick={plan.popular ? handleUpgrade : undefined}
                                            className={cn(
                                                "w-full h-16 rounded-2xl text-base font-black transition-all active:scale-[0.98] shadow-2xl uppercase tracking-widest",
                                                plan.popular
                                                    ? "bg-white text-black hover:bg-zinc-200 shadow-white/10"
                                                    : "bg-white/5 text-zinc-700 cursor-not-allowed border border-white/5 shadow-none"
                                            )}
                                        >
                                            {isLoading && plan.popular ? <Loader2 className="h-6 w-6 animate-spin" /> : plan.buttonText}
                                        </Button>
                                    </div>
                                </PricingCard.Body>
                            </PricingCard.Card>
                        </div>
                    ))}
                </TimelineContent>

                {/* Footer Trust Section (Consistent V5) */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto border-t border-white/[0.08] pt-20 relative z-10">
                    {[
                        { icon: Shield, title: "Vault Privacy", desc: "Your data is encrypted at rest and in transit. Payments via Stripe." },
                        { icon: Zap, title: "Velocity Boost", desc: "Unlimited AI optimization and premium template access instantly." },
                        { icon: Globe, title: "Universal Brand", desc: "Optimized for the global ATS standards. Built for high performance." }
                    ].map((item, i) => (
                        <div key={i} className="space-y-4">
                            <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform group shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                <item.icon className="h-6 w-6 text-white group-hover:text-emerald-400 transition-colors" />
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
