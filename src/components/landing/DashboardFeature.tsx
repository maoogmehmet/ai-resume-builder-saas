'use client';

import { Cpu, Lock, Sparkles, Zap, Shield, Globe, Terminal } from 'lucide-react'
import { motion } from 'framer-motion'

export function DashboardFeature() {
    return (
        <section className="py-48 md:py-64 bg-black overflow-hidden relative border-y border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.01)_0,transparent_70%)] pointer-events-none" />
            <div className="mx-auto max-w-6xl space-y-32 px-6 relative z-10">
                <div className="relative z-10 grid items-center gap-12 md:grid-cols-2 md:gap-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-9xl font-black italic tracking-tighter text-white leading-[0.85] lowercase"
                    >
                        the career <br /> <span className="text-zinc-700 font-normal">ecosystem</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-md sm:ml-auto text-zinc-600 text-xl font-black italic lowercase tracking-tight opacity-60 leading-tight"
                    >
                        Experience a unified neural command center for your professional identity. From adaptive career synthesis to real-time integration with global professional infrastructure.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative rounded-[4rem] p-6 border border-white/5 bg-white/[0.01] backdrop-blur-3xl overflow-hidden group shadow-[0_100px_200px_rgba(0,0,0,0.8)]"
                >
                    <div className="aspect-[21/9] relative">
                        {/* Gradient overlay for depth */}
                        <div className="bg-gradient-to-t from-black via-transparent to-transparent absolute inset-0 z-[11] opacity-80" />

                        {/* Mockup Image - Using a stylized professional dashboard visual */}
                        <img
                            src="/professional_dashboard_mockup.png"
                            className="absolute inset-0 z-10 w-full h-full object-cover rounded-[3rem] opacity-90 group-hover:scale-[1.05] transition-transform duration-[2000ms]"
                            alt="Dashboard Ecosystem Visualization"
                        />

                        {/* Decorative UI elements overlay */}
                        <div className="absolute inset-0 z-[12] pointer-events-none p-12">
                            <div className="absolute top-12 left-12 p-6 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-2xl shadow-3xl group-hover:translate-x-4 transition-transform duration-1000">
                                <div className="h-2 w-24 bg-white/20 rounded-full mb-3" />
                                <div className="h-1.5 w-16 bg-white/10 rounded-full" />
                            </div>
                            <div className="absolute bottom-12 right-12 p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-3xl group-hover:-translate-x-4 transition-transform duration-1000">
                                <div className="h-2 w-32 bg-white/30 rounded-full mb-4" />
                                <div className="h-2 w-20 bg-white/10 rounded-full" />
                                <Sparkles className="absolute -top-3 -right-3 h-8 w-8 text-white opacity-20" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="relative mx-auto grid grid-cols-2 gap-x-8 gap-y-16 sm:gap-20 lg:grid-cols-4 pt-16">
                    <FeatureItem
                        icon={<Zap className="size-5 text-white opacity-40" />}
                        title="Neural Sync"
                        description="Synchronize your professional identity from elite nodes in milliseconds."
                    />
                    <FeatureItem
                        icon={<Terminal className="size-5 text-white opacity-40" />}
                        title="Core Synthesis"
                        description="Proprietary AI engines architect millions of high-impact professional metrics."
                    />
                    <FeatureItem
                        icon={<Shield className="size-5 text-white opacity-40" />}
                        title="Quantum Security"
                        description="Your career assets are protected with next-generation neural encryption."
                    />
                    <FeatureItem
                        icon={<Globe className="size-5 text-white opacity-40" />}
                        title="Global Access"
                        description="Deploy your professional presence across the entire digital landscape instantly."
                    />
                </div>
            </div>
        </section>
    )
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 group/item"
        >
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl group-hover/item:bg-white/5 transition-colors duration-500">
                    {icon}
                </div>
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic leading-none">{title}</h3>
            </div>
            <p className="text-zinc-600 text-[13px] font-black italic lowercase leading-snug opacity-60 group-hover/item:opacity-80 transition-opacity">{description}</p>
        </motion.div>
    )
}
