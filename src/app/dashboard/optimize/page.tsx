'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Target, Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'

export default function OptimizePage() {
    const [title, setTitle] = useState('')
    const [company, setCompany] = useState('')
    const [desc, setDesc] = useState('')
    const [resumes, setResumes] = useState<any[]>([])
    const [selectedResumeUrl, setSelectedResumeUrl] = useState('')

    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [results, setResults] = useState<any>(null)

    useEffect(() => {
        // Fetch resumes
        const loadResumes = async () => {
            const supabase = createClient()
            const { data } = await supabase.from('resumes').select('id, title').order('created_at', { ascending: false })
            if (data && data.length > 0) {
                setResumes(data)
                setSelectedResumeUrl(data[0].id)
            }
        }
        loadResumes()

        // Check session storage for pre-filled job
        try {
            const storedJob = sessionStorage.getItem('optimizeJob')
            if (storedJob) {
                const job = JSON.parse(storedJob)
                setTitle(job.title || '')
                setCompany(job.companyName || '')
                setDesc(job.description || '')
                sessionStorage.removeItem('optimizeJob')
            }
        } catch (e) {
            console.error('Failed to parse optimize job from session storage', e)
        }
    }, [])

    const isInstantMode = title.trim() && company.trim() && !desc.trim();
    const isValid = (title.trim() && desc.trim() && selectedResumeUrl) || (isInstantMode && selectedResumeUrl);

    const handleAnalyze = async () => {
        if (!isValid) return
        setIsAnalyzing(true)
        setResults(null)

        try {
            const response = await fetch('/api/ai/ats-match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeId: selectedResumeUrl,
                    jobTitle: title,
                    companyName: company,
                    jobDescription: desc
                })
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || 'Optimization failed')
                return
            }

            setResults(data.result)
            toast.success('CV Analysis Complete!')

        } catch (error: any) {
            toast.error('Failed to analyze CV: ' + error.message)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-zinc-100">
            <div className="max-w-6xl mx-auto w-full p-8 space-y-8">
                {/* Header */}
                <header className="pb-4">
                    <div className="flex items-center gap-3">
                        <Target className="h-10 w-10 text-white" />
                        <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
                            CV Optimizer
                        </h1>
                    </div>
                    <p className="text-zinc-400 text-sm font-medium mt-3 max-w-2xl leading-relaxed">
                        Paste a job description or use <span className="text-white font-bold italic">Instant AI Analysis</span> by just entering the Job Title and Company. Get professional insights in seconds.
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Left Column - Form */}
                    <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 shadow-2xl">
                        <div className="mb-8 space-y-3">
                            <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">Select Resume Context</Label>
                            {resumes.length === 0 ? (
                                <div className="text-sm text-zinc-400 bg-white/5 p-4 rounded-xl border border-white/10">
                                    You don&apos;t have any resumes yet. Go to CV Builder to create one first.
                                </div>
                            ) : (
                                <Select value={selectedResumeUrl} onValueChange={setSelectedResumeUrl}>
                                    <SelectTrigger className="w-full h-12 border-white/10 bg-black text-white font-bold text-sm focus:ring-white/20 transition-all hover:border-white/20 rounded-xl">
                                        <SelectValue placeholder="Select a resume" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                                        {resumes.map(r => (
                                            <SelectItem key={r.id} value={r.id} className="hover:bg-white/5 focus:bg-white/5 focus:text-white cursor-pointer py-3">{r.title || 'Untitled Resume'}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        <div className="w-full h-px bg-white/5 my-10" />

                        <div className="mb-1">
                            <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">Job Details</h2>
                            <p className="text-zinc-500 text-[13px] font-medium">Tell us about the role you&apos;re targeting.</p>
                        </div>

                        <div className="h-6" />

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="space-y-3">
                                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">Job Title</Label>
                                <Input
                                    placeholder="e.g. Frontend Developer"
                                    className="bg-black/40 h-12 border-white/5 text-white text-sm focus-visible:ring-1 focus-visible:ring-white/20 placeholder:text-zinc-700 rounded-xl transition-all hover:bg-black/60"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">Company</Label>
                                <Input
                                    placeholder="e.g. Google"
                                    className="bg-black/40 h-12 border-white/5 text-white text-sm focus-visible:ring-1 focus-visible:ring-white/20 placeholder:text-zinc-700 rounded-xl transition-all hover:bg-black/60"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 mb-10">
                            <div className="flex items-center justify-between">
                                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">Job Description</Label>
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/5">Optional for Instant Mode</span>
                            </div>
                            <Textarea
                                placeholder="Paste the full job description here..."
                                className="min-h-[220px] bg-black/40 resize-y border-white/5 p-5 leading-relaxed text-sm text-zinc-200 focus-visible:ring-1 focus-visible:ring-white/20 placeholder:text-zinc-700 rounded-2xl transition-all hover:bg-black/60"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            />
                        </div>

                        <AnimatedGenerateButton
                            onClick={handleAnalyze}
                            disabled={!isValid || isAnalyzing}
                            generating={isAnalyzing}
                            labelIdle={isInstantMode ? "🚀 Instant AI Analysis" : "Analyze My CV"}
                            labelActive="Analyzing..."
                            highlightHueDeg={200}
                            size="lg"
                            className="w-full h-14"
                        />
                    </div>

                    {/* Right Column - Results Empty State or Results */}
                    {results ? (
                        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-3xl space-y-10 animate-in fade-in zoom-in-95 duration-700 text-white overflow-hidden relative">
                            {/* Ambient Glow */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                            {results.is_predicted && (
                                <div className="absolute top-0 right-0 bg-blue-600 text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-bl-xl shadow-xl shadow-blue-500/10 flex items-center gap-2 z-20">
                                    <Sparkles className="h-3 w-3" />
                                    AI Predicted Match
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="relative h-24 w-24 flex items-center justify-center rounded-2xl bg-black/40 border border-white/5 shadow-2xl group transition-all duration-500 hover:scale-105 shrink-0">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90 p-1.5">
                                        <circle cx="44" cy="44" r="40" fill="none" strokeWidth="4" stroke="rgba(255,255,255,0.02)" className="translate-x-1 translate-y-1" />
                                        <circle
                                            cx="44"
                                            cy="44"
                                            r="40"
                                            fill="none"
                                            strokeWidth="4"
                                            stroke={results.ats_score >= 80 ? '#22c55e' : results.ats_score >= 60 ? '#eab308' : '#ef4444'}
                                            strokeDasharray="251"
                                            strokeDashoffset={251 - (251 * (results.ats_score || 0)) / 100}
                                            strokeLinecap="round"
                                            className="translate-x-1 translate-y-1 transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                                        />
                                    </svg>
                                    <span className="text-3xl font-black text-white z-10 tracking-tighter">{results.ats_score}<span className="text-sm text-zinc-500 font-bold ml-0.5">%</span></span>
                                </div>
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase mb-1">Match Analysis</h2>
                                    <p className="text-zinc-400 font-medium text-sm leading-relaxed max-w-sm">
                                        {results.ats_score >= 80 ? 'Excellent match for this role.' : results.ats_score >= 60 ? 'Good match. Some optimizations could boost your visibility.' : 'Minimal match. Significant updates are required.'}
                                    </p>
                                </div>
                            </div>

                            {results.predicted_requirements && results.predicted_requirements.length > 0 && (
                                <div className="space-y-4 p-6 bg-white/[0.01] border border-white/5 rounded-2xl backdrop-blur-md">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                            <Target className="h-3.5 w-3.5" /> Predicted Requirements
                                        </h3>
                                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full">Industry Standard</span>
                                    </div>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {results.predicted_requirements.map((req: string, i: number) => (
                                            <li key={i} className="text-[13px] text-zinc-300 flex items-center gap-3 font-medium bg-black/10 p-2.5 rounded-xl border border-white/[0.01] transition-all hover:bg-black/20">
                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                                                <span className="truncate">{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {results.keyword_analysis?.missing_keywords && results.keyword_analysis.missing_keywords.length > 0 && (
                                    <div className="space-y-4 bg-red-500/[0.01] border border-red-500/5 p-5 rounded-2xl">
                                        <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2 italic">
                                            <AlertCircle className="h-3.5 w-3.5" /> Missing
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {results.keyword_analysis.missing_keywords.map((skill: string, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-red-500/5 text-red-500/80 border border-red-500/10 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm transition-all hover:bg-red-500/10 cursor-default">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {results.keyword_analysis?.matched_keywords && results.keyword_analysis.matched_keywords.length > 0 && (
                                    <div className="space-y-4 bg-emerald-500/[0.01] border border-emerald-500/5 p-5 rounded-2xl">
                                        <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 italic">
                                            <CheckCircle className="h-3.5 w-3.5" /> Matched
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {results.keyword_analysis.matched_keywords.map((skill: string, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-emerald-500/5 text-emerald-500/80 border border-emerald-500/10 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm transition-all hover:bg-emerald-500/10 cursor-default">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {results.suggestions && (
                                <div className="space-y-5 pt-8 border-t border-white/5">
                                    <h3 className="text-lg font-black italic tracking-tighter text-white uppercase sm:text-base">Expert Strategy</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {results.suggestions.map((rec: string, i: number) => (
                                            <div key={i} className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-all duration-300 group">
                                                <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                    <Sparkles className="h-4 w-4 text-blue-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[13px] text-zinc-200 font-bold leading-tight">{rec}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl min-h-[550px] flex flex-col items-center justify-center p-12 text-center shadow-2xl relative overflow-hidden group">
                            {/* Animated circle in background */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl group-hover:bg-white/[0.05] transition-all duration-700" />

                            <div className="h-24 w-24 flex items-center justify-center rounded-3xl bg-white/5 border border-white/10 shadow-xl mb-8 group-hover:scale-110 transition-transform duration-500">
                                <Target className="h-10 w-10 text-zinc-400" />
                            </div>
                            <h3 className="text-xl font-black italic tracking-tighter text-white uppercase mb-3">Ready for Analysis</h3>
                            <p className="text-zinc-500 font-medium max-w-[280px] leading-relaxed">
                                {isAnalyzing ? 'Our AI is dissecting your CV against the role requirements...' : 'Paste a job description and select a resume to unlock your professional match score and strategic insights.'}
                            </p>
                        </div>
                    )}

                </main>
            </div>
        </div>
    )
}
