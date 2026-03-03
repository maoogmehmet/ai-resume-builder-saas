'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'
import { CheckCircle2, Sparkles, Loader2, BrainCircuit, Rocket, Star, ArrowLeft } from 'lucide-react'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const LOADING_STEPS = [
    { label: 'Analyzing target role requirements...', duration: 4000 },
    { label: 'Crafting your executive summary...', duration: 6000 },
    { label: 'Building experience bullets with impact metrics...', duration: 8000 },
    { label: 'Optimizing for ATS systems...', duration: 5000 },
    { label: 'Polishing and finalizing your resume...', duration: 99999 },
]

export default function MagicBuildPage() {
    const [role, setRole] = useState('')
    const [skills, setSkills] = useState('')
    const [accomplishments, setAccomplishments] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [loadingStep, setLoadingStep] = useState(0)
    const router = useRouter()

    // Animate through loading steps
    useEffect(() => {
        if (!isLoading) {
            setLoadingStep(0)
            return
        }
        let currentStep = 0
        const advance = () => {
            if (currentStep < LOADING_STEPS.length - 1) {
                currentStep++
                setLoadingStep(currentStep)
                setTimeout(advance, LOADING_STEPS[currentStep].duration)
            }
        }
        const timer = setTimeout(advance, LOADING_STEPS[0].duration)
        return () => clearTimeout(timer)
    }, [isLoading])

    const handleMagicBuild = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!role.trim()) {
            toast.error('Please enter a target role')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/resume/magic-build', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, skills, accomplishments }),
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Failed to generate resume')

            toast.success('🎉 AI Resume Ready!', { description: 'Your tailored resume has been created. Opening editor...' })
            router.push(`/editor/${data.resumeId}`)

        } catch (error: any) {
            toast.error('Generation Failed', {
                description: error.message || 'Please try again.',
                duration: 6000,
            })
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/10 relative flex flex-col items-center justify-center p-6">
            {/* Subtle background gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none opacity-20" />

            <div className="absolute top-10 left-10 z-20">
                <Link href="/dashboard/builder">
                    <AnimatedGenerateButton
                        size="icon"
                        className="h-10 w-10 bg-white/5 border-white/10 text-zinc-500 hover:text-white"
                        icon={<ArrowLeft className="h-4 w-4" />}
                    />
                </Link>
            </div>

            <main className="relative z-10 w-full max-w-xl mx-auto py-12">
                <AnimatePresence mode="wait">
                    {!isLoading ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-10"
                        >
                            {/* Hero Header */}
                            <div className="text-center space-y-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", damping: 20, delay: 0.2 }}
                                    className="h-20 w-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl mb-6 group hover:scale-110 transition-transform duration-700"
                                >
                                    <Sparkles className="h-10 w-10 text-yellow-400 group-hover:rotate-12 transition-transform" />
                                </motion.div>
                                <h1 className="text-5xl font-black tracking-tighter italic lowercase bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent">
                                    ai magic lab
                                </h1>
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] max-w-sm mx-auto italic opacity-60">
                                    Architecting high-performance career narratives using advanced neural logic.
                                </p>
                            </div>

                            {/* Main Form */}
                            <form onSubmit={handleMagicBuild} className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl space-y-8 group">
                                <div className="grid gap-3">
                                    <Label htmlFor="role" className="text-zinc-600 font-black uppercase text-[9px] tracking-[0.4em] ml-2 italic">target position *</Label>
                                    <Input
                                        id="role"
                                        placeholder="e.g. Senior Product Manager"
                                        className="rounded-2xl h-14 border-white/5 bg-black/40 focus:bg-white/[0.04] focus:border-white/20 transition-all font-black px-6 text-sm placeholder:text-zinc-800 italic"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="skills" className="text-zinc-600 font-black uppercase text-[9px] tracking-[0.4em] ml-2 italic">key expertise</Label>
                                    <Input
                                        id="skills"
                                        placeholder="e.g. React, Strategy, AI"
                                        className="rounded-2xl h-14 border-white/5 bg-black/40 focus:bg-white/[0.04] focus:border-white/20 transition-all font-black px-6 text-sm placeholder:text-zinc-800 italic"
                                        value={skills}
                                        onChange={(e) => setSkills(e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="desc" className="flex justify-between text-zinc-600 font-black uppercase text-[9px] tracking-[0.4em] ml-2 italic">
                                        signature accomplishment
                                        <span className="opacity-40">{accomplishments.length}/500</span>
                                    </Label>
                                    <Textarea
                                        id="desc"
                                        maxLength={500}
                                        placeholder="Describe your highest impact achievement..."
                                        className="rounded-[1.8rem] min-h-[140px] border-white/5 bg-black/40 focus:bg-white/[0.04] focus:border-white/20 transition-all p-6 font-black text-sm resize-none placeholder:text-zinc-800 leading-relaxed italic"
                                        value={accomplishments}
                                        onChange={(e) => setAccomplishments(e.target.value)}
                                    />
                                </div>

                                <div className="pt-4">
                                    <AnimatedGenerateButton
                                        type="submit"
                                        disabled={!role.trim()}
                                        generating={isLoading}
                                        labelIdle="Initialize Neural Build"
                                        labelActive="Synthesizing..."
                                        highlightHueDeg={45}
                                        size="lg"
                                        className="w-full h-16 font-black italic lowercase text-lg shadow-2xl"
                                    />
                                </div>

                                <div className="flex items-center justify-center gap-6 pt-4 text-zinc-800 border-t border-white/[0.03]">
                                    <div className="flex items-center gap-2 group/icon">
                                        <BrainCircuit className="h-3.5 w-3.5 group-hover/icon:text-zinc-400 transition-colors" />
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] italic">Neural Logic</span>
                                    </div>
                                    <div className="flex items-center gap-2 group/icon">
                                        <Rocket className="h-3.5 w-3.5 group-hover/icon:text-zinc-400 transition-colors" />
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] italic">ATS Optimized</span>
                                    </div>
                                    <div className="flex items-center gap-2 group/icon">
                                        <Star className="h-3.5 w-3.5 group-hover/icon:text-yellow-500 transition-colors" />
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] italic">Executive Tier</span>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-20 text-center space-y-16"
                        >
                            <div className="relative">
                                <motion.div
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                                        scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    className="h-40 w-40 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.05)]"
                                >
                                    <Sparkles className="h-16 w-16 text-yellow-500/80 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                                </motion.div>
                                <motion.div
                                    className="absolute -top-4 -right-4 h-10 w-10 bg-white rounded-full border-8 border-black animate-pulse"
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-4xl font-black text-white italic tracking-tighter lowercase">synthesizing narrative</h3>
                                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] italic opacity-60">Architecting professional nodes and impact metrics.</p>
                            </div>

                            <div className="w-full max-w-sm space-y-3">
                                {LOADING_STEPS.map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-700 border ${i === loadingStep ? 'bg-white text-black border-transparent shadow-2xl scale-105' : i < loadingStep ? 'opacity-30 border-transparent text-zinc-500' : 'opacity-10 border-white/5 text-zinc-700'}`}
                                    >
                                        {i < loadingStep ? (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        ) : i === loadingStep ? (
                                            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                                        ) : (
                                            <div className="h-4 w-4 rounded-full border border-zinc-800 shrink-0" />
                                        )}
                                        <span className="text-[10px] font-black uppercase tracking-widest text-left flex-1 italic">
                                            {step.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-800 animate-pulse italic">
                                neural synthesis in progress — secured tunnel established
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}
