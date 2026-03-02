"use client";

import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import * as PricingCard from "@/components/ui/pricing-card";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { CheckCheck, Sparkles, Zap, Shield, Globe } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const plans = [
    {
        id: "starter",
        name: "Starter",
        description: "Essential foundations for building your first professional resumes.",
        price: 0,
        buttonText: "Start for Free",
        link: "/auth/signup",
        popular: false,
        includes: [
            "Basic access:",
            "2 CVs per 14 days",
            "2 Letters per 14 days",
            "Draft Storage",
        ],
        locked: [
            "Unlimited CV Generation",
            "Clean PDF (No Watermark)",
            "Advanced AI Analysis",
            "LinkedIn Analysis",
        ]
    },
    {
        id: "pro",
        name: "Pro Elite",
        description: "Unlimited power and AI-driven intelligence for serious career growth.",
        price: 99,
        popular: true,
        buttonText: "Upgrade Now",
        link: "/dashboard/upgrade",
        includes: [
            "Elite features:",
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
                delay: i * 0.4,
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
            className="px-6 py-40 min-h-screen max-w-7xl mx-auto relative bg-black"
            ref={pricingRef}
        >
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/5 rounded-full blur-[150px] pointer-events-none opacity-50" />

            <article className="flex sm:flex-row flex-col sm:pb-20 pb-12 sm:items-center items-start justify-between relative z-10">
                <div className="text-left mb-6">
                    <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white mb-6">
                        <VerticalCutReveal
                            splitBy="words"
                            staggerDuration={0.15}
                            staggerFrom="first"
                            reverse={true}
                            containerClassName="justify-start"
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
                        className="text-zinc-500 text-lg md:text-xl font-medium w-[80%]"
                    >
                        Vibrant tools. AI insights. Professional branding. ROI is one interview away.
                        No monthly fees. One yearly plan. Total career control.
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
                        Vibrant Choice
                    </div>
                </TimelineContent>
            </article>

            <TimelineContent
                as="div"
                animationNum={2}
                timelineRef={pricingRef}
                customVariants={revealVariants}
                className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto relative z-10"
            >
                {plans.map((plan, index) => (
                    <TimelineContent
                        as="div"
                        key={plan.name}
                        animationNum={index + 3}
                        timelineRef={pricingRef}
                        customVariants={revealVariants}
                        className="h-full flex flex-col"
                    >
                        <PricingCard.Card className={cn(
                            "h-full flex flex-col border border-white/[0.08] hover:border-white/[0.15] transition-all duration-500 bg-zinc-950/20 backdrop-blur-3xl",
                            plan.popular && "ring-2 ring-white/20 shadow-[0_40px_100px_rgba(255,255,255,0.05)] bg-gradient-to-t from-black via-zinc-950/40 to-white/5"
                        )}>
                            <PricingCard.Header className="p-8 md:p-10 border-white/[0.05]">
                                <PricingCard.Plan>
                                    <PricingCard.PlanName className="text-white">
                                        <Zap className={cn("size-4 text-zinc-500", plan.popular && "text-emerald-500")} />
                                        {plan.name}
                                    </PricingCard.PlanName>
                                    {plan.popular && <PricingCard.Badge>Elite Access</PricingCard.Badge>}
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
                                    <PricingCard.Period className="text-zinc-600">/Year</PricingCard.Period>
                                </PricingCard.Price>

                                <PricingCard.Description className="text-zinc-500 font-medium">
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
                                            <PricingCard.ListItem key={i} className="text-zinc-800 line-through opacity-50 font-medium italic">
                                                <CheckCheck className="size-4 shrink-0 mt-0.5 text-zinc-900" />
                                                {lock}
                                            </PricingCard.ListItem>
                                        ))}
                                    </PricingCard.List>
                                </div>

                                <div className="mt-12 pt-8 border-t border-white/[0.05]">
                                    <Button
                                        asChild
                                        className={cn(
                                            "w-full h-16 rounded-2xl text-base font-black transition-all active:scale-[0.98] shadow-2xl uppercase tracking-widest",
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

            {/* Trust Badges V5 */}
            <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto border-t border-white/[0.08] pt-20 relative z-10">
                {[
                    { icon: Shield, title: "Pure Encryption", desc: "No data leakage. Direct, secure Stripe transactions." },
                    { icon: Zap, title: "Vibrant Results", desc: "Unlock premium AI features and high-fidelity templates instantly." },
                    { icon: Globe, title: "Global Presence", desc: "Your branding is permanent and optimized for the global market." }
                ].map((item, i) => (
                    <div key={i} className="space-y-4 text-center md:text-left">
                        <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform group mx-auto md:mx-0 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                            <item.icon className="h-6 w-6 text-white group-hover:text-emerald-400 transition-colors" />
                        </div>
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">{item.title}</h3>
                        <p className="text-zinc-500 text-[13px] leading-relaxed font-medium">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
