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
                <div className="relative z-10 flex flex-col md:flex-row items-stretch justify-center gap-10 max-w-6xl mx-auto px-6">
                    {plans.map((plan, index) => (
                        <div key={plan.id} className="flex-1 flex flex-col max-w-[450px] w-full mx-auto md:mx-0 group">
                            <PricingCard.Card className={cn(
                                "h-full flex flex-col border border-white/5 hover:border-white/10 transition-all duration-700 bg-black/40 backdrop-blur-3xl rounded-[3rem] p-4",
                                plan.popular && "ring-1 ring-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-gradient-to-t from-black via-white/[0.01] to-white/[0.03]"
                            )}>
                                <PricingCard.Header className="p-8 md:p-10 border-white/[0.05] rounded-[2.5rem]">
                                    <PricingCard.Plan>
                                        <PricingCard.PlanName className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px] italic">
                                            <Zap className={cn("size-3.5 text-zinc-800", plan.popular && "text-white opacity-40")} />
                                            {plan.name}
                                        </PricingCard.PlanName>
                                        {plan.popular && <PricingCard.Badge className="text-[9px] px-3 py-1 font-black italic lowercase bg-white/5 text-white border-white/10">strategic choice</PricingCard.Badge>}
                                    </PricingCard.Plan>

                                    <PricingCard.Price className="mb-4">
                                        <PricingCard.MainPrice className="text-white italic text-5xl md:text-7xl font-black lowercase tracking-tighter">
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
                                        <PricingCard.Period className="text-zinc-700 font-black italic text-[12px] lowercase ml-2">/year</PricingCard.Period>
                                    </PricingCard.Price>

                                    <PricingCard.Description className="text-zinc-600 font-black italic text-[13px] leading-snug lowercase opacity-60">
                                        {plan.description}
                                    </PricingCard.Description>

                                    {!plan.popular && (
                                        <p className="mt-6 text-[9px] text-zinc-800 font-black uppercase tracking-[0.3em] italic opacity-40">Restricted Protocol</p>
                                    )}
                                </PricingCard.Header>

                                <PricingCard.Body className="p-8 md:p-10 pt-0 flex-1 flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <PricingCard.Separator className="text-zinc-800 text-[9px] font-black uppercase tracking-[0.4em] italic mb-4">Neural Features</PricingCard.Separator>
                                        <PricingCard.List className="space-y-3.5">
                                            {plan.includes.map((feature, i) => (
                                                <PricingCard.ListItem key={i} className="text-zinc-300 font-black italic text-[14px] lowercase group/item flex items-center gap-3">
                                                    <CheckCheck className={cn("size-4 shrink-0 transition-all duration-300 opacity-20", plan.popular && "text-emerald-500 opacity-60")} />
                                                    {feature}
                                                </PricingCard.ListItem>
                                            ))}

                                            {!plan.popular && plan.locked?.map((lock, i) => (
                                                <PricingCard.ListItem key={i} className="text-zinc-900 line-through font-black italic text-[13px] flex items-center gap-3 opacity-30 lowercase">
                                                    <CheckCheck className="size-4 shrink-0" />
                                                    {lock}
                                                </PricingCard.ListItem>
                                            ))}
                                        </PricingCard.List>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-white/5">
                                        <AnimatedGenerateButton
                                            disabled={isLoading || !plan.popular}
                                            onClick={plan.popular ? handleUpgrade : undefined}
                                            generating={isLoading && plan.popular}
                                            labelIdle={plan.buttonText}
                                            labelActive="Initializing..."
                                            className={cn(
                                                "w-full h-16 rounded-[1.5rem] font-black italic lowercase shadow-3xl",
                                                !plan.popular && "bg-white/5 border-white/10 text-white cursor-not-allowed opacity-40"
                                            )}
                                            highlightHueDeg={plan.popular ? 200 : 0}
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
