'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'
import { Target, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    const [activeTab, setActiveTab] = useState('url')

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
                // The AI returns optimized_bullets: { experience_0_bullet_1: "..." }
                // We need to map this back to our array
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
            if (!val) setTimeout(resetState, 300); // clear on close
        }}>
            <DialogTrigger asChild>
                <AnimatedGenerateButton
                    labelIdle="ATS Analyze"
                    highlightHueDeg={200}
                    size="sm"
                    className="h-9"
                />
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] bg-white border-zinc-200">
                <DialogHeader>
                    <DialogTitle>ATS Job Match Optimizer</DialogTitle>
                    <DialogDescription>
                        Input a job role to see how well your resume matches the Applicant Tracking System requirements.
                    </DialogDescription>
                </DialogHeader>

                {!atsResult ? (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="url">LinkedIn URL</TabsTrigger>
                            <TabsTrigger value="manual">Manual Text</TabsTrigger>
                        </TabsList>

                        <TabsContent value="url" className="mt-4 grid gap-4">
                            <div className="grid gap-2">
                                <Label>Job Posting URL</Label>
                                <Input
                                    placeholder="https://www.linkedin.com/jobs/view/..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-zinc-500">We will automatically extract the description for analysis.</p>
                            </div>
                            <Button onClick={handleScrape} disabled={isLoading || !url} type="button" variant="secondary">
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Fetch Job Details
                            </Button>
                        </TabsContent>

                        <TabsContent value="manual" className="mt-4 grid gap-4">
                            <div className="grid gap-2">
                                <Label>Job Description</Label>
                                <Textarea
                                    className="min-h-[150px] resize-y"
                                    placeholder="Paste the job description here..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Job Title (Optional)</Label>
                                    <Input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Frontend Engineer" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Company (Optional)</Label>
                                    <Input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Google" />
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
                        </TabsContent>
                    </Tabs>
                ) : (
                    <AtsScoreDisplay
                        scoreData={atsResult}
                        isLoading={isLoading}
                        onRecalculate={() => setAtsResult(null)}
                        onApplyOptimization={handleApplyOptimization}
                    />
                )}

            </DialogContent>
        </Dialog>
    )
}
