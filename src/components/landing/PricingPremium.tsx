"use client";

import { TimelineContent } from "@/components/ui/timeline-animation";
import * as PricingCard from "@/components/ui/pricing-card";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { CheckCheck, Sparkles, Zap, Zap as ZapIcon } from "lucide-react";
import { useRef } from "react";
import { motion } from "framer-motion";
import AnimatedGenerateButton from "@/components/ui/animated-generate-button";

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
        name: "Pro",
        description: "Unlimited power and AI-driven intelligence for serious leaders.",
        price: 99,
        popular: true,
        buttonText: "Upgrade to Pro",
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
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1] as any
            },
        }),
        hidden: {
            filter: "blur(8px)",
            y: 20,
            opacity: 0,
        },
    };

    return (
        <section
            id="pricing"
            className="px-6 pt-32 pb-64 min-h-screen max-w-full mx-auto relative bg-black overflow-hidden border-t border-white/5"
            ref={pricingRef}
        >
            {/* Background Subtle Gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

            <article className="flex flex-col items-center text-center pb-24 relative z-10 font-sans">
                <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white mb-6 lowercase">
                    plans & <span className="text-zinc-700 font-normal">investment</span>
                </h2>

                <TimelineContent
                    as="div"
                    animationNum={0}
                    timelineRef={pricingRef}
                    customVariants={revealVariants}
                    className="text-zinc-600 text-xl md:text-2xl font-black italic lowercase tracking-tight max-w-3xl leading-tight opacity-60"
                >
                    Built for those who refuse to stay in the same place. <br className="hidden md:block" />
                    No monthly friction. One annual commitment to your evolution.
                </TimelineContent>

                <TimelineContent
                    as="div"
                    animationNum={1}
                    timelineRef={pricingRef}
                    customVariants={revealVariants}
                    className="mt-12"
                >
                    <div className="flex items-center gap-3 px-8 py-3 rounded-full bg-white/[0.02] border border-white/5 text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] shadow-3xl backdrop-blur-3xl italic">
                        <Sparkles className="h-3 w-3 text-white opacity-40" />
                        Professional Grade Access
                    </div>
                </TimelineContent>
            </article>

            {/* CORE FIX: flex-row with tight max-w to ENSURE side-by-side */}
            <div className="relative z-10 flex flex-col md:flex-row items-stretch justify-center gap-10 max-w-6xl mx-auto px-6">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.name}
                        custom={index + 2}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={revealVariants}
                        className="flex-1 flex flex-col max-w-[450px] w-full mx-auto md:mx-0 group"
                    >
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
                                        href={plan.link}
                                        labelIdle={plan.buttonText}
                                        className={cn(
                                            "w-full h-16 rounded-[1.5rem] font-black italic lowercase shadow-3xl",
                                            !plan.popular && "bg-white/5 border-white/10 text-white"
                                        )}
                                        highlightHueDeg={plan.popular ? 200 : 0}
                                    />
                                </div>
                            </PricingCard.Body>
                        </PricingCard.Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
