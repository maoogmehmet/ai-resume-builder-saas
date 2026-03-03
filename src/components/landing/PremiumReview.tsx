'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion } from 'framer-motion'

export function PremiumReview() {
    return (
        <section className="py-16 md:py-32 bg-black overflow-hidden font-sans">
            <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center md:space-y-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl sm:text-7xl font-black italic tracking-tighter text-white leading-[1.05]"
                    >
                        Built by makers, <br /> <span className="text-zinc-500">loved by elite talent.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-500 text-lg font-medium leading-relaxed"
                    >
                        The ultimate career engine designed for those who refuse to settle. Empowering the next generation of industry leaders.
                    </motion.p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
                    <Card className="grid grid-rows-[auto_1fr] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2 bg-black border-white/10 rounded-[2rem] hover:border-white/20 transition-all duration-300">
                        <CardHeader className="p-6 pb-0 sm:p-0">
                            <span className="text-white font-black tracking-tighter text-2xl">Maoog Software</span>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 sm:p-0">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-xl font-medium text-white italic">
                                    "Novatypalcv has transformed the way elite professionals development their career narratives. Their extensive collection of AI tools, templates, and analytics has significantly accelerated our workflow. The flexibility to customize every aspect allows us to create unique candidate experiences. Maoog Software sees this as a game-changer for modern recruitment."
                                </p>

                                <div className="grid grid-cols-[auto_1fr] items-center gap-3 border-t border-white/5 pt-6">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
                                            alt="Mehmet Hanifi Özdede"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>MÖ</AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <cite className="text-sm font-medium text-white not-italic">Mehmet Hanifi Özdede</cite>
                                        <span className="text-zinc-500 block text-xs font-black uppercase tracking-widest">CEO, Maoog Software</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2 bg-black border-white/10 rounded-[2rem] hover:border-white/20 transition-all duration-300">
                        <CardContent className="h-full pt-6 p-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-xl font-medium text-zinc-300 italic">
                                    "Novatypalcv is really extraordinary and very practical, no need to break your head. A real gold mine for those aiming for the 1%."
                                </p>

                                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://tailus.io/images/reviews/jonathan.webp"
                                            alt="Jonathan Yombo"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>JY</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-medium text-white not-italic">Jonathan Yombo</cite>
                                        <span className="text-zinc-500 block text-xs font-medium">Software Engineer</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>

                    <Card className="bg-black border-white/10 rounded-[2rem] hover:border-white/20 transition-all duration-300">
                        <CardContent className="h-full pt-6 p-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-zinc-400">Great work on the dashboard. This is one of the best career platforms that I have seen so far!</p>

                                <div className="grid items-center gap-3 [grid-template-columns:auto_1fr]">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://tailus.io/images/reviews/yucel.webp"
                                            alt="Yucel Faruksahan"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>YF</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-xs font-medium text-white not-italic">Yucel Faruksahan</cite>
                                        <span className="text-zinc-600 block text-[10px] font-black uppercase tracking-widest">Creator, Tailkits</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>

                    <Card className="bg-black border-white/10 rounded-[2rem] hover:border-white/20 transition-all duration-300">
                        <CardContent className="h-full pt-6 p-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-zinc-400">The LinkedIn sync is flawless. The most efficient way to build a high-performance profile.</p>

                                <div className="grid grid-cols-[auto_1fr] gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://tailus.io/images/reviews/rodrigo.webp"
                                            alt="Rodrigo Aguilar"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>RA</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-xs font-medium text-white">Rodrigo Aguilar</p>
                                        <span className="text-zinc-600 block text-[10px] font-black uppercase tracking-widest">Creator, TailwindAwesome</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
