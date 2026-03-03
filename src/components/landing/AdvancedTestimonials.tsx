'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion } from 'framer-motion'

export function AdvancedTestimonials() {
    return (
        <section className="py-24 md:py-32 bg-black border-t border-white/5">
            <div className="mx-auto max-w-6xl space-y-16 px-6">
                <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px]"
                    >
                        Success Stories
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-white text-4xl md:text-6xl font-medium tracking-tight"
                    >
                        Built for results, <br /> <span className="text-zinc-500">trusted by elite talent</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-500 text-lg leading-relaxed"
                    >
                        Our users have secured offers at the world's most innovative companies. From Silicon Valley startups to Fortune 500 giants.
                    </motion.p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="sm:col-span-2 md:row-span-2"
                    >
                        <Card className="h-full bg-zinc-900/10 border-white/5 backdrop-blur-3xl p-8 hover:border-white/10 transition-colors">
                            <CardHeader className="p-0 mb-8">
                                <img
                                    className="h-8 w-fit dark:invert opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
                                    src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                    alt="Nvidia Wordmark"
                                />
                            </CardHeader>
                            <CardContent className="p-0">
                                <blockquote className="space-y-8">
                                    <p className="text-2xl font-medium text-white leading-snug tracking-tight">"The AI engine transformed my disjointed experience into a cohesive narrative that resonated with senior leadership at Nvidia. I went from 'ignored' to 'hired' in 3 weeks. It's truly a game-changer."</p>

                                    <div className="flex items-center gap-4">
                                        <Avatar className="size-14 border border-white/10 shadow-2xl">
                                            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop" />
                                            <AvatarFallback className="bg-white/5">JD</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <cite className="text-base font-bold text-white not-italic tracking-wide">James D. Sullivan</cite>
                                            <span className="text-zinc-500 block text-sm font-medium">Principal Machine Learning Engineer</span>
                                        </div>
                                    </div>
                                </blockquote>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="sm:col-span-2"
                    >
                        <Card className="bg-zinc-900/10 border-white/5 backdrop-blur-3xl p-8 hover:border-white/10 transition-colors">
                            <CardContent className="p-0">
                                <blockquote className="space-y-6">
                                    <p className="text-lg font-medium text-zinc-300 italic leading-relaxed">"The ATS-match technology is extraordinary. I could see exactly how my profile stacked up against requirements and optimized it instantly."</p>

                                    <div className="flex items-center gap-3">
                                        <Avatar className="size-10 border border-white/10 shadow-xl">
                                            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop" />
                                            <AvatarFallback className="bg-white/5">SL</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <cite className="text-sm font-bold text-white not-italic">Sarah L. Jenkins</cite>
                                            <span className="text-zinc-500 block text-xs font-medium uppercase tracking-widest pt-0.5">Senior Product Designer</span>
                                        </div>
                                    </div>
                                </blockquote>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="bg-zinc-900/10 border-white/5 backdrop-blur-3xl p-6 hover:border-white/10 transition-colors h-full">
                            <CardContent className="p-0">
                                <blockquote className="space-y-4">
                                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">"One core, infinite possibilities. My career found its command center."</p>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="size-8">
                                            <AvatarFallback className="bg-emerald-500/20 text-emerald-500 text-[10px] font-black">MK</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <cite className="text-xs font-bold text-white truncate block">Marco K.</cite>
                                            <span className="text-zinc-600 block text-[10px] uppercase truncate">DevOps</span>
                                        </div>
                                    </div>
                                </blockquote>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="bg-zinc-900/10 border-white/5 backdrop-blur-3xl p-6 border-blue-500/20 hover:border-blue-500/40 transition-colors h-full">
                            <CardContent className="p-0">
                                <blockquote className="space-y-4">
                                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">"The Claude integration for professional writing is simply unbeatable."</p>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="size-8">
                                            <AvatarFallback className="bg-orange-500/20 text-orange-500 text-[10px] font-black">EL</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <cite className="text-xs font-bold text-white truncate block">Elena L.</cite>
                                            <span className="text-zinc-600 block text-[10px] uppercase truncate">Writer</span>
                                        </div>
                                    </div>
                                </blockquote>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
