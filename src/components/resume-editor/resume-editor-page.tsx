'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
    Loader2, ArrowLeft, CheckCircle2, Sparkles, Layout, CloudUpload, ChevronDown, ChevronRight,
    User, Briefcase, GraduationCap, Wrench, FileText, Clock, RotateCcw, Wand2, Target, X, ShieldCheck, MessageSquarePlus,
    Download, Share2, AlertTriangle, Save, Eye, EyeOff, Zap, BookOpen
} from 'lucide-react'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'
import { pdf } from '@react-pdf/renderer'
import { ResumePDFDocument } from '@/lib/pdf-generator'
import { PersonalInfoSection } from '@/components/resume-editor/personal-info'
import { ExperienceSection } from '@/components/resume-editor/experience-section'
import { EducationSection } from '@/components/resume-editor/education-section'
import { SkillsSection } from '@/components/resume-editor/skills-section'
import { ResumePreview } from '@/components/resume-preview'
import { PdfDownloadButton } from '@/components/pdf-download-button'
import { PublicLinkManager } from '@/components/public-link-manager'
import { ResumeVersions } from '@/components/resume-versions'

type TemplateType = 'classic' | 'modern' | 'executive'

const TEMPLATES: { id: TemplateType; label: string; description: string; badge?: string }[] = [
    { id: 'classic', label: 'Classic', description: 'Clean, ATS-friendly single-column layout' },
    { id: 'modern', label: 'Modern', description: 'Dark sidebar with skill bars', badge: 'Popular' },
    { id: 'executive', label: 'Executive', description: 'Premium bold typographic design', badge: 'Premium' },
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
    { id: 'personal_info', label: 'Personal Information', icon: User, num: '01', hint: 'Name, email, contact details' },
    { id: 'summary', label: 'Professional Summary', icon: FileText, num: '02', hint: 'Who you are & what you bring' },
    { id: 'experience', label: 'Work Experience', icon: Briefcase, num: '03', hint: 'Your career history' },
    { id: 'education', label: 'Education', icon: GraduationCap, num: '04', hint: 'Degrees and certifications' },
    { id: 'skills', label: 'Skills', icon: Wrench, num: '05', hint: 'Technical and soft skills' },
    { id: 'additional_explanations', label: 'Additional Notes', icon: BookOpen, num: '06', hint: 'Projects, certifications, interests' },
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
    const [isUploadingPdf, setIsUploadingPdf] = useState(false)
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
    const [openSections, setOpenSections] = useState<Set<string>>(new Set(['personal_info']))
    const [showOptimizerPanel, setShowOptimizerPanel] = useState(false)
    const [isAtsSafe, setIsAtsSafe] = useState(false)
    const [showPreview, setShowPreview] = useState(true)
    const [jdText, setJdText] = useState('')
    const [isAnalyzingJd, setIsAnalyzingJd] = useState(false)
    const [jdAnalysis, setJdAnalysis] = useState<{ missing: string[]; matched: string[] } | null>(null)

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
            setResumeData({ ...EMPTY_RESUME, ...jsonData })
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
        toast.info('Generating resume...', { description: 'Converting LinkedIn data to ATS-optimized format...' })
        try {
            const response = await fetch('/api/ai/generate-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeId })
            })

            const result = await response.json()
            if (!response.ok) {
                if (result.error === 'subscription_required') {
                    toast.error('Premium Required', { description: result.message || 'Please upgrade to Elite Tier to continue.' })
                    router.push('/#pricing')
                    return
                }
                throw new Error(result.error || result.message || 'AI generation failed')
            }

            setResumeData((prev: any) => ({ ...prev, ...result.aiGenerated }))

            const jobTitle = result.aiGenerated?.personal_info?.title || result.aiGenerated?.experience?.[0]?.position || 'Professional'
            fetch('/api/ai/generate-letter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeId, jobTitle, companyName: 'Future Employer', jobDescription: 'General application' })
            }).catch(e => console.error('Pitch deck auto-gen failed', e))

            syncPdfToCloud(result.aiGenerated, template, true).catch(e => console.error('Auto PDF sync failed', e))

            toast.success('Resume Generated!', { description: 'Your resume has been optimized.' })
        } catch (error: any) {
            toast.error('AI Generation Failed', { description: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    const handleGenerateSummary = async () => {
        if (!resumeData) return
        setIsGeneratingSummary(true)
        toast.info('Generating Professional Summary...', { description: 'Analyzing your experience and skills...' })

        try {
            const response = await fetch('/api/ai/generate-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeData })
            })

            const result = await response.json()
            if (!response.ok) throw new Error(result.error || 'Summary generation failed')

            handleUpdate('summary', result.summary)
            toast.success('Summary Generated!', { description: 'Your professional summary has been drafted.' })
        } catch (error: any) {
            toast.error('Generation Failed', { description: error.message })
        } finally {
            setIsGeneratingSummary(false)
        }
    }

    const handleAnalyzeJd = async () => {
        if (!jdText.trim()) {
            toast.error('Please paste a job description first')
            return
        }
        setIsAnalyzingJd(true)
        try {
            const response = await fetch('/api/ai/ats-match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeId,
                    jobTitle: resumeData?.experience?.[0]?.position || 'Professional',
                    companyName: 'Target Company',
                    jobDescription: jdText
                })
            })
            const result = await response.json()
            if (!response.ok) throw new Error(result.error || 'Analysis failed')

            setJdAnalysis({
                missing: result.result?.keyword_analysis?.missing_keywords || [],
                matched: result.result?.keyword_analysis?.matched_keywords || []
            })
            toast.success('Gap analysis complete!')
        } catch (error: any) {
            toast.error('Analysis Failed', { description: error.message })
        } finally {
            setIsAnalyzingJd(false)
        }
    }

    // Debounced auto-save
    useEffect(() => {
        if (!resumeData || isLoading || currentVersionId) return

        const timeout = setTimeout(async () => {
            setIsSaving(true)
            const { error } = await supabase
                .from('resumes')
                .update({ ai_generated_json: resumeData, updated_at: new Date().toISOString() })
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
        syncPdfToCloud(version.optimized_json, (version.optimized_json?.template || template) as TemplateType, true).catch(e => console.error(e))
        toast.info(`Version restored: ${version.company_name || 'Saved Version'}`)
    }

    const syncPdfToCloud = async (data: any, currentTemplate: TemplateType, silenceToast = false) => {
        setIsUploadingPdf(true)
        if (!silenceToast) toast.loading('Uploading PDF to cloud...', { id: 'pdf-upload' })

        try {
            const doc = <ResumePDFDocument data={data} template={currentTemplate} />
            const blob = await pdf(doc).toBlob()

            const formData = new FormData()
            formData.append('file', blob, 'resume.pdf')
            formData.append('resumeId', resumeId)

            const res = await fetch('/api/resume/upload-pdf', { method: 'POST', body: formData })
            const responseText = await res.text()
            let result
            try { result = JSON.parse(responseText) } catch (e) {
                console.error('Non-JSON response:', responseText)
                throw new Error('Server returned an invalid response.')
            }

            if (!res.ok) throw new Error(result.error || 'Failed to upload PDF')
            if (!silenceToast) toast.success('PDF saved to cloud!', { id: 'pdf-upload' })
        } catch (error: any) {
            if (!silenceToast) toast.error('Failed to sync PDF', { id: 'pdf-upload', description: error.message })
            console.error(error)
        } finally {
            setIsUploadingPdf(false)
        }
    }

    const handleSavePdfToCloud = async () => {
        if (!resumeData) return
        await syncPdfToCloud(resumeData, template, false)
    }

    const handleShare = () => {
        toast.info('Copy the public link above to share your CV')
    }

    if (isLoading && !resumeData) {
        return (
            <div className="flex w-full min-h-screen items-center justify-center bg-[#0a0a0a] flex-col gap-5">
                <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Sparkles className="h-8 w-8 text-emerald-400 animate-pulse" />
                </div>
                <div className="text-center">
                    <p className="text-white font-bold text-sm">Loading your resume...</p>
                    <p className="text-zinc-600 text-xs mt-1">Setting up the editor</p>
                </div>
            </div>
        )
    }

    if (!resumeData) return null

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0a] w-full relative selection:bg-emerald-500/30">
            {/* ── HEADER ── */}
            <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/[0.06] px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all"
                    >
                        <ArrowLeft className="h-4 w-4 text-zinc-400" />
                    </button>
                    <div>
                        <h1 className="text-base font-black text-white tracking-tight uppercase leading-none">Resume Editor</h1>
                        <div className="flex items-center gap-2 mt-1">
                            {isSaving ? (
                                <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1.5">
                                    <Loader2 className="h-2.5 w-2.5 animate-spin" /> Saving...
                                </span>
                            ) : lastSaved ? (
                                <span className="text-[10px] text-emerald-500/70 font-medium flex items-center gap-1.5">
                                    <CheckCircle2 className="h-2.5 w-2.5" /> Saved {lastSaved.toLocaleTimeString()}
                                </span>
                            ) : currentVersionId ? (
                                <span className="text-[10px] text-blue-400/70 font-medium flex items-center gap-1.5">
                                    <RotateCcw className="h-2.5 w-2.5" /> Version restored
                                </span>
                            ) : (
                                <span className="text-[10px] text-zinc-700 font-medium">Auto-save enabled</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Template Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowTemplates(!showTemplates)}
                            className="flex items-center gap-2 px-3 py-2 h-9 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-bold rounded-xl transition-all"
                        >
                            <Layout className="h-3.5 w-3.5" />
                            <span className="capitalize hidden sm:block">{template}</span>
                            <ChevronDown className={`h-3 w-3 text-zinc-500 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
                        </button>
                        {showTemplates && (
                            <div className="absolute right-0 top-11 z-50 bg-[#101010] rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 p-2 w-72 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <p className="px-4 py-2.5 text-[9px] font-bold text-zinc-600 uppercase tracking-widest border-b border-white/5 mb-1">Template Style</p>
                                {TEMPLATES.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            setTemplate(t.id)
                                            handleUpdate('template', t.id)
                                            setShowTemplates(false)
                                            toast.success(`Template changed to ${t.label}`)
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group mb-1 ${template === t.id ? 'bg-white/5 text-emerald-400' : 'hover:bg-white/[0.04] text-zinc-500 hover:text-white'}`}
                                    >
                                        <div>
                                            <div className="flex items-center gap-2 font-bold text-xs">
                                                {t.label}
                                                {t.badge && <span className="text-[8px] font-black px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">{t.badge}</span>}
                                            </div>
                                            <div className={`text-[10px] mt-0.5 font-medium ${template === t.id ? 'text-zinc-500' : 'text-zinc-700 group-hover:text-zinc-500'}`}>{t.description}</div>
                                        </div>
                                        {template === t.id && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cloud Sync */}
                    <button
                        onClick={handleSavePdfToCloud}
                        disabled={isUploadingPdf}
                        className="flex items-center gap-2 px-3 py-2 h-9 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                        title="Upload PDF to cloud (for shareable links)"
                    >
                        {isUploadingPdf ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CloudUpload className="h-3.5 w-3.5" />}
                        <span className="hidden sm:block">Sync</span>
                    </button>

                    {/* Share */}
                    <PublicLinkManager resumeId={resumeId} template={template} versionId={currentVersionId} />

                    {/* Download PDF */}
                    <PdfDownloadButton resumeData={resumeData} template={template} />

                    {/* Toggle preview on mobile */}
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="lg:hidden flex items-center gap-2 px-3 py-2 h-9 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-bold rounded-xl transition-all"
                    >
                        {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                </div>
            </header>

            <main className="flex-1 flex w-full relative">
                {/* LEFT PANE - Editor */}
                <div className={`overflow-y-auto border-r border-white/5 bg-[#0a0a0a] pb-40 h-[calc(100vh-61px)] custom-scrollbar transition-all duration-300 ${showPreview ? 'w-full lg:w-[44%]' : 'w-full'} p-4 sm:p-8`}>
                    <div className="space-y-3 max-w-2xl mx-auto">
                        {SECTIONS.map((section) => {
                            const isOpen = openSections.has(section.id)
                            const Icon = section.icon
                            const count = section.id === 'experience' ? resumeData.experience?.length
                                : section.id === 'education' ? resumeData.education?.length
                                    : section.id === 'skills' ? ((resumeData.skills?.technical?.length || 0) + (resumeData.skills?.soft?.length || 0))
                                        : null

                            return (
                                <div key={section.id} className={`rounded-2xl border transition-all duration-300 ${isOpen ? 'bg-white/[0.018] border-white/10 shadow-xl' : 'bg-transparent border-white/[0.06] hover:border-white/10'}`}>
                                    <button
                                        onClick={() => toggleSection(section.id)}
                                        className="w-full flex items-center justify-between px-5 py-4 group"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <div className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all duration-200 ${isOpen ? 'bg-white text-black border-transparent shadow-lg' : 'bg-white/5 border-white/5 group-hover:bg-white/10'}`}>
                                                <Icon className={`h-4 w-4 transition-colors ${isOpen ? 'text-black' : 'text-zinc-500 group-hover:text-white'}`} />
                                            </div>
                                            <div className="text-left">
                                                <span className={`block font-bold text-sm transition-colors ${isOpen ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{section.label}</span>
                                                <span className="text-[10px] font-medium text-zinc-700">
                                                    {count !== null && count > 0 ? `${count} ${count === 1 ? 'item' : 'items'}` : section.hint}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-zinc-800 tabular-nums">{section.num}</span>
                                            <ChevronDown className={`h-4 w-4 text-zinc-600 transition-transform duration-300 ${isOpen ? 'rotate-180 text-zinc-400' : 'group-hover:text-zinc-400'}`} />
                                        </div>
                                    </button>

                                    {isOpen && (
                                        <div className="px-5 pb-6 pt-2 border-t border-white/[0.04] animate-in fade-in slide-in-from-top-2 duration-300">
                                            {section.id === 'personal_info' && (
                                                <PersonalInfoSection
                                                    data={resumeData.personal_info}
                                                    onChange={(data) => handleUpdate('personal_info', data)}
                                                />
                                            )}
                                            {section.id === 'summary' && (
                                                <div className="space-y-3">
                                                    <textarea
                                                        className="w-full min-h-[160px] p-4 rounded-xl border border-white/5 bg-black focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/20 outline-none transition-all text-sm leading-relaxed resize-none text-zinc-300 placeholder:text-zinc-700 font-normal"
                                                        value={resumeData.summary || ''}
                                                        maxLength={1000}
                                                        onChange={(e) => handleUpdate('summary', e.target.value)}
                                                        placeholder="Write a compelling professional summary that showcases your expertise, key achievements, and what you bring to potential employers..."
                                                    />
                                                    <div className="flex items-center justify-between">
                                                        <button
                                                            onClick={handleGenerateSummary}
                                                            disabled={isGeneratingSummary}
                                                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-xl transition-colors disabled:opacity-50"
                                                        >
                                                            {isGeneratingSummary ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                                                            {isGeneratingSummary ? 'Generating...' : 'Generate with AI'}
                                                        </button>
                                                        <span className="text-[10px] text-zinc-700 font-medium">{(resumeData.summary || '').length} / 1000</span>
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
                                                    <p className="text-xs text-zinc-600">Add certifications, awards, projects, languages, or interests</p>
                                                    <textarea
                                                        className="w-full min-h-[140px] p-4 rounded-xl border border-white/5 bg-black focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500/20 outline-none transition-all text-sm leading-relaxed resize-none text-zinc-300 placeholder:text-zinc-700 font-normal"
                                                        value={resumeData.additional_explanations || ''}
                                                        onChange={(e) => handleUpdate('additional_explanations', e.target.value)}
                                                        placeholder="• AWS Certified Solutions Architect (2023)&#10;• Speaker at React Conf 2022&#10;• Languages: English (fluent), Spanish (intermediate)"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Bottom tools */}
                    <div className="mt-6 max-w-2xl mx-auto space-y-3">
                        {/* Version History */}
                        <ResumeVersions
                            resumeId={resumeId}
                            currentVersionId={currentVersionId}
                            onSelectVersion={handleVersionSelect}
                        />
                    </div>
                </div>

                {/* RIGHT PANE - Preview + Optimizer */}
                <div className={`${showPreview ? 'hidden lg:flex' : 'hidden'} bg-[#050505] h-[calc(100vh-61px)] overflow-hidden transition-all duration-300 relative flex-1`}>

                    {/* Slide-Out JD Optimizer Panel */}
                    <div className={`h-full border-r border-white/5 bg-[#0a0a0a] transition-all duration-500 flex-shrink-0 flex flex-col ${showOptimizerPanel ? 'w-[360px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                        <div className="p-5 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                    <Target className="h-3.5 w-3.5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">JD Optimizer</h3>
                                    <p className="text-[10px] text-zinc-600">Analyze keyword gaps</p>
                                </div>
                            </div>
                            <button onClick={() => setShowOptimizerPanel(false)} className="h-7 w-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Job Description</Label>
                                <textarea
                                    className="w-full h-48 bg-black border border-white/5 rounded-xl p-4 text-xs text-zinc-300 resize-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all placeholder:text-zinc-700"
                                    placeholder="Paste the job description here to find keyword gaps and optimize your CV for this specific role..."
                                    value={jdText}
                                    onChange={(e) => setJdText(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleAnalyzeJd}
                                disabled={isAnalyzingJd || !jdText.trim()}
                                className="w-full py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 text-[10px] font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isAnalyzingJd ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                                {isAnalyzingJd ? 'Analyzing...' : 'Analyze Keyword Gaps'}
                            </button>

                            {jdAnalysis && (
                                <div className="space-y-4 animate-in fade-in duration-500">
                                    {jdAnalysis.missing.length > 0 && (
                                        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                                                    <span className="text-xs font-bold text-red-300">Missing Keywords</span>
                                                </div>
                                                <span className="text-[9px] text-red-400 font-bold">{jdAnalysis.missing.length} gaps</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {jdAnalysis.missing.map(k => (
                                                    <span key={k} className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-[9px] font-bold uppercase tracking-wide border border-red-500/20">{k}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {jdAnalysis.matched.length > 0 && (
                                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                                <span className="text-xs font-bold text-emerald-300">Matched Keywords</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {jdAnalysis.matched.map(k => (
                                                    <span key={k} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-wide border border-emerald-500/20">{k}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* PDF Preview Wrapper */}
                    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
                        {/* Preview Top Bar */}
                        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 bg-black/50 backdrop-blur-xl border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Live Preview</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* JD Optimizer Trigger */}
                                <button
                                    onClick={() => setShowOptimizerPanel(!showOptimizerPanel)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors ${showOptimizerPanel ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20' : 'bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:border-white/10'}`}
                                >
                                    <Target className="h-3 w-3" /> Optimize
                                </button>

                                <div className="w-px h-4 bg-white/10" />

                                {/* ATS Toggle */}
                                <button
                                    onClick={() => { setIsAtsSafe(!isAtsSafe); toast.success(isAtsSafe ? 'ATS Safe mode off' : 'ATS Safe mode on — simplified layout') }}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-colors ${isAtsSafe ? 'bg-blue-500/20 text-blue-300 border-blue-500/20' : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:border-white/10'}`}
                                    title="Strip complex layouts for ATS parsers"
                                >
                                    <ShieldCheck className="h-3 w-3" /> ATS Safe
                                </button>

                                {/* DOCX */}
                                <div
                                    title="Word export — coming Q3 2026"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-white/[0.03] border border-white/[0.04] text-zinc-700 cursor-not-allowed select-none"
                                >
                                    <FileText className="h-3 w-3" /> DOCX
                                    <span className="ml-1 text-[7px] bg-zinc-800 text-zinc-500 px-1 py-0.5 rounded font-black tracking-widest">Q3 2026</span>
                                </div>

                                {/* Share */}
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:border-white/10 transition-colors"
                                >
                                    <Share2 className="h-3 w-3" /> Share
                                </button>
                            </div>
                        </div>

                        {/* PDF Preview */}
                        <div className="flex-1 p-8 flex items-start justify-center">
                            <div className="w-full max-w-[900px] shadow-[0_40px_80px_rgba(0,0,0,1)] rounded-2xl overflow-hidden border border-white/[0.06]" style={{ minHeight: '700px', aspectRatio: '1/1.414' }}>
                                <ResumePreview data={resumeData} isLoading={isLoading} template={template} isTwoPage={false} isAtsSafe={isAtsSafe} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #1e1e1e; border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #2a2a2a; }
            `}</style>
        </div>
    )
}
