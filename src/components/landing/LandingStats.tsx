'use client';

import { motion } from 'framer-motion'

export function LandingStats() {
    return (
        <section className="bg-black py-48 md:py-64 font-sans overflow-hidden border-t border-white/5 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_0,transparent_70%)] pointer-events-none" />
            <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10">
                <div className="mx-auto max-w-3xl text-center mb-32">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-9xl font-black italic tracking-tighter text-white mb-10 lowercase"
                    >
                        neural <br /> <span className="text-zinc-700 font-normal">performance metrics</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-2xl leading-tight text-zinc-600 font-black italic lowercase tracking-tight max-w-2xl mx-auto opacity-60"
                    >
                        Our backbone architects thousands of successful professional nodes daily. Here is the synthesized impact.
                    </motion.p>
                </div>

                <div className="grid gap-16 sm:grid-cols-3">
                    <StatItem
                        value="500,000+"
                        label="Architected Nodes"
                        delay={0.3}
                    />
                    <StatItem
                        value="98.4%"
                        label="Neural Match Matrix"
                        delay={0.4}
                    />
                    <StatItem
                        value="4.9 / 5"
                        label="Node Satisfaction"
                        delay={0.5}
                    />
                </div>
            </div>
        </section>
    );
}

function StatItem({ value, label, delay }: { value: string, label: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center space-y-6 px-12 group"
        >
            <div className="text-6xl md:text-9xl font-black text-white tracking-tighter italic lowercase group-hover:scale-110 transition-transform duration-700">
                {value}
            </div>
            <div className="h-0.5 w-12 bg-white/5 mb-2 group-hover:w-24 transition-all duration-700" />
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em] italic opacity-40">
                {label}
            </p>
        </motion.div>
    );
}
