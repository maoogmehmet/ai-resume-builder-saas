'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'
import { CheckCircle2, Sparkles, Loader2, BrainCircuit, Rocket, Star, ArrowLeft, ArrowRight, LayoutTemplate, BriefcaseBusiness, AlertTriangle, FileText } from 'lucide-react'
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

type WizardData = {
    role: string;
    seniority: string;
    industry: string;
    skills: string;
    accomplishments: string;
    preset: 'ats' | 'modern' | 'onepage';
}

export default function MagicBuildPage() {
    const router = useRouter()

    const [step, setStep] = useState(1)
    const totalSteps = 4

    const [data, setData] = useState<WizardData>({
        role: '',
        seniority: '',
        industry: '',
        skills: '',
        accomplishments: '',
        preset: 'modern'
    })

    const [isLoading, setIsLoading] = useState(false)
    const [loadingStep, setLoadingStep] = useState(0)
    const [skippingStep, setSkippingStep] = useState(false)

    // Derived progress
    const progressPercent = Math.round(((step - 1) / totalSteps) * 100)

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

    const handleField = useCallback((field: keyof WizardData, value: string) => {
        setData(prev => ({ ...prev, [field]: value }))
    }, [])

    const handleNext = () => {
        if (step === 1 && !data.role.trim()) {
            toast.error('Target position is required.')
            return
        }
        setSkippingStep(false)
        setStep(s => Math.min(s + 1, totalSteps))
    }

    const handleBack = () => {
        setStep(s => Math.max(s - 1, 1))
    }

    const handleSkip = () => {
        setSkippingStep(true)
        toast.warning('Skipping inputs reduces AI generation quality', { icon: '⚠️' })
        setStep(s => Math.min(s + 1, totalSteps))
    }

    const handleGenerate = async () => {
        if (!data.role.trim()) {
            toast.error('Please enter a target role')
            setStep(1)
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/resume/magic-build', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Combine industry/seniority into context for the backend
                body: JSON.stringify({
                    role: data.role,
                    skills: data.skills,
                    accomplishments: `Industry: ${data.industry}, Seniority: ${data.seniority}. Achievements: ${data.accomplishments}`,
                    // Note: Backend might need updates to accept 'preset', passing it anyway
                    preset: data.preset
                }),
            })

            const resData = await response.json()
            if (!response.ok) {
                if (resData.error === 'subscription_required') {
                    toast.error('Premium Required', { description: resData.message || 'Please upgrade to Elite Tier to continue.' })
                    router.push('/#pricing')
                    return
                }
                throw new Error(resData.error || resData.message || 'Failed to generate resume')
            }

            toast.success('🎉 AI Resume Ready!', { description: 'Opening editor...' })
            router.push(`/editor/${resData.resumeId}`)

        } catch (error: any) {
            toast.error('Generation Failed', {
                description: error.message || 'Please try again.',
                duration: 6000,
            })
            setIsLoading(false)
        }
    }

    // Wizard Step Contents
    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black italic tracking-tighter text-white">Target Architecture</h2>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] italic">Define the exact role and level you are aiming for.</p>
                        </div>
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="role" className="text-zinc-400 font-extrabold uppercase text-[10px] tracking-[0.2em] italic">Target Position *</Label>
                                <Input
                                    id="role"
                                    placeholder="e.g. Senior Product Manager"
                                    className="rounded-2xl h-14 border border-white/10 bg-[#0f0f0f] focus:bg-[#151515] focus:border-white/20 transition-all font-bold px-6 text-sm italic text-white shadow-inner"
                                    value={data.role}
                                    onChange={(e) => handleField('role', e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="seniority" className="text-zinc-400 font-extrabold uppercase text-[10px] tracking-[0.2em] italic">Seniority Level</Label>
                                <select
                                    id="seniority"
                                    className="w-full rounded-2xl h-14 border border-white/10 bg-[#0f0f0f] focus:bg-[#151515] focus:border-white/20 outline-none transition-all font-bold px-6 text-sm italic text-white shadow-inner appearance-none cursor-pointer"
                                    value={data.seniority}
                                    onChange={(e) => handleField('seniority', e.target.value)}
                                >
                                    <option value="" disabled className="text-zinc-700">Select Seniority</option>
                                    <option value="Entry-Level">Entry-Level</option>
                                    <option value="Mid-Level">Mid-Level</option>
                                    <option value="Senior">Senior</option>
                                    <option value="Director">Director / VP</option>
                                    <option value="Executive">Executive / C-Suite</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )
            case 2:
                return (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black italic tracking-tighter text-white">Neural Keywords</h2>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] italic">Inject industry context and core technical proficiencies.</p>
                        </div>
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="industry" className="text-zinc-400 font-extrabold uppercase text-[10px] tracking-[0.2em] italic">Target Industry</Label>
                                <Input
                                    id="industry"
                                    placeholder="e.g. FinTech, Healthcare, SaaS"
                                    className="rounded-2xl h-14 border border-white/10 bg-[#0f0f0f] focus:bg-[#151515] focus:border-white/20 transition-all font-bold px-6 text-sm italic text-white shadow-inner"
                                    value={data.industry}
                                    onChange={(e) => handleField('industry', e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="skills" className="text-zinc-400 font-extrabold uppercase text-[10px] tracking-[0.2em] italic">Key Expertise</Label>
                                <Input
                                    id="skills"
                                    placeholder="e.g. React, Strategic Planning, Agile"
                                    className="rounded-2xl h-14 border border-white/10 bg-[#0f0f0f] focus:bg-[#151515] focus:border-white/20 transition-all font-bold px-6 text-sm italic text-white shadow-inner"
                                    value={data.skills}
                                    onChange={(e) => handleField('skills', e.target.value)}
                                />
                            </div>
                        </div>
                    </motion.div>
                )
            case 3:
                return (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black italic tracking-tighter text-white">Signature Impact</h2>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] italic">Quantify your highest performance narratives.</p>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="desc" className="flex justify-between text-zinc-400 font-extrabold uppercase text-[10px] tracking-[0.2em] italic">
                                <span>Core Achievements</span>
                                <span className="text-zinc-600 tracking-wider">{data.accomplishments.length}/500</span>
                            </Label>
                            <Textarea
                                id="desc"
                                maxLength={500}
                                placeholder="Describe a project, metric improved, or major milestone..."
                                className="rounded-[1.5rem] min-h-[160px] border border-white/10 bg-[#0f0f0f] focus:bg-[#151515] focus:border-white/20 transition-all p-6 font-bold text-sm resize-none italic text-white shadow-inner leading-relaxed"
                                value={data.accomplishments}
                                onChange={(e) => handleField('accomplishments', e.target.value)}
                                autoFocus
                            />
                            {/* Guardrail Mock */}
                            {(data.accomplishments.includes('100%') || data.accomplishments.toLowerCase().includes('millions')) && (
                                <div className="flex items-start gap-2 text-yellow-500/80 bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20 mt-2">
                                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                                    <p className="text-[10px] font-bold uppercase tracking-wider italic leading-normal">AI Guardrail: This claim seems highly aggressive. Ensure you can verify it in an interview.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )
            case 4:
                return (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black italic tracking-tighter text-white">Final Synthesis</h2>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] italic">Select layout algorithm.</p>
                        </div>

                        <div className="grid gap-4">
                            {[
                                { id: 'ats', title: 'ATS Standard', desc: 'Max readability for parsing bots.' },
                                { id: 'modern', title: 'Modern Executive', desc: 'Balanced aesthetics and density.' },
                                { id: 'onepage', title: 'One-Page Dense', desc: 'High impact, tightly packed blocks.' },
                            ].map(preset => (
                                <label key={preset.id} className={`flex items-start gap-4 p-5 rounded-[1.5rem] border cursor-pointer transition-all duration-300 ${data.preset === preset.id ? 'bg-[#111111] border-[#eab308]/50 shadow-[0_0_20px_rgba(234,179,8,0.05)]' : 'bg-[#0f0f0f] border-white/5 hover:border-white/10'}`}>
                                    <input
                                        type="radio"
                                        name="preset"
                                        className="sr-only"
                                        value={preset.id}
                                        checked={data.preset === preset.id}
                                        onChange={() => setData({ ...data, preset: preset.id as any })}
                                    />
                                    <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${data.preset === preset.id ? 'border-[#eab308]' : 'border-zinc-700'}`}>
                                        {data.preset === preset.id && <div className="h-2 w-2 rounded-full bg-[#eab308]" />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black italic uppercase tracking-wider text-white">{preset.title}</h4>
                                        <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase italic mt-1">{preset.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </motion.div>
                )
            default:
                return null
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-6 sm:p-12 pb-24">
                <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center space-y-16"
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
                            className="h-32 w-32 bg-black rounded-[2rem] border border-[#eab308]/20 flex items-center justify-center shadow-[0_0_40px_rgba(234,179,8,0.1)] relative z-10"
                        >
                            <Sparkles className="h-12 w-12 text-[#eab308]" />
                        </motion.div>
                        <motion.div
                            className="absolute -top-3 -right-3 h-8 w-8 bg-[#eab308] rounded-full border-4 border-black animate-pulse z-20"
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-3xl font-black text-white italic tracking-tighter lowercase">synthesizing narrative</h3>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] italic leading-relaxed">Architecting professional nodes <br />and impact metrics.</p>
                    </div>

                    <div className="w-full max-w-md space-y-3 relative z-20 bg-black">
                        {LOADING_STEPS.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-700 border ${i === loadingStep ? 'bg-[#111111] text-white border-white/10 shadow-xl scale-[1.02]' : i < loadingStep ? 'opacity-40 border-transparent text-zinc-500' : 'opacity-20 border-white/5 text-zinc-700'}`}
                            >
                                {i < loadingStep ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                ) : i === loadingStep ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-[#eab308] shrink-0" />
                                ) : (
                                    <div className="h-4 w-4 rounded-full border border-zinc-800 shrink-0" />
                                )}
                                <span className="text-[10px] font-black uppercase tracking-widest text-left flex-1 italic">
                                    {step.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-700 animate-pulse italic mt-4">
                        neural synthesis in progress — secured tunnel established
                    </p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#eab308]/30 flex flex-col">

            {/* Top Minimalist Header */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 shrink-0 relative z-20 bg-black">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/builder" className="flex items-center justify-center h-10 w-10 bg-[#0a0a0a] border border-white/10 rounded-xl text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-black border border-[#eab308]/40 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.05)]">
                            <Sparkles className="h-4 w-4 text-[#eab308]" />
                        </div>
                        <h1 className="text-xl font-black tracking-[-0.05em] italic lowercase text-white">
                            ai magic lab <span className="text-zinc-600 font-bold ml-2 text-sm tracking-normal uppercase">/ Wizard</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="w-32 h-1.5 bg-[#0f0f0f] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#eab308] rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-black italic tracking-widest text-zinc-500">{progressPercent}%</span>
                    </div>
                    {/* Feature Tiers Tiny */}
                    <div className="hidden lg:flex items-center gap-4 border-l border-white/5 pl-6 text-zinc-600">
                        <div className="flex items-center gap-1.5"><BrainCircuit className="h-3 w-3" /></div>
                        <div className="flex items-center gap-1.5"><Rocket className="h-3 w-3" /></div>
                        <div className="flex items-center gap-1.5"><Star className="h-3 w-3 text-[#eab308]" /></div>
                    </div>
                </div>
            </header>

            {/* Split Pane Layout */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">

                {/* Left Pane: Wizard Form */}
                <div className="w-full lg:w-[45%] flex flex-col h-[calc(100vh-80px)] overflow-y-auto border-r border-white/5 relative bg-black custom-scrollbar">

                    <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 xl:p-20 w-full max-w-2xl mx-auto">
                        <AnimatePresence mode="wait">
                            {renderStepContent()}
                        </AnimatePresence>
                    </div>

                    {/* Wizard Controls */}
                    <div className="p-6 border-t border-white/5 bg-[#050505] flex items-center justify-between mt-auto shrink-0 sticky bottom-0">
                        <button
                            onClick={handleBack}
                            disabled={step === 1}
                            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors disabled:opacity-20 flex items-center gap-2 italic"
                        >
                            <ArrowLeft className="w-3 h-3" /> Back
                        </button>

                        <div className="flex items-center gap-4">
                            {step < totalSteps && step > 1 && (
                                <button
                                    onClick={handleSkip}
                                    className="text-[10px] font-black uppercase tracking-widest text-[#eab308]/60 hover:text-[#eab308] transition-colors italic px-4"
                                >
                                    Skip For Now
                                </button>
                            )}

                            {step < totalSteps ? (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-wider italic hover:bg-zinc-200 transition-colors"
                                >
                                    Proceed <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleGenerate}
                                    className="flex items-center gap-2 bg-[#eab308] text-black px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-wider italic hover:bg-[#dca506] transition-all hover:shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                                >
                                    <Sparkles className="w-3.5 h-3.5" /> Initialize Neural Build
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Pane: Live Preview */}
                <div className="hidden lg:block w-[55%] h-[calc(100vh-80px)] bg-[#030303] overflow-y-auto p-12 custom-scrollbar relative">
                    <div className="absolute top-6 right-6 flex items-center gap-2 text-zinc-600 bg-black border border-white/5 px-4 py-2 rounded-full shadow-lg">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest italic">Live Neural Preview</span>
                    </div>

                    {/* The A4 Document Mockup */}
                    <div className="w-full max-w-[800px] aspect-[8.5/11] bg-white rounded-md shadow-[0_0_50px_rgba(0,0,0,0.5)] mx-auto overflow-hidden text-black flex flex-col scale-[0.95] origin-top transition-all duration-700 ease-out">

                        {/* Header Mock */}
                        <div className="p-10 border-b border-zinc-200 text-center space-y-3">
                            <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-900">Your Name</h1>
                            <div className="text-zinc-500 font-medium tracking-wide text-sm flex items-center justify-center gap-4">
                                <span>City, State</span> • <span>contact@email.com</span> • <span>LinkedIn/in/profile</span>
                            </div>
                        </div>

                        {/* Summary Mock */}
                        <div className="p-10 space-y-6 flex-1">
                            <div className="space-y-4 relative group">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#eab308] flex items-center gap-2 border-b border-zinc-200 pb-2">
                                    <LayoutTemplate className="w-4 h-4" /> Professional Summary
                                </h3>

                                <p className={`text-sm leading-relaxed transition-all duration-500 font-medium ${data.role ? 'text-zinc-800' : 'text-zinc-300'}`}>
                                    {data.role ? (
                                        <>Forward-thinking <span className="font-bold underline decoration-[#eab308] underline-offset-4">{data.seniority ? `${data.seniority} ` : ''}{data.role}</span> with expertise in delivering scalable solutions{data.industry ? ` within the ${data.industry} sector` : ''}. Proven track record of leveraging strategic insights to drive growth and efficiency.</>
                                    ) : (
                                        <>Enter your target position in the wizard to generate an AI-tailored executive summary. This section will intelligently blend your seniority and industry context.</>
                                    )}
                                </p>

                                <div className="absolute -left-6 top-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[#eab308]" title="Regenerate Section">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Skills Mock */}
                            <div className="space-y-4 relative group pt-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#eab308] flex items-center gap-2 border-b border-zinc-200 pb-2">
                                    <BrainCircuit className="w-4 h-4" /> Core Competencies
                                </h3>

                                <div className="flex flex-wrap gap-2">
                                    {data.skills ? data.skills.split(',').map((s, i) => (
                                        <span key={i} className="bg-zinc-100 px-3 py-1.5 rounded-md text-xs font-bold text-zinc-700 border border-zinc-200">
                                            {s.trim()}
                                        </span>
                                    )) : (
                                        [1, 2, 3, 4, 5].map(i => (
                                            <span key={i} className="bg-zinc-50 text-transparent px-8 py-1.5 rounded-md text-xs font-bold border border-zinc-100">
                                                Skill
                                            </span>
                                        ))
                                    )}
                                </div>
                                <div className="absolute -left-6 top-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[#eab308]" title="Regenerate Section">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Experience Mock */}
                            <div className="space-y-4 relative group pt-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#eab308] flex items-center gap-2 border-b border-zinc-200 pb-2">
                                    <BriefcaseBusiness className="w-4 h-4" /> Showcase Experience
                                </h3>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-baseline font-bold text-zinc-800">
                                        <h4>Strategic Role Demo</h4>
                                        <span className="text-xs text-zinc-500">2021 - Present</span>
                                    </div>
                                    <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-600">
                                        <li className={`${data.accomplishments ? 'text-zinc-800 font-medium' : 'text-zinc-300'}`}>
                                            {data.accomplishments ? data.accomplishments : 'Highlighting signature accomplishments ensures the optimizer constructs heavily quantified impact metrics.'}
                                        </li>
                                        <li className="text-zinc-300">Spearheaded cross-functional initiatives leading to 45% reduction in operational overhead within Q1.</li>
                                        <li className="text-zinc-300">Architected a scalable framework utilized by over 100+ internal stakeholders.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            {/* Custom scrollbar styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    )
}
