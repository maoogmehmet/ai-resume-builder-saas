'use client'

import { cn } from '@/lib/utils'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Bold, Calendar1, Ellipsis, Italic, Strikethrough, Underline, Sparkles, BrainCircuit } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'

export function SmartEditorFeature() {
    return (
        <section className="bg-black py-48 md:py-64 font-sans overflow-hidden border-y border-white/5 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(255,255,255,0.02)_0,transparent_50%)] pointer-events-none" />
            <div className="mx-auto w-full max-w-6xl px-6 relative z-10">
                <div className="mb-32 text-center sm:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-zinc-700 font-black uppercase tracking-[0.5em] text-[10px] mb-6 italic"
                    >
                        Precision Engineering Node
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-white text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.85] lowercase font-heading"
                    >
                        draft with <br /> <span className="text-zinc-700 font-normal not-italic">neural intelligence</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-white/60 mt-10 text-xl md:text-2xl max-w-3xl leading-tight font-black italic lowercase font-sans"
                    >
                        Our Smart Editor doesn't just format. it synthesizes. Effortlessly refine narrative nodes, restructure your professional history, and align your profile with specific recruitment logic using our real-time neural assistant.
                    </motion.p>
                </div>

                <div className="space-y-24 sm:space-y-0 sm:divide-y divide-white/5">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid sm:grid-cols-5 py-24 gap-12 sm:gap-0 group"
                    >
                        <div className="sm:col-span-2 flex items-center justify-center bg-[#050505] rounded-[3.5rem] border border-white/[0.03] p-16 shadow-[0_0_100px_rgba(0,0,0,1)] group-hover:border-white/10 transition-all duration-700 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                            <CodeIllustration className="w-full relative z-10" />
                        </div>
                        <div className="sm:col-span-3 sm:pl-24 flex flex-col justify-center">
                            <h3 className="text-white text-4xl font-black italic tracking-tighter mb-6 lowercase">content structuring</h3>
                            <p className="text-zinc-600 text-xl leading-snug font-black italic lowercase opacity-60">
                                Automatically categorize your technical skills, volunteer work, and projects into the most impactful sections for neural recruitment filters.
                            </p>
                            <div className="mt-10 flex items-center gap-4 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] italic font-heading">
                                <BrainCircuit className="size-5 text-white opacity-40" /> AI-Driven Taxonomy Protocol
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="grid sm:grid-cols-5 py-24 gap-12 sm:gap-0 group"
                    >
                        <div className="sm:col-span-3 sm:pr-24 flex flex-col justify-center order-2 sm:order-1">
                            <h3 className="text-white text-4xl font-black italic tracking-tighter mb-6 lowercase">smart interview prep</h3>
                            <p className="text-zinc-600 text-xl leading-snug font-black italic lowercase opacity-60">
                                Seamlessly transition from building your resume to landing the role. Schedule mock simulations and prep sessions directly within your neural dashboard.
                            </p>
                            <div className="mt-10 flex items-center gap-4 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] italic font-heading">
                                <Calendar1 className="size-5 text-white opacity-40" /> Integrated Logic Calendar
                            </div>
                        </div>
                        <div className="sm:col-span-2 flex items-center justify-center bg-white/[0.02] rounded-[3rem] border border-white/5 p-12 order-1 sm:order-2 shadow-3xl group-hover:bg-white/[0.03] transition-colors duration-700">
                            <ScheduleIllustration className="pt-12" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

type IllustrationProps = {
    className?: string
    variant?: 'elevated' | 'outlined' | 'mixed'
}

export const ScheduleIllustration = ({ className, variant = 'elevated' }: IllustrationProps) => {
    return (
        <div className={cn('relative', className)}>
            <div
                className={cn('bg-black/90 backdrop-blur-3xl absolute flex -translate-y-[120%] items-center gap-3 rounded-[1.25rem] p-3 animate-in fade-in slide-in-from-bottom-6 duration-1000 z-20', {
                    'shadow-[0_40px_100px_rgba(0,0,0,0.9)] border border-white/[0.05]': variant === 'elevated',
                    'border-white/10 border': variant === 'outlined',
                    'border-white/10 border shadow-2xl': variant === 'mixed',
                })}>
                <AnimatedGenerateButton
                    size="sm"
                    labelIdle="schedule prep"
                    className="h-10 px-6 bg-white text-black font-black italic lowercase border-none hover:bg-zinc-200 transition-transform active:scale-95"
                    icon={<Calendar1 className="h-4 w-4" />}
                />
                <span className="bg-white/10 block h-8 w-px mx-1"></span>
                <ToggleGroup
                    type="multiple"
                    size="sm"
                    className="gap-1.5 *:rounded-lg">
                    <ToggleGroupItem
                        value="bold"
                        className="text-white/20 data-[state=on]:bg-white/10 data-[state=on]:text-white transition-all hover:text-white/40"
                        aria-label="Toggle bold">
                        <Bold className="size-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="italic"
                        className="text-white/20 data-[state=on]:bg-white/10 data-[state=on]:text-white transition-all hover:text-white/40"
                        aria-label="Toggle italic">
                        <Italic className="size-4" />
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
            <div className="flex items-center gap-3">
                <span className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white px-4 py-2 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(16,185,129,0.1)] font-black italic lowercase text-sm">
                    march 15th, 10:00 am
                </span>
                <span className="text-zinc-500 font-black italic lowercase text-lg tracking-tight">
                    is your mock simulation.
                </span>
            </div>
        </div>
    )
}

export const CodeIllustration = ({ className }: { className?: string }) => {
    return (
        <div className={cn('[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]', className)}>
            <ul className="text-zinc-800 mx-auto w-fit font-black italic lowercase text-3xl space-y-4 tracking-tighter">
                {['impact', 'metrics', 'experience', 'education', 'projects'].map((item, index) => (
                    <li
                        key={index}
                        className={cn("transition-all duration-700", index === 2 ? "text-white text-4xl scale-110 relative before:absolute before:-translate-x-[140%] before:text-white before:content-['optimize'] before:font-black before:text-[11px] before:uppercase before:tracking-[0.4em] before:top-5 before:italic" : "opacity-20 blur-[1px] group-hover:opacity-40 group-hover:blur-0")}>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}
