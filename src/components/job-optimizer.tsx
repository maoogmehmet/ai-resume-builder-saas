'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from 'sonner'
import { Target, Loader2, Sparkles, Link2 } from 'lucide-react'
import { AtsScoreDisplay } from '@/components/ats-score'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'

interface JobOptimizerProps {
    resumeId: string;
    resumeData: any;
    onOptimizationApplied: (newVersion: any) => void;
}

export function JobOptimizerDialog({ resumeId, resumeData, onOptimizationApplied }: JobOptimizerProps) {
    const [url, setUrl] = useState('')
    const [jobDescription, setJobDescription] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'url' | 'manual'>('url')

    const [atsResult, setAtsResult] = useState<any>(null)

    const handleScrape = async () => {
        if (!url.includes('linkedin.com/')) {
            toast.error('Invalid URL', { description: 'Please enter a valid LinkedIn URL (e.g. linkedin.com/jobs/view/...)' })
            return;
        }

        setIsLoading(true)
        toast.info('Scraping Job Details...')

        try {
            const resp = await fetch('/api/linkedin/scrape-job', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobUrl: url })
            })

            const data = await resp.json()
            if (!resp.ok) throw new Error(data.error)

            setJobDescription(data.description || '')
            setJobTitle(data.title || '')
            setCompanyName(data.company || '')
            setActiveTab('manual') // switch to manual tab to show the scraped desc
            toast.success('Job details extracted!')

        } catch (error: any) {
            toast.error('Extraction Failed', { description: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    const handleAnalyze = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()

        if (!jobDescription.trim()) {
            toast.error('Missing Description', { description: 'Provide a job description to analyze' })
            return
        }

        setIsLoading(true)
        toast.info('Analyzing Match...')

        try {
            const resp = await fetch('/api/ai/ats-match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeId,
                    jobDescription
                })
            })

            const data = await resp.json()
            if (!resp.ok) throw new Error(data.error)

            setAtsResult(data.result)
            toast.success('Analysis Complete')

        } catch (error: any) {
            toast.error('Analysis Failed', { description: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    const handleApplyOptimization = async (optimizedBullets: any) => {
        setIsLoading(true)
        toast.info('Applying optimization...')

        try {
            // Create the optimized JSON
            const optimizedJson = JSON.parse(JSON.stringify(resumeData))

            // Apply bullets if they exist
            if (optimizedBullets) {
                Object.keys(optimizedBullets).forEach(key => {
                    const match = key.match(/experience_(\d+)_bullet_(\d+)/)
                    if (match) {
                        const expIdx = parseInt(match[1])
                        const bulletIdx = parseInt(match[2])
                        if (optimizedJson.experience[expIdx] && optimizedJson.experience[expIdx].bullets) {
                            optimizedJson.experience[expIdx].bullets[bulletIdx] = optimizedBullets[key]
                        }
                    }
                })
            }

            // Save as new version
            const resp = await fetch('/api/resume/versions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeId,
                    jobTitle: jobTitle || 'Optimized Version',
                    companyName: companyName || 'Generic',
                    optimizedJson,
                    atsScore: atsResult.ats_score,
                    atsAnalysis: atsResult
                })
            })

            const data = await resp.json()
            if (!resp.ok) throw new Error(data.error)

            toast.success('Optimization Applied!', { description: 'A new version has been created.' })
            onOptimizationApplied(data.version)
            setOpen(false)

        } catch (error: any) {
            toast.error('Application Failed', { description: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    const resetState = () => {
        setAtsResult(null)
        setJobDescription('')
        setJobTitle('')
        setCompanyName('')
        setUrl('')
        setActiveTab('url')
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) setTimeout(resetState, 300);
        }}>
            <DialogTrigger asChild>
                <AnimatedGenerateButton
                    labelIdle="ATS Analyze"
                    highlightHueDeg={200}
                    size="sm"
                    className="h-9"
                />
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] rounded-3xl p-0 overflow-hidden">
                <div className="p-6 pb-0">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                                <Target className="h-4.5 w-4.5 text-blue-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-white font-black italic tracking-tighter text-xl uppercase">ATS Job Match</DialogTitle>
                                <DialogDescription className="text-zinc-500 text-xs font-medium mt-0.5">
                                    Analyze how well your resume matches a specific job.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {!atsResult ? (
                    <div className="p-6 pt-4 space-y-5">
                        {/* Tab Switcher */}
                        <div className="flex rounded-xl bg-white/[0.03] border border-white/[0.06] p-1">
                            <button
                                onClick={() => setActiveTab('url')}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'url' ? 'bg-white/[0.08] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <Link2 className="h-3.5 w-3.5" />
                                LinkedIn URL
                            </button>
                            <button
                                onClick={() => setActiveTab('manual')}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'manual' ? 'bg-white/[0.08] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                Manual Text
                            </button>
                        </div>

                        {activeTab === 'url' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Job Posting URL</label>
                                    <input
                                        className="w-full h-11 px-4 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white text-sm placeholder:text-zinc-600 focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/30 outline-none transition-all"
                                        placeholder="https://www.linkedin.com/jobs/view/..."
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <p className="text-[10px] text-zinc-600 font-medium">We will automatically extract the description for analysis.</p>
                                </div>
                                <button
                                    onClick={handleScrape}
                                    disabled={isLoading || !url}
                                    className="w-full h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white font-bold text-xs uppercase tracking-wider hover:bg-white/[0.10] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                    Fetch Job Details
                                </button>
                            </div>
                        )}

                        {activeTab === 'manual' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Job Description</label>
                                    <textarea
                                        className="w-full min-h-[140px] p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white text-sm placeholder:text-zinc-600 focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/30 outline-none transition-all resize-none"
                                        placeholder="Paste the job description here..."
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Job Title <span className="text-zinc-700">(Optional)</span></label>
                                        <input
                                            className="w-full h-11 px-4 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white text-sm placeholder:text-zinc-600 focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/30 outline-none transition-all"
                                            value={jobTitle}
                                            onChange={e => setJobTitle(e.target.value)}
                                            placeholder="e.g. Frontend Engineer"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Company <span className="text-zinc-700">(Optional)</span></label>
                                        <input
                                            className="w-full h-11 px-4 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white text-sm placeholder:text-zinc-600 focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/30 outline-none transition-all"
                                            value={companyName}
                                            onChange={e => setCompanyName(e.target.value)}
                                            placeholder="e.g. Google"
                                        />
                                    </div>
                                </div>
                                <AnimatedGenerateButton
                                    onClick={handleAnalyze}
                                    disabled={isLoading || !jobDescription.trim()}
                                    generating={isLoading}
                                    labelIdle="Analyze Resume"
                                    labelActive="Analyzing Match..."
                                    highlightHueDeg={200}
                                    size="lg"
                                    className="w-full h-12"
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-6 pt-2">
                        <AtsScoreDisplay
                            scoreData={atsResult}
                            isLoading={isLoading}
                            onRecalculate={() => setAtsResult(null)}
                            onApplyOptimization={handleApplyOptimization}
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
