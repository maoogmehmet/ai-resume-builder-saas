"use client";

import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import * as PricingCard from "@/components/ui/pricing-card";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { CheckCheck, Sparkles, Zap, Shield, Zap as ZapIcon, Globe } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const plans = [
    {
        id: "starter",
        name: "Starter Rank",
        description: "The essential foundations for building your first professional resumes.",
        price: 0,
        buttonText: "Start for Free",
        link: "/auth/signup",
        popular: false,
        includes: [
            "2 CVs (Refreshes every 14 days)",
            "2 Letters (Refreshes every 14 days)",
            "2 Daily Job Match Searches",
            "Draft Storage Access",
            "Standard Template Access",
        ],
        locked: [
            "Unlimited Generative Builds",
            "Clean Export (No Watermarks)",
            "Advanced AI Analysis",
            "LinkedIn Growth Integration",
        ]
    },
    {
        id: "pro",
        name: "Pro Elite",
        description: "Unlimited power and AI-driven intelligence for serious leaders.",
        price: 99,
        popular: true,
        buttonText: "Upgrade to Elite",
        link: "/dashboard/upgrade",
        includes: [
            "Unlimited Resume Building",
            "No Watermarks (Premium Export)",
            "Advanced AI Optimization",
            "LinkedIn & Profile Analysis",
            "Custom Public URL",
            "Priority AI Support",
            "Beta Feature Access",
        ],
    },
];

export function PricingPremium() {
    const pricingRef = useRef<HTMLDivElement>(null);

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
    };

    return (
        <section
            id="pricing"
            className="px-4 py-32 min-h-screen max-w-full mx-auto relative bg-black overflow-hidden"
            ref={pricingRef}
        >
            {/* Background Subtle Gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none opacity-20" />

            <article className="flex flex-col items-center text-center pb-16 relative z-10">
                <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-4">
                    <VerticalCutReveal
                        splitBy="words"
                        staggerDuration={0.1}
                        staggerFrom="first"
                        reverse={true}
                        containerClassName="justify-center"
                        transition={{
                            type: "spring",
                            stiffness: 250,
                            damping: 40,
                            delay: 0,
                        }}
                    >
                        Plans & Pricing
                    </VerticalCutReveal>
                </h2>

                <TimelineContent
                    as="p"
                    animationNum={0}
                    timelineRef={pricingRef}
                    customVariants={revealVariants}
                    className="text-zinc-500 text-sm md:text-base font-medium max-w-xl"
                >
                    Built for those who refuse to stay in the same place.
                    No monthly fees. One yearly investment in your future.
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
                        Vibrant Access
                    </div>
                </TimelineContent>
            </article>

            {/* CORE FIX: flex-row with tight max-w to ENSURE side-by-side */}
            <div className="relative z-10 flex flex-col md:flex-row items-stretch justify-center gap-4 lg:gap-6 max-w-5xl mx-auto px-2">
                {plans.map((plan, index) => (
                    <TimelineContent
                        as="div"
                        key={plan.name}
                        animationNum={index + 2}
                        timelineRef={pricingRef}
                        customVariants={revealVariants}
                        className="flex-1 flex flex-col max-w-[420px] w-full mx-auto md:mx-0"
                    >
                        <PricingCard.Card className={cn(
                            "h-full flex flex-col border border-white/[0.08] hover:border-white/[0.15] transition-all duration-500 bg-zinc-950/20 backdrop-blur-3xl rounded-[2rem]",
                            plan.popular && "ring-1 ring-white/20 shadow-[0_20px_60px_rgba(255,255,255,0.05)] bg-gradient-to-t from-black via-zinc-950/40 to-white/5 md:scale-[1.01]"
                        )}>
                            <PricingCard.Header className="p-5 md:p-6 border-white/[0.05] rounded-[1.8rem]">
                                <PricingCard.Plan>
                                    <PricingCard.PlanName className="text-white text-[11px]">
                                        <Zap className={cn("size-3.5 text-zinc-500", plan.popular && "text-emerald-500")} />
                                        {plan.name}
                                    </PricingCard.PlanName>
                                    {plan.popular && <PricingCard.Badge className="text-[8px] px-2 py-0.5">Most Popular</PricingCard.Badge>}
                                </PricingCard.Plan>

                                <PricingCard.Price className="mb-2">
                                    <PricingCard.MainPrice className="text-white italic text-4xl md:text-5xl">
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
                                    <PricingCard.Period className="text-zinc-600 font-bold text-[10px]">/Year</PricingCard.Period>
                                </PricingCard.Price>

                                <PricingCard.Description className="text-zinc-500 font-medium text-[11px] leading-tight">
                                    {plan.description}
                                </PricingCard.Description>

                                {!plan.popular && (
                                    <p className="mt-4 text-[10px] text-zinc-700 font-bold uppercase tracking-widest italic opacity-50">Locked features below</p>
                                )}
                            </PricingCard.Header>

                            <PricingCard.Body className="p-5 md:p-6 pt-0 flex-1 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <PricingCard.Separator className="text-zinc-800 text-[8px] font-black uppercase tracking-[0.2em]">Included Features</PricingCard.Separator>
                                    <PricingCard.List className="space-y-2.5">
                                        {plan.includes.map((feature, i) => (
                                            <PricingCard.ListItem key={i} className="text-zinc-400 font-bold text-[11px] group/item flex items-center gap-2">
                                                <CheckCheck className={cn("size-3.5 shrink-0 transition-all duration-300", plan.popular ? "text-emerald-500" : "text-white/40")} />
                                                {feature}
                                            </PricingCard.ListItem>
                                        ))}

                                        {!plan.popular && plan.locked?.map((lock, i) => (
                                            <PricingCard.ListItem key={i} className="text-zinc-800 line-through opacity-20 font-medium italic text-[11px] flex items-center gap-2">
                                                <CheckCheck className="size-3.5 shrink-0 text-zinc-900" />
                                                {lock}
                                            </PricingCard.ListItem>
                                        ))}
                                    </PricingCard.List>
                                </div>

                                <div className="mt-8 pt-5 border-t border-white/[0.05]">
                                    <Button
                                        asChild
                                        className={cn(
                                            "w-full h-12 rounded-xl text-xs font-black transition-all active:scale-[0.98] shadow-2xl uppercase tracking-widest",
                                            plan.popular
                                                ? "bg-white text-black hover:bg-zinc-200 shadow-white/10"
                                                : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                                        )}
                                    >
                                        <a href={plan.link}>{plan.buttonText}</a>
                                    </Button>
                                </div>
                            </PricingCard.Body>
                        </PricingCard.Card>
                    </TimelineContent>
                ))}
            </div>

            {/* Trust Badges - Smaller & Tighter */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-white/[0.1] pt-12 relative z-10">
                {[
                    { icon: Shield, title: "Pure Encryption", desc: "No data leakage. Direct, secure Stripe transactions." },
                    { icon: ZapIcon, title: "Velocity Boost", desc: "Unlock premium AI features instantly." },
                    { icon: Globe, title: "Global Presence", desc: "Optimized for the global market standards." }
                ].map((item, i) => (
                    <div key={i} className="space-y-2 text-center md:text-left px-4">
                        <div className="h-9 w-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group mx-auto md:mx-0 shadow-md">
                            <item.icon className="h-4 w-4 text-white group-hover:text-emerald-400 transition-colors" />
                        </div>
                        <h3 className="text-[9px] font-black text-white uppercase tracking-[0.2em]">{item.title}</h3>
                        <p className="text-zinc-600 text-[11px] leading-relaxed font-medium">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
