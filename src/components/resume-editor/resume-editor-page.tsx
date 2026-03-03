'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
    Loader2, ArrowLeft, CheckCircle2, Sparkles, Layout, CloudUpload, ChevronDown,
    User, Briefcase, GraduationCap, Wrench, FileText,
    Check, MessageSquarePlus
} from 'lucide-react'
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
    additional_explanations: '',
    template: 'classic'
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
    const [isTwoPageView, setIsTwoPageView] = useState(false)
    const [isUploadingPdf, setIsUploadingPdf] = useState(false)
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
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
            if (jsonData.template) {
                setTemplate(jsonData.template as TemplateType)
            }
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
        toast.info('Generating Novatypalcv...', { description: 'Converting LinkedIn data to ATS-optimized format...' })
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

    const handleGenerateSummary = async () => {
        if (!resumeData) return;
        setIsGeneratingSummary(true);
        toast.info('Generating Professional Summary...', { description: 'Analyzing your experience and skills...' });

        try {
            const response = await fetch('/api/ai/generate-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeData })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Summary generation failed');

            handleUpdate('summary', result.summary);
            toast.success('Summary Generated!', { description: 'Your professional summary has been drafted.' });
        } catch (error: any) {
            toast.error('Generation Failed', { description: error.message });
        } finally {
            setIsGeneratingSummary(false);
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
        if (version.optimized_json?.template) {
            setTemplate(version.optimized_json.template as TemplateType)
        }
        syncPdfToCloud(version.optimized_json, (version.optimized_json?.template || template) as TemplateType, true).catch(e => console.error(e));
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
                <p className="text-zinc-500 font-medium font-black uppercase tracking-widest text-[10px] italic">Loading Lab...</p>
            </div>
        )
    }

    if (!resumeData) return null

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0a] w-full relative selection:bg-emerald-500/30">
            {/* ── HEADER ── */}
            <header className="sticky top-0 z-40 bg-black border-b border-white/[0.06] px-4 lg:px-12 py-4 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-6">
                    <AnimatedGenerateButton
                        size="icon"
                        href="/dashboard"
                        className="h-10 w-10"
                        icon={<ArrowLeft className="h-4 w-4" />}
                    />
                    <div className="flex flex-col h-full justify-center">
                        <h1 className="text-xl font-black text-white tracking-tighter italic uppercase leading-none">resume lab</h1>
                        <div className="flex items-center gap-2 mt-1.5 h-3">
                            {isSaving ? (
                                <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse italic">
                                    <Loader2 className="h-2.5 w-2.5 animate-spin" /> saving process...
                                </span>
                            ) : lastSaved ? (
                                <span className="text-[10px] text-emerald-500/60 font-black uppercase tracking-widest flex items-center gap-1.5 italic">
                                    <CheckCircle2 className="h-2.5 w-2.5" /> secured {lastSaved.toLocaleTimeString()}
                                </span>
                            ) : currentVersionId ? (
                                <span className="text-[10px] text-blue-500/60 font-black uppercase tracking-widest flex items-center gap-1.5 italic">
                                    saved version active
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Template Selector */}
                    <div className="relative">
                        <AnimatedGenerateButton
                            onClick={() => setShowTemplates(!showTemplates)}
                            labelIdle={template}
                            size="sm"
                            className="font-black italic lowercase"
                            icon={<Layout className={`h-3.5 w-3.5 transition-transform ${showTemplates ? 'rotate-90' : ''}`} />}
                        />
                        {showTemplates && (
                            <div className="absolute right-0 top-12 z-50 bg-black rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 p-2 w-72 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-3 border-b border-white/5 mb-1.5">
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] italic">Architectural Style</span>
                                </div>
                                {TEMPLATES.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            setTemplate(t.id);
                                            handleUpdate('template', t.id);
                                            setShowTemplates(false);
                                            toast.success(`Style transitioned to ${t.label}`);
                                        }}
                                        className={`w-full text-left px-4 py-3.5 rounded-xl transition-all flex items-center justify-between group mb-1 ${template === t.id ? 'bg-white/5 text-emerald-400' : 'hover:bg-white/[0.04] text-zinc-500 hover:text-white'}`}
                                    >
                                        <div>
                                            <div className="flex items-center gap-2 font-black text-xs tracking-tighter uppercase italic">
                                                {t.label}
                                                {(t.id === 'modern' || t.id === 'executive') && <Sparkles className="h-3 w-3 text-emerald-500/40" />}
                                            </div>
                                            <div className={`text-[10px] mt-1 font-bold ${template === t.id ? 'text-zinc-500' : 'text-zinc-700 group-hover:text-zinc-500'}`}>{t.description}</div>
                                        </div>
                                        {template === t.id && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <AnimatedGenerateButton
                        onClick={handleSavePdfToCloud}
                        disabled={isUploadingPdf}
                        generating={isUploadingPdf}
                        labelIdle="sync"
                        labelActive="clouding..."
                        size="sm"
                        className="font-black italic lowercase"
                        icon={<CloudUpload className="h-3.5 w-3.5" />}
                    />

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
                <div className={`overflow-y-auto border-r border-white/5 p-4 sm:p-10 bg-[#0a0a0a] pb-40 h-[calc(100vh-73px)] custom-scrollbar transition-all duration-300 ${isTwoPageView ? 'hidden lg:block lg:w-[30%]' : 'w-full lg:w-[45%]'}`}>
                    <div className="space-y-4">
                        {SECTIONS.map((section) => {
                            const isOpen = openSections.has(section.id)
                            const Icon = section.icon
                            const count = section.id === 'experience' ? resumeData.experience?.length
                                : section.id === 'education' ? resumeData.education?.length
                                    : section.id === 'skills' ? ((resumeData.skills?.technical?.length || 0) + (resumeData.skills?.soft?.length || 0))
                                        : null

                            return (
                                <div key={section.id} className={`rounded-[2rem] border transition-all duration-500 relative overflow-hidden ${isOpen ? 'bg-white/[0.02] border-white/10 shadow-2xl' : 'bg-transparent border-white/5 hover:border-white/10'}`}>
                                    <button
                                        onClick={() => toggleSection(section.id)}
                                        className="w-full flex items-center justify-between px-8 py-7 group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-2xl border flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-white text-black border-transparent scale-110 shadow-2xl shadow-white/10' : 'bg-white/5 border-white/5 group-hover:bg-white/10'}`}>
                                                <Icon className={`h-4.5 w-4.5 transition-colors ${isOpen ? 'text-black' : 'text-zinc-600 group-hover:text-white'}`} />
                                            </div>
                                            <div className="text-left">
                                                <span className={`block font-black uppercase text-xs tracking-tighter italic transition-colors ${isOpen ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{section.label}</span>
                                                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">{section.num}{count !== null && count > 0 ? ` — ${count} items` : ''}</span>
                                            </div>
                                        </div>
                                        <ChevronDown className={`h-4 w-4 text-zinc-700 transition-transform duration-500 ${isOpen ? 'rotate-180 text-white' : 'group-hover:text-zinc-400'}`} />
                                    </button>

                                    {isOpen && (
                                        <div className="px-8 pb-10 pt-2 border-t border-white/[0.03] animate-in fade-in slide-in-from-top-2 duration-500">
                                            {section.id === 'personal_info' && (
                                                <PersonalInfoSection
                                                    data={resumeData.personal_info}
                                                    onChange={(data) => handleUpdate('personal_info', data)}
                                                />
                                            )}
                                            {section.id === 'summary' && (
                                                <div className="space-y-4">
                                                    <textarea
                                                        className="w-full min-h-[160px] p-6 rounded-2xl border border-white/5 bg-black focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/20 outline-none transition-all text-sm leading-relaxed resize-none text-zinc-400 placeholder:text-zinc-700 font-medium font-sans"
                                                        value={resumeData.summary || ''}
                                                        maxLength={1000}
                                                        onChange={(e) => handleUpdate('summary', e.target.value)}
                                                        placeholder="Write a compelling professional summary..."
                                                    />
                                                    <div className="pt-2">
                                                        <AnimatedGenerateButton
                                                            onClick={handleGenerateSummary}
                                                            disabled={isGeneratingSummary}
                                                            generating={isGeneratingSummary}
                                                            labelIdle="magic summary"
                                                            labelActive="writing..."
                                                            highlightHueDeg={140}
                                                            size="sm"
                                                            className="w-full italic font-black lowercase"
                                                        />
                                                        <div className="flex justify-end mt-2">
                                                            <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest italic">
                                                                {(resumeData.summary || '').length} <span className="text-zinc-900">/ 1000</span>
                                                            </span>
                                                        </div>
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
                                                <div className="space-y-4">
                                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] italic mb-1 px-1">Custom Additions</p>
                                                    <textarea
                                                        className="w-full min-h-[160px] p-6 rounded-2xl border border-white/5 bg-black focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/20 outline-none transition-all text-sm leading-relaxed resize-none text-zinc-400 placeholder:text-zinc-700 font-medium font-sans"
                                                        value={resumeData.additional_explanations || ''}
                                                        onChange={(e) => handleUpdate('additional_explanations', e.target.value)}
                                                        placeholder="Add certifications, projects, or interests..."
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-12">
                        <ResumeVersions
                            resumeId={resumeId}
                            currentVersionId={currentVersionId}
                            onSelectVersion={handleVersionSelect}
                        />
                    </div>
                </div>

                {/* RIGHT PANE - Live PDF Preview */}
                <div className={`hidden lg:flex flex-col bg-[#050505] h-[calc(100vh-73px)] overflow-y-auto transition-all duration-300 relative ${isTwoPageView ? 'w-[70%]' : 'w-[55%]'}`}>
                    <div className="sticky top-0 z-10 flex items-center justify-between px-10 py-5 bg-black/40 backdrop-blur-3xl border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] italic">Live Intelligence Render</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <PdfDownloadButton
                                resumeData={resumeData}
                                template={template}
                            />
                        </div>
                    </div>
                    <div className="flex-1 p-12 flex items-start justify-center">
                        <div className={`transition-all duration-1000 w-full max-w-[1000px] shadow-[0_50px_100px_rgba(0,0,0,1)] rounded-3xl overflow-hidden border border-white/10 group ${isTwoPageView ? 'aspect-[1.414/1]' : 'aspect-[1/1.414]'}`} style={{ minHeight: '700px' }}>
                            <ResumePreview data={resumeData} isLoading={isLoading} template={template} isTwoPage={isTwoPageView} />
                        </div>
                    </div>
                </div>
            </main>

            {showTemplates && (
                <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" onClick={() => { setShowTemplates(false); }} />
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
