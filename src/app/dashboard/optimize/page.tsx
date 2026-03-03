'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AnimatedText from '@/components/ui/animated-text'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Target, Sparkles, Loader2, CheckCircle, AlertCircle, TrendingUp, History, Download, Trash2, ArrowRight, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
import { Gauge } from '@/components/ui/gauge'
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

            // Fetch resumes
            const { data: resData } = await supabase.from('resumes').select('id, title').order('created_at', { ascending: false })
            if (resData && resData.length > 0) {
                setResumes(resData)
                setSelectedResumeUrl(resData[0].id)
                loadPastVersions(resData[0].id)
            }

            // Check session storage
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

            // Automatically save to archive
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

            // Create a version entry
            const { data, error } = await supabase.from('resume_versions').insert({
                resume_id: selectedResumeUrl,
                job_title: title,
                company_name: company,
                job_description: desc,
                ats_score: analysisResult.ats_score,
                ats_analysis: analysisResult,
                optimized_json: {} // We reuse the original for now
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
            <div className="max-w-7xl mx-auto w-full p-8 px-12 pt-16 space-y-12">

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

                {/* Simplified Header */}
                <header className="flex flex-col sm:flex-row items-baseline justify-between gap-4 border-b border-white/5 pb-8 mb-8">
                    <div className="space-y-1">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter italic lowercase">
                            cv optimizer
                        </h1>
                    </div>
                </header>

                <main className="space-y-24">

                    {/* Metrics Section */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 group hover:border-white/20 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Analysis Cycles</span>
                                <AlertCircle className="h-4 w-4 text-zinc-500" />
                            </div>
                            <div className="text-3xl font-black italic tracking-tighter mb-1">12</div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase">Recent optimizations</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 group hover:border-white/20 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Matched Ratio</span>
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div className="text-3xl font-black italic tracking-tighter mb-1 text-emerald-400">72%</div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase">Keyword density</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 group hover:border-white/20 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Market Index</span>
                                <TrendingUp className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="text-3xl font-black italic tracking-tighter mb-1 text-blue-400">High</div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase">Readiness level</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 group hover:border-white/20 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">ATS Version</span>
                                <Sparkles className="h-4 w-4 text-purple-500" />
                            </div>
                            <div className="text-3xl font-black italic tracking-tighter mb-1 text-purple-400">V4.2</div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase">Neural engine status</p>
                        </div>
                    </section>

                    <div className="flex flex-col lg:flex-row gap-12 items-start">

                        {/* Left Column - Form */}
                        <div className="lg:w-[450px] shrink-0 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 shadow-3xl">
                            <div className="space-y-10">
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic mb-1">Job Details</h2>
                                    <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">Configure target landscape</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Job Title</Label>
                                        <Input
                                            placeholder="e.g. Frontend Developer"
                                            className="bg-black h-14 border-white/5 text-white text-sm font-bold focus-visible:ring-1 focus-visible:ring-white/10 placeholder:text-zinc-800 rounded-2xl transition-all"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Company</Label>
                                        <Input
                                            placeholder="e.g. Google"
                                            className="bg-black h-14 border-white/5 text-white text-sm font-bold focus-visible:ring-1 focus-visible:ring-white/10 placeholder:text-zinc-800 rounded-2xl transition-all"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Job Description</Label>
                                        <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/5 italic">Optional</span>
                                    </div>
                                    <Textarea
                                        placeholder="Paste the full job description here..."
                                        className="min-h-[200px] bg-black resize-none border-white/5 p-6 leading-relaxed text-sm text-zinc-300 focus-visible:ring-1 focus-visible:ring-white/10 placeholder:text-zinc-800 rounded-2xl transition-all"
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
                                    className="w-full h-16 rounded-[1.5rem]"
                                />
                            </div>
                        </div>

                        {/* Right Column - Results */}
                        <div className="flex-1 min-h-[800px]">
                            {results ? (
                                <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-1000">

                                    {/* Main Analysis Card */}
                                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 z-20">
                                            {results.is_predicted && (
                                                <div className="bg-[#1d4ed8] text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-2xl flex items-center gap-2 italic">
                                                    <Sparkles className="h-4 w-4" />
                                                    AI Predicted Match
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-center justify-center py-16 relative">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

                                            <div className="shrink-0 flex items-center justify-center relative z-10">
                                                <Gauge
                                                    value={results.ats_score}
                                                    size="large"
                                                    showValue={true}
                                                    label="ATS MATCH"
                                                    className="drop-shadow-[0_0_80px_rgba(16,185,129,0.05)]"
                                                />
                                            </div>
                                            <p className="text-zinc-500 font-bold text-lg leading-relaxed max-w-sm text-center mt-12 relative z-10 italic">
                                                {results.ats_score >= 80 ? 'Excellent match for this role.' : results.ats_score >= 60 ? 'Good match. Some optimizations could boost your visibility.' : 'Minimal match. Significant updates are required.'}
                                            </p>
                                        </div>

                                        {/* Requirements Grid */}
                                        {results.predicted_requirements && results.predicted_requirements.length > 0 && (
                                            <div className="mt-16 p-10 bg-[#111111]/50 border border-white/5 rounded-[2.5rem] relative z-10">
                                                <div className="flex items-center justify-between mb-8">
                                                    <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] flex items-center gap-3">
                                                        <Target className="h-4 w-4" /> Predicted Requirements
                                                    </h3>
                                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-zinc-800">Industry Standard</span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {results.predicted_requirements.map((req: string, i: number) => (
                                                        <div key={i} className="text-[12px] text-zinc-400 flex items-center gap-4 font-bold bg-black p-4 rounded-2xl border border-white/[0.02]">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                                            <span className="line-clamp-1 uppercase tracking-tight">{req}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Tag Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 relative z-10">
                                            {results.keyword_analysis?.missing_keywords && results.keyword_analysis.missing_keywords.length > 0 && (
                                                <div className="bg-[#0f0a0a] border border-red-500/10 p-8 rounded-[2rem] space-y-6">
                                                    <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                                        <AlertCircle className="h-4 w-4" /> Missing
                                                    </h3>
                                                    <div className="flex flex-wrap gap-3">
                                                        {results.keyword_analysis.missing_keywords.map((skill: string, i: number) => (
                                                            <span key={i} className="px-4 py-2 bg-red-500/5 text-red-500/90 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-wider">{skill}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {results.keyword_analysis?.matched_keywords && results.keyword_analysis.matched_keywords.length > 0 && (
                                                <div className="bg-[#0a0f0a] border border-emerald-500/10 p-8 rounded-[2rem] space-y-6">
                                                    <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                                        <CheckCircle className="h-4 w-4" /> Matched
                                                    </h3>
                                                    <div className="flex flex-wrap gap-3">
                                                        {results.keyword_analysis.matched_keywords.map((skill: string, i: number) => (
                                                            <span key={i} className="px-4 py-2 bg-emerald-500/5 text-emerald-500/90 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-wider">{skill}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Strategy Section */}
                                        {results.suggestions && (
                                            <div className="mt-16 pt-16 border-t border-white/5 relative z-10">
                                                <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic mb-8">Expert Strategy</h3>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {results.suggestions.map((rec: string, i: number) => (
                                                        <div key={i} className="flex items-center gap-6 bg-[#111111] p-6 rounded-[1.5rem] border border-white/5 hover:border-white/10 transition-all duration-300 group">
                                                            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                                <Sparkles className="h-6 w-6 text-blue-400" />
                                                            </div>
                                                            <p className="text-[13px] text-zinc-200 font-bold leading-relaxed">{rec}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] h-full min-h-[700px] flex flex-col items-center justify-center p-12 text-center relative overflow-hidden group">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0,transparent_70%)] pointer-events-none" />

                                    <div className="h-32 w-32 flex items-center justify-center rounded-[2.5rem] bg-zinc-900 border border-white/5 shadow-3xl mb-12 group-hover:scale-110 transition-transform duration-700">
                                        <div className="p-6 bg-white/5 rounded-2xl">
                                            <Target className="h-12 w-12 text-zinc-500" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tighter text-white uppercase italic mb-4">Ready for Analysis</h3>
                                    <p className="text-zinc-500 font-bold text-sm max-w-[320px] leading-relaxed uppercase tracking-tight">
                                        {isAnalyzing ? 'Our AI is dissecting your CV against the role requirements...' : 'Paste a job description and select a resume to unlock your professional match score and strategic insights.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* History Archive Section */}
                    <div id="history-section" className="pt-24 border-t border-white/5 space-y-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-black">
                                    <History className="h-3 w-3" />
                                    <span>Intelligence Archive</span>
                                </div>
                                <h2 className="text-4xl font-black tracking-tighter italic">Optimized <span className="text-zinc-400">CVs</span>.</h2>
                                <p className="text-zinc-500 text-sm font-medium max-w-xl">
                                    Access your historical analysis reports and strategic optimizations for previously targeted roles.
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className="bg-white/5 border-white/5 text-zinc-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic">
                                    {pastVersions.length} Sessions Saved
                                </Badge>
                            </div>
                        </div>

                        {pastVersions.length === 0 ? (
                            <div className="bg-[#0a0a0a] border border-dashed border-white/10 rounded-[3rem] p-24 text-center">
                                <History className="h-12 w-12 text-zinc-800 mx-auto mb-6" />
                                <p className="text-zinc-600 font-bold uppercase tracking-tight text-sm">No analysis history found for this resume.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pastVersions.map((version) => (
                                    <div key={version.id} className="group relative bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 hover:border-white/10 transition-all duration-500">
                                        <div className="absolute top-8 right-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleDeleteVersion(version.id)}
                                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                                                        <FileText className="h-5 w-5 text-zinc-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">
                                                            {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                                                        </p>
                                                        <p className="text-sm font-black text-zinc-200 tracking-tight line-clamp-1 italic">{version.job_title}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-5 bg-black rounded-2xl border border-white/[0.02]">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">{version.company_name}</span>
                                                    <span className={cn(
                                                        "text-[10px] font-black italic tracking-tighter",
                                                        version.ats_score >= 80 ? "text-emerald-500" : version.ats_score >= 60 ? "text-amber-500" : "text-red-500"
                                                    )}>
                                                        {version.ats_score}% Match
                                                    </span>
                                                </div>
                                                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className={cn(
                                                            "h-full h-1 rounded-full",
                                                            version.ats_score >= 80 ? "bg-emerald-500" : version.ats_score >= 60 ? "bg-amber-500" : "bg-red-500"
                                                        )}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${version.ats_score}%` }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                    />
                                                </div>
                                            </div>

                                            <AnimatedGenerateButton
                                                labelIdle="Review Analysis"
                                                onClick={() => setResults(version.ats_analysis)}
                                                className="w-full"
                                                size="sm"
                                            />
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
