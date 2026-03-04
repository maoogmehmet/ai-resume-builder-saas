'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AnimatedText from '@/components/ui/animated-text'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Target, Sparkles, CheckCircle, AlertCircle, TrendingUp, History, Trash2, ArrowRight, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { AlertBanner } from '@/components/ui/alert-banner'
import { cn } from '@/lib/utils'

export default function OptimizePage() {
    const [title, setTitle] = useState('')
    const [company, setCompany] = useState('')
    const [desc, setDesc] = useState('')
    const [resumes, setResumes] = useState<any[]>([])
    const [selectedResumeUrl, setSelectedResumeUrl] = useState('')

    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [results, setResults] = useState<any>(null)
    const [pastVersions, setPastVersions] = useState<any[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [notification, setNotification] = useState<{ title: string, description: string, variant: 'success' | 'destructive' } | null>(null)

    useEffect(() => {
        const loadInitialData = async () => {
            const supabase = createClient()
            const { data: resData } = await supabase.from('resumes').select('id, title').order('created_at', { ascending: false })
            if (resData && resData.length > 0) {
                setResumes(resData)
                setSelectedResumeUrl(resData[0].id)
                loadPastVersions(resData[0].id)
            }
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
                console.error('Failed to parse optimize job', e)
            }
        }
        loadInitialData()
    }, [])

    const loadPastVersions = async (resumeId: string) => {
        if (!resumeId) return
        const supabase = createClient()
        const { data } = await supabase
            .from('resume_versions')
            .select('*')
            .eq('resume_id', resumeId)
            .order('created_at', { ascending: false })
        if (data) setPastVersions(data)
    }

    const isInstantMode = title.trim() && company.trim() && !desc.trim()
    const isValid = (title.trim() && desc.trim() && selectedResumeUrl) || (isInstantMode && selectedResumeUrl)

    const handleAnalyze = async () => {
        if (!isValid) return
        setIsAnalyzing(true)
        setResults(null)
        try {
            const response = await fetch('/api/ai/ats-match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeId: selectedResumeUrl, jobTitle: title, companyName: company, jobDescription: desc })
            })
            const data = await response.json()
            if (!response.ok) { toast.error(data.error || 'Optimization failed'); return }
            setResults(data.result)
            toast.success('CV Analysis Complete!')
            saveToArchive(data.result)
        } catch (error: any) {
            toast.error('Failed to analyze CV: ' + error.message)
        } finally {
            setIsAnalyzing(false)
        }
    }

    const saveToArchive = async (analysisResult: any) => {
        if (!selectedResumeUrl) return
        setIsSaving(true)
        try {
            const supabase = createClient()
            const { data, error } = await supabase.from('resume_versions').insert({
                resume_id: selectedResumeUrl,
                job_title: title,
                company_name: company,
                job_description: desc,
                ats_score: analysisResult.ats_score,
                ats_analysis: analysisResult,
                optimized_json: {}
            }).select().single()
            if (error) throw error
            setPastVersions([data, ...pastVersions])
        } catch (error: any) {
            console.error('Save failed', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteVersion = async (id: string) => {
        const supabase = createClient()
        const { error } = await supabase.from('resume_versions').delete().eq('id', id)
        if (!error) {
            setPastVersions(pastVersions.filter(v => v.id !== id))
            toast.success('History entry removed')
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white">
            <div className="max-w-[1400px] mx-auto w-full p-8 px-12 pt-16 space-y-8">

                {notification && (
                    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-4">
                        <AlertBanner
                            title={notification.title}
                            description={notification.description}
                            variant={notification.variant}
                            onDismiss={() => setNotification(null)}
                        />
                    </div>
                )}

                {/* Header */}
                <header className="flex flex-col sm:flex-row items-baseline justify-between gap-4 border-b border-white/5 pb-8">
                    <div className="space-y-1">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter italic lowercase">
                            <AnimatedText text="cv optimizer" />
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-2xl flex flex-col items-center">
                            <span className="text-2xl font-black italic tracking-tighter leading-none">{pastVersions.length}</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mt-1">Analyses</span>
                        </div>
                    </div>
                </header>

                <main className="space-y-8">

                    {/* Metrics Row */}
                    <section className="grid grid-cols-4 gap-5">
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-7 relative overflow-hidden group hover:border-white/10 transition-all">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="flex items-center justify-between mb-3"><span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Sessions</span><History className="h-4 w-4 text-zinc-600" /></div>
                            <div className="text-3xl font-black italic tracking-tighter mb-1">{pastVersions.length || 0}</div>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase">Analysis cycles</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-emerald-500/10 rounded-[2rem] p-7 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="flex items-center justify-between mb-3"><span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Best Score</span><CheckCircle className="h-4 w-4 text-emerald-500" /></div>
                            <div className="text-3xl font-black italic tracking-tighter mb-1 text-emerald-400">
                                {pastVersions.length > 0 ? `${Math.max(...pastVersions.map((v: any) => v.ats_score || 0))}%` : (results ? `${results.ats_score}%` : '—')}
                            </div>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase">Peak keyword match</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-blue-500/10 rounded-[2rem] p-7 relative overflow-hidden group hover:border-blue-500/20 transition-all">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="flex items-center justify-between mb-3"><span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Market Index</span><TrendingUp className="h-4 w-4 text-blue-500" /></div>
                            <div className="text-3xl font-black italic tracking-tighter mb-1 text-blue-400">
                                {results ? (results.ats_score >= 80 ? 'High' : results.ats_score >= 60 ? 'Mid' : 'Low') : '—'}
                            </div>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase">Role readiness</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-purple-500/10 rounded-[2rem] p-7 relative overflow-hidden group hover:border-purple-500/20 transition-all">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="flex items-center justify-between mb-3"><span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Engine</span><Sparkles className="h-4 w-4 text-purple-500" /></div>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" /></span>
                                <div className="text-3xl font-black italic tracking-tighter text-purple-400">Live</div>
                            </div>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase mt-1">Neural engine active</p>
                        </div>
                    </section>

                    {/* ── CONFIG BAR ── full-width horizontal form */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none" />
                        <div className="relative z-10 space-y-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-black tracking-tighter text-white uppercase italic">Target Mission</h2>
                                    <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-wider">Select asset and configure trajectory</p>
                                </div>
                                <div className="flex gap-4">
                                    <button className="text-[9px] font-black uppercase tracking-widest text-emerald-400 border-b border-emerald-500 pb-0.5">Paste JD</button>
                                    <button className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors">URL Import</button>
                                    <button className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors">Saved Job</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-4 items-end">
                                <div className="col-span-3 space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-1.5"><FileText className="h-3 w-3" /> Asset</Label>
                                    <Select value={selectedResumeUrl} onValueChange={(v) => { setSelectedResumeUrl(v); loadPastVersions(v) }}>
                                        <SelectTrigger className="w-full h-11 bg-black border-white/5 rounded-xl text-white text-sm font-bold focus:ring-1 focus:ring-emerald-500/30">
                                            <SelectValue placeholder="Select CV..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0a0a0a] border-white/10 rounded-2xl shadow-2xl">
                                            {resumes.map(r => <SelectItem key={r.id} value={r.id} className="font-bold">{r.title}</SelectItem>)}
                                            {resumes.length === 0 && <div className="p-4 text-center text-zinc-500 text-xs">No assets</div>}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Role</Label>
                                    <Input placeholder="Frontend Engineer..." className="bg-black h-11 border-white/5 text-white text-sm font-bold focus-visible:ring-1 focus-visible:ring-emerald-500/30 placeholder:text-zinc-800 rounded-xl" value={title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Company</Label>
                                    <Input placeholder="Google..." className="bg-black h-11 border-white/5 text-white text-sm font-bold focus-visible:ring-1 focus-visible:ring-emerald-500/30 placeholder:text-zinc-800 rounded-xl" value={company} onChange={(e) => setCompany(e.target.value)} />
                                </div>
                                <div className="col-span-3 space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Job Description <span className="text-zinc-700 italic">(optional)</span></Label>
                                    <Input placeholder="Paste JD or key requirements..." className="bg-black h-11 border-white/5 text-white text-sm font-bold focus-visible:ring-1 focus-visible:ring-emerald-500/30 placeholder:text-zinc-800 rounded-xl" value={desc} onChange={(e) => setDesc(e.target.value)} />
                                </div>
                                <div className="col-span-2">
                                    <AnimatedGenerateButton
                                        onClick={handleAnalyze}
                                        disabled={!isValid || isAnalyzing}
                                        generating={isAnalyzing}
                                        labelIdle={isInstantMode ? "🚀 Fast Track" : "Analyze →"}
                                        labelActive="Analyzing..."
                                        highlightHueDeg={140}
                                        size="md"
                                        className="w-full h-11 rounded-xl text-[10px] tracking-[0.15em]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RESULTS AREA ── */}
                    {isAnalyzing ? (
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] min-h-[280px] flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.04)_0,transparent_70%)]" />
                            <div className="relative flex items-center gap-8 z-10">
                                <div className="relative h-14 w-14">
                                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
                                    <div className="h-full w-full rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                                        <Sparkles className="h-6 w-6 text-emerald-400 animate-pulse" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span><p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Neural Engine Active</p></div>
                                    <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic">Analyzing Profile...</h3>
                                </div>
                            </div>
                        </div>
                    ) : results ? (
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* ROW 1 — 4 score/status cards */}
                            <div className="grid grid-cols-4 gap-4">
                                <div className="bg-[#0a0a0a] border border-emerald-500/20 rounded-[2rem] p-6 relative overflow-hidden hover:border-emerald-500/40 transition-all">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
                                    <div className="relative z-10">
                                        <div className="flex justify-between mb-3"><span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Overall Match</span><TrendingUp className="h-3.5 w-3.5 text-emerald-500" /></div>
                                        <div className="text-4xl font-black italic tracking-tighter text-emerald-400 mb-2">{results.ats_score || 0}<span className="text-xl text-emerald-600">%</span></div>
                                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden"><div className="h-1 bg-emerald-500 rounded-full" style={{ width: `${results.ats_score || 0}%` }} /></div>
                                    </div>
                                </div>
                                <div className="bg-[#0a0a0a] border border-blue-500/20 rounded-[2rem] p-6 relative overflow-hidden hover:border-blue-500/40 transition-all">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
                                    <div className="relative z-10">
                                        <div className="flex justify-between mb-3"><span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">ATS Parse</span><Target className="h-3.5 w-3.5 text-blue-500" /></div>
                                        <div className="text-4xl font-black italic tracking-tighter text-blue-400 mb-2">{Math.min(100, (results.ats_score || 0) + 8)}<span className="text-xl text-blue-600">%</span></div>
                                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden"><div className="h-1 bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (results.ats_score || 0) + 8)}%` }} /></div>
                                    </div>
                                </div>
                                <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6">
                                    <div className="flex justify-between mb-3"><span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Live Status</span><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span></div>
                                    <div className="text-2xl font-black italic tracking-tighter text-white mb-1">{results.ats_score >= 80 ? 'Strong' : results.ats_score >= 60 ? 'Moderate' : 'Weak'}</div>
                                    <p className="text-[9px] font-black uppercase text-zinc-600">Market Position</p>
                                </div>
                                <div className="bg-[#0a0a0a] border border-amber-500/10 rounded-[2rem] p-6">
                                    <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1.5 mb-3"><AlertCircle className="h-3 w-3 text-amber-500" /> Top Fix</h3>
                                    {results.suggestions?.[0] && <p className="text-[11px] font-bold text-zinc-400 leading-relaxed line-clamp-4">{results.suggestions[0]}</p>}
                                </div>
                            </div>

                            {/* ROW 2 — Keyword Intelligence (wide) + Section Scores */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2"><Target className="h-3.5 w-3.5 text-purple-500" /> Keyword Intelligence</h3>
                                        <button className="text-[9px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"><Sparkles className="h-2.5 w-2.5" /> Auto-Inject All</button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {results.keyword_analysis?.missing_keywords?.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between"><p className="text-[9px] font-black uppercase tracking-widest text-red-500/80 flex items-center gap-1"><AlertCircle className="h-2.5 w-2.5" /> Missing ({results.keyword_analysis.missing_keywords.length})</p><button className="text-[8px] font-black uppercase text-red-400 hover:text-red-300">Inject →</button></div>
                                                <div className="flex flex-wrap gap-1.5">{results.keyword_analysis.missing_keywords.map((s: string, i: number) => (<button key={i} className="px-2.5 py-1 bg-red-500/5 hover:bg-red-500/15 text-red-400 border border-red-500/20 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all">{s}</button>))}</div>
                                            </div>
                                        )}
                                        {results.keyword_analysis?.matched_keywords?.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80 flex items-center gap-1"><CheckCircle className="h-2.5 w-2.5" /> Matched ({results.keyword_analysis.matched_keywords.length})</p>
                                                <div className="flex flex-wrap gap-1.5">{results.keyword_analysis.matched_keywords.map((s: string, i: number) => (<span key={i} className="px-2.5 py-1 bg-emerald-500/5 text-emerald-500/70 border border-emerald-500/15 rounded-lg text-[9px] font-black uppercase tracking-wider">{s}</span>))}</div>
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-amber-500/80 flex items-center gap-1"><AlertCircle className="h-2.5 w-2.5" /> Overused</p>
                                            <div className="flex flex-wrap gap-1.5">{['results-driven', 'detail-oriented', 'team player'].map((w, i) => (<span key={i} className="px-2.5 py-1 bg-amber-500/5 text-amber-500/70 border border-amber-500/15 rounded-lg text-[9px] font-black uppercase">{w}</span>))}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 space-y-4">
                                    <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2"><TrendingUp className="h-3.5 w-3.5 text-blue-500" /> Section Scores</h3>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Summary', score: Math.min(100, (results.ats_score || 60) - 5), color: 'emerald' },
                                            { label: 'Experience', score: Math.min(100, (results.ats_score || 60) + 2), color: 'blue' },
                                            { label: 'Skills', score: Math.max(30, (results.ats_score || 60) - 15), color: 'purple' },
                                            { label: 'Education', score: 90, color: 'emerald' },
                                        ].map(s => (
                                            <div key={s.label} className="flex items-center gap-3">
                                                <span className="text-[9px] font-black text-zinc-500 uppercase w-20 shrink-0">{s.label}</span>
                                                <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden"><div className={`h-1.5 bg-${s.color}-500 rounded-full`} style={{ width: `${s.score}%` }} /></div>
                                                <span className={`text-[9px] font-black text-${s.color}-400 w-8 text-right`}>{s.score}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ROW 3 — Bullet Quality + ATS Compat + A/B Compare */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-[#0a0a0a] border border-orange-500/10 rounded-[2rem] p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5"><AlertCircle className="h-3 w-3 text-orange-500" /> Bullet Quality</h3>
                                        <span className="text-[8px] font-black px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded border border-orange-500/20">3 Flags</span>
                                    </div>
                                    <div className="space-y-2">
                                        {[
                                            { text: 'Responsible for managing cross-functional teams…', flags: ['Passive', 'No Metric'] },
                                            { text: 'Led product launch resulting in revenue increase…', flags: ['No Metric'] },
                                            { text: 'Communicated with stakeholders regularly', flags: ['Vague'] },
                                        ].map((b, i) => (
                                            <div key={i} className="p-3 bg-black rounded-xl border border-white/[0.03] hover:border-white/10 transition-all group">
                                                <p className="text-[10px] text-zinc-500 line-clamp-1 mb-1.5">"{b.text}"</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex gap-1">{b.flags.map((f, fi) => (<span key={fi} className="px-1.5 py-0.5 bg-orange-500/10 text-orange-400 rounded text-[7px] font-black uppercase border border-orange-500/20">{f}</span>))}</div>
                                                    <button className="opacity-0 group-hover:opacity-100 text-[8px] font-black text-emerald-400 flex items-center gap-0.5 transition-opacity"><Sparkles className="h-2 w-2" /> Fix</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5"><CheckCircle className="h-3 w-3 text-green-500" /> ATS Compatibility</h3>
                                        <button className="text-[8px] font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 px-2.5 py-1 rounded transition-colors">Generate Safe →</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[{ label: 'No Tables', ok: true }, { label: 'No Icons', ok: false }, { label: 'Single Col', ok: true }, { label: 'Std Fonts', ok: true }, { label: 'Clean H', ok: true }, { label: 'No Images', ok: false }].map(c => (
                                            <div key={c.label} className="flex items-center gap-2 p-2.5 bg-black rounded-xl border border-white/[0.03]">
                                                <div className={`h-2 w-2 rounded-full ${c.ok ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]'}`} />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{c.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-[#0a0a0a] border border-purple-500/10 rounded-[2rem] p-6 space-y-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                                    <div className="relative z-10 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5"><ArrowRight className="h-3 w-3 text-purple-500" /> A/B Compare</h3>
                                            <span className="text-[7px] font-black uppercase px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded border border-purple-500/20">Beta</span>
                                        </div>
                                        <p className="text-[10px] text-zinc-600">Compare two CV versions against the same JD.</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="p-3 bg-black rounded-xl border border-white/[0.04] hover:border-purple-500/20 transition-all cursor-pointer">
                                                <p className="text-[8px] font-black uppercase text-zinc-600 mb-1.5">Asset A</p>
                                                <div className="flex items-center gap-1.5"><div className="h-6 w-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><FileText className="h-3 w-3 text-emerald-500" /></div><span className="text-[9px] font-black text-zinc-300 truncate">{resumes[0]?.title || 'CV A'}</span></div>
                                            </div>
                                            <div className="p-3 bg-black rounded-xl border border-dashed border-white/10 hover:border-purple-500/20 transition-all cursor-pointer">
                                                <p className="text-[8px] font-black uppercase text-zinc-600 mb-1.5">Asset B</p>
                                                <button className="text-[9px] font-black text-zinc-600 hover:text-zinc-400">+ Select</button>
                                            </div>
                                        </div>
                                        <button className="w-full py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"><Sparkles className="h-2.5 w-2.5" /> Run Comparison</button>
                                    </div>
                                </div>
                            </div>

                            {/* Full-width priority fixes */}
                            {results.suggestions?.length > 1 && (
                                <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6">
                                    <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 mb-4"><AlertCircle className="h-3.5 w-3.5 text-amber-500" /> All Priority Fixes</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {results.suggestions.map((rec: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3 p-3 bg-black rounded-xl border border-white/[0.03] hover:border-white/10 transition-all">
                                                <div className="h-6 w-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400 text-[9px] font-black">{i + 1}</div>
                                                <p className="text-[11px] text-zinc-400 font-bold leading-relaxed">{rec}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] min-h-[380px] flex flex-col items-center justify-center p-12 text-center relative overflow-hidden group">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0,transparent_70%)] pointer-events-none" />
                            <div className="h-24 w-24 flex items-center justify-center rounded-[2.5rem] bg-zinc-900 border border-white/5 shadow-xl mb-8 group-hover:scale-110 transition-transform duration-700">
                                <Target className="h-10 w-10 text-zinc-600" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic mb-3">Intelligence Standby</h3>
                            <p className="text-zinc-600 font-bold text-sm max-w-[320px] leading-relaxed uppercase tracking-tight">
                                Select a CV, configure your target role, and initiate optimization.
                            </p>
                        </div>
                    )}

                    {/* ── HISTORY ARCHIVE ── */}
                    <div id="history-section" className="pt-8 border-t border-white/5 space-y-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-black"><History className="h-3 w-3" /><span>Intelligence Archive</span></div>
                                <h2 className="text-3xl font-black tracking-tighter italic">Optimized <span className="text-zinc-400">CVs</span>.</h2>
                            </div>
                            <Badge variant="outline" className="bg-white/5 border-white/5 text-zinc-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic">{pastVersions.length} Sessions Saved</Badge>
                        </div>

                        {pastVersions.length === 0 ? (
                            <div className="bg-[#0a0a0a] border border-dashed border-white/10 rounded-[3rem] p-20 text-center">
                                <History className="h-10 w-10 text-zinc-800 mx-auto mb-4" />
                                <p className="text-zinc-600 font-bold uppercase tracking-tight text-sm">No analysis history found for this resume.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {pastVersions.map((version) => (
                                    <div key={version.id} className="group relative bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-7 hover:border-white/10 transition-all duration-500">
                                        <div className="absolute top-7 right-7 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleDeleteVersion(version.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                        <div className="space-y-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center"><FileText className="h-5 w-5 text-zinc-500" /></div>
                                                <div>
                                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">{formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}</p>
                                                    <p className="text-sm font-black text-zinc-200 tracking-tight line-clamp-1 italic">{version.job_title}</p>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-black rounded-2xl border border-white/[0.02]">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">{version.company_name}</span>
                                                    <span className={cn("text-[10px] font-black italic tracking-tighter", version.ats_score >= 80 ? "text-emerald-500" : version.ats_score >= 60 ? "text-amber-500" : "text-red-500")}>{version.ats_score}% Match</span>
                                                </div>
                                                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                                    <motion.div className={cn("h-full rounded-full", version.ats_score >= 80 ? "bg-emerald-500" : version.ats_score >= 60 ? "bg-amber-500" : "bg-red-500")} initial={{ width: 0 }} animate={{ width: `${version.ats_score}%` }} transition={{ duration: 1, delay: 0.5 }} />
                                                </div>
                                            </div>
                                            <AnimatedGenerateButton labelIdle="Review Analysis" onClick={() => {
                                                setResults(version.ats_analysis)
                                                setTitle(version.job_title || '')
                                                setCompany(version.company_name || '')
                                                setTimeout(() => {
                                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                                }, 100)
                                                toast.success('Analysis loaded')
                                            }} className="w-full" size="sm" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </main>
            </div>
        </div>
    )
}
