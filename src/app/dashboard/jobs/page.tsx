'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Search, Briefcase, ExternalLink, Loader2, Bookmark, BookmarkCheck, FileCheck2, Sparkles, X, TrendingUp, CheckCircle2, Circle, Trash2 } from 'lucide-react'
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
            const exists = prev.find(j => (j.jobUrl || j.job_url) === (job.jobUrl || job.job_url))
            if (exists) {
                return prev.filter(j => (j.jobUrl || j.job_url) !== (job.jobUrl || job.job_url))
            }
            return [...prev, job]
        })
    }
    const isJobSelected = (job: any) => selectedJobs.some(j => (j.jobUrl || j.job_url) === (job.jobUrl || job.job_url))

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
                setSavedJobs(prev => [data.job, ...prev.filter(j => j.job_url !== (job.jobUrl || job.job_url))])
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
        <div className="flex flex-col min-h-screen bg-white w-full font-sans">
            <div className="max-w-7xl mx-auto w-full p-8 space-y-8">

                <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between pb-8 border-b border-slate-100 gap-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                            <Briefcase className="h-5 w-5 text-slate-700" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-[#1E293B] leading-none mb-1">
                                Job Finder
                            </h1>
                            <p className="text-[#64748B] text-xs font-medium uppercase tracking-wider">
                                Power Search (100 Results Limit)
                            </p>
                        </div>
                    </div>

                    <div className="flex w-full xl:w-auto items-center gap-3 bg-white p-1 rounded-xl">
                        <div className="relative flex-1 xl:w-[350px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search Jobs (e.g. 'Frontend Developer')"
                                className="h-11 pl-9 bg-white border-slate-200 focus:bg-white text-sm"
                                value={jobQuery}
                                onChange={(e) => setJobQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleJobSearch()}
                            />
                        </div>
                        <div className="relative w-full xl:w-[200px]">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Location"
                                className="h-11 pl-9 bg-white border-slate-200 focus:bg-white text-sm"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleJobSearch()}
                            />
                        </div>
                        <Button
                            onClick={handleJobSearch}
                            disabled={isJobsLoading}
                            className="h-11 px-8 bg-[#2563EB] hover:bg-blue-700 text-white font-medium rounded-lg"
                        >
                            {isJobsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                        </Button>
                    </div>
                </header>

                <main>
                    {!hasSearched ? (
                        <>
                            <div className="mb-8">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Start Your Search</h3>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Saved Jobs</h3>

                                {isLoadingSaved ? (
                                    <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading saved jobs...</div>
                                ) : savedJobs.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {savedJobs.map((savedJob) => {
                                            const selected = isJobSelected(savedJob)
                                            return (
                                                <div key={savedJob.id}
                                                    onClick={() => toggleJobSelection(savedJob)}
                                                    className={`flex flex-col sm:flex-row gap-5 border p-5 rounded-2xl bg-white transition-all cursor-pointer ${selected ? 'border-blue-500 shadow-sm ring-1 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'}`}>
                                                    <div className="h-14 w-14 rounded-xl flex items-center justify-center shrink-0 bg-[#3B82F6] text-white overflow-hidden shadow-sm">
                                                        {savedJob.company_logo ? (
                                                            <img src={savedJob.company_logo} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xl font-bold">{savedJob.company_name?.charAt(0) || 'C'}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0 flex flex-col">
                                                        <div className="flex items-start justify-between gap-4 mb-2">
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                                <h4 className="font-bold text-[17px] text-[#2563EB] leading-snug">{savedJob.title}</h4>
                                                                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{new Date(savedJob.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="text-slate-300 shrink-0">
                                                                {selected ? <CheckCircle2 className="h-6 w-6 text-blue-500 fill-blue-50" /> : <Circle className="h-6 w-6 text-slate-200 hover:text-slate-300 transition-colors" />}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mb-3">
                                                            <div className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-slate-400" />{savedJob.company_name}</div>
                                                            <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-400" />{savedJob.location || 'Remote'}</div>
                                                        </div>

                                                        <p className="text-sm text-slate-500 line-clamp-2 mb-5 leading-relaxed">
                                                            {savedJob.description || "No preview description available."}
                                                        </p>

                                                        <div className="flex items-center gap-2 mt-auto">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 shadow-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 gap-2 font-semibold text-xs rounded-lg px-3"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    sessionStorage.setItem('optimizeJob', JSON.stringify({
                                                                        title: savedJob.title, companyName: savedJob.company_name, description: savedJob.description
                                                                    }))
                                                                    window.location.href = '/dashboard/optimize?from=search'
                                                                }}
                                                            >
                                                                <TrendingUp className="h-3.5 w-3.5 text-slate-400" /> Optimize CV
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => handleDeleteSavedJob(savedJob.id, e)}
                                                                disabled={deletingJobIds.has(savedJob.id)}
                                                                className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                                                            >
                                                                {deletingJobIds.has(savedJob.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                            </Button>

                                                            <a href={savedJob.job_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[13px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 ml-auto transition-colors">
                                                                View Details <ExternalLink className="h-3.5 w-3.5" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="border border-slate-200 border-dashed rounded-xl p-6 bg-slate-50/50 flex flex-col items-center justify-center text-center">
                                        <Bookmark className="h-6 w-6 text-slate-300 mb-2" />
                                        <p className="text-sm font-medium text-slate-500">No saved jobs yet.</p>
                                    </div>
                                )}
                            </div>

                            <p className="text-center text-xs text-slate-400 mt-12 mb-8">Search for jobs to populate your list</p>

                            <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                                    <Search className="h-8 w-8 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to find your dream job?</h3>
                                <p className="text-slate-500 font-medium max-w-sm">
                                    Enter a job title and location above to search through the best opportunities on LinkedIn.
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6">
                            {isJobsLoading ? (
                                <div className="py-20 flex flex-col items-center justify-center text-center">
                                    <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
                                    <p className="text-slate-600 font-medium">Scraping latest opportunities...</p>
                                </div>
                            ) : jobError ? (
                                <div className="py-20 flex flex-col items-center justify-center text-center">
                                    <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-red-500 text-2xl font-bold">!</span>
                                    </div>
                                    <h5 className="text-lg font-bold text-zinc-900 mb-2">Search Error</h5>
                                    <p className="text-red-500 text-sm font-medium">{jobError}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-lg font-bold text-slate-900">Search Results</h2>
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700">{jobs.length} found</Badge>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => setHasSearched(false)}>Back to Saved</Button>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        {jobs.map((job, i) => {
                                            const defaultLetter = job.companyName?.charAt(0) || 'C'
                                            const displayDate = job.postedAt || new Date().toLocaleDateString()
                                            const saved = isJobSaved(job.jobUrl)
                                            const saving = savingJobUrls.has(job.jobUrl)
                                            const selected = isJobSelected(job)

                                            return (
                                                <div key={i}
                                                    onClick={() => toggleJobSelection(job)}
                                                    className={`flex flex-col sm:flex-row gap-5 border p-5 rounded-2xl bg-white transition-all cursor-pointer ${selected ? 'border-blue-500 shadow-sm ring-1 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}>
                                                    <div className="h-14 w-14 rounded-xl flex items-center justify-center shrink-0 bg-[#3B82F6] text-white shadow-sm overflow-hidden">
                                                        {job.companyLogo ? (
                                                            <img src={job.companyLogo} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xl font-bold">{defaultLetter}</span>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0 flex flex-col">
                                                        <div className="flex items-start justify-between gap-4 mb-2">
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                                <h4 className="font-bold text-[17px] text-[#2563EB] leading-snug">{job.title}</h4>
                                                                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{displayDate}</span>
                                                            </div>
                                                            <div className="text-slate-300 shrink-0">
                                                                {selected ? <CheckCircle2 className="h-6 w-6 text-blue-500 fill-blue-50" /> : <Circle className="h-6 w-6 text-slate-200 hover:text-slate-300 transition-colors" />}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mb-3">
                                                            <div className="flex items-center gap-1.5">
                                                                <Briefcase className="h-4 w-4 text-slate-400" />
                                                                {job.companyName}
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin className="h-4 w-4 text-slate-400" />
                                                                {job.location}
                                                            </div>
                                                        </div>

                                                        <p className="text-sm text-slate-500 line-clamp-2 mb-5 leading-relaxed">
                                                            {job.description || "No preview description available. Click details to read more."}
                                                        </p>

                                                        <div className="flex flex-wrap items-center gap-4 mt-auto">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 shadow-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 gap-2 font-semibold text-xs rounded-lg px-3"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    sessionStorage.setItem('optimizeJob', JSON.stringify({
                                                                        title: job.title,
                                                                        companyName: job.companyName,
                                                                        description: job.description
                                                                    }))
                                                                    window.location.href = '/dashboard/optimize?from=search'
                                                                }}
                                                            >
                                                                <TrendingUp className="h-3.5 w-3.5 text-slate-400" /> Optimize CV
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                disabled={saving || saved}
                                                                onClick={(e) => { e.stopPropagation(); handleSaveJob(job) }}
                                                                className={`h-8 font-semibold text-xs rounded-lg px-3 gap-2 border bg-white shadow-sm ${saved ? 'text-emerald-700 border-emerald-200 hover:bg-emerald-50' : 'text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                                            >
                                                                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <BookmarkCheck className="h-3.5 w-3.5 text-emerald-600" /> : <Bookmark className="h-3.5 w-3.5 text-slate-400" />}
                                                                {saved ? 'Saved' : 'Save'}
                                                            </Button>

                                                            <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="ml-auto text-[13px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors">
                                                                View Details <ExternalLink className="h-3.5 w-3.5" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Batch Cover Letter Modal */}
            {letterJobTargets.length > 0 && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { if (!isGeneratingLetter && !generationComplete) setLetterJobTargets([]) }}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-purple-500" />
                                    Generate Cover Letters
                                </h3>
                                <p className="text-sm font-medium text-slate-500 mt-1">Batch processing for {letterJobTargets.length} selected job(s)</p>
                            </div>
                            {!isGeneratingLetter && (
                                <button onClick={() => setLetterJobTargets([])} className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400">
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        <div className="p-6">
                            {!generationComplete ? (
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 block mb-2">Select Primary Resume *</label>
                                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">This resume will be analyzed to extract your skills and experience to write highly targeted cover letters tailored to each specific company.</p>
                                        {resumes.length === 0 ? (
                                            <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border">No resumes found. Create one first in the Builder.</p>
                                        ) : (
                                            <select
                                                className="w-full h-12 border border-slate-200 rounded-xl px-4 text-sm bg-zinc-50 font-medium cursor-pointer"
                                                value={selectedResumeForLetter}
                                                onChange={(e) => setSelectedResumeForLetter(e.target.value)}
                                            >
                                                {resumes.map(r => (
                                                    <option key={r.id} value={r.id}>{r.title || 'Untitled Resume'}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    {!isGeneratingLetter ? (
                                        <Button
                                            onClick={handleBatchLetters}
                                            disabled={resumes.length === 0}
                                            className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl gap-2 shadow-lg shadow-purple-500/20 text-base mt-4"
                                        >
                                            <Sparkles className="h-5 w-5" />
                                            Generate {letterJobTargets.length} Letters
                                        </Button>
                                    ) : (
                                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 text-center mt-4">
                                            <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto mb-4" />
                                            <h4 className="font-bold text-slate-900 mb-1">Writing your letters...</h4>
                                            <p className="text-sm font-medium text-slate-500">
                                                Processing {generationProgress.current} of {generationProgress.total}
                                            </p>
                                            <div className="w-full bg-slate-200 rounded-full h-2 mt-4 overflow-hidden">
                                                <div
                                                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6 text-center py-6">
                                    <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Letters Generated Successfully!</h3>
                                        <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                            All cover letters have been securely saved to your archive as beautiful PDFs.
                                        </p>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            variant="outline"
                                            className="flex-1 h-12 font-bold"
                                            onClick={() => setLetterJobTargets([])}
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            className="flex-1 h-12 font-bold bg-[#1E293B] hover:bg-slate-900 text-white"
                                            onClick={() => window.location.href = '/dashboard/letters'}
                                        >
                                            View in Archive
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Action Bar */}
            {selectedJobs.length > 0 && (
                <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center px-4 animate-in slide-in-from-bottom-8 duration-300">
                    <div className="bg-[#1E293B] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#3B82F6] text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center">
                                {selectedJobs.length}
                            </div>
                            <span className="font-semibold text-[15px]">Jobs Selected</span>
                        </div>
                        <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
                            <button
                                onClick={() => setSelectedJobs([])}
                                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors px-2"
                            >
                                Cancel
                            </button>
                            <Button
                                className="h-10 px-5 gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl shadow-sm"
                                onClick={() => setLetterJobTargets(selectedJobs)}
                            >
                                <Sparkles className="h-4 w-4 text-purple-600" /> Generate Letters
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
