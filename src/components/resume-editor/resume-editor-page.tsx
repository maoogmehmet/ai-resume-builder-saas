'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, CheckCircle2, Sparkles, Layout, CloudUpload } from 'lucide-react'
import Link from 'next/link'
import { pdf } from '@react-pdf/renderer'
import { ResumePDFDocument } from '@/lib/pdf-generator'
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
import { ResumeVersions } from '@/components/resume-versions'

type TemplateType = 'classic' | 'modern' | 'executive'

const TEMPLATES: { id: TemplateType; label: string; description: string }[] = [
    { id: 'classic', label: 'Classic', description: 'Clean ATS-friendly layout' },
    { id: 'modern', label: 'Modern', description: 'Dark sidebar with skills' },
    { id: 'executive', label: 'Executive', description: 'Premium bold design' },
]

const EMPTY_RESUME = {
    personal_info: { full_name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '', profile_image: '' },
    summary: '',
    experience: [],
    education: [],
    skills: { technical: [], soft: [] }
}

export function ResumeEditorPage() {
    const router = useRouter()
    const params = useParams()
    const supabase = createClient()

    const [resumeData, setResumeData] = useState<any>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [currentVersionId, setCurrentVersionId] = useState<string | undefined>()
    const [template, setTemplate] = useState<TemplateType>('classic')
    const [showTemplates, setShowTemplates] = useState(false)
    const [isUploadingPdf, setIsUploadingPdf] = useState(false)

    const resumeId = params?.id as string

    // Fetch initial data
    useEffect(() => {
        if (!resumeId) {
            toast.error('No resume ID found')
            router.push('/dashboard')
            return
        }

        async function loadResume() {
            const { data, error } = await supabase
                .from('resumes')
                .select('*')
                .eq('id', resumeId)
                .single()

            if (error || !data) {
                toast.error('Could not load resume. Redirecting...')
                router.push('/dashboard')
                return
            }

            const jsonData = data.ai_generated_json || data.original_linkedin_json || EMPTY_RESUME
            setResumeData(jsonData)
            setIsLoading(false)

            // If we have raw LinkedIn data but no AI version, generate it
            if (!data.ai_generated_json && data.original_linkedin_json) {
                requestAIGeneration()
            }
        }

        loadResume()
    }, [resumeId])

    const requestAIGeneration = async () => {
        setIsLoading(true)
        toast.info('Generating AI Resume...', { description: 'Converting LinkedIn data to ATS-optimized format...' })
        try {
            const response = await fetch('/api/ai/generate-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeId })
            })

            const result = await response.json()

            if (!response.ok) throw new Error(result.error || 'AI generation failed')

            setResumeData(result.aiGenerated)

            // Auto-generate a generic Pitch Deck in the background
            const jobTitle = result.aiGenerated?.personal_info?.title || result.aiGenerated?.experience?.[0]?.position || 'Professional';
            fetch('/api/ai/generate-letter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeId,
                    jobTitle,
                    companyName: 'Future Employer',
                    jobDescription: 'General application'
                })
            }).catch(e => console.error("Pitch deck auto-gen failed", e));

            // Auto-upload the PDF to Supabase Storage without showing a toast
            syncPdfToCloud(result.aiGenerated, template, true).catch(e => console.error("Auto PDF sync failed", e));

            toast.success('AI Resume Generated!', { description: 'Your resume has been optimized.' })
        } catch (error: any) {
            toast.error('AI Generation Failed', { description: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    // Debounced auto-save
    useEffect(() => {
        if (!resumeData || isLoading || currentVersionId) return

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
    }, [resumeData, resumeId, isLoading, currentVersionId])

    const handleUpdate = useCallback((section: string, data: any) => {
        setResumeData((prev: any) => ({ ...prev, [section]: data }))
    }, [])

    const handleVersionSelect = (version: any) => {
        setResumeData(version.optimized_json)
        setCurrentVersionId(version.id)
        syncPdfToCloud(version.optimized_json, template, true).catch(e => console.error(e));
        toast.info(`Switched to version: ${version.company_name || 'Saved Version'}`)
    }

    const syncPdfToCloud = async (data: any, currentTemplate: TemplateType, silenceToast = false) => {
        setIsUploadingPdf(true);
        if (!silenceToast) toast.loading('Generating & Uploading PDF...', { id: 'pdf-upload' });

        try {
            // 1. Generate PDF Blob client-side
            const doc = <ResumePDFDocument data={data} template={currentTemplate} />
            const blob = await pdf(doc).toBlob();

            // 2. Upload to API
            const formData = new FormData();
            formData.append('file', blob, 'resume.pdf');
            formData.append('resumeId', resumeId);

            const res = await fetch('/api/resume/upload-pdf', {
                method: 'POST',
                body: formData,
            });

            const responseText = await res.text();
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                console.error("Non-JSON response:", responseText);
                throw new Error("Server returned an invalid response.");
            }

            if (!res.ok) throw new Error(result.error || 'Failed to upload PDF');

            if (!silenceToast) toast.success('PDF saved to cloud!', { id: 'pdf-upload', description: 'Your PDF is now publicly available for download links.' });
        } catch (error: any) {
            if (!silenceToast) toast.error('Failed to sync PDF', { id: 'pdf-upload', description: error.message });
            console.error(error);
        } finally {
            setIsUploadingPdf(false);
        }
    }

    const handleSavePdfToCloud = async () => {
        if (!resumeData) return;
        await syncPdfToCloud(resumeData, template, false);
    }

    if (isLoading && !resumeData) {
        return (
            <div className="flex w-full min-h-screen items-center justify-center bg-zinc-50 flex-col gap-4">
                <div className="h-16 w-16 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                    <Sparkles className="h-8 w-8 text-yellow-400" />
                </div>
                <p className="text-zinc-500 font-medium">Loading your resume...</p>
            </div>
        )
    }

    if (!resumeData) return null

    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 w-full relative">
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-zinc-100">
                        <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div className="flex flex-col h-full justify-center">
                        <h1 className="font-bold text-zinc-900 tracking-tight leading-none text-lg">Resume Editor</h1>
                        <div className="flex items-center gap-2 mt-1">
                            {isSaving ? (
                                <span className="text-xs text-zinc-400 font-medium animate-pulse flex items-center gap-1">
                                    <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                                </span>
                            ) : lastSaved ? (
                                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3" /> Saved {lastSaved.toLocaleTimeString()}
                                </span>
                            ) : currentVersionId ? (
                                <Badge variant="outline" className="text-[10px] py-0 px-2 border-blue-200 bg-blue-50 text-blue-600">Viewing Saved Version</Badge>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Template Selector */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-2 font-bold border-zinc-200"
                            onClick={() => setShowTemplates(!showTemplates)}
                        >
                            <Layout className="h-4 w-4" />
                            <span className="hidden sm:inline capitalize">{template}</span>
                        </Button>
                        {showTemplates && (
                            <div className="absolute right-0 top-11 z-50 bg-white rounded-2xl shadow-2xl border border-zinc-100 p-2 w-56">
                                {TEMPLATES.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => { setTemplate(t.id); setShowTemplates(false); }}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${template === t.id ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-50 text-zinc-700'}`}
                                    >
                                        <div className="font-bold text-sm">{t.label}</div>
                                        <div className={`text-[10px] mt-0.5 ${template === t.id ? 'text-zinc-400' : 'text-zinc-400'}`}>{t.description}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-2 font-bold border-zinc-200 text-zinc-600 hover:text-zinc-900"
                        onClick={handleSavePdfToCloud}
                        disabled={isUploadingPdf}
                    >
                        {isUploadingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />}
                        <span className="hidden sm:inline">Sync to Cloud</span>
                    </Button>

                    <PublicLinkManager resumeId={resumeId} template={template} versionId={currentVersionId} />
                    <PdfDownloadButton resumeData={resumeData} template={template} />
                    <JobOptimizerDialog
                        resumeId={resumeId}
                        resumeData={resumeData}
                        onOptimizationApplied={(v) => handleVersionSelect(v)}
                    />
                </div>
            </header>

            <main className="flex-1 flex w-full relative">
                {/* LEFT PANE - Editor */}
                <div className="w-full lg:w-[45%] overflow-y-auto border-r border-zinc-200 p-4 sm:p-6 bg-white pb-32 h-[calc(100vh-65px)] custom-scrollbar">
                    <Accordion type="single" collapsible defaultValue="personal_info" className="w-full space-y-3">

                        <AccordionItem value="personal_info" className="border border-zinc-100 rounded-2xl bg-white shadow-sm overflow-hidden">
                            <AccordionTrigger className="hover:no-underline font-bold text-zinc-800 px-5 py-4 hover:bg-zinc-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 bg-zinc-900 rounded-lg flex items-center justify-center text-white text-[10px] font-black">1</div>
                                    Personal Information
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-5 pb-5 pt-2 border-t border-zinc-50">
                                <PersonalInfoSection
                                    data={resumeData.personal_info}
                                    onChange={(data) => handleUpdate('personal_info', data)}
                                />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="summary" className="border border-zinc-100 rounded-2xl bg-white shadow-sm overflow-hidden">
                            <AccordionTrigger className="hover:no-underline font-bold text-zinc-800 px-5 py-4 hover:bg-zinc-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 bg-zinc-900 rounded-lg flex items-center justify-center text-white text-[10px] font-black">2</div>
                                    Professional Summary
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-5 pb-5 pt-2 border-t border-zinc-50">
                                <textarea
                                    className="w-full min-h-[140px] p-4 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-sm leading-relaxed resize-none bg-zinc-50/50"
                                    value={resumeData.summary || ''}
                                    maxLength={1000}
                                    onChange={(e) => handleUpdate('summary', e.target.value)}
                                    placeholder="Write a compelling professional summary highlighting your top achievements and career goals (2-4 sentences)."
                                />
                                <div className="flex justify-end mt-2 text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                                    {(resumeData.summary || '').length} / 1000
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="experience" className="border border-zinc-100 rounded-2xl bg-white shadow-sm overflow-hidden">
                            <AccordionTrigger className="hover:no-underline font-bold text-zinc-800 px-5 py-4 hover:bg-zinc-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 bg-zinc-900 rounded-lg flex items-center justify-center text-white text-[10px] font-black">3</div>
                                    Work Experience
                                    <Badge variant="secondary" className="ml-2 bg-zinc-100 text-zinc-500 font-bold text-[10px]">
                                        {resumeData.experience?.length || 0} entries
                                    </Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-5 pb-5 pt-2 border-t border-zinc-50">
                                <ExperienceSection data={resumeData.experience} onChange={(data) => handleUpdate('experience', data)} />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="education" className="border border-zinc-100 rounded-2xl bg-white shadow-sm overflow-hidden">
                            <AccordionTrigger className="hover:no-underline font-bold text-zinc-800 px-5 py-4 hover:bg-zinc-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 bg-zinc-900 rounded-lg flex items-center justify-center text-white text-[10px] font-black">4</div>
                                    Education
                                    <Badge variant="secondary" className="ml-2 bg-zinc-100 text-zinc-500 font-bold text-[10px]">
                                        {resumeData.education?.length || 0} entries
                                    </Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-5 pb-5 pt-2 border-t border-zinc-50">
                                <EducationSection data={resumeData.education} onChange={(data) => handleUpdate('education', data)} />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="skills" className="border border-zinc-100 rounded-2xl bg-white shadow-sm overflow-hidden">
                            <AccordionTrigger className="hover:no-underline font-bold text-zinc-800 px-5 py-4 hover:bg-zinc-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 bg-zinc-900 rounded-lg flex items-center justify-center text-white text-[10px] font-black">5</div>
                                    Skills
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-5 pb-5 pt-2 border-t border-zinc-50">
                                <SkillsSection
                                    data={resumeData.skills || { technical: [], soft: [] }}
                                    onChange={(data) => handleUpdate('skills', data)}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className="mt-6">
                        <ResumeVersions
                            resumeId={resumeId}
                            currentVersionId={currentVersionId}
                            onSelectVersion={handleVersionSelect}
                        />
                    </div>
                </div>

                {/* RIGHT PANE - Live PDF Preview */}
                <div className="hidden lg:flex flex-col w-[55%] bg-zinc-200/30 h-[calc(100vh-65px)] overflow-y-auto border-l">
                    <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-zinc-100 border-b border-zinc-200">
                        <span className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Live PDF Preview</span>
                        <span className="text-xs font-bold text-zinc-400 capitalize">{template} Template</span>
                    </div>
                    <div className="flex-1 p-6 flex items-start justify-center">
                        <div className="w-full max-w-[800px] shadow-2xl rounded-2xl overflow-hidden" style={{ aspectRatio: '1/1.414', minHeight: '600px' }}>
                            <ResumePreview data={resumeData} isLoading={isLoading} template={template} />
                        </div>
                    </div>
                </div>
            </main>

            {showTemplates && (
                <div className="fixed inset-0 z-40" onClick={() => setShowTemplates(false)} />
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e4e4e7; border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #d4d4d8; }
            `}</style>
        </div>
    )
}
