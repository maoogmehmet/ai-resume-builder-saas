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
        description: "The essential toolkit for a clean, standout professional resume.",
        price: 0,
        buttonText: "Start for Free",
        link: "/auth/signup",
        popular: false,
        includes: [
            "2 CVs (Refreshed every 14 days)",
            "2 Cover Letters (Refreshed every 14 days)",
            "2 Daily Job Match Searches",
            "Draft Storage",
        ],
        locked: [
            "Unlimited Generative Builds",
            "Clean Export (No Watermark)",
            "Advanced AI Analysis",
            "LinkedIn Growth Integration",
        ]
    },
    {
        id: "pro",
        name: "Pro Elite",
        description: "Full AI intelligence for serious leaders and career climbers.",
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
                delay: i * 0.3,
                duration: 0.5,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            y: -20,
            opacity: 0,
        },
    };

    return (
        <section
            id="pricing"
            className="px-4 py-32 min-h-screen max-w-7xl mx-auto relative bg-black overflow-hidden"
            ref={pricingRef}
        >
            {/* Subtle Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none opacity-30" />

            <article className="flex flex-col items-center text-center pb-20 relative z-10">
                <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter text-white mb-6">
                    <VerticalCutReveal
                        splitBy="words"
                        staggerDuration={0.15}
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
                    className="text-zinc-500 text-base md:text-lg font-medium max-w-2xl"
                >
                    Built for those who refuse to stay in the same place.
                    No monthly renewals. One yearly investment in your future.
                </TimelineContent>

                <TimelineContent
                    as="div"
                    animationNum={1}
                    timelineRef={pricingRef}
                    customVariants={revealVariants}
                    className="mt-8"
                >
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em]">
                        <Sparkles className="h-3 w-3 text-emerald-500" />
                        Vibrant Access
                    </div>
                </TimelineContent>
            </article>

            {/* Grid: Shrink max-w and force grid-cols-2 */}
            <TimelineContent
                as="div"
                animationNum={2}
                timelineRef={pricingRef}
                customVariants={revealVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto relative z-10"
            >
                {plans.map((plan, index) => (
                    <TimelineContent
                        as="div"
                        key={plan.name}
                        animationNum={index + 2}
                        timelineRef={pricingRef}
                        customVariants={revealVariants}
                        className="h-full flex flex-col"
                    >
                        <PricingCard.Card className={cn(
                            "h-full flex flex-col border border-white/[0.08] hover:border-white/[0.15] transition-all duration-500 bg-zinc-950/20 backdrop-blur-3xl",
                            plan.popular && "ring-1 ring-white/20 shadow-[0_20px_60px_rgba(255,255,255,0.05)] bg-gradient-to-t from-black via-zinc-950/40 to-white/5 scale-[1.02]"
                        )}>
                            <PricingCard.Header className="p-6 md:p-8 border-white/[0.05]">
                                <PricingCard.Plan>
                                    <PricingCard.PlanName className="text-white">
                                        <Zap className={cn("size-3.5 text-zinc-500", plan.popular && "text-emerald-500")} />
                                        {plan.name}
                                    </PricingCard.PlanName>
                                    {plan.popular && <PricingCard.Badge className="text-[9px]">Elite Rank</PricingCard.Badge>}
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
                                    <PricingCard.Period className="text-zinc-600 font-bold">/Year</PricingCard.Period>
                                </PricingCard.Price>

                                <PricingCard.Description className="text-zinc-500 font-medium">
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
                                            <PricingCard.ListItem key={i} className="text-zinc-800 line-through opacity-30 font-medium italic text-xs">
                                                <CheckCheck className="size-3.5 shrink-0 mt-0.5 text-zinc-900" />
                                                {lock}
                                            </PricingCard.ListItem>
                                        ))}
                                    </PricingCard.List>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/[0.05]">
                                    <Button
                                        asChild
                                        className={cn(
                                            "w-full h-14 rounded-xl text-sm font-black transition-all active:scale-[0.98] shadow-2xl uppercase tracking-widest",
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
            </TimelineContent>

            {/* Trust Badges - Optimized spacing */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto border-t border-white/[0.08] pt-16 relative z-10">
                {[
                    { icon: Shield, title: "Pure Encryption", desc: "No data leakage. Direct, secure Stripe transactions." },
                    { icon: ZapIcon, title: "Velocity Boost", desc: "Unlock premium AI features and high-fidelity templates instantly." },
                    { icon: Globe, title: "Global Presence", desc: "Your branding is permanent and optimized for the global market." }
                ].map((item, i) => (
                    <div key={i} className="space-y-3 text-center md:text-left">
                        <div className="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:scale-110 transition-transform group mx-auto md:mx-0">
                            <item.icon className="h-5 w-5 text-white group-hover:text-emerald-400 transition-colors" />
                        </div>
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{item.title}</h3>
                        <p className="text-zinc-500 text-[12px] leading-relaxed font-medium">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
