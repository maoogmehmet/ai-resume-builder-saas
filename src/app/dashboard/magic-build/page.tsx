'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner'
import { CheckCircle2, Sparkles, Loader2, ArrowLeft, BrainCircuit, Rocket, Star } from 'lucide-react'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
import { motion, AnimatePresence } from 'framer-motion'

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
        <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30 relative flex flex-col items-center justify-center">
            {/* Pure black background, no glows for cleaner dashboard look */}

            <main className="relative z-10 w-full max-w-xl mx-auto px-6 py-12">
                <AnimatePresence mode="wait">
                    {!isLoading ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-8"
                        >
                            {/* Hero Header - More Compact */}
                            <div className="text-center space-y-3">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", damping: 15 }}
                                    className="h-16 w-16 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center mx-auto shadow-2xl mb-4 group"
                                >
                                    <Sparkles className="h-8 w-8 text-yellow-400 group-hover:scale-110 transition-transform" />
                                </motion.div>
                                <h1 className="text-4xl font-black tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                                    AI Magic Lab
                                </h1>
                                <p className="text-zinc-500 text-sm font-medium max-w-sm mx-auto">
                                    Our AI engine crafts a high-impact, ATS-optimized resume draft in seconds.
                                </p>
                            </div>

                            {/* Main Form - Reduced Padding and Width */}
                            <form onSubmit={handleMagicBuild} className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-500 space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="role" className="text-zinc-500 font-bold uppercase text-[9px] tracking-[0.2em] ml-1">Target Position *</Label>
                                    <Input
                                        id="role"
                                        placeholder="e.g. Senior Product Manager, Lead Engineer"
                                        className="rounded-xl h-12 border-white/5 bg-black/40 focus:bg-black/60 focus:ring-1 focus:ring-yellow-500/20 transition-all font-medium px-5 text-base placeholder:text-zinc-700"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="skills" className="text-zinc-500 font-bold uppercase text-[9px] tracking-[0.2em] ml-1">Key Expertise</Label>
                                    <Input
                                        id="skills"
                                        placeholder="e.g. React, Leadership, AI, Cloud, Strategy"
                                        className="rounded-xl h-12 border-white/5 bg-black/40 focus:bg-black/60 focus:ring-1 focus:ring-yellow-500/20 transition-all font-medium px-5 text-base placeholder:text-zinc-700"
                                        value={skills}
                                        onChange={(e) => setSkills(e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="desc" className="flex justify-between text-zinc-500 font-bold uppercase text-[9px] tracking-[0.2em] ml-1">
                                        Signature Achievement
                                        <span className="normal-case font-normal tracking-normal opacity-40">{accomplishments.length}/500</span>
                                    </Label>
                                    <Textarea
                                        id="desc"
                                        maxLength={500}
                                        placeholder="Describe your most impactful achievement — include numbers, scale, and results..."
                                        className="rounded-2xl min-h-[120px] border-white/5 bg-black/40 focus:bg-black/60 focus:ring-1 focus:ring-yellow-500/20 transition-all p-5 font-medium resize-none text-base placeholder:text-zinc-700 leading-relaxed"
                                        value={accomplishments}
                                        onChange={(e) => setAccomplishments(e.target.value)}
                                    />
                                </div>

                                <div className="pt-2">
                                    <AnimatedGenerateButton
                                        type="submit"
                                        disabled={!role.trim()}
                                        generating={isLoading}
                                        labelIdle="Ignite AI Build"
                                        labelActive="Igniting..."
                                        highlightHueDeg={45}
                                        size="lg"
                                        className="w-full h-14 shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all"
                                    />
                                </div>

                                <div className="flex items-center justify-center gap-5 pt-2 text-zinc-700">
                                    <div className="flex items-center gap-1.5">
                                        <BrainCircuit className="h-3.5 w-3.5" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">Neural Logic</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Rocket className="h-3.5 w-3.5" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">ATS Optimized</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Star className="h-3.5 w-3.5 text-yellow-500/50" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">Executive Grade</span>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-20 text-center space-y-12"
                        >
                            <div className="relative">
                                <motion.div
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    className="h-32 w-32 bg-yellow-400/10 rounded-[2.5rem] border border-yellow-400/20 flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.1)]"
                                >
                                    <Sparkles className="h-14 w-14 text-yellow-400" />
                                </motion.div>
                                <motion.div
                                    className="absolute -top-2 -right-2 h-8 w-8 bg-blue-500 rounded-full border-4 border-black animate-bounce"
                                />
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-3xl font-black text-white">Synthesizing Your Future</h3>
                                <p className="text-zinc-500 text-lg font-medium">Sit back while we architect your professional narrative</p>
                            </div>

                            <div className="w-full max-w-md space-y-4">
                                {LOADING_STEPS.map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all border ${i === loadingStep ? 'bg-white text-black border-transparent' : i < loadingStep ? 'opacity-40 border-transparent text-zinc-400' : 'opacity-10 border-white/5 text-zinc-600'}`}
                                    >
                                        {i < loadingStep ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                        ) : i === loadingStep ? (
                                            <Loader2 className="h-5 w-5 animate-spin shrink-0" />
                                        ) : (
                                            <div className="h-5 w-5 rounded-full border-2 border-zinc-800 shrink-0" />
                                        )}
                                        <span className="text-sm font-bold tracking-tight text-left flex-1">
                                            {step.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 animate-pulse">
                                Secure Connection Established — Processing via Gemini & Anthropic
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}
