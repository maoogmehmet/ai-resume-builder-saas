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

interface JobOptimizerProps {
    resumeId: string;
}

export function JobOptimizerDialog({ resumeId }: JobOptimizerProps) {
    const [url, setUrl] = useState('')
    const [jobDescription, setJobDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('url')

    const [atsResult, setAtsResult] = useState<any>(null)

    const handleScrape = async () => {
        if (!url.includes('linkedin.com/jobs/')) {
            toast.error('Invalid URL', { description: 'Please enter a valid LinkedIn Job URL' })
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

    const resetState = () => {
        setAtsResult(null)
        setJobDescription('')
        setUrl('')
        setActiveTab('url')
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) setTimeout(resetState, 300); // clear on close
        }}>
            <DialogTrigger asChild>
                <Button className="font-medium bg-zinc-900 shadow-sm gap-2">
                    <Target className="w-4 h-4" /> ATS Analyze
                </Button>
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
                            <Button onClick={handleAnalyze} disabled={isLoading || !jobDescription.trim()} type="button">
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Analyze Resume
                            </Button>
                        </TabsContent>
                    </Tabs>
                ) : (
                    <AtsScoreDisplay scoreData={atsResult} onRecalculate={() => setAtsResult(null)} onOptimize={() => {
                        toast.info('Feature Coming Soon', { description: 'Automatic AI resume tuning will be in Phase 6!' })
                    }} />
                )}

            </DialogContent>
        </Dialog>
    )
}
