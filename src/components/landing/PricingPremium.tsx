"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { CheckCheck, Sparkles, Zap, Shield, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const plans = [
    {
        id: "starter",
        name: "Starter",
        description: "Essential foundations for building your first professional resumes.",
        price: 0,
        yearlyPrice: 0,
        buttonText: "Start for Free",
        buttonVariant: "outline" as const,
        link: "/auth/signup",
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
        yearlyPrice: 99,
        popular: true,
        buttonText: "Upgrade Now",
        buttonVariant: "default" as const,
        link: "/dashboard/upgrade",
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
            className="px-6 py-32 min-h-screen max-w-7xl mx-auto relative bg-black"
            ref={pricingRef}
        >
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

            <article className="flex flex-col items-center justify-center text-center mb-20">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                    >
                        <Sparkles className="h-3 w-3" />
                        Pricing Plans
                    </motion.div>

                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white italic mb-6">
                        <VerticalCutReveal
                            splitBy="words"
                            staggerDuration={0.15}
                            staggerFrom="first"
                            reverse={true}
                            containerClassName="justify-center"
                        >
                            Plans & Pricing
                        </VerticalCutReveal>
                    </h2>

                    <TimelineContent
                        as="p"
                        animationNum={0}
                        timelineRef={pricingRef}
                        customVariants={revealVariants}
                        className="text-zinc-500 text-lg md:text-xl font-medium"
                    >
                        Trusted by professionals worldwide. ROI is one interview away.
                        Choose the plan that fits your ambition.
                    </TimelineContent>
                </div>
            </article>

            <TimelineContent
                as="div"
                animationNum={2}
                timelineRef={pricingRef}
                customVariants={revealVariants}
                className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto p-4 sm:p-8 rounded-[3rem] bg-zinc-950/50 border border-white/[0.04] backdrop-blur-sm"
            >
                {plans.map((plan, index) => (
                    <TimelineContent
                        as="div"
                        key={plan.name}
                        animationNum={index + 3}
                        timelineRef={pricingRef}
                        customVariants={revealVariants}
                        className="h-full"
                    >
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

                            <CardContent className="p-8 md:p-12">
                                <div className="space-y-4 pb-8">
                                    {plan.popular && (
                                        <div className="mb-4">
                                            <span className="bg-emerald-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                                Elite Tier
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
                                                value={99} // Locked to $99 as per request or $0
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
                                        What's Included:
                                    </h4>
                                    <ul className="space-y-4">
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
                                                    plan.popular ? "text-zinc-100" : "text-zinc-400 group-hover:text-zinc-200"
                                                )}>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}

                                        {!plan.popular && plan.locked?.map((lock, i) => (
                                            <li key={i} className="flex items-center opacity-30 grayscale">
                                                <span className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 mr-4 bg-white/5 text-zinc-800 border border-white/5">
                                                    <CheckCheck className="h-3.5 w-3.5" />
                                                </span>
                                                <span className="text-sm font-bold text-zinc-800 line-through decoration-emerald-500/20">
                                                    {lock}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>

                            <CardFooter className="p-8 md:p-12 pt-0">
                                <Button
                                    asChild
                                    className={cn(
                                        "w-full h-16 rounded-[1.25rem] text-base font-black transition-all active:scale-[0.98] shadow-2xl uppercase tracking-widest",
                                        plan.popular
                                            ? "bg-white text-black hover:bg-zinc-200 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
                                            : "bg-white/5 text-white hover:bg-white/10 border border-white/5"
                                    )}
                                >
                                    <a href={plan.link}>{plan.buttonText}</a>
                                </Button>
                            </CardFooter>
                        </Card>
                    </TimelineContent>
                ))}
            </TimelineContent>

            {/* Features Footer Section */}
            <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto border-t border-white/[0.04] pt-20">
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
        </section>
    );
}
