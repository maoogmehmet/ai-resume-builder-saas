'use client'

import React, { useState, useRef } from 'react'
import { TimelineContent } from "@/components/ui/timeline-animation"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"
import AnimatedText from '@/components/ui/animated-text'
import * as PricingCard from "@/components/ui/pricing-card"
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
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
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white p-6 sm:p-12 overflow-x-hidden relative" ref={pricingRef}>
            {/* Background Subtle Gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none opacity-20" />

            <div className="max-w-6xl mx-auto w-full space-y-12 pb-32 relative z-10">

                {/* Header Section */}
                <article className="flex flex-col items-center text-center pb-12 relative z-10 border-b border-white/5">
                    <AnimatedText text="Scale Your Career." className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 italic lowercase" animationType="words" />

                    <TimelineContent
                        as="p"
                        animationNum={0}
                        timelineRef={pricingRef}
                        customVariants={revealVariants}
                        className="text-zinc-500 text-sm md:text-lg font-black uppercase tracking-widest italic max-w-2xl px-4 opacity-70"
                    >
                        Locked filters and AI optimization unlock immediately upon upgrade.
                        Join the elite tier for high-performance job seeking.
                    </TimelineContent>

                    <TimelineContent
                        as="div"
                        animationNum={1}
                        timelineRef={pricingRef}
                        customVariants={revealVariants}
                        className="mt-8"
                    >
                        <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl italic">
                            <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                            Elite Access Activated
                        </div>
                    </TimelineContent>
                </article>

                {/* Grid */}
                <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 lg:gap-12 max-w-5xl mx-auto px-2 relative z-10">
                    {plans.map((plan, index) => (
                        <div key={plan.id} className="flex-1 flex flex-col max-w-[440px] w-full mx-auto md:mx-0">
                            <PricingCard.Card className={cn(
                                "h-full flex flex-col border border-white/[0.08] hover:border-white/[0.15] transition-all duration-700 bg-black/40 backdrop-blur-3xl rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden group",
                                plan.popular && "ring-1 ring-white/20 shadow-[0_60px_120px_rgba(255,255,255,0.05)] bg-gradient-to-t from-black via-zinc-950/40 to-white/5"
                            )}>
                                <PricingCard.Header className="p-8 md:p-10 border-white/[0.05] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Zap className="h-32 w-32 -mr-8 -mt-8" />
                                    </div>

                                    <PricingCard.Plan>
                                        <PricingCard.PlanName className="text-white text-[11px] font-black uppercase tracking-widest italic flex items-center gap-2">
                                            <Zap className={cn("size-4 text-zinc-700", plan.popular && "text-emerald-500")} />
                                            {plan.name}
                                        </PricingCard.PlanName>
                                        {plan.popular && <PricingCard.Badge className="text-[10px] px-3 py-1 font-black bg-white text-black italic">ELITE TIER</PricingCard.Badge>}
                                    </PricingCard.Plan>

                                    <PricingCard.Price className="my-6">
                                        <PricingCard.MainPrice className="text-white text-5xl md:text-7xl font-black italic tracking-tighter">
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
                                        <PricingCard.Period className="text-zinc-600 font-black tracking-[0.2em] uppercase text-[11px] italic ml-2">/Year</PricingCard.Period>
                                    </PricingCard.Price>

                                    <PricingCard.Description className="text-zinc-500 font-bold text-xs leading-relaxed italic opacity-80">
                                        {plan.description}
                                    </PricingCard.Description>
                                </PricingCard.Header>

                                <PricingCard.Body className="p-8 md:p-10 pt-0 flex-1 flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <PricingCard.Separator className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.4em] italic mb-4">Neural Capabilities</PricingCard.Separator>
                                        <PricingCard.List className="space-y-4">
                                            {plan.includes.map((feature, i) => (
                                                <PricingCard.ListItem key={i} className="text-zinc-400 font-bold text-[14px] flex items-center gap-3 italic">
                                                    <CheckCheck className={cn("size-4 shrink-0 transition-all duration-300", plan.popular ? "text-emerald-500" : "text-white/20")} />
                                                    {feature}
                                                </PricingCard.ListItem>
                                            ))}

                                            {!plan.popular && plan.locked?.map((lock, i) => (
                                                <PricingCard.ListItem key={i} className="text-zinc-800 line-through font-bold text-[14px] flex items-center gap-3 italic opacity-40">
                                                    <CheckCheck className="size-4 shrink-0 text-zinc-900" />
                                                    {lock}
                                                </PricingCard.ListItem>
                                            ))}
                                        </PricingCard.List>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-white/[0.05]">
                                        <AnimatedGenerateButton
                                            disabled={isLoading || !plan.popular}
                                            onClick={plan.popular ? handleUpgrade : undefined}
                                            generating={isLoading && plan.popular}
                                            labelIdle={plan.buttonText}
                                            labelActive="Initializing..."
                                            size="lg"
                                            className={cn(
                                                "w-full h-14 font-black italic lowercase text-lg",
                                                !plan.popular && "opacity-40 cursor-not-allowed grayscale"
                                            )}
                                            highlightHueDeg={plan.popular ? 140 : 0}
                                        />
                                    </div>
                                </PricingCard.Body>
                            </PricingCard.Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
