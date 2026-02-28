'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Search, Briefcase, ExternalLink, Loader2, Bookmark, BookmarkCheck, FileCheck2, Sparkles, X, TrendingUp, CheckCircle2, Circle, Trash2, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

export default function JobsPage() {
    const [jobQuery, setJobQuery] = useState('')
    const [location, setLocation] = useState('Remote')
    const [jobs, setJobs] = useState<any[]>([])
    const [isJobsLoading, setIsJobsLoading] = useState(false)
    const [jobError, setJobError] = useState<string | null>(null)
    const [hasSearched, setHasSearched] = useState(false)

    // Saved jobs state
    const [savedJobs, setSavedJobs] = useState<any[]>([])
    const [isLoadingSaved, setIsLoadingSaved] = useState(true)
    const [savingJobUrls, setSavingJobUrls] = useState<Set<string>>(new Set())

    // Quick cover letter / Batch generation state
    const [resumes, setResumes] = useState<any[]>([])
    const [letterJobTargets, setLetterJobTargets] = useState<any[]>([]) // array of jobs to process
    const [selectedResumeForLetter, setSelectedResumeForLetter] = useState('')
    const [isGeneratingLetter, setIsGeneratingLetter] = useState(false)
    const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 })
    const [generationComplete, setGenerationComplete] = useState(false)

    // Multi-select state
    const [selectedJobs, setSelectedJobs] = useState<any[]>([])

    // Handlers for Selection
    const toggleJobSelection = (job: any, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setSelectedJobs(prev => {
            const exists = prev.find(j => (j.jobUrl || j.job_url) === (job.jobUrl || j.job_url))
            if (exists) {
                return prev.filter(j => (j.jobUrl || j.job_url) !== (job.jobUrl || j.job_url))
            }
            return [...prev, job]
        })
    }
    const isJobSelected = (job: any) => selectedJobs.some(j => (j.jobUrl || j.job_url) === (job.jobUrl || j.job_url))

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const res = await fetch('/api/jobs/list')
                const data = await res.json()
                if (data.success) {
                    setSavedJobs(data.jobs)
                }
            } catch (error) {
                console.error('Failed to load saved jobs', error)
            } finally {
                setIsLoadingSaved(false)
            }
        }
        fetchSavedJobs()

        // Fetch user's resumes for letter generation
        const fetchResumes = async () => {
            const supabase = createClient()
            const { data } = await supabase.from('resumes').select('id, title').order('created_at', { ascending: false })
            if (data && data.length > 0) {
                setResumes(data)
                setSelectedResumeForLetter(data[0].id)
            }
        }
        fetchResumes()
    }, [])

    const handleJobSearch = async () => {
        if (!jobQuery.trim()) return
        setIsJobsLoading(true)
        setJobs([])
        setJobError(null)
        setHasSearched(true)
        try {
            const res = await fetch('/api/linkedin/search-jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: jobQuery.trim(), location: location.trim() })
            })
            const data = await res.json()
            if (!res.ok) {
                setJobError(data.error || 'Search failed')
                toast.error(data.error || 'Job search failed')
            } else if (data.jobs && data.jobs.length > 0) {
                setJobs(data.jobs)
            } else {
                setJobError('No jobs found for this search. Try different keywords.')
            }
        } catch (error: any) {
            setJobError('Failed to connect to job search service.')
            toast.error('Search failed: ' + error.message)
        } finally {
            setIsJobsLoading(false)
        }
    }

    const handleSaveJob = async (job: any) => {
        setSavingJobUrls(prev => new Set(prev).add(job.jobUrl))
        try {
            const res = await fetch('/api/jobs/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: job.title || job.title,
                    companyName: job.companyName || job.company_name,
                    location: job.location,
                    jobUrl: job.jobUrl || job.job_url,
                    salary: job.salary,
                    description: job.description,
                    companyLogo: job.companyLogo || job.company_logo
                })
            })
            const data = await res.json()
            if (res.ok && data.success) {
                toast.success('Job saved!')
                setSavedJobs(prev => [data.job, ...prev.filter(j => j.job_url !== (job.jobUrl || j.job_url))])
            } else {
                toast.error(data.error || 'Failed to save job.')
            }
        } catch (error: any) {
            toast.error('Error saving job')
        } finally {
            setSavingJobUrls(prev => {
                const next = new Set(prev)
                next.delete(job.jobUrl || job.job_url)
                return next
            })
        }
    }

    const [deletingJobIds, setDeletingJobIds] = useState<Set<string>>(new Set())

    const handleDeleteSavedJob = async (jobId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setDeletingJobIds(prev => new Set(prev).add(jobId))
        try {
            const res = await fetch('/api/jobs/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: jobId })
            })
            const data = await res.json()
            if (res.ok && data.success) {
                toast.success('Job removed from saved list')
                setSavedJobs(prev => prev.filter(j => j.id !== jobId))
                setSelectedJobs(prev => prev.filter(j => j.id !== jobId))
            } else {
                toast.error(data.error || 'Failed to delete job')
            }
        } catch (error) {
            toast.error('Error deleting job')
        } finally {
            setDeletingJobIds(prev => {
                const next = new Set(prev)
                next.delete(jobId)
                return next
            })
        }
    }

    const isJobSaved = (url: string) => savedJobs.some(j => j.job_url === url)

    const handleBatchLetters = async () => {
        if (letterJobTargets.length === 0 || !selectedResumeForLetter) return
        setIsGeneratingLetter(true)
        setGenerationComplete(false)
        setGenerationProgress({ current: 0, total: letterJobTargets.length })

        let successCount = 0;

        for (let i = 0; i < letterJobTargets.length; i++) {
            const target = letterJobTargets[i];
            setGenerationProgress({ current: i + 1, total: letterJobTargets.length })
            try {
                const res = await fetch('/api/ai/generate-letter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        resumeId: selectedResumeForLetter,
                        jobTitle: target.title,
                        companyName: target.companyName || target.company_name,
                        jobDescription: target.description || `${target.title} at ${target.companyName || target.company_name}`
                    })
                })
                const data = await res.json()
                if (res.ok) {
                    successCount++;
                } else {
                    toast.error(`Failed for ${target.companyName || target.company_name}: ${data.error}`)
                }
            } catch (err: any) {
                toast.error(`Error for ${target.companyName || target.company_name}: ` + err.message)
            }
        }

        setIsGeneratingLetter(false)
        if (successCount > 0) {
            toast.success(`Successfully generated ${successCount} cover letters!`)
            setGenerationComplete(true)
            setSelectedJobs([]) // Clear selection on success
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-white">
            <div className="max-w-7xl mx-auto w-full p-8 px-12 space-y-12">

                <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between pb-4 gap-8">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Job Finder
                        </h1>
                        {!hasSearched && savedJobs.length > 0 && (
                            <Badge variant="outline" className="h-5 bg-white/5 border-white/10 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                                {savedJobs.length} Saved
                            </Badge>
                        )}
                    </div>

                    <div className="flex w-full xl:w-auto items-center gap-2 bg-[#0a0a0a] p-1.5 rounded-2xl border border-white/10">
                        <div className="relative flex-1 xl:w-[300px]">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
                            <Input
                                placeholder="Search Jobs..."
                                className="h-10 pl-10 bg-transparent border-none focus-visible:ring-0 text-white text-sm placeholder:text-zinc-600"
                                value={jobQuery}
                                onChange={(e) => setJobQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleJobSearch()}
                            />
                        </div>
                        <div className="h-4 w-px bg-white/5" />
                        <div className="relative w-full xl:w-[150px]">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
                            <Input
                                placeholder="Location"
                                className="h-10 pl-10 bg-transparent border-none focus-visible:ring-0 text-white text-sm placeholder:text-zinc-600"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleJobSearch()}
                            />
                        </div>
                        <Button
                            onClick={handleJobSearch}
                            disabled={isJobsLoading}
                            className="h-9 px-6 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl text-xs"
                        >
                            {isJobsLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Search'}
                        </Button>
                    </div>
                </header>

                <main>
                    {!hasSearched ? (
                        <div className="space-y-12">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Saved Opportunities</h2>
                                <Button variant="ghost" className="text-xs text-zinc-500 hover:text-white font-bold h-8">Sort by Date <ChevronDown className="h-3 w-3 ml-1 opacity-50" /></Button>
                            </div>

                            {isLoadingSaved ? (
                                <div className="py-24 flex justify-center w-full">
                                    <Loader2 className="h-6 w-6 animate-spin text-zinc-800" />
                                </div>
                            ) : savedJobs.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {savedJobs.map((savedJob) => {
                                        const selected = isJobSelected(savedJob)
                                        return (
                                            <div key={savedJob.id}
                                                onClick={() => toggleJobSelection(savedJob)}
                                                className={`flex flex-col border rounded-[2rem] bg-[#0a0a0a] transition-all cursor-pointer group relative overflow-hidden ${selected ? 'border-white/40 ring-1 ring-white/10 shadow-2xl shadow-white/5' : 'border-white/10 hover:border-white/20'}`}>

                                                <div className="p-8 pb-4">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                                                            {savedJob.company_logo ? (
                                                                <img src={savedJob.company_logo} alt={savedJob.company_name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-lg font-bold text-zinc-500">{savedJob.company_name?.charAt(0) || 'C'}</span>
                                                            )}
                                                        </div>
                                                        <div className={`h-5 w-5 rounded-full border border-white/10 flex items-center justify-center transition-all ${selected ? 'bg-white border-white' : 'group-hover:border-white/30'}`}>
                                                            {selected && <CheckCircle2 className="h-3 w-3 text-black fill-black" />}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <h4 className="font-bold text-lg text-white leading-tight line-clamp-1">{savedJob.title}</h4>
                                                        <p className="text-sm font-medium text-emerald-500/80">{savedJob.company_name}</p>
                                                    </div>
                                                </div>

                                                <div className="px-8 pb-6 flex-1 space-y-4">
                                                    <div className="flex items-center gap-3 text-xs font-bold text-zinc-500">
                                                        <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-50" /> {savedJob.location || 'Remote'}</div>
                                                        <div className="h-1 w-1 rounded-full bg-zinc-800" />
                                                        <div>{new Date(savedJob.created_at).toLocaleDateString()}</div>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed h-8">
                                                        {savedJob.description || "No preview description available."}
                                                    </p>
                                                </div>

                                                <div className="p-6 pt-0 mt-auto flex items-center justify-between gap-3 border-t border-white/5">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="flex-1 h-10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl gap-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            sessionStorage.setItem('optimizeJob', JSON.stringify({
                                                                title: savedJob.title, companyName: savedJob.company_name, description: savedJob.description
                                                            }))
                                                            window.location.href = '/dashboard/optimize'
                                                        }}
                                                    >
                                                        <Sparkles className="h-3.5 w-3.5 text-emerald-500" /> Optimize
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => handleDeleteSavedJob(savedJob.id, e)}
                                                        disabled={deletingJobIds.has(savedJob.id)}
                                                        className="h-10 w-10 p-0 text-zinc-600 hover:text-red-500 hover:bg-red-50 rounded-xl"
                                                    >
                                                        {deletingJobIds.has(savedJob.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="border border-white/10 border-dashed rounded-[2rem] p-24 bg-[#0a0a0a] flex flex-col items-center justify-center text-center">
                                    <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                                        <Briefcase className="h-8 w-8 text-zinc-700" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No saved jobs yet</h3>
                                    <p className="text-zinc-500 text-sm max-w-sm mb-8">
                                        Search and save jobs you're interested in to manage your pipeline efficiently.
                                    </p>
                                    <Button
                                        onClick={() => setJobQuery('Frontend Developer')}
                                        className="bg-white text-black hover:bg-zinc-200 font-bold px-8 rounded-xl h-12"
                                    >
                                        Explore Jobs
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-sm font-bold text-white uppercase tracking-widest">Search Results</h2>
                                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none px-2 py-0.5 font-bold uppercase tracking-widest text-[10px]">{jobs.length} found</Badge>
                                </div>
                                <Button variant="ghost" className="text-xs text-zinc-500 hover:text-white font-bold h-8" onClick={() => setHasSearched(false)}>Back to list</Button>
                            </div>

                            {isJobsLoading ? (
                                <div className="py-32 flex flex-col items-center justify-center text-center">
                                    <Loader2 className="h-12 w-12 animate-spin text-zinc-800 mb-6" />
                                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Scanning LinkedIn for latest roles...</p>
                                </div>
                            ) : jobError ? (
                                <div className="py-24 border border-white/10 rounded-[2rem] bg-[#0a0a0a] flex flex-col items-center justify-center text-center">
                                    <div className="h-12 w-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                                        <X className="h-6 w-6 text-red-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Search Error</h3>
                                    <p className="text-red-500 text-sm font-medium">{jobError}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {jobs.map((job, i) => {
                                        const saved = isJobSaved(job.jobUrl)
                                        const saving = savingJobUrls.has(job.jobUrl)
                                        const selected = isJobSelected(job)

                                        return (
                                            <div key={i}
                                                onClick={() => toggleJobSelection(job)}
                                                className={`flex flex-col border rounded-[2rem] bg-[#0a0a0a] transition-all cursor-pointer group relative ${selected ? 'border-white/40 ring-1 ring-white/10 shadow-2xl shadow-white/5' : 'border-white/10 hover:border-white/20'}`}>

                                                <div className="p-8 pb-4">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                                                            {job.companyLogo ? (
                                                                <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-lg font-bold text-zinc-500">{job.companyName?.charAt(0) || 'C'}</span>
                                                            )}
                                                        </div>
                                                        <div className={`h-5 w-5 rounded-full border border-white/10 flex items-center justify-center transition-all ${selected ? 'bg-white border-white' : 'group-hover:border-white/30'}`}>
                                                            {selected && <CheckCircle2 className="h-3 w-3 text-black fill-black" />}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <h4 className="font-bold text-lg text-white leading-tight line-clamp-1">{job.title}</h4>
                                                        <p className="text-sm font-medium text-emerald-500/80">{job.companyName}</p>
                                                    </div>
                                                </div>

                                                <div className="px-8 pb-6 flex-1 space-y-4">
                                                    <div className="flex items-center gap-3 text-xs font-bold text-zinc-500">
                                                        <div className="flex items-center gap-1"><MapPin className="h-3 w-3 opacity-50" /> {job.location || 'Remote'}</div>
                                                        <div className="h-1 w-1 rounded-full bg-zinc-800" />
                                                        <div>{job.postedAt || 'Recently'}</div>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed h-8">
                                                        {job.description || "No preview description available."}
                                                    </p>
                                                </div>

                                                <div className="p-6 pt-0 mt-auto flex items-center justify-between gap-3 border-t border-white/5">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={saving || saved}
                                                        onClick={(e) => { e.stopPropagation(); handleSaveJob(job) }}
                                                        className={`flex-1 h-10 font-bold text-xs rounded-xl gap-2 border bg-white/5 shadow-sm transition-all ${saved ? 'text-emerald-500 border-white/5' : 'text-white border-white/5 hover:bg-white/10'}`}
                                                    >
                                                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5 opacity-50" />}
                                                        {saved ? 'Saved' : 'Save'}
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                        className="h-10 w-10 p-0 text-zinc-600 hover:text-white hover:bg-white/5 rounded-xl"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="h-3.5 w-3.5" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </main>

                {/* Batch Cover Letter Modal - Overhauled to Dark */}
                {letterJobTargets.length > 0 && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => { if (!isGeneratingLetter && !generationComplete) setLetterJobTargets([]) }}>
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <div className="p-10 pb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <Sparkles className="h-6 w-6 text-emerald-500" />
                                        Magic Letters
                                    </h3>
                                    <p className="text-sm font-medium text-zinc-500 mt-2">Crafting {letterJobTargets.length} personalized documents</p>
                                </div>
                                {!isGeneratingLetter && (
                                    <button onClick={() => setLetterJobTargets([])} className="h-10 w-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-zinc-600 hover:text-white transition-colors">
                                        <X className="h-6 w-6" />
                                    </button>
                                )}
                            </div>

                            <div className="p-10 pt-4">
                                {!generationComplete ? (
                                    <div className="space-y-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] block">Base Foundation</label>
                                            {resumes.length === 0 ? (
                                                <p className="text-sm text-zinc-500 bg-white/5 p-4 rounded-2xl border border-white/5">No resumes found. Create one in the Builder first.</p>
                                            ) : (
                                                <div className="relative group">
                                                    <select
                                                        className="w-full h-14 bg-black border border-white/10 group-hover:border-white/20 rounded-2xl px-5 text-sm font-bold text-white appearance-none cursor-pointer outline-none transition-all"
                                                        value={selectedResumeForLetter}
                                                        onChange={(e) => setSelectedResumeForLetter(e.target.value)}
                                                    >
                                                        {resumes.map(r => (
                                                            <option key={r.id} value={r.id}>{r.title || 'Untitled Resume'}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none group-hover:text-white transition-colors" />
                                                </div>
                                            )}
                                        </div>

                                        {!isGeneratingLetter ? (
                                            <Button
                                                onClick={handleBatchLetters}
                                                disabled={resumes.length === 0}
                                                className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl gap-3 shadow-[0_0_30px_rgba(255,255,255,0.05)] text-base"
                                            >
                                                <Sparkles className="h-5 w-5" />
                                                Generate Now
                                            </Button>
                                        ) : (
                                            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 text-center">
                                                <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mx-auto mb-6" />
                                                <h4 className="font-bold text-white mb-2 text-lg">AI is writing...</h4>
                                                <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
                                                    Page {generationProgress.current} / {generationProgress.total}
                                                </p>
                                                <div className="w-full bg-white/5 rounded-full h-1.5 mt-8 overflow-hidden">
                                                    <div
                                                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                                        style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-8 text-center py-6">
                                        <div className="h-20 w-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-3">Generation Complete</h3>
                                            <p className="text-zinc-500 text-sm max-w-[280px] mx-auto leading-relaxed font-medium">
                                                All cover letters have been securely saved to your archive as beautiful documents.
                                            </p>
                                        </div>
                                        <div className="flex gap-4 pt-6">
                                            <Button
                                                variant="outline"
                                                className="flex-1 h-14 font-bold border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-2xl"
                                                onClick={() => setLetterJobTargets([])}
                                            >
                                                Done
                                            </Button>
                                            <Button
                                                className="flex-1 h-14 font-bold bg-white text-black hover:bg-zinc-200 rounded-2xl"
                                                onClick={() => window.location.href = '/dashboard/letters'}
                                            >
                                                View Archive
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Floating Action Bar - Overhauled to Dark */}
                {selectedJobs.length > 0 && (
                    <div className="fixed bottom-10 left-0 right-0 z-40 flex justify-center px-4 animate-in slide-in-from-bottom-10 duration-500">
                        <div className="bg-[#0a0a0a] border border-white/10 text-white px-8 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-10">
                            <div className="flex items-center gap-4">
                                <div className="bg-emerald-500 text-black text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                    {selectedJobs.length}
                                </div>
                                <span className="font-bold text-sm tracking-tight">Active Selection</span>
                            </div>
                            <div className="flex items-center gap-6 border-l border-white/10 pl-10">
                                <button
                                    onClick={() => setSelectedJobs([])}
                                    className="text-xs font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest"
                                >
                                    Clear
                                </button>
                                <Button
                                    className="h-11 px-6 gap-2.5 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl shadow-2xl transition-all active:scale-95"
                                    onClick={() => setLetterJobTargets(selectedJobs)}
                                >
                                    <Sparkles className="h-4 w-4 text-emerald-500" /> Magic Letters
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
