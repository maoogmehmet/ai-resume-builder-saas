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

    const isValid = title.trim() && desc.trim() && selectedResumeUrl

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
                        <Target className="h-8 w-8 text-white" />
                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            CV Optimizer
                        </h1>
                    </div>
                    <p className="text-zinc-400 text-sm font-medium mt-2">
                        Paste a job description to see how well your CV matches and get improvement suggestions.
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Left Column - Form */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-sm">

                        <div className="mb-6 space-y-2">
                            <Label className="text-[13px] font-semibold text-zinc-300">Select Resume to Optimize *</Label>
                            {resumes.length === 0 ? (
                                <div className="text-sm text-zinc-400 bg-white/5 p-3 rounded-lg border border-white/10">
                                    You don&apos;t have any resumes yet. Go to CV Builder to create one first.
                                </div>
                            ) : (
                                <Select value={selectedResumeUrl} onValueChange={setSelectedResumeUrl}>
                                    <SelectTrigger className="w-full h-11 border-white/10 bg-black text-white font-medium text-sm focus:ring-white/20">
                                        <SelectValue placeholder="Select a resume" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1e1e1e] border-white/10 text-white">
                                        {resumes.map(r => (
                                            <SelectItem key={r.id} value={r.id} className="hover:bg-white/5 focus:bg-white/5 focus:text-white cursor-pointer">{r.title || 'Untitled Resume'}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        <div className="w-full h-px bg-white/10 my-8" />

                        <h2 className="text-lg font-bold text-white mb-1">Job Details</h2>
                        <p className="text-zinc-400 text-[13px] mb-6">Tell us about the role you&apos;re targeting.</p>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <Label className="text-[13px] font-semibold text-zinc-300">Job Title</Label>
                                <Input
                                    placeholder="e.g. Frontend Developer"
                                    className="bg-black h-11 border-white/10 text-white text-sm focus-visible:ring-1 focus-visible:ring-white/20 placeholder:text-zinc-600"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[13px] font-semibold text-zinc-300">Company</Label>
                                <Input
                                    placeholder="e.g. Google"
                                    className="bg-black h-11 border-white/10 text-white text-sm focus-visible:ring-1 focus-visible:ring-white/20 placeholder:text-zinc-600"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 mb-8">
                            <Label className="text-[13px] font-semibold text-zinc-300">Job Description *</Label>
                            <Textarea
                                placeholder="Paste the full job description here..."
                                className="min-h-[220px] bg-black resize-y border-white/10 p-4 leading-relaxed text-sm text-white focus-visible:ring-1 focus-visible:ring-white/20 placeholder:text-zinc-600"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            />
                        </div>

                        <Button
                            onClick={handleAnalyze}
                            disabled={!isValid || isAnalyzing}
                            className={`w-full h-12 text-base font-semibold rounded-xl flex items-center gap-2 ${(isValid && !isAnalyzing) ? 'bg-white text-black hover:bg-zinc-200 shadow-xl' : 'bg-white/10 text-zinc-500 cursor-not-allowed'}`}
                        >
                            {isAnalyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                            {isAnalyzing ? 'Analyzing...' : 'Analyze My CV'}
                        </Button>
                    </div>

                    {/* Right Column - Results Empty State or Results */}
                    {results ? (
                        <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-8 shadow-sm space-y-8 animate-in fade-in zoom-in-95 duration-500 text-white">
                            <div className="flex items-center gap-6">
                                <div className="relative h-24 w-24 flex items-center justify-center rounded-full border-4 border-white/5 shadow-inner">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                        <circle cx="44" cy="44" r="44" fill="none" strokeWidth="8" stroke="rgba(255,255,255,0.05)" className="translate-x-1 translate-y-1" />
                                        <circle cx="44" cy="44" r="44" fill="none" strokeWidth="8" stroke={results.match_score >= 80 ? '#22c55e' : results.match_score >= 60 ? '#eab308' : '#ef4444'} strokeDasharray="276" strokeDashoffset={276 - (276 * results.match_score) / 100} strokeLinecap="round" className="translate-x-1 translate-y-1 transition-all duration-1000" />
                                    </svg>
                                    <span className="text-3xl font-black text-white">{results.match_score}<span className="text-lg text-zinc-500">%</span></span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">Match Score</h2>
                                    <p className="text-zinc-400 font-medium">{results.match_score >= 80 ? 'Excellent match! You are highly qualified.' : results.match_score >= 60 ? 'Good match. Some optimizations needed.' : 'Low match. Significant updates required.'}</p>
                                </div>
                            </div>

                            {results.missing_skills && results.missing_skills.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><AlertCircle className="h-5 w-5 text-red-500" /> Missing Keywords</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {results.missing_skills.map((skill: string, i: number) => (
                                            <span key={i} className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm font-bold">{skill}</span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-zinc-500 italic">Consider strategically adding these to your experience if applicable.</p>
                                </div>
                            )}

                            {results.matching_skills && results.matching_skills.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><CheckCircle className="h-5 w-5 text-emerald-500" /> Matched Keywords</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {results.matching_skills.map((skill: string, i: number) => (
                                            <span key={i} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-bold">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.recommendations && (
                                <div className="space-y-4 pt-4 border-t border-white/10">
                                    <h3 className="text-lg font-bold text-white">Expert Recommendations</h3>
                                    <ul className="space-y-3">
                                        {results.recommendations.map((rec: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                                                <Target className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                                                <span className="text-sm text-zinc-300 font-medium leading-relaxed">{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-black border border-white/10 rounded-2xl min-h-[550px] flex flex-col items-center justify-center p-8 text-center shadow-inner">
                            <div className="h-20 w-20 flex items-center justify-center rounded-full bg-white/5 border border-white/10 shadow-sm mb-6">
                                <Target className="h-8 w-8 text-zinc-500" />
                            </div>
                            <p className="text-zinc-500 font-medium max-w-[250px]">
                                {isAnalyzing ? 'Analyzing your CV against the job description...' : 'Enter a job description and select a resume to see your match score'}
                            </p>
                        </div>
                    )}

                </main>
            </div>
        </div>
    )
}
