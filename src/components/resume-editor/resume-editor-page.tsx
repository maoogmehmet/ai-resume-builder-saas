'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
    Loader2, ArrowLeft, CheckCircle2, Sparkles, Layout, CloudUpload, ChevronDown,
    User, Briefcase, GraduationCap, Wrench, FileText, MoreVertical, Printer,
    Check, MessageSquarePlus
} from 'lucide-react'
import Link from 'next/link'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
import { pdf } from '@react-pdf/renderer'
import { ResumePDFDocument } from '@/lib/pdf-generator'
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
    skills: { technical: [], soft: [] },
    additional_explanations: ''
}

const SECTIONS = [
    { id: 'personal_info', label: 'Personal Information', icon: User, num: '01' },
    { id: 'summary', label: 'Professional Summary', icon: FileText, num: '02' },
    { id: 'experience', label: 'Work Experience', icon: Briefcase, num: '03' },
    { id: 'education', label: 'Education', icon: GraduationCap, num: '04' },
    { id: 'skills', label: 'Skills', icon: Wrench, num: '05' },
    { id: 'additional_explanations', label: 'Additional Explanations', icon: MessageSquarePlus, num: '06' },
]

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
    const [showMoreMenu, setShowMoreMenu] = useState(false)
    const [isTwoPageView, setIsTwoPageView] = useState(false)
    const [isUploadingPdf, setIsUploadingPdf] = useState(false)
    const [openSections, setOpenSections] = useState<Set<string>>(new Set(['personal_info']))

    const resumeId = params?.id as string

    const toggleSection = (id: string) => {
        setOpenSections(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

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
            setResumeData({
                ...EMPTY_RESUME,
                ...jsonData
            })
            setIsLoading(false)

            if (!data.ai_generated_json && data.original_linkedin_json) {
                requestAIGeneration()
            }
        }

        loadResume()
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

            setResumeData((prev: any) => ({
                ...prev,
                ...result.aiGenerated
            }))

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            const doc = <ResumePDFDocument data={data} template={currentTemplate} />
            const blob = await pdf(doc).toBlob();

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
            <div className="flex w-full min-h-screen items-center justify-center bg-[#0a0a0a] flex-col gap-4">
                <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                    <Sparkles className="h-8 w-8 text-emerald-400" />
                </div>
                <p className="text-zinc-500 font-medium">Loading your resume...</p>
            </div>
        )
    }

    if (!resumeData) return null

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0a] w-full relative">
            {/* ── HEADER ── */}
            <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06] px-4 lg:px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-white/5 text-zinc-400 hover:text-white">
                        <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div className="flex flex-col h-full justify-center">
                        <h1 className="font-bold text-white tracking-tight leading-none text-lg">Resume Editor</h1>
                        <div className="flex items-center gap-2 mt-1">
                            {isSaving ? (
                                <span className="text-xs text-zinc-500 font-medium animate-pulse flex items-center gap-1">
                                    <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                                </span>
                            ) : lastSaved ? (
                                <span className="text-xs text-emerald-500/80 font-medium flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3" /> Saved {lastSaved.toLocaleTimeString()}
                                </span>
                            ) : currentVersionId ? (
                                <Badge variant="outline" className="text-[10px] py-0 px-2 border-blue-500/30 bg-blue-500/10 text-blue-400">Viewing Saved Version</Badge>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Template Selector */}
                    <div className="relative">
                        <button
                            className="h-9 px-3 gap-2 font-bold text-xs rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all flex items-center"
                            onClick={() => setShowTemplates(!showTemplates)}
                        >
                            <Layout className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline capitalize font-bold">{template}</span>
                            <ChevronDown className={`h-3 w-3 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
                        </button>
                        {showTemplates && (
                            <div className="absolute right-0 top-11 z-50 bg-[#141414] rounded-2xl shadow-2xl border border-white/[0.08] p-2 w-64 overflow-hidden">
                                <div className="px-3 py-2 border-b border-white/[0.05] mb-1">
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Select Template</span>
                                </div>
                                {TEMPLATES.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => { setTemplate(t.id); setShowTemplates(false); }}
                                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group ${template === t.id ? 'bg-white text-black' : 'hover:bg-white/[0.06] text-zinc-400 hover:text-white'}`}
                                    >
                                        <div>
                                            <div className="font-bold text-sm tracking-tight">{t.label}</div>
                                            <div className={`text-[10px] mt-0.5 leading-tight ${template === t.id ? 'text-zinc-600' : 'text-zinc-500'}`}>{t.description}</div>
                                        </div>
                                        {template === t.id && <Check className="h-4 w-4 text-emerald-600" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        className="h-9 px-3 gap-2 font-bold text-xs rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all flex items-center disabled:opacity-50"
                        onClick={handleSavePdfToCloud}
                        disabled={isUploadingPdf}
                    >
                        {isUploadingPdf ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CloudUpload className="h-3.5 w-3.5" />}
                        <span className="hidden sm:inline">Sync to Cloud</span>
                    </button>

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
                <div className={`overflow-y-auto border-r border-white/[0.06] p-4 sm:p-6 bg-[#0a0a0a] pb-32 h-[calc(100vh-65px)] custom-scrollbar transition-all duration-300 ${isTwoPageView ? 'hidden lg:block lg:w-[30%]' : 'w-full lg:w-[45%]'}`}>
                    <div className="space-y-3">
                        {SECTIONS.map((section) => {
                            const isOpen = openSections.has(section.id)
                            const Icon = section.icon
                            const count = section.id === 'experience' ? resumeData.experience?.length
                                : section.id === 'education' ? resumeData.education?.length
                                    : section.id === 'skills' ? (resumeData.skills?.technical?.length + resumeData.skills?.soft?.length)
                                        : null

                            return (
                                <div key={section.id} className="border border-white/[0.06] rounded-2xl bg-[#111111] overflow-hidden transition-all shadow-sm">
                                    <button
                                        onClick={() => toggleSection(section.id)}
                                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                                                <Icon className="h-4 w-4 text-zinc-400" />
                                            </div>
                                            <span className="font-semibold text-white text-sm">{section.label}</span>
                                            {count !== null && count > 0 && (
                                                <span className="text-[10px] font-bold text-zinc-500 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-md">
                                                    {count}
                                                </span>
                                            )}
                                        </div>
                                        <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isOpen && (
                                        <div className="px-5 pb-5 pt-2 border-t border-white/[0.04]">
                                            {section.id === 'personal_info' && (
                                                <PersonalInfoSection
                                                    data={resumeData.personal_info}
                                                    onChange={(data) => handleUpdate('personal_info', data)}
                                                />
                                            )}
                                            {section.id === 'summary' && (
                                                <div className="space-y-3">
                                                    <textarea
                                                        className="w-full min-h-[140px] p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30 outline-none transition-all text-sm leading-relaxed resize-none text-zinc-300 placeholder:text-zinc-600"
                                                        value={resumeData.summary || ''}
                                                        maxLength={1000}
                                                        onChange={(e) => handleUpdate('summary', e.target.value)}
                                                        placeholder="Write a compelling professional summary highlighting your top achievements and career goals (2-4 sentences)."
                                                    />
                                                    <div className="flex items-center justify-between">
                                                        <AnimatedGenerateButton
                                                            onClick={requestAIGeneration}
                                                            disabled={isLoading}
                                                            generating={isLoading}
                                                            labelIdle="Generate with AI"
                                                            labelActive="Writing Summary..."
                                                            highlightHueDeg={140}
                                                            size="sm"
                                                            className="h-10"
                                                        />
                                                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                                                            {(resumeData.summary || '').length} / 1000
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {section.id === 'experience' && (
                                                <ExperienceSection data={resumeData.experience} onChange={(data) => handleUpdate('experience', data)} />
                                            )}
                                            {section.id === 'education' && (
                                                <EducationSection data={resumeData.education} onChange={(data) => handleUpdate('education', data)} />
                                            )}
                                            {section.id === 'skills' && (
                                                <SkillsSection
                                                    data={resumeData.skills || { technical: [], soft: [] }}
                                                    onChange={(data) => handleUpdate('skills', data)}
                                                />
                                            )}
                                            {section.id === 'additional_explanations' && (
                                                <div className="space-y-3">
                                                    <Label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 block">Custom Content Section</Label>
                                                    <textarea
                                                        className="w-full min-h-[140px] p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30 outline-none transition-all text-sm leading-relaxed resize-none text-zinc-300 placeholder:text-zinc-600 font-mono"
                                                        value={resumeData.additional_explanations || ''}
                                                        onChange={(e) => handleUpdate('additional_explanations', e.target.value)}
                                                        placeholder="Add certifications, projects, workshops, or any extra information you'd like to appear at the end of your resume."
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-6">
                        <ResumeVersions
                            resumeId={resumeId}
                            currentVersionId={currentVersionId}
                            onSelectVersion={handleVersionSelect}
                        />
                    </div>
                </div>

                {/* RIGHT PANE - Live PDF Preview */}
                <div className={`hidden lg:flex flex-col bg-[#080808] h-[calc(100vh-65px)] overflow-y-auto transition-all duration-300 ${isTwoPageView ? 'w-[70%]' : 'w-[55%]'}`}>
                    <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-[#0a0a0a] border-b border-white/[0.06]">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Live PDF Preview</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="h-8 w-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-all">
                                <Printer className="h-4 w-4" />
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                                    className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${showMoreMenu ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/[0.06]'}`}
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </button>
                                {showMoreMenu && (
                                    <div className="absolute right-0 top-10 z-50 bg-[#141414] rounded-xl shadow-2xl border border-white/[0.08] p-1.5 w-56 overflow-hidden">
                                        <button
                                            onClick={() => { setIsTwoPageView(!isTwoPageView); setShowMoreMenu(false); }}
                                            className="w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between hover:bg-white/[0.06] text-zinc-400 hover:text-white"
                                        >
                                            <span className="text-xs font-semibold">İki sayfalı görünüm</span>
                                            {isTwoPageView && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                                        </button>
                                        <button
                                            onClick={() => { toggleSection('additional_explanations'); setShowMoreMenu(false); }}
                                            className="w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between hover:bg-white/[0.06] text-zinc-400 hover:text-white"
                                        >
                                            <span className="text-xs font-semibold">Ek Açıklamalar</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 p-6 flex items-start justify-center">
                        <div className={`transition-all duration-500 w-full max-w-[1200px] shadow-2xl shadow-black/50 rounded-2xl overflow-hidden border border-white/[0.06] ${isTwoPageView ? 'aspect-[1.414/1]' : 'aspect-[1/1.414]'}`} style={{ minHeight: '600px' }}>
                            <ResumePreview data={resumeData} isLoading={isLoading} template={template} isTwoPage={isTwoPageView} />
                        </div>
                    </div>
                </div>
            </main>

            {(showTemplates || showMoreMenu) && (
                <div className="fixed inset-0 z-40" onClick={() => { setShowTemplates(false); setShowMoreMenu(false); }} />
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #1a1a1a; border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #2a2a2a; }
            `}</style>
        </div>
    )
}
