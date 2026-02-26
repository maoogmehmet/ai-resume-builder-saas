'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Download, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { PersonalInfoSection } from '@/components/resume-editor/personal-info'
import { ExperienceSection } from '@/components/resume-editor/experience-section'
import { EducationSection } from '@/components/resume-editor/education-section'
import { SkillsSection } from '@/components/resume-editor/skills-section'
import { ResumePreview } from '@/components/resume-preview'
import { JobOptimizerDialog } from '@/components/job-optimizer'
import { PdfDownloadButton } from '@/components/pdf-download-button'
import { PublicLinkManager } from '@/components/public-link-manager'

export function ResumeEditorPage() {
    const router = useRouter()
    const params = useParams()
    const supabase = createClient()

    const [resumeData, setResumeData] = useState<any>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)

    const resumeId = params?.id as string

    // Fetch initial data
    useEffect(() => {
        async function loadResume() {
            if (!resumeId) return;

            const { data, error } = await supabase
                .from('resumes')
                .select('*')
                .eq('id', resumeId)
                .single()

            if (error) {
                toast.error('Could not load resume')
                router.push('/dashboard')
                return
            }

            setResumeData(data.ai_generated_json || data.original_linkedin_json || {
                personal_info: { full_name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
                summary: '',
                experience: [],
                education: [],
                skills: { technical: [], soft: [] }
            })
            setIsLoading(false)

            // If we just gathered raw data and AI isn't generated yet
            if (!data.ai_generated_json && data.original_linkedin_json) {
                requestAIGeneration()
            }
        }
        loadResume()
    }, [resumeId, router])

    const requestAIGeneration = async () => {
        setIsLoading(true)
        toast.info('Generating AI Resume...', { description: 'Converting LinkedIn data to ATS format' })
        try {
            const response = await fetch('/api/ai/generate-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeId })
            })

            const result = await response.json()

            if (!response.ok) throw new Error(result.error)

            setResumeData(result.aiGenerated)
            toast.success('Resume Generated!', { description: 'Your LinkedIn data was successfully processed.' })
        } catch (error: any) {
            toast.error('AI Generation Failed', { description: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    // Debounced Save
    useEffect(() => {
        if (!resumeData || isLoading) return;

        const timeout = setTimeout(async () => {
            setIsSaving(true)
            const { error } = await supabase
                .from('resumes')
                .update({
                    ai_generated_json: resumeData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', resumeId)

            if (error) {
                toast.error('Failed to save changes')
            } else {
                setLastSaved(new Date())
            }
            setIsSaving(false)
        }, 2000)

        return () => clearTimeout(timeout)
    }, [resumeData, resumeId, isLoading])

    const handleUpdate = useCallback((section: string, data: any) => {
        setResumeData((prev: any) => ({ ...prev, [section]: data }))
    }, [])

    if (isLoading && !resumeData) {
        return <div className="flex w-full min-h-screen items-center justify-center bg-zinc-50"><Loader2 className="animate-spin h-8 w-8 text-zinc-400" /></div>
    }

    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 w-full relative">
            <header className="sticky top-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div className="flex flex-col h-full justify-center">
                        <h1 className="font-semibold text-zinc-900 tracking-tight leading-none">Editor</h1>
                        <div className="flex items-center gap-2 mt-1">
                            {isSaving ? (
                                <span className="text-xs text-zinc-500 font-medium animate-pulse flex items-center">
                                    Saving...
                                </span>
                            ) : lastSaved ? (
                                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3" /> Saved at {lastSaved.toLocaleTimeString()}
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <PublicLinkManager resumeId={resumeId} />
                    <PdfDownloadButton resumeData={resumeData} />
                    <JobOptimizerDialog resumeId={resumeId} />
                </div>
            </header>

            <main className="flex-1 flex w-full relative">
                {/* LEFT PANE - Editor */}
                <div className="w-full lg:w-1/2 overflow-y-auto border-r border-zinc-200 p-6 sm:p-8 bg-zinc-50 pb-32 h-[calc(100vh-65px)] custom-scrollbar">
                    <Accordion type="single" collapsible defaultValue="personal_info" className="w-full space-y-4">
                        <AccordionItem value="personal_info" className="border rounded-lg bg-white shadow-sm px-4">
                            <AccordionTrigger className="hover:no-underline font-semibold text-lg text-zinc-800">
                                Personal Information
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4">
                                <PersonalInfoSection data={resumeData.personal_info} onChange={(data) => handleUpdate('personal_info', data)} />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="summary" className="border rounded-lg bg-white shadow-sm px-4">
                            <AccordionTrigger className="hover:no-underline font-semibold text-lg text-zinc-800">
                                Professional Summary
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4">
                                {/* Embedded simplified Textarea for summary */}
                                <textarea
                                    className="w-full min-h-[150px] p-3 rounded-md border border-zinc-200 focus:ring-2 focus:ring-zinc-400 outline-none transition-all text-sm"
                                    value={resumeData.summary || ''}
                                    onChange={(e) => handleUpdate('summary', e.target.value)}
                                    placeholder="2-3 sentences max."
                                />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="experience" className="border rounded-lg bg-white shadow-sm px-4">
                            <AccordionTrigger className="hover:no-underline font-semibold text-lg text-zinc-800">
                                Work Experience
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4">
                                <ExperienceSection data={resumeData.experience} onChange={(data) => handleUpdate('experience', data)} />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="education" className="border rounded-lg bg-white shadow-sm px-4">
                            <AccordionTrigger className="hover:no-underline font-semibold text-lg text-zinc-800">
                                Education
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4">
                                <EducationSection data={resumeData.education} onChange={(data) => handleUpdate('education', data)} />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="skills" className="border rounded-lg bg-white shadow-sm px-4">
                            <AccordionTrigger className="hover:no-underline font-semibold text-lg text-zinc-800">
                                Skills
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4">
                                <SkillsSection data={resumeData.skills || { technical: [], soft: [] }} onChange={(data) => handleUpdate('skills', data)} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* RIGHT PANE - Live Preview */}
                <div className="hidden lg:block w-1/2 p-10 bg-zinc-200/50 h-[calc(100vh-65px)] overflow-y-auto items-center justify-center border-l flex-shrink-0">
                    <div className="max-w-[850px] mx-auto w-full h-full pb-32 aspect-[1/1.414]">
                        <ResumePreview data={resumeData} isLoading={isLoading} />
                    </div>
                </div>
            </main>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
           background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
           background-color: #d4d4d8;
           border-radius: 20px;
        }
      `}</style>
        </div>
    )
}
