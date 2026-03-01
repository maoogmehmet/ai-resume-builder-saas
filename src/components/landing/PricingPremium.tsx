"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Plan {
    name: string;
    price: string;
    yearlyPrice: string;
    period: string;
    description: string;
    buttonText: string;
    href: string;
    features: string[];
    isPopular?: boolean;
}

interface PricingSectionProps {
    plans: Plan[];
    title?: string;
    description?: string;
}

export function PricingPremium({
    plans,
    title = "Professional Plans",
    description = "Invest in your future. ROI is one interview away.",
}: PricingSectionProps) {
    const [isMonthly, setIsMonthly] = useState(true);

    return (
        <section className="py-24 md:py-32 bg-black overflow-hidden relative" id="pricing">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="mx-auto max-w-5xl px-6 sm:px-8 relative z-10">
                <div className="flex flex-col items-center gap-6 text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-7xl font-black tracking-tighter text-white italic"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-zinc-500 font-medium max-w-2xl"
                    >
                        {description}
                    </motion.p>

                    {/* Pricing Toggle */}
                    <div className="flex items-center gap-4 mt-4 bg-white/[0.03] border border-white/5 p-1.5 rounded-2xl backdrop-blur-xl">
                        <button
                            onClick={() => setIsMonthly(true)}
                            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isMonthly ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-white"
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsMonthly(false)}
                            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${!isMonthly ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-white"
                                }`}
                        >
                            Annual
                            <span className="absolute -top-3 -right-3 bg-emerald-500 text-black text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                                -20%
                            </span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {plans.map((plan, index) => (
                        <PricingCard
                            key={plan.name}
                            plan={plan}
                            isMonthly={isMonthly}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function PricingCard({ plan, isMonthly, index }: { plan: Plan; isMonthly: boolean; index: number }) {
    const displayPrice = plan.price === "FREE" ? "FREE" : (isMonthly ? plan.price : plan.yearlyPrice);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className={`flex flex-col rounded-[3rem] border p-12 text-left relative transition-all duration-500 h-full ${plan.isPopular
                    ? "bg-[#0a0a0a] border-emerald-500/30 shadow-[0_40px_100px_rgba(16,185,129,0.08)] ring-1 ring-emerald-500/10"
                    : "bg-black border-white/5 hover:border-white/10"
                }`}
        >
            {plan.isPopular && (
                <div className="absolute top-0 right-12 -translate-y-1/2">
                    <Badge className="bg-emerald-500 text-black font-black uppercase tracking-widest px-4 py-1.5 rounded-full border-none shadow-xl">
                        Most Popular
                    </Badge>
                </div>
            )}

            <div>
                <div className="flex items-center justify-between mb-10">
                    <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${plan.isPopular ? "text-emerald-500" : "text-zinc-600"
                        }`}>
                        {plan.name}
                    </span>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                    <h4 className="text-7xl font-black text-white tracking-tighter italic">
                        {displayPrice === "FREE" ? "" : "$"}
                        {displayPrice}
                    </h4>
                    {displayPrice !== "FREE" && (
                        <span className="text-zinc-600 font-bold uppercase tracking-widest text-xs">/ {plan.period}</span>
                    )}
                </div>
                <p className="text-sm font-bold text-zinc-500 leading-relaxed mb-10 min-h-[40px]">
                    {plan.description}
                </p>
            </div>

            <div className={`h-px w-full mb-10 ${plan.isPopular ? "bg-emerald-500/10" : "bg-white/5"}`} />

            <ul className="space-y-6 mb-16 flex-1">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start text-sm font-bold group">
                        <div className={`mr-4 mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${plan.isPopular ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-zinc-700"
                            }`}>
                            <CircleCheck className="h-3 w-3" />
                        </div>
                        <span className={plan.isPopular ? "text-zinc-300" : "text-zinc-500"}>{feature}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-auto">
                <Button
                    asChild
                    size="lg"
                    className={`w-full h-16 rounded-2xl text-base font-black transition-all active:scale-[0.98] ${plan.isPopular
                            ? "bg-white text-black hover:bg-zinc-200 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
                            : "bg-white/5 border-white/5 text-white hover:bg-white/10"
                        }`}
                >
                    <Link href={plan.href}>{plan.buttonText}</Link>
                </Button>
            </div>
        </motion.div>
    );
}
