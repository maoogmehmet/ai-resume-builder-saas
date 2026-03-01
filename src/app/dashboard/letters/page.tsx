'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FileText, Loader2, Sparkles, Plus, Copy, Check, Building2, Briefcase, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { CoverLetterDownloadButton } from '@/components/cover-letter-download-button'
import AnimatedGenerateButton from '@/components/ui/animated-generate-button'

export default function LettersPage() {
    const [resumes, setResumes] = useState<any[]>([])
    const [selectedResumeId, setSelectedResumeId] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [jobDescription, setJobDescription] = useState('')

    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedLetter, setGeneratedLetter] = useState<any | null>(null)
    const [previewLetter, setPreviewLetter] = useState<any | null>(null) // the currently selected letter to view

    // Editable Slide States (Array of 4 slides)
    const [slides, setSlides] = useState<any[]>([])
    const [isSavingChanges, setIsSavingChanges] = useState(false)

    const [lettersHistory, setLettersHistory] = useState<any[]>([])
    const [isLoadingHistory, setIsLoadingHistory] = useState(true)
    const [profileData, setProfileData] = useState<any>(null)

    const [copiedContent, setCopiedContent] = useState(false)
    const [deletingLetterIds, setDeletingLetterIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        const loadData = async () => {
            const supabase = createClient()

            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
                setProfileData(profile)
            }

            // Fetch resumes connected to user
            const { data: resumesData } = await supabase.from('resumes').select('id, title').order('created_at', { ascending: false })
            if (resumesData && resumesData.length > 0) {
                setResumes(resumesData)
                setSelectedResumeId(resumesData[0].id)
            }

            // Fetch letters history (now includes profiles(full_name, email) internally but we also fetch it above manually just in case)
            try {
                const res = await fetch('/api/letters/list')
                const data = await res.json()
                if (data.success) {
                    setLettersHistory(data.letters)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setIsLoadingHistory(false)
            }
        }
        loadData()
    }, [])

    const isValid = selectedResumeId && jobTitle.trim() && jobDescription.trim()

    const handleGenerate = async () => {
        if (!isValid) return
        setIsGenerating(true)
        setGeneratedLetter(null)
        setPreviewLetter(null)

        try {
            const response = await fetch('/api/ai/generate-letter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeId: selectedResumeId,
                    jobTitle,
                    companyName,
                    jobDescription
                })
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || 'Generation failed')
                return
            }

            setGeneratedLetter(data.letter)
            handleSelectPreview(data.letter)
            toast.success('Cover Letter Generated Successfully!')

            // Include profile object in the new letter to avoid prop issues
            const newLetter = { ...data.letter, profiles: profileData }

            // Prepend new letter to history
            setLettersHistory(prev => [newLetter, ...prev])

        } catch (error: any) {
            toast.error('Failed to generate template: ' + error.message)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSelectPreview = (letter: any) => {
        setPreviewLetter(letter)
        window.scrollTo({ top: 0, behavior: 'smooth' })

        let parsedContent: any = []
        try {
            parsedContent = JSON.parse(letter.content)
            if (!Array.isArray(parsedContent)) throw new Error("Not an array")
        } catch (e) {
            // Legacy format fallback: migrate to slides
            const legacyContent = letter.content
            let legacyObj: any = {}
            try { legacyObj = JSON.parse(legacyContent) } catch (err) { legacyObj = { letter_body: legacyContent } }

            parsedContent = [
                { title: `Pitch for ${letter.job_title}`, subtitle: `Prepared for ${letter.company_name}`, content: "Intro slide text..." },
                { title: "Company Context", subtitle: "Understanding Your Challenges", content: legacyObj.why_company || "" },
                { title: "Why Me?", subtitle: "Relevant Achievements", content: legacyObj.why_me || "" },
                { title: "First 90 Days", subtitle: "Action Plan", content: "Details of my first 90 days..." }
            ]
        }

        setSlides(parsedContent)
    }

    const handleSlideChange = (index: number, field: string, value: string) => {
        setSlides(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        })
    }

    const handleSaveChanges = async () => {
        if (!previewLetter) return;
        setIsSavingChanges(true);

        const newContentString = JSON.stringify(slides);

        try {
            const res = await fetch('/api/letters/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: previewLetter.id,
                    content: newContentString
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Letter template saved!');
                // Update history
                setLettersHistory(prev => prev.map(l => l.id === previewLetter.id ? { ...l, content: newContentString } : l));
                // Update preview reference to avoid stale data on PDF generation
                setPreviewLetter({ ...previewLetter, content: newContentString });
            } else {
                toast.error(data.error || 'Failed to save');
            }
        } catch (error: any) {
            toast.error('Error saving changes: ' + error.message);
        } finally {
            setIsSavingChanges(false);
        }
    }

    const handleDeleteLetter = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setDeletingLetterIds(prev => new Set(prev).add(id))
        try {
            const res = await fetch('/api/letters/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            const data = await res.json()
            if (res.ok && data.success) {
                toast.success('Letter deleted from archive')
                setLettersHistory(prev => prev.filter(l => l.id !== id))
                if (previewLetter?.id === id) {
                    setPreviewLetter(null)
                    setSlides([])
                }
            } else {
                toast.error(data.error || 'Failed to delete letter')
            }
        } catch (error) {
            toast.error('Error deleting letter')
        } finally {
            setDeletingLetterIds(prev => {
                const next = new Set(prev)
                next.delete(id)
                return next
            })
        }
    }

    const copyToClipboard = (content: string) => {
        navigator.clipboard.writeText(content)
        setCopiedContent(true)
        toast.success("Copied to clipboard!")
        setTimeout(() => setCopiedContent(false), 2000)
    }

    // Helper formatting func
    const getProfileDetails = (letter: any) => {
        if (letter.profiles) return { full_name: letter.profiles.full_name, email: letter.profiles.email };
        return { full_name: profileData?.full_name || 'My Name', email: profileData?.email || 'myemail@example.com' };
    }

    return (
        <div className="flex flex-col min-h-screen bg-black w-full font-sans text-zinc-100">
            <div className="max-w-6xl mx-auto w-full p-8 space-y-8">
                {/* Header */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4">
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase mb-2">
                            Motivation Letters
                        </h1>
                        <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-2xl">
                            Generate and manage <span className="text-white font-bold italic">AI-crafted</span>, targeted cover letters with elegant PDF exports.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 h-12 flex items-center shadow-xl">
                            <span className="text-white mr-2 text-base">{lettersHistory.length}</span> Archived
                        </div>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Left Column - Generation Form */}
                    <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

                        <h2 className="text-xl font-black italic tracking-tighter text-white mb-8 flex items-center gap-3 uppercase">
                            <Sparkles className="h-6 w-6 text-purple-400" />
                            Target a New Role
                        </h2>

                        <div className="mb-8 space-y-3">
                            <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">Select Resume Context</Label>
                            {resumes.length === 0 ? (
                                <div className="text-sm text-zinc-400 bg-white/5 p-3 rounded-lg border border-white/10">
                                    You don&apos;t have any resumes yet. Go to <Link href="/dashboard/builder" className="text-purple-400 hover:text-purple-300 underline">Builder</Link> first.
                                </div>
                            ) : (
                                <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                                    <SelectTrigger className="w-full h-11 border-white/10 bg-black text-white font-medium text-sm focus:ring-white/20">
                                        <SelectValue placeholder="Select a resume" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1e1e1e] border-white/10 text-white">
                                        {resumes.map(r => (
                                            <SelectItem key={r.id} value={r.id} className="hover:bg-white/5 focus:bg-white/5 focus:text-white cursor-pointer">{r.title || 'Untitled Resume'}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="space-y-3">
                                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">Target Role</Label>
                                <Input
                                    placeholder="e.g. Marketing Manager"
                                    className="bg-black/40 h-12 border-white/5 text-white text-sm focus-visible:ring-1 focus-visible:ring-white/20 placeholder:text-zinc-700 rounded-xl transition-all hover:bg-black/60"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">Company</Label>
                                <Input
                                    placeholder="e.g. Apple"
                                    className="bg-black/40 h-12 border-white/5 text-white text-sm focus-visible:ring-1 focus-visible:ring-white/20 placeholder:text-zinc-700 rounded-xl transition-all hover:bg-black/60"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 mb-10">
                            <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">Target Job Description</Label>
                            <Textarea
                                placeholder="Paste the exact job description here..."
                                className="min-h-[180px] bg-black/40 resize-y border-white/5 p-5 leading-relaxed text-sm text-zinc-300 focus-visible:ring-1 focus-visible:ring-white/20 placeholder:text-zinc-700 rounded-2xl transition-all hover:bg-black/60"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>

                        <AnimatedGenerateButton
                            onClick={handleGenerate}
                            disabled={!isValid || isGenerating || resumes.length === 0}
                            generating={isGenerating}
                            labelIdle="Generate Perfect Letter"
                            labelActive="AI is gathering company intel & writing..."
                            highlightHueDeg={270}
                            size="lg"
                            className="w-full h-14"
                        />
                    </div>

                    <div className="space-y-6">

                        {/* Currently Selected/Generated Result */}
                        {previewLetter && (
                            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-3xl text-white animate-in slide-in-from-right-8 duration-700 relative overflow-hidden group">
                                <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-white/5 pb-8 gap-6">
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-purple-500/20 rounded-xl border border-purple-500/30">
                                                <Sparkles className="h-6 w-6 text-purple-400" />
                                            </div>
                                            Template Editor
                                        </h3>
                                        <div className="flex items-center gap-2 text-zinc-400">
                                            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500">For</span>
                                            <p className="text-[13px] font-bold text-zinc-300">{previewLetter.job_title} @ <span className="text-white italic">{previewLetter.company_name}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 relative z-10">
                                        <Button
                                            size="lg"
                                            className={`${isSavingChanges ? 'bg-zinc-800' : 'bg-emerald-600 hover:bg-emerald-500'} text-white shadow-xl shadow-emerald-500/10 transition-all font-black uppercase tracking-widest text-[11px] h-12 px-6 rounded-xl`}
                                            onClick={handleSaveChanges}
                                            disabled={isSavingChanges}
                                        >
                                            {isSavingChanges ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                            {isSavingChanges ? 'Saving' : 'Save Edits'}
                                        </Button>
                                    </div>
                                </div>

                                {/* Builder form: Slides */}
                                <div className="space-y-8 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar relative z-10">
                                    {slides.map((slide, idx) => (
                                        <div key={idx} className="bg-black/30 border border-white/5 rounded-3xl p-8 shadow-2xl transition-all hover:bg-black/50 hover:border-white/10">
                                            <div className="flex items-center gap-5 mb-8 border-b border-white/5 pb-6">
                                                <div className="bg-white/5 text-white font-black h-12 w-12 rounded-2xl flex items-center justify-center text-lg shrink-0 border border-white/10 shadow-xl italic tracking-tighter">
                                                    {idx + 1}
                                                </div>
                                                <div className="w-full flex-1 space-y-2">
                                                    <Input
                                                        value={slide.title}
                                                        onChange={(e) => handleSlideChange(idx, 'title', e.target.value)}
                                                        className="h-9 bg-transparent border-0 text-white font-black italic tracking-tighter uppercase px-0 focus-visible:ring-0 text-xl"
                                                        placeholder="Slide Title"
                                                    />
                                                    <Input
                                                        value={slide.subtitle}
                                                        onChange={(e) => handleSlideChange(idx, 'subtitle', e.target.value)}
                                                        className="h-6 bg-transparent border-0 text-zinc-500 font-black uppercase tracking-[0.2em] px-0 focus-visible:ring-0 text-[10px]"
                                                        placeholder="Slide Subtitle"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Textarea
                                                    className="min-h-[160px] bg-black/40 border-white/5 text-zinc-300 text-[14.5px] leading-relaxed p-6 rounded-2xl focus-visible:ring-1 focus-visible:ring-white/20 transition-all hover:bg-black/60 shadow-inner"
                                                    value={slide.content}
                                                    onChange={(e) => handleSlideChange(idx, 'content', e.target.value)}
                                                    placeholder="Slide content (use bullets or paragraphs)"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 pt-8 border-t border-white/5 w-full flex justify-end gap-3 relative z-10">
                                    <CoverLetterDownloadButton
                                        letterData={previewLetter}
                                        profileData={getProfileDetails(previewLetter)}
                                        variant="default"
                                        className="bg-purple-600 hover:bg-purple-500 w-full sm:w-auto h-14 px-10 shadow-2xl shadow-purple-600/20 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl transition-all active:scale-95"
                                    />
                                </div>
                            </div>
                        )}

                        {/* History */}
                        <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-zinc-500/5 rounded-full blur-3xl pointer-events-none" />

                            <h2 className="text-xl font-black italic tracking-tighter text-white uppercase mb-8 flex items-center gap-3">
                                <Briefcase className="h-6 w-6 text-zinc-500" />
                                Archive
                            </h2>

                            {isLoadingHistory ? (
                                <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-zinc-700" /></div>
                            ) : lettersHistory.length === 0 ? (
                                <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-3xl bg-black/20 group hover:border-white/10 transition-all">
                                    <FileText className="h-12 w-12 text-zinc-700 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                    <p className="text-sm font-black uppercase tracking-widest text-zinc-500">No letters archived.</p>
                                </div>
                            ) : (
                                <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar relative z-10">
                                    {lettersHistory.map((letter) => (
                                        <div key={letter.id} className={`border rounded-2xl p-6 transition-all group relative overflow-hidden ${previewLetter?.id === letter.id ? 'border-purple-500/30 bg-purple-500/5 shadow-2xl' : 'border-white/5 bg-black/20 hover:border-white/10 hover:bg-black/40 shadow-sm'}`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-black italic tracking-tighter text-white text-lg leading-tight flex-1 uppercase">{letter.job_title}</h4>
                                                <span className="text-[10px] font-black text-zinc-500 whitespace-nowrap bg-white/5 border border-white/5 px-3 py-1.5 rounded-full shrink-0 ml-4 uppercase tracking-widest">
                                                    {new Date(letter.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-xs font-black text-zinc-500 flex items-center gap-2 mb-6 uppercase tracking-widest">
                                                <Building2 className="h-3.5 w-3.5 text-zinc-600" />
                                                {letter.company_name}
                                            </p>

                                            <div className="flex gap-3">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleSelectPreview(letter)}
                                                    className={`flex-1 h-10 font-black uppercase tracking-[0.2em] text-[10px] rounded-xl transition-all active:scale-95 ${previewLetter?.id === letter.id ? 'bg-white text-black hover:bg-zinc-200' : 'bg-white/5 text-white border border-white/5 hover:bg-white/10'}`}
                                                >
                                                    Edit Template
                                                </Button>

                                                <CoverLetterDownloadButton
                                                    letterData={letter}
                                                    profileData={getProfileDetails(letter)}
                                                    variant="outline"
                                                    className="flex-1 h-10 font-black uppercase tracking-[0.2em] text-[10px] border-white/5 bg-black/40 text-white hover:bg-white/5 rounded-xl transition-all active:scale-95"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => handleDeleteLetter(letter.id, e)}
                                                    disabled={deletingLetterIds.has(letter.id)}
                                                    className="h-10 w-10 p-0 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl flex-shrink-0 border border-white/5 transition-all active:scale-95"
                                                >
                                                    {deletingLetterIds.has(letter.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                </main>
            </div>
        </div>
    )
}

