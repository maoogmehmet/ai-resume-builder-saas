'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MessageCircleQuestion, HelpCircle, BrainCircuit, ShieldCheck, Zap } from 'lucide-react'

export function LandingFAQs() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'How does the neural engine optimize for ATS?',
            answer: 'Our proprietary matrix analyzes evolving recruitment algorithms and identifies high-performance narrative nodes. It then synthesizes your experience against millions of successful professional data points to ensure your presence ranks at the apex of neural tracking systems.',
        },
        {
            id: 'item-2',
            question: 'Can I synchronize my professional identity from LinkedIn?',
            answer: 'Yes. With our Ultra-Sync protocol, you can pull your entire career history in milliseconds. Our neural engine automatically architects this raw data into a high-impact narrative that flows seamlessly across executive-grade templates.',
        },
        {
            id: 'item-3',
            question: 'Is my professional data secured via encryption?',
            answer: 'Absolutely. We utilize enterprise-grade AES-256 neural encryption to protect your professional assets. Your data remains your exclusive property; we never externalize its contents to third parties or utilize it for public model training without explicit authorization.',
        },
        {
            id: 'item-4',
            question: 'Which neural model powers the synthesis process?',
            answer: 'We leverage elite reasoning engines, primarily Anthropic’s Claude 3.5 Sonnet. This ensures that every node of your professional narrative possesses a sophisticated, executive-tier tone that feels architected by a senior human strategist.',
        },
        {
            id: 'item-5',
            question: 'Are the templates optimized for technical or executive roles?',
            answer: 'Our templates are engineered to be adaptive and high-impact. Whether you are architecting backend infrastructure at a tech giant or leading strategic initiatives as an Executive Director, our smart editor adjusts font pairings and layout hierarchies to suit specific industry logic.',
        },
    ]

    return (
        <section className="bg-black py-48 md:py-64 border-t border-white/5 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-white/[0.01] blur-[150px] rounded-full pointer-events-none" />

            <div className="mx-auto max-w-5xl px-6 relative z-10">
                <div className="text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-white/[0.02] border border-white/5 text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] italic shadow-3xl backdrop-blur-3xl mb-12"
                    >
                        <HelpCircle className="size-3 text-white opacity-40" /> Neural Knowledge Base
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-white text-6xl md:text-9xl font-black italic tracking-tighter lowercase leading-[0.85]"
                    >
                        frequently asked <br /> <span className="text-zinc-700 font-normal">logic queries</span>
                    </motion.h2>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-12"
                >
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full space-y-6 border-none">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] px-10 py-4 transition-all duration-700 hover:border-white/10 data-[state=open]:bg-white/[0.03] data-[state=open]:border-white/20 shadow-2xl">
                                <AccordionTrigger className="cursor-pointer text-2xl font-black text-white hover:no-underline py-6 text-left italic lowercase tracking-tight">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="pb-8">
                                    <p className="text-zinc-600 font-black italic lowercase text-lg leading-snug max-w-3xl opacity-60">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="text-zinc-800 font-black italic lowercase mt-20 text-sm text-center tracking-widest opacity-40 uppercase"
                    >
                        still navigating ambiguity? reach our node specialists at{' '}
                        <Link
                            href="mailto:support@airesumebuilder.com"
                            className="text-zinc-600 hover:text-white transition-colors">
                            support@airesumebuilder.com
                        </Link>
                    </motion.p>
                </motion.div>
            </div>
        </section>
    )
}
