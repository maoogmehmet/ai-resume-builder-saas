'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Linkedin, FileText, Sparkles, ArrowLeft, CheckCircle2, Upload, Copy, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type Step = 'instructions' | 'paste' | 'generating' | 'done'

export default function LinkedinMappingPage() {
    const router = useRouter()
    const [step, setStep] = useState<Step>('instructions')
    const [pastedText, setPastedText] = useState('')
    const [resumeId, setResumeId] = useState<string | null>(null)

    const handleGenerate = async () => {
        if (!pastedText.trim() || pastedText.length < 100) {
            toast.error('Please paste more content from your LinkedIn profile.')
            return
        }
        setStep('generating')
        try {
            // Create a new resume record with the pasted LinkedIn text
            const createRes = await fetch('/api/resume/manage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create',
                    title: 'LinkedIn Import',
                    content: { personalInfo: {}, summary: '', experience: [], education: [], skills: [], additional: {} },
                    linkedinText: pastedText.slice(0, 8000) // Pass pasted text to backend
                })
            })
            const createData = await createRes.json()

            if (!createRes.ok || !createData.resumeId) {
                throw new Error(createData.error || 'Failed to create resume')
            }

            const newResumeId = createData.resumeId

            // Now call AI to generate the resume from LinkedIn text
            const genRes = await fetch('/api/ai/generate-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeId: newResumeId, linkedinText: pastedText.slice(0, 8000) })
            })

            const genData = await genRes.json()

            if (!genRes.ok) {
                // Even if AI fails, the resume was created — go to editor
                console.warn('AI generation failed, redirecting to editor:', genData.error)
            }

            setResumeId(newResumeId)
            setStep('done')
        } catch (err: any) {
            toast.error(err.message || 'Import failed. Please try again.')
            setStep('paste')
        }
    }

    const instructions = [
        {
            step: 1,
            icon: '🔗',
            title: 'Go to your LinkedIn profile',
            desc: 'Open linkedin.com and navigate to your profile page.',
        },
        {
            step: 2,
            icon: '📋',
            title: 'Select All & Copy',
            desc: 'Press Ctrl+A (or Cmd+A on Mac) to select everything, then Ctrl+C to copy the full page text.',
        },
        {
            step: 3,
            icon: '📝',
            title: 'Paste here',
            desc: 'Click "Continue" below and paste the text. Our AI will extract your experience, education, and skills automatically.',
        },
    ]

    return (
        <div className="min-h-screen bg-black text-white font-sans p-6 sm:p-12 pb-24">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-12">
                    <Link href="/dashboard" className="flex items-center gap-2 h-10 px-4 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-colors text-sm font-bold">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-blue-600/15 border border-blue-500/30 rounded-xl flex items-center justify-center">
                            <Linkedin className="h-4 w-4 text-blue-400 fill-current" strokeWidth={0} />
                        </div>
                        <span className="font-black tracking-tighter text-lg italic lowercase">ai linkedin protocol</span>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {/* Step 1: Instructions */}
                    {step === 'instructions' && (
                        <motion.div key="instructions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                            <div className="text-center mb-10">
                                <h1 className="text-4xl font-black tracking-tighter italic lowercase text-white mb-3">Import from LinkedIn</h1>
                                <p className="text-zinc-500 font-medium max-w-md mx-auto">
                                    Copy your LinkedIn profile text and let our AI reconstruct it into a high-performance, ATS-optimized resume — in seconds.
                                </p>
                            </div>
                            <div className="space-y-4 mb-10">
                                {instructions.map((item) => (
                                    <div key={item.step} className="flex gap-5 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                                        <div className="text-2xl shrink-0 mt-0.5">{item.icon}</div>
                                        <div>
                                            <p className="font-black text-white text-sm mb-1">{item.title}</p>
                                            <p className="text-zinc-500 text-xs leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl flex items-start gap-3 mb-8">
                                <AlertCircle className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
                                <p className="text-yellow-400/80 text-xs font-bold leading-relaxed">
                                    Only your publicly visible profile text is needed — no login, no LinkedIn credentials, no API key required.
                                </p>
                            </div>
                            <button
                                onClick={() => setStep('paste')}
                                className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black italic tracking-wider transition-all text-lg shadow-lg shadow-blue-500/20"
                            >
                                Continue — Paste My Profile
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: Paste */}
                    {step === 'paste' && (
                        <motion.div key="paste" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                            <div className="mb-8">
                                <h2 className="text-3xl font-black tracking-tighter italic lowercase text-white mb-2">Paste your profile text</h2>
                                <p className="text-zinc-500 text-sm font-medium">Copy everything from your LinkedIn page (Ctrl+A → Ctrl+C) and paste it below.</p>
                            </div>
                            <textarea
                                value={pastedText}
                                onChange={(e) => setPastedText(e.target.value)}
                                placeholder="Paste your full LinkedIn profile text here...

Example: John Smith | Senior Software Engineer at Google | San Francisco, CA
Experience
Google — Senior Software Engineer (2020 - Present)
• Led a team of 5 engineers..."
                                className="w-full h-72 bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-white placeholder:text-zinc-600 text-sm font-mono resize-none focus:outline-none focus:border-blue-500/40 transition-colors"
                            />
                            <div className="flex justify-between items-center mt-2 mb-6">
                                <span className="text-zinc-600 text-xs font-bold">{pastedText.length} characters {pastedText.length < 100 ? '— paste more for best results' : '✓ good'}</span>
                                <button onClick={() => setPastedText('')} className="text-zinc-600 text-xs font-bold hover:text-white transition-colors">Clear</button>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setStep('instructions')} className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white font-bold text-sm transition-all">
                                    ← Back
                                </button>
                                <button
                                    onClick={handleGenerate}
                                    disabled={pastedText.length < 100}
                                    className="flex-1 h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black italic tracking-wider transition-all text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="h-4 w-4" /> Generate Resume with AI
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Generating */}
                    {step === 'generating' && (
                        <motion.div key="generating" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-20">
                            <div className="h-24 w-24 bg-blue-600/10 border border-blue-500/30 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.15)] relative mb-8">
                                <Linkedin className="h-10 w-10 text-blue-500 animate-pulse" />
                                <div className="absolute inset-0 border-2 border-blue-500/50 rounded-3xl border-t-transparent animate-spin" />
                            </div>
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white mb-3">Building Your CV</h2>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] italic">AI is parsing your LinkedIn data and generating an ATS-optimized resume</p>
                        </motion.div>
                    )}

                    {/* Step 4: Done */}
                    {step === 'done' && (
                        <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-12">
                            <div className="h-24 w-24 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.15)] mb-8">
                                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                            </div>
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white mb-3">Resume Generated!</h2>
                            <p className="text-zinc-500 font-medium mb-10 max-w-sm">
                                Your LinkedIn profile has been converted into a fully editable, ATS-ready resume. Open it in the editor to review and refine.
                            </p>
                            <button
                                onClick={() => resumeId && router.push(`/editor/${resumeId}`)}
                                className="w-full max-w-xs h-14 rounded-2xl bg-white text-black font-black italic tracking-wider text-lg shadow-xl transition-all hover:bg-zinc-100"
                            >
                                Open in Editor →
                            </button>
                            <Link href="/dashboard/resumes" className="mt-4 text-zinc-500 text-sm font-bold hover:text-white transition-colors">
                                View all my CVs
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
