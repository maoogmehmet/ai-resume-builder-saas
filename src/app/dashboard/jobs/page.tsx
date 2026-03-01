'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Search, Briefcase, ExternalLink, Loader2, Bookmark, BookmarkCheck, FileCheck2, Sparkles, X, TrendingUp, CheckCircle2, Circle, Trash2, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'

const REGIONS: { label: string; icon: string; countries: { name: string; code: string }[] }[] = [
    {
        label: 'Europe', icon: '🇪🇺', countries: [
            { name: 'United Kingdom', code: 'UK' }, { name: 'Germany', code: 'DE' }, { name: 'France', code: 'FR' },
            { name: 'Netherlands', code: 'NL' }, { name: 'Spain', code: 'ES' }, { name: 'Italy', code: 'IT' },
            { name: 'Sweden', code: 'SE' }, { name: 'Switzerland', code: 'CH' }, { name: 'Ireland', code: 'IE' },
            { name: 'Poland', code: 'PL' }, { name: 'Portugal', code: 'PT' }, { name: 'Belgium', code: 'BE' },
            { name: 'Austria', code: 'AT' }, { name: 'Denmark', code: 'DK' }, { name: 'Finland', code: 'FI' },
            { name: 'Norway', code: 'NO' }, { name: 'Czech Republic', code: 'CZ' }, { name: 'Romania', code: 'RO' },
        ]
    },
    {
        label: 'Türkiye', icon: '🇹🇷', countries: [
            { name: 'Istanbul', code: 'IST' }, { name: 'Ankara', code: 'ANK' }, { name: 'Izmir', code: 'IZM' },
            { name: 'Antalya', code: 'ANT' }, { name: 'Bursa', code: 'BRS' },
        ]
    },
    {
        label: 'North America', icon: '🇺🇸', countries: [
            { name: 'United States', code: 'US' }, { name: 'Canada', code: 'CA' }, { name: 'Mexico', code: 'MX' },
        ]
    },
    {
        label: 'South America', icon: '🇧🇷', countries: [
            { name: 'Brazil', code: 'BR' }, { name: 'Argentina', code: 'AR' }, { name: 'Colombia', code: 'CO' },
            { name: 'Chile', code: 'CL' }, { name: 'Peru', code: 'PE' },
        ]
    },
    {
        label: 'Asia', icon: '🌏', countries: [
            { name: 'Japan', code: 'JP' }, { name: 'South Korea', code: 'KR' }, { name: 'India', code: 'IN' },
            { name: 'Singapore', code: 'SG' }, { name: 'China', code: 'CN' }, { name: 'UAE', code: 'AE' },
            { name: 'Israel', code: 'IL' }, { name: 'Saudi Arabia', code: 'SA' }, { name: 'Indonesia', code: 'ID' },
        ]
    },
    {
        label: 'Africa', icon: '🌍', countries: [
            { name: 'South Africa', code: 'ZA' }, { name: 'Nigeria', code: 'NG' }, { name: 'Kenya', code: 'KE' },
            { name: 'Egypt', code: 'EG' }, { name: 'Morocco', code: 'MA' },
        ]
    },
    {
        label: 'Oceania', icon: '🌊', countries: [
            { name: 'Australia', code: 'AU' }, { name: 'New Zealand', code: 'NZ' },
        ]
    },
]

export default function JobsPage() {
    const [jobQuery, setJobQuery] = useState('')
    const [location, setLocation] = useState('')
    const [jobs, setJobs] = useState<any[]>([])
    const [isJobsLoading, setIsJobsLoading] = useState(false)
    const [jobError, setJobError] = useState<string | null>(null)
    const [hasSearched, setHasSearched] = useState(false)
    const [expandedRegion, setExpandedRegion] = useState<string | null>(null)

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

    // Handlers for Selection - use _uid for unique identification
    const getJobId = (j: any) => j._uid || j.id || j.jobUrl || j.job_url || '';
    const toggleJobSelection = (job: any, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const uid = getJobId(job);
        if (!uid) return;
        setSelectedJobs(prev => {
            const exists = prev.find(j => getJobId(j) === uid)
            if (exists) {
                return prev.filter(j => getJobId(j) !== uid)
            }
            return [...prev, job]
        })
    }
    const isJobSelected = (job: any) => {
        const uid = getJobId(job);
        if (!uid) return false;
        return selectedJobs.some(j => getJobId(j) === uid);
    }

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
                setJobs(data.jobs.map((j: any, idx: number) => ({ ...j, _uid: `search-${Date.now()}-${idx}` })))
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
        const url = job.jobUrl || job.job_url || ''
        if (!url || url === '#') {
            toast.error('This job has no valid URL and cannot be saved.')
            return
        }
        if (isJobSaved(url)) {
            toast.info('This job is already saved!')
            return
        }
        setSavingJobUrls(prev => new Set(prev).add(url))
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
                next.delete(url)
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

    const isJobSaved = (url: string) => {
        if (!url) return false;
        return savedJobs.some(j => j.job_url === url)
    }
    const getAbsoluteJobUrl = (url: string) => {
        if (!url || url === '#') return '#';
        if (url.startsWith('http')) return url;
        return `https://www.linkedin.com${url.startsWith('/') ? '' : '/'}${url}`;
    }

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

                <header className="flex flex-col gap-6 pb-4">
                    <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
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
                    </div>

                    {/* Quick Category Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                        {[
                            { label: 'All Jobs', icon: '🌐', query: 'Jobs' },
                            { label: 'Software Engineering', icon: '💻', query: 'Software Engineer' },
                            { label: 'Frontend Developer', icon: '🎨', query: 'Frontend Developer' },
                            { label: 'Backend Developer', icon: '⚙️', query: 'Backend Developer' },
                            { label: 'Data Science', icon: '📊', query: 'Data Scientist' },
                            { label: 'AI / Machine Learning', icon: '🤖', query: 'Machine Learning Engineer' },
                            { label: '3D & Graphics', icon: '🎮', query: '3D Artist' },
                            { label: 'Product Design', icon: '✏️', query: 'Product Designer' },
                            { label: 'Marketing', icon: '📈', query: 'Marketing Manager' },
                            { label: 'Product Manager', icon: '📋', query: 'Product Manager' },
                            { label: 'DevOps', icon: '☁️', query: 'DevOps Engineer' },
                            { label: 'Cybersecurity', icon: '🔒', query: 'Cybersecurity Analyst' },
                        ].map((cat) => (
                            <button
                                key={cat.query}
                                onClick={async () => {
                                    setJobQuery(cat.query)
                                    setLocation('')
                                    setIsJobsLoading(true)
                                    setJobs([])
                                    setJobError(null)
                                    setHasSearched(true)
                                    try {
                                        const res = await fetch('/api/linkedin/search-jobs', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ query: cat.query, location: '' })
                                        })
                                        const data = await res.json()
                                        if (!res.ok) {
                                            setJobError(data.error || 'Search failed')
                                        } else if (data.jobs && data.jobs.length > 0) {
                                            setJobs(data.jobs.map((j: any, idx: number) => ({ ...j, _uid: `cat-${Date.now()}-${idx}` })))
                                        } else {
                                            setJobError('No jobs found. Try a different category.')
                                        }
                                    } catch {
                                        setJobError('Failed to connect to job search service.')
                                    } finally {
                                        setIsJobsLoading(false)
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.08] hover:border-white/10 transition-all text-[12px] font-semibold whitespace-nowrap shrink-0 active:scale-95"
                            >
                                <span className="text-sm">{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Location / Region Filters */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                            {REGIONS.map((region) => (
                                <button
                                    key={region.label}
                                    onClick={() => setExpandedRegion(prev => prev === region.label ? null : region.label)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-[12px] font-semibold whitespace-nowrap shrink-0 active:scale-95 ${expandedRegion === region.label ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.04] border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.08] hover:border-white/10'}`}
                                >
                                    <span className="text-sm">{region.icon}</span>
                                    {region.label}
                                    <ChevronDown className={`h-3 w-3 transition-transform ${expandedRegion === region.label ? 'rotate-180' : ''}`} />
                                </button>
                            ))}
                        </div>

                        {/* Expanded Country List */}
                        {expandedRegion && (
                            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 pl-2">
                                {REGIONS.find(r => r.label === expandedRegion)?.countries.map((country) => (
                                    <button
                                        key={country.code}
                                        onClick={async () => {
                                            const query = jobQuery.trim() || 'Jobs'
                                            setLocation(country.name)
                                            setJobQuery(query)
                                            setIsJobsLoading(true)
                                            setJobs([])
                                            setJobError(null)
                                            setHasSearched(true)
                                            try {
                                                const res = await fetch('/api/linkedin/search-jobs', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ query, location: country.name })
                                                })
                                                const data = await res.json()
                                                if (!res.ok) {
                                                    setJobError(data.error || 'Search failed')
                                                } else if (data.jobs && data.jobs.length > 0) {
                                                    setJobs(data.jobs.map((j: any, idx: number) => ({ ...j, _uid: `loc-${Date.now()}-${idx}` })))
                                                } else {
                                                    setJobError(`No jobs found in ${country.name}. Try a different location.`)
                                                }
                                            } catch {
                                                setJobError('Failed to connect to job search service.')
                                            } finally {
                                                setIsJobsLoading(false)
                                            }
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-zinc-500 hover:text-white hover:bg-white/[0.06] hover:border-white/10 transition-all text-[11px] font-medium whitespace-nowrap shrink-0 active:scale-95"
                                    >
                                        {country.name}
                                    </button>
                                ))}
                            </div>
                        )}
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
                                                className={`flex flex-col border rounded-[2.5rem] bg-[#0a0a0a] transition-all cursor-pointer group relative overflow-hidden ${selected ? 'border-zinc-700 ring-1 ring-white/5 shadow-2xl shadow-white/5' : 'border-white/5 hover:border-white/10'}`}>

                                                <div className="p-8 pb-4">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-xl">
                                                            {savedJob.company_logo ? (
                                                                <img src={savedJob.company_logo} alt={savedJob.company_name} className="w-10 h-10 object-contain" />
                                                            ) : (
                                                                <span className="text-lg font-bold text-black">{savedJob.company_name?.charAt(0) || 'C'}</span>
                                                            )}
                                                        </div>
                                                        <div className={`h-6 w-6 rounded-full border border-white/10 flex items-center justify-center transition-all ${selected ? 'bg-zinc-800 border-zinc-700' : 'group-hover:border-white/20'}`}>
                                                            {selected && <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <h4 className="font-bold text-xl text-white leading-tight tracking-tight line-clamp-1">{savedJob.title}</h4>
                                                        <p className="text-base font-medium text-emerald-500/90">{savedJob.company_name}</p>
                                                    </div>
                                                </div>

                                                <div className="px-8 pb-6 flex-1 space-y-4 mt-2">
                                                    <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-500">
                                                        <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 opacity-40" /> {savedJob.location || 'Remote'}</div>
                                                        <div className="h-1 w-1 rounded-full bg-zinc-800" />
                                                        <div>{new Date(savedJob.created_at).toLocaleDateString()}</div>
                                                    </div>
                                                    <p className="text-[13px] text-zinc-500 line-clamp-2 leading-relaxed h-10 font-medium opacity-80">
                                                        {savedJob.description || "No preview description available."}
                                                    </p>
                                                </div>

                                                <div className="p-5 flex items-center justify-between gap-3 border-t border-white/5 bg-zinc-900/10">
                                                    <AnimatedGenerateButton
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            sessionStorage.setItem('optimizeJob', JSON.stringify({
                                                                title: savedJob.title,
                                                                companyName: savedJob.company_name,
                                                                description: savedJob.description,
                                                                url: savedJob.job_url
                                                            }))
                                                            window.location.href = '/dashboard/optimize'
                                                        }}
                                                        labelIdle="Optimize"
                                                        highlightHueDeg={140}
                                                        size="md"
                                                        className="flex-1 h-12"
                                                    />

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                            className="h-12 w-12 p-0 text-zinc-500 hover:text-white hover:bg-white/5 rounded-[1.25rem] transition-all"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <a href={getAbsoluteJobUrl(savedJob.job_url)} target="_blank" rel="noopener noreferrer">
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        </Button>

                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => handleDeleteSavedJob(savedJob.id, e)}
                                                            disabled={deletingJobIds.has(savedJob.id)}
                                                            className="h-12 w-12 p-0 text-zinc-600 hover:text-red-400 hover:bg-red-500/5 rounded-[1.25rem] transition-all"
                                                        >
                                                            {deletingJobIds.has(savedJob.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="border border-white/5 border-dashed rounded-[3rem] p-24 bg-[#0a0a0a] flex flex-col items-center justify-center text-center">
                                    <div className="h-20 w-20 rounded-[2rem] bg-white/5 flex items-center justify-center mb-8 border border-white/5">
                                        <Briefcase className="h-8 w-8 text-zinc-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">No saved jobs yet</h3>
                                    <p className="text-zinc-500 text-sm max-w-sm mb-10 font-medium">
                                        Search and save jobs you're interested in to manage your pipeline efficiently.
                                    </p>
                                    <Button
                                        onClick={() => setJobQuery('Frontend Developer')}
                                        className="bg-white text-black hover:bg-zinc-200 font-bold px-10 rounded-[1.25rem] h-14 text-base transition-all active:scale-95"
                                    >
                                        Explore Jobs
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Search Results</h2>
                                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none px-3 py-1 font-bold uppercase tracking-widest text-[9px] rounded-full">{jobs.length} found</Badge>
                                </div>
                                <Button variant="ghost" className="text-xs text-zinc-500 hover:text-white font-bold h-10 px-6 bg-white/5 rounded-xl" onClick={() => setHasSearched(false)}>Back to list</Button>
                            </div>

                            {isJobsLoading ? (
                                <div className="py-32 flex flex-col items-center justify-center text-center">
                                    <div className="relative mb-8">
                                        <div className="h-16 w-16 rounded-full border-2 border-white/5 flex items-center justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
                                        </div>
                                        <div className="absolute inset-0 bg-white/10 blur-xl rounded-full scale-110 opacity-50 animate-pulse" />
                                    </div>
                                    <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">Scanning LinkedIn for latest roles...</p>
                                </div>
                            ) : jobError ? (
                                <div className="py-24 border border-white/5 rounded-[3rem] bg-[#0a0a0a] flex flex-col items-center justify-center text-center">
                                    <div className="h-16 w-16 bg-red-500/5 border border-red-500/10 rounded-[1.5rem] flex items-center justify-center mb-8">
                                        <X className="h-8 w-8 text-red-500/80" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Search Error</h3>
                                    <p className="text-red-500/80 text-sm font-bold uppercase tracking-widest">{jobError}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {jobs.map((job, i) => {
                                        const saved = isJobSaved(job.jobUrl)
                                        const saving = savingJobUrls.has(job.jobUrl)
                                        const selected = isJobSelected(job)
                                        const jobLink = getAbsoluteJobUrl(job.jobUrl)

                                        return (
                                            <div key={`search-${i}-${job.jobUrl}`}
                                                onClick={() => toggleJobSelection(job)}
                                                className={`flex flex-col border rounded-[2.5rem] bg-[#0a0a0a] transition-all cursor-pointer group relative overflow-hidden ${selected ? 'border-zinc-700 ring-1 ring-white/5 shadow-2xl shadow-white/5' : 'border-white/5 hover:border-white/10'}`}>

                                                <div className="p-8 pb-4">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-xl">
                                                            {job.companyLogo ? (
                                                                <img src={job.companyLogo} alt={job.companyName} className="w-10 h-10 object-contain" />
                                                            ) : (
                                                                <span className="text-lg font-bold text-black">{job.companyName?.charAt(0) || 'C'}</span>
                                                            )}
                                                        </div>
                                                        <div className={`h-6 w-6 rounded-full border border-white/10 flex items-center justify-center transition-all ${selected ? 'bg-zinc-800 border-zinc-700' : 'group-hover:border-white/20'}`}>
                                                            {selected && <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <h4 className="font-bold text-xl text-white leading-tight tracking-tight line-clamp-1">{job.title}</h4>
                                                        <p className="text-base font-medium text-emerald-500/90">{job.companyName}</p>
                                                    </div>
                                                </div>

                                                <div className="px-8 pb-6 flex-1 space-y-4 mt-2">
                                                    <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-500">
                                                        <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 opacity-40" /> {job.location || 'Remote'}</div>
                                                        <div className="h-1 w-1 rounded-full bg-zinc-800" />
                                                        <div>{job.postedAt || 'Recently'}</div>
                                                    </div>
                                                    <p className="text-[13px] text-zinc-500 line-clamp-2 leading-relaxed h-10 font-medium opacity-80">
                                                        {job.description || "No preview description available."}
                                                    </p>
                                                </div>

                                                <div className="p-5 flex items-center justify-between gap-3 border-t border-white/5 bg-zinc-900/10">
                                                    <AnimatedGenerateButton
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            sessionStorage.setItem('optimizeJob', JSON.stringify({
                                                                title: job.title,
                                                                companyName: job.companyName,
                                                                description: job.description,
                                                                url: job.jobUrl
                                                            }))
                                                            window.location.href = '/dashboard/optimize'
                                                        }}
                                                        labelIdle="Optimize"
                                                        highlightHueDeg={140}
                                                        size="md"
                                                        className="flex-1 h-12"
                                                    />

                                                    {jobLink && jobLink !== '#' && (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleSaveJob(job) }}
                                                                className={`h-12 w-12 rounded-[1.25rem] flex items-center justify-center transition-all active:scale-95 border ${saved ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' : saving ? 'bg-white/5 text-zinc-400 border-white/5' : 'bg-transparent text-zinc-500 border-white/5 hover:text-white hover:bg-white/5'}`}
                                                            >
                                                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                                                            </button>

                                                            <a
                                                                href={jobLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="h-12 w-12 rounded-[1.25rem] flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        </div>
                                                    )}
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
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300" onClick={() => { if (!isGeneratingLetter && !generationComplete) setLetterJobTargets([]) }}>
                        <div className="bg-[#050505] border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] max-w-xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <div className="p-12 pb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-3xl font-bold text-white flex items-center gap-4 tracking-tight">
                                        <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/20 rounded-[1.25rem] flex items-center justify-center">
                                            <Sparkles className="h-5 w-5 text-emerald-500" />
                                        </div>
                                        Magic Letters
                                    </h3>
                                    <p className="text-[13px] font-bold text-zinc-600 mt-3 uppercase tracking-[0.2em]">Crafting {letterJobTargets.length} personalized documents</p>
                                </div>
                                {!isGeneratingLetter && (
                                    <button onClick={() => setLetterJobTargets([])} className="h-12 w-12 rounded-2xl hover:bg-white/5 flex items-center justify-center text-zinc-700 hover:text-white transition-all">
                                        <X className="h-6 w-6" />
                                    </button>
                                )}
                            </div>

                            <div className="p-12 pt-4">
                                {!generationComplete ? (
                                    <div className="space-y-12">
                                        <div className="space-y-5">
                                            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] block ml-1">Base Foundation</label>
                                            {resumes.length === 0 ? (
                                                <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-[1.5rem] flex items-center gap-4">
                                                    <X className="h-5 w-5 text-red-500" />
                                                    <p className="text-[13px] font-bold text-red-500/80 uppercase tracking-widest">No resumes found. Create one first.</p>
                                                </div>
                                            ) : (
                                                <div className="relative group">
                                                    <select
                                                        className="w-full h-16 bg-black border border-white/10 group-hover:border-white/20 rounded-[1.25rem] px-6 text-sm font-bold text-white appearance-none cursor-pointer outline-none transition-all shadow-sm"
                                                        value={selectedResumeForLetter}
                                                        onChange={(e) => setSelectedResumeForLetter(e.target.value)}
                                                    >
                                                        {resumes.map(r => (
                                                            <option key={r.id} value={r.id}>{r.title || 'Untitled Resume'}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none group-hover:text-white transition-colors" />
                                                </div>
                                            )}
                                        </div>

                                        {!isGeneratingLetter ? (
                                            <AnimatedGenerateButton
                                                onClick={handleBatchLetters}
                                                disabled={resumes.length === 0 || isGeneratingLetter}
                                                generating={isGeneratingLetter}
                                                labelIdle="Generate Now"
                                                labelActive="Generating Magic..."
                                                highlightHueDeg={140}
                                                size="lg"
                                                className="w-full h-16"
                                            />
                                        ) : (
                                            <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 text-center relative overflow-hidden">
                                                <div className="relative z-10">
                                                    <div className="relative mb-8 flex justify-center">
                                                        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
                                                        <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full scale-150 animate-pulse" />
                                                    </div>
                                                    <h4 className="font-bold text-white mb-3 text-xl tracking-tight">AI is crafting your future...</h4>
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">
                                                        Page {generationProgress.current} <span className="mx-2 opacity-30">/</span> {generationProgress.total}
                                                    </p>
                                                    <div className="w-full bg-white/5 rounded-full h-1 mt-10 overflow-hidden">
                                                        <div
                                                            className="bg-emerald-500 h-1 rounded-full transition-all duration-700 shadow-[0_0_20px_rgba(16,185,129,0.8)]"
                                                            style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-12 text-center py-6">
                                        <div className="relative mx-auto h-24 w-24 mb-10">
                                            <div className="h-24 w-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center border border-emerald-500/20">
                                                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                                            </div>
                                            <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full animate-pulse" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Generation Complete</h3>
                                            <p className="text-zinc-500 text-sm max-w-[320px] mx-auto leading-relaxed font-bold uppercase tracking-widest opacity-60">
                                                All cover letters have been securely saved to your archive as beautiful documents.
                                            </p>
                                        </div>
                                        <div className="flex gap-4 pt-4">
                                            <Button
                                                variant="outline"
                                                className="flex-1 h-16 font-bold border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-[1.25rem] text-sm"
                                                onClick={() => setLetterJobTargets([])}
                                            >
                                                Done
                                            </Button>
                                            <Button
                                                className="flex-1 h-16 font-bold bg-white text-black hover:bg-zinc-200 rounded-[1.25rem] text-sm"
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
                    <div className="fixed bottom-12 left-0 right-0 z-50 flex justify-center px-4 animate-in slide-in-from-bottom-20 duration-700">
                        <div className="bg-[#0a0a0a] border border-white/10 text-white px-10 py-5 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] flex items-center gap-12 backdrop-blur-3xl">
                            <div className="flex items-center gap-5">
                                <div className="bg-emerald-500 text-black text-[11px] font-black h-6 w-6 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                                    {selectedJobs.length}
                                </div>
                                <span className="font-bold text-sm tracking-tight text-white/90">Selected Potential</span>
                            </div>
                            <div className="flex items-center gap-8 border-l border-white/5 pl-12">
                                <button
                                    onClick={() => setSelectedJobs([])}
                                    className="text-[10px] font-bold text-zinc-600 hover:text-white transition-all uppercase tracking-[0.3em]"
                                >
                                    Cancel
                                </button>
                                <AnimatedGenerateButton
                                    className="h-14 px-8 min-w-[180px]"
                                    onClick={() => setLetterJobTargets(selectedJobs)}
                                    labelIdle="Magic Letters"
                                    highlightHueDeg={140}
                                    size="lg"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
