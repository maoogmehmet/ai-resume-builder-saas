'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'
import { CheckCircle2, Sparkles, Loader2, BrainCircuit, AlertTriangle, FileText, ArrowLeft, ArrowRight, BookOpen, Layers, Target, Mail, Send, Activity, Settings2, Copy, History, X } from 'lucide-react'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// Types
type Tone = 'Professional' | 'Direct' | 'Friendly'
type Length = 'S' | 'M' | 'L'
type Language = 'EN' | 'TR'
type VariantKey = 'A' | 'B' | 'C'

interface GeneratedVariant {
    id: VariantKey;
    title: string;
    hook: string;
    content: string;
    differences: string;
}

export default function CoverLetterHub() {
    const router = useRouter()

    // Form State
    const [resumes, setResumes] = useState<any[]>([])
    const [selectedResumeId, setSelectedResumeId] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [jobDescription, setJobDescription] = useState('')

    // New Controls State
    const [tone, setTone] = useState<Tone>('Professional')
    const [length, setLength] = useState<Length>('M')
    const [language, setLanguage] = useState<Language>('EN')

    // Company Research State
    const [missionFit, setMissionFit] = useState('')
    const [productInterest, setProductInterest] = useState('')
    const [cultureFit, setCultureFit] = useState('')

    // Achievement Picker State
    const [isPickerOpen, setIsPickerOpen] = useState(false)
    const [mockCVBullets, setMockCVBullets] = useState<string[]>([
        "Increased Q3 revenue by 45% through strategic partnerships.",
        "Led a team of 12 engineers to deliver the V2 API 3 weeks early.",
        "Reduced server costs by $12k/mo by optimizing AWS Lambda usage.",
        "Spearheaded the migration from Vue to React, improving TTL by 2s.",
        "Authored 15+ technical blog posts driving 50k monthly visits."
    ])
    const [selectedBullets, setSelectedBullets] = useState<Set<number>>(new Set())

    // UI State
    const [isGenerating, setIsGenerating] = useState(false)
    const [variants, setVariants] = useState<GeneratedVariant[] | null>(null)
    const [activeVariant, setActiveVariant] = useState<VariantKey>('A')
    const [subjectLine, setSubjectLine] = useState("Application for [Role] - [My Name]")

    // Detector State
    const [showDetector, setShowDetector] = useState(false)
    const [detectorFixed, setDetectorFixed] = useState(false)

    useEffect(() => {
        const fetchResumes = async () => {
            const supabase = createClient()
            const { data } = await supabase.from('resumes').select('id, title').order('created_at', { ascending: false })
            if (data && data.length > 0) {
                setResumes(data)
                setSelectedResumeId(data[0].id)
            }
        }
        fetchResumes()
    }, [])

    const toggleBullet = (index: number) => {
        const split = new Set(selectedBullets)
        if (split.has(index)) {
            split.delete(index)
        } else {
            if (split.size < 3) split.add(index)
            else toast.error("You can only select up to 3 achievements.")
        }
        setSelectedBullets(split)
    }

    const handleGenerate = async () => {
        if (!selectedResumeId || !jobTitle || !companyName) {
            toast.error("Resume, Target Role, and Company are required.")
            return
        }

        setIsGenerating(true)
        setShowDetector(false)
        setDetectorFixed(false)

        try {
            // Simulate generation of 3 distinct variants
            await new Promise(res => setTimeout(res, 4000))

            const selectedText = Array.from(selectedBullets).map(i => mockCVBullets[i]).join(" ")

            setVariants([
                {
                    id: 'A',
                    title: 'The Aggressive Pitch',
                    hook: 'Lead with immediate value and bold numbers.',
                    differences: 'High impact, very direct, skips pleasantries.',
                    content: `Dear Hiring Manager at ${companyName},\n\nWhen I saw the ${jobTitle} opening, I knew my ability to immediately drive results would perfectly align with your current objectives. In my recent roles, I have consistently exceeded expectations—for example, ${Array.from(selectedBullets).length > 0 ? Array.from(selectedBullets).map(i => mockCVBullets[i]).join(" ") : "driving 45% revenue growth"}.\n\nFurthermore, my interest in your product direction strongly signals I am ready to hit the ground running. I am a hardworking individual who always gives 110%.\n\nLet's schedule a time to discuss how I can translate this track record into immediate wins for ${companyName}.`
                },
                {
                    id: 'B',
                    title: 'The Balanced Professional',
                    hook: 'Standard storytelling bridging past and future.',
                    differences: 'Professional tone, highlights cultural fit.',
                    content: `Dear Hiring Manager,\n\nI am thrilled to apply for the ${jobTitle} position at ${companyName}. Drawing from my background, I have developed a unique blend of strategic thinking and execution. ${cultureFit ? `Your commitment to ${cultureFit} resonates deeply with me.` : ''}\n\n${Array.from(selectedBullets).length > 0 ? `I'm particularly proud that I ${Array.from(selectedBullets).map(i => mockCVBullets[i]).join(" ")}.` : 'I have a strong track record of success in similar environments.'}\n\nI look forward to the possibility of contributing to your team's ongoing success.`
                },
                {
                    id: 'C',
                    title: 'The Conservative Intro',
                    hook: 'Highly formal, focusing heavily on mission alignment.',
                    differences: 'Safe, traditional, emphasizes respect and long-term vision.',
                    content: `To the Hiring Committee at ${companyName},\n\nPlease accept this letter as formal expression of my interest in the ${jobTitle} role. ${missionFit ? `I have closely followed your mission to ${missionFit}.` : 'I have long admired your organization.'}\n\nMy extensive experience has prepared me well for the responsibilities outlined in your description. ${Array.from(selectedBullets).length > 0 ? ` Notably, ${Array.from(selectedBullets).map(i => mockCVBullets[i]).join(" ")}.` : ''}\n\nThank you for reviewing my application. I am available for an interview at your earliest convenience.`
                }
            ])
            setSubjectLine(`Application: ${jobTitle} - Proven Impact`)
            setActiveVariant('A')

            // Trigger red flag detector on Variant A
            setTimeout(() => {
                setShowDetector(true)
            }, 1000)

        } catch (e: any) {
            toast.error("Generation failed")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleCopyEmail = () => {
        if (!variants) return
        const active = variants.find(v => v.id === activeVariant)
        const emailPayload = `Subject: ${subjectLine}\n\n${active?.content}`
        navigator.clipboard.writeText(emailPayload)
        toast.success("Ready for Email!", { description: "Subject and Body copied to clipboard." })
    }

    const handleOneClickFix = () => {
        if (!variants) return

        // Mock fixing the generic phrase in Variant A
        const newVariants = [...variants]
        const vA = newVariants.find(v => v.id === 'A')
        if (vA) {
            vA.content = vA.content.replace(
                "I am a hardworking individual who always gives 110%.",
                "I leverage data-driven methodologies to consistently outpace quarterly goals."
            )
        }
        setVariants(newVariants)
        setDetectorFixed(true)
        toast.success("Red Flags Fixed", { description: "Generic phrases have been replaced with sharp metrics." })
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-purple-500/30">

            {/* Minimalist Top Nav */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 shrink-0 relative z-20 bg-black">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/letters" className="flex items-center justify-center h-10 w-10 bg-[#0a0a0a] border border-white/10 rounded-xl text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-black border border-purple-500/40 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                            <Mail className="h-4 w-4 text-purple-400" />
                        </div>
                        <h1 className="text-xl font-black tracking-[-0.05em] italic lowercase text-white">
                            letter hub <span className="text-zinc-600 font-bold ml-2 text-sm tracking-normal uppercase">/ Tri-Variant Gen</span>
                        </h1>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic flex items-center gap-2">
                        <Activity className="h-3 w-3 text-emerald-500" /> Neural Pipeline Linked
                    </span>
                </div>
            </header>

            {/* Split Screen Layout */}
            <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden">

                {/* LEFT PANE: Configuration Generator */}
                <div className="w-full lg:w-[45%] h-full bg-[#030303] border-r border-white/5 overflow-y-auto custom-scrollbar p-8 sm:p-12 pb-32 relative">

                    <div className="max-w-xl mx-auto space-y-12">

                        {/* Core Requirements */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-0.5">
                                    <Target className="h-4 w-4 text-purple-400" /> Job Details
                                </h3>
                                <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">Define the target role and company.</p>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">Select Foundational CV *</Label>
                                <select
                                    className="w-full rounded-2xl h-14 border border-white/10 bg-[#0f0f0f] focus:bg-[#151515] focus:border-white/20 outline-none transition-all font-bold px-6 text-sm italic text-white shadow-inner appearance-none cursor-pointer"
                                    value={selectedResumeId}
                                    onChange={(e) => setSelectedResumeId(e.target.value)}
                                >
                                    <option value="" disabled>Select Resume</option>
                                    {resumes.map(r => (
                                        <option key={r.id} value={r.id}>{r.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">Target Role *</Label>
                                    <Input
                                        className="rounded-2xl h-12 border border-white/10 bg-[#0f0f0f] focus:bg-[#151515] transition-all font-bold px-4 text-sm italic text-white shadow-inner"
                                        placeholder="Product Manager"
                                        value={jobTitle}
                                        onChange={e => setJobTitle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">Company *</Label>
                                    <Input
                                        className="rounded-2xl h-12 border border-white/10 bg-[#0f0f0f] focus:bg-[#151515] transition-all font-bold px-4 text-sm italic text-white shadow-inner"
                                        placeholder="Apple"
                                        value={companyName}
                                        onChange={e => setCompanyName(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tone & Length Controls */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-0.5">
                                    <Settings2 className="h-4 w-4 text-emerald-400" /> Writing Controls
                                </h3>
                                <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">Adjust tone, length and language.</p>
                            </div>

                            <div className="grid grid-cols-3 gap-2 bg-[#0a0a0a] p-1.5 rounded-2xl border border-white/5">
                                {['Professional', 'Direct', 'Friendly'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTone(t as Tone)}
                                        className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${tone === t ? 'bg-[#1a1a1a] text-emerald-400 border border-emerald-500/20 shadow-md' : 'text-zinc-500 hover:text-white'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Density (Length)</Label>
                                    <div className="flex gap-2">
                                        {['S', 'M', 'L'].map(l => (
                                            <button
                                                key={l}
                                                onClick={() => setLength(l as Length)}
                                                className={`h-10 flex-1 rounded-xl text-xs font-black transition-all ${length === l ? 'bg-white text-black' : 'bg-[#0f0f0f] text-zinc-500 border border-white/5 hover:border-white/20'}`}
                                            >
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Language Phase</Label>
                                    <div className="flex gap-2">
                                        {['EN', 'TR'].map(l => (
                                            <button
                                                key={l}
                                                onClick={() => setLanguage(l as Language)}
                                                className={`h-10 flex-1 rounded-xl text-xs font-black transition-all ${language === l ? 'bg-[#3b82f6] text-white' : 'bg-[#0f0f0f] text-zinc-500 border border-white/5 hover:border-white/20'}`}
                                            >
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Achievement Picker */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-white flex items-center gap-2 mb-0.5">
                                        <Layers className="h-4 w-4 text-blue-400" /> Key Achievements
                                    </h3>
                                    <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">Pick up to 3 bullet points to highlight.</p>
                                </div>
                                <button
                                    onClick={() => setIsPickerOpen(!isPickerOpen)}
                                    className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic hover:bg-blue-600/30 transition-all flex items-center gap-2"
                                >
                                    Picker <ArrowRight className={`w-3 h-3 transition-transform ${isPickerOpen ? 'rotate-90' : ''}`} />
                                </button>
                            </div>

                            <AnimatePresence>
                                {isPickerOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-[#050505] border border-white/5 rounded-2xl p-4 space-y-2 mt-2">
                                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Select up to 3 bullets to highlight:</p>
                                            {mockCVBullets.map((bullet, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => toggleBullet(i)}
                                                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${selectedBullets.has(i) ? 'bg-blue-500/10 border-blue-500/50 text-white' : 'border-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200'}`}
                                                >
                                                    <div className="flex gap-3 items-start">
                                                        <div className={`mt-0.5 w-3 h-3 rounded-sm border shrink-0 flex items-center justify-center ${selectedBullets.has(i) ? 'bg-blue-500 border-blue-500' : 'border-zinc-700'}`}>
                                                            {selectedBullets.has(i) && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                                                        </div>
                                                        <span className="leading-relaxed font-medium">{bullet}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="pt-2 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                                <span className={`${selectedBullets.size === 3 ? 'text-blue-400' : 'text-zinc-500'}`}>{selectedBullets.size}/3 Selected</span>
                                                <button onClick={() => setIsPickerOpen(false)} className="text-zinc-400 hover:text-white">Done</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Company Research Notes */}
                        <div className="space-y-5">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-0.5">
                                    <BookOpen className="h-4 w-4 text-[#eab308]" /> Company Notes
                                </h3>
                                <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">Optional context signals — leave blank to skip.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Mission Fit</Label>
                                    <Textarea
                                        className="min-h-[60px] max-h-[100px] rounded-2xl border border-white/5 bg-[#0a0a0a] focus:bg-[#111] transition-all px-4 py-3 text-sm italic text-white shadow-inner resize-none"
                                        placeholder="Leave blank to omit..."
                                        value={missionFit}
                                        onChange={e => setMissionFit(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Culture Observation</Label>
                                    <Input
                                        className="rounded-2xl h-12 border border-white/5 bg-[#0a0a0a] focus:bg-[#111] transition-all px-4 text-sm italic text-white shadow-inner"
                                        placeholder="e.g. They value autonomous teams..."
                                        value={cultureFit}
                                        onChange={e => setCultureFit(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Fixed Generation Footer */}
                    <div className="p-5 border-t border-white/5 bg-[#050505] flex items-center justify-between gap-4 absolute bottom-0 left-0 right-0 lg:sticky">
                        <div className="text-xs text-zinc-600 font-medium hidden sm:block">
                            3 variants · {tone} tone · {length === 'S' ? 'Short' : length === 'M' ? 'Standard' : 'Detailed'}
                        </div>
                        <AnimatedGenerateButton
                            labelIdle={isGenerating ? 'Generating...' : 'Generate 3 Variants'}
                            labelActive="Crafting Variants..."
                            generating={isGenerating}
                            onClick={handleGenerate}
                            highlightHueDeg={270}
                            className="flex-1 sm:w-auto h-12 rounded-2xl text-[11px] font-bold"
                            icon={<Sparkles className="h-4 w-4" />}
                        />
                    </div>
                </div>

                {/* RIGHT PANE: Output Canvas */}
                <div className="w-full lg:w-[55%] h-full bg-[#080808] relative overflow-hidden flex flex-col items-center">

                    {/* Placeholder State */}
                    {!isGenerating && !variants && (
                        <div className="m-auto text-center space-y-6 px-8">
                            <div className="h-20 w-20 mx-auto bg-purple-500/5 border border-purple-500/10 rounded-[2rem] flex items-center justify-center">
                                <Mail className="w-9 h-9 text-purple-500/30" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold tracking-tight text-zinc-400">Ready to write</h3>
                                <p className="text-sm text-zinc-600 max-w-[260px] mx-auto leading-relaxed">Fill in the details on the left and click Generate to create 3 personalized letter variants.</p>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {isGenerating && (
                        <div className="m-auto flex flex-col items-center gap-6">
                            <div className="relative h-24 w-24">
                                <div className="absolute inset-0 rounded-[2rem] border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                                <div className="absolute inset-3 rounded-2xl bg-purple-500/5 flex items-center justify-center">
                                    <Sparkles className="w-7 h-7 text-purple-400 animate-pulse" />
                                </div>
                            </div>
                            <div className="text-center space-y-1.5">
                                <h3 className="text-xl font-bold text-white">Generating your letters...</h3>
                                <p className="text-sm text-zinc-500">Crafting 3 unique variants with different hooks and structures.</p>
                            </div>
                        </div>
                    )}

                    {/* Output State */}
                    {variants && !isGenerating && (
                        <div className="w-full h-full flex flex-col p-6 sm:p-12 custom-scrollbar overflow-y-auto">

                            {/* Top Tools: Variant Switcher */}
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                                <div className="flex p-1.5 bg-[#111] border border-white/10 rounded-full shadow-lg">
                                    {variants.map(v => (
                                        <button
                                            key={v.id}
                                            onClick={() => setActiveVariant(v.id)}
                                            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest italic transition-all ${activeVariant === v.id ? 'bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.3)] text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                            Variant {v.id}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleCopyEmail}
                                    className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest italic hover:bg-zinc-200 transition-colors shadow-lg"
                                >
                                    <Copy className="w-3 h-3" /> Copy as Email
                                </button>
                            </div>

                            {/* Active Variant Context */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeVariant}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="flex-1 w-full max-w-2xl mx-auto flex flex-col gap-6"
                                >
                                    {/* Variant Summary Box */}
                                    <div className="bg-[#111] border border-purple-500/20 p-5 rounded-3xl flex items-start gap-4">
                                        <div className="h-10 w-10 shrink-0 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/30">
                                            <span className="font-black italic text-purple-400 text-lg">{activeVariant}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm mb-1">{variants.find(v => v.id === activeVariant)?.title}</h4>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#eab308]/80 leading-relaxed italic">
                                                Diff: {variants.find(v => v.id === activeVariant)?.differences}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Subject Line Input */}
                                    <div className="bg-black/50 border border-white/5 rounded-2xl p-4 flex gap-4 items-center">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic shrink-0">Subject:</div>
                                        <Input
                                            value={subjectLine}
                                            onChange={e => setSubjectLine(e.target.value)}
                                            className="bg-transparent border-0 text-white font-bold h-auto p-0 focus-visible:ring-0 placeholder:text-zinc-600"
                                        />
                                    </div>

                                    {/* The Document Canvas */}
                                    <div className="flex-1 min-h-[500px] bg-white rounded-md shadow-2xl p-8 sm:p-12 text-black text-sm relative">

                                        {/* Fake Red Flag Detector floating over canvas */}
                                        <AnimatePresence>
                                            {showDetector && activeVariant === 'A' && !detectorFixed && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="absolute -right-12 top-48 bg-[#111] border border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.3)] p-4 rounded-2xl w-[260px] text-left text-white z-10"
                                                >
                                                    <div className="flex items-center gap-2 text-rose-400 mb-2">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest italic">AI Flag: Generic Tone</span>
                                                    </div>
                                                    <p className="text-xs text-zinc-400 font-medium leading-relaxed mb-4">
                                                        "I am a hardworking individual who always gives 110%" is overly generic and unverifiable.
                                                    </p>
                                                    <button
                                                        onClick={handleOneClickFix}
                                                        className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic flex items-center justify-center gap-2 transition-colors"
                                                    >
                                                        <Sparkles className="w-3 h-3" /> 1-Click Fix
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Highlighted text mapping inside textarea/div */}
                                        <Textarea
                                            className="w-full h-full bg-transparent border-0 resize-none font-medium leading-loose text-zinc-800 focus-visible:ring-0 p-0"
                                            value={variants.find(v => v.id === activeVariant)?.content}
                                            onChange={(e) => {
                                                const updated = [...variants];
                                                const idx = updated.findIndex(v => v.id === activeVariant)
                                                updated[idx].content = e.target.value
                                                setVariants(updated)
                                            }}
                                        />

                                        {/* Visual Highlights Simulation */}
                                        {activeVariant === 'A' && !detectorFixed && showDetector && (
                                            <div className="absolute inset-0 pointer-events-none p-8 sm:p-12">
                                                {/* In a real rich editor, we'd wrap text, but we'll mock the styling here manually if needed. Due to textarea limits, we just show the detector box outside. */}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); }
            `}</style>
        </div>
    )
}
