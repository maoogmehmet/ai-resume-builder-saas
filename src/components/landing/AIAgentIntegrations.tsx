'use client'

import { Card } from '@/components/ui/card'
import { ChevronRight, Sparkles, BrainCircuit, Globe, Code, Cpu, Shield, Zap } from 'lucide-react'
import * as React from 'react'
import { motion } from 'framer-motion'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'

export function AIAgentIntegrations() {
    return (
        <section className="bg-black py-48 md:py-64 relative overflow-hidden border-y border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.02)_0,transparent_50%)] pointer-events-none" />
            <div className="mx-auto max-w-6xl px-6 relative z-10">
                <div className="text-center space-y-10 mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-white/[0.02] border border-white/5 text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] italic shadow-3xl backdrop-blur-3xl"
                    >
                        <Sparkles className="size-3 text-white opacity-40" /> Neural Pipeline • Powered by Claude 3.5 Sonnet
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-balance text-6xl md:text-9xl font-black italic tracking-tighter text-white leading-[0.85] lowercase"
                    >
                        sync with your <br /> <span className="text-zinc-700 font-normal">professional ecosystem</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-white/60 mt-10 text-xl md:text-2xl max-w-3xl mx-auto font-black italic lowercase leading-tight font-sans"
                    >
                        Connect seamlessly with elite professional networks and neural reasoning engines to synthesize your career narrative with surgical outcome precision.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-32 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <IntegrationCard
                        title="LinkedIn Network"
                        description="Seamlessly sync your professional history and node insights with a single secure protocol."
                        icon={<LinkedInLogo />}
                    />

                    <IntegrationCard
                        title="Indeed Career"
                        description="Automatically tailor your identity for top-tier listings on the world's largest talent market."
                        icon={<IndeedLogo />}
                    />

                    <IntegrationCard
                        title="Glassdoor Insights"
                        description="Research company culture while optimizing your narrative for specific organizational values."
                        icon={<GlassdoorLogo />}
                    />

                    <IntegrationCard
                        title="Greenhouse Hub"
                        description="Ensure 100% neural compatibility for companies using modern hiring pipelines."
                        icon={<GreenhouseLogo />}
                    />

                    <IntegrationCard
                        title="Lever Ecosystem"
                        description="Optimize your application structure for seamless processing in elite recruitment protocols."
                        icon={<LeverLogo />}
                    />

                    <IntegrationCard
                        title="Google Jobs"
                        description="Boost your visibility on search nodes with structured, SEO-friendly professional assets."
                        icon={<GoogleLogo />}
                    />
                </motion.div>
            </div>
        </section>
    )
}

const IntegrationCard = ({
    title,
    description,
    icon,
    link = '/dashboard/magic-build',
}: {
    title: string
    description: string
    icon: React.ReactNode
    link?: string
}) => {
    return (
        <Card className="p-10 bg-[#050505] border-white/[0.03] group hover:border-white/10 transition-all duration-700 rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col h-full">
                <div className="size-16 rounded-[1.5rem] bg-black border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shadow-3xl">
                    <div className="size-10 flex items-center justify-center">{icon}</div>
                </div>

                <div className="space-y-4 py-10 flex-1">
                    <h3 className="text-2xl font-black text-white italic tracking-tighter lowercase font-heading">{title}</h3>
                    <p className="text-zinc-600 font-black italic text-sm leading-snug lowercase opacity-60 line-clamp-3">{description}</p>
                </div>

                <div className="flex pt-8 border-t border-white/5 mt-auto">
                    <AnimatedGenerateButton
                        href={link}
                        labelIdle={`initiate ${title.split(' ')[0]}`}
                        size="sm"
                        className="bg-transparent border-none text-zinc-500 hover:text-white px-0 h-auto font-black italic lowercase tracking-tight shadow-none flex items-center gap-2"
                        icon={<ChevronRight className="h-4 w-4" />}
                    />
                </div>
            </div>
        </Card>
    )
}

// --- Logos (inline SVG) ---
const LinkedInLogo = () => (
    <svg viewBox="0 0 24 24" fill="#0077B5" xmlns="http://www.w3.org/2000/svg" className="size-8">
        <path d="M4.98 3.5C4.98 4.4665 4.21487 5.25 3.24354 5.25C2.27221 5.25 1.5 4.4665 1.5 3.5C1.5 2.5335 2.27221 1.75 3.24354 1.75C4.21487 1.75 4.98 2.5335 4.98 3.5ZM1.74853 6.9665H4.73855V17.25H1.74853V6.9665ZM6.59006 6.9665H9.45143V8.34925H9.49206C9.89046 7.5855 10.8647 6.7825 12.31 6.7825C15.3184 6.7825 15.8763 8.78325 15.8763 11.366V17.25H12.8877V12.518C12.8877 11.3888 12.8659 10.1585 11.3283 10.1585C9.7681 10.1585 9.5 11.3888 9.5 12.446V17.25H12.8877L6.59006 6.9665Z" transform="scale(1.2)" />
    </svg>
)

const IndeedLogo = () => (
    <svg viewBox="0 0 24 24" fill="#2164f3" xmlns="http://www.w3.org/2000/svg" className="size-8">
        <path d="M2.397 4.574c-.707 0-1.28.572-1.28 1.28v12.292c0 .708.573 1.28 1.28 1.28h19.206c.707 0 1.28-.572 1.28-1.28v-12.292c0-.708-.573-1.28-1.28-1.28h-19.206zM12 15h-3v-3h3v3zm0-4h-3v-3h3v3z" />
    </svg>
)

const GlassdoorLogo = () => (
    <svg viewBox="0 0 24 24" fill="#0caa41" xmlns="http://www.w3.org/2000/svg" className="size-8">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 18c-3.313 0-6-2.687-6-6s2.687-6 6-6 6 2.687 6 6-2.687 6-6 6z" />
    </svg>
)

const GreenhouseLogo = () => (
    <svg viewBox="0 0 24 24" fill="#00b2a9" xmlns="http://www.w3.org/2000/svg" className="size-8">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 15V9h4v8h-4z" />
    </svg>
)

const LeverLogo = () => (
    <svg viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" className="size-8 opacity-40">
        <path d="M4 4h16v2H4V4zm0 6h16v2H4v-2zm0 6h16v2H4v-2z" />
    </svg>
)

const GoogleLogo = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="size-10">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
    </svg>
)
