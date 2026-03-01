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
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            My Motivation Letters
                        </h1>
                        <p className="text-zinc-400 text-sm font-medium mt-1">
                            Generate and manage AI-crafted, targeted cover letters in elegant PDFs.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-white/5 border text-center border-white/10 px-4 py-2 rounded-lg text-sm font-semibold text-zinc-300 h-11 flex items-center shadow-sm">
                            <span className="text-white mr-2 text-base">{lettersHistory.length}</span> Letters Archived
                        </div>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Left Column - Generation Form */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-400" />
                            Target a New Role
                        </h2>

                        <div className="mb-6 space-y-2">
                            <Label className="text-[13px] font-semibold text-zinc-300">Select Resume Context *</Label>
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

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <Label className="text-[13px] font-semibold text-zinc-300">Target Role *</Label>
                                <Input
                                    placeholder="e.g. Marketing Manager"
                                    className="bg-black h-11 border-white/10 text-white text-sm focus-visible:ring-1 focus-visible:ring-white/20 placeholder:text-zinc-600"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[13px] font-semibold text-zinc-300">Company</Label>
                                <Input
                                    placeholder="e.g. Apple"
                                    className="bg-black h-11 border-white/10 text-white text-sm focus-visible:ring-1 focus-visible:ring-white/20 placeholder:text-zinc-600"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 mb-8">
                            <Label className="text-[13px] font-semibold text-zinc-300">Target Job Description *</Label>
                            <Textarea
                                placeholder="Paste the exact job description here..."
                                className="min-h-[160px] bg-black resize-y border-white/10 p-4 leading-relaxed text-sm text-white focus-visible:ring-1 focus-visible:ring-white/20 placeholder:text-zinc-600"
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
                            className="w-full h-12"
                        />
                    </div>

                    <div className="space-y-6">

                        {/* Currently Selected/Generated Result */}
                        {previewLetter && (
                            <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-8 shadow-sm text-white animate-in slide-in-from-right-4 duration-500">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b border-white/10 pb-5 gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
                                            <FileText className="h-5 w-5 text-purple-400" />
                                            Letter Template Builder
                                        </h3>
                                        <p className="text-[13px] text-zinc-400 font-medium">For: {previewLetter.job_title} at <strong className="text-white">{previewLetter.company_name}</strong></p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            size="sm"
                                            className={`${isSavingChanges ? 'bg-slate-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white shadow-lg`}
                                            onClick={handleSaveChanges}
                                            disabled={isSavingChanges}
                                        >
                                            {isSavingChanges ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                            {isSavingChanges ? 'Saving...' : 'Save Edits'}
                                        </Button>
                                    </div>
                                </div>

                                {/* Builder form: Slides */}
                                <div className="space-y-6 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                                    {slides.map((slide, idx) => (
                                        <div key={idx} className="bg-black/50 border border-white/10 rounded-xl p-5 shadow-inner">
                                            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
                                                <div className="bg-white/10 text-white font-bold h-8 w-8 rounded-full flex items-center justify-center text-sm shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <div className="w-full flex-1 space-y-2">
                                                    <Input
                                                        value={slide.title}
                                                        onChange={(e) => handleSlideChange(idx, 'title', e.target.value)}
                                                        className="h-8 bg-transparent border-0 text-white font-bold px-0 focus-visible:ring-0 text-base"
                                                        placeholder="Slide Title"
                                                    />
                                                    <Input
                                                        value={slide.subtitle}
                                                        onChange={(e) => handleSlideChange(idx, 'subtitle', e.target.value)}
                                                        className="h-6 bg-transparent border-0 text-zinc-400 font-medium px-0 focus-visible:ring-0 text-xs"
                                                        placeholder="Slide Subtitle"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Textarea
                                                    className="min-h-[140px] bg-black border-white/10 text-zinc-300 text-[13.5px] leading-relaxed p-4 rounded-lg focus-visible:ring-1 focus-visible:ring-white/20"
                                                    value={slide.content}
                                                    onChange={(e) => handleSlideChange(idx, 'content', e.target.value)}
                                                    placeholder="Slide content (use bullets or paragraphs)"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/10 w-full flex justify-end gap-3">
                                    <CoverLetterDownloadButton
                                        letterData={previewLetter}
                                        profileData={getProfileDetails(previewLetter)}
                                        variant="default"
                                        className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto h-11 px-8 shadow-xl shadow-purple-600/20"
                                    />
                                </div>
                            </div>
                        )}

                        {/* History */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-sm">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-zinc-400" />
                                Your Letter Archive
                            </h2>

                            {isLoadingHistory ? (
                                <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-zinc-600" /></div>
                            ) : lettersHistory.length === 0 ? (
                                <div className="text-center py-10 border border-dashed border-white/10 rounded-xl bg-white/5">
                                    <FileText className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-zinc-400">No cover letters in your archive.</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {lettersHistory.map((letter) => (
                                        <div key={letter.id} className={`border rounded-xl p-5 transition-all group ${previewLetter?.id === letter.id ? 'border-white/30 bg-white/10 shadow-sm' : 'border-white/10 hover:border-white/20'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-white leading-tight flex-1">{letter.job_title}</h4>
                                                <span className="text-xs font-semibold text-zinc-300 whitespace-nowrap bg-white/10 px-2.5 py-1 rounded-md shrink-0 ml-4">
                                                    {new Date(letter.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-zinc-400 flex items-center gap-1.5 mb-4">
                                                <Building2 className="h-3.5 w-3.5" />
                                                {letter.company_name}
                                            </p>

                                            <div className="flex gap-3">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleSelectPreview(letter)}
                                                    className={`flex-1 h-9 font-semibold text-xs ${previewLetter?.id === letter.id ? 'bg-white text-black hover:bg-zinc-200' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                                >
                                                    View Preview
                                                </Button>

                                                <CoverLetterDownloadButton
                                                    letterData={letter}
                                                    profileData={getProfileDetails(letter)}
                                                    variant="outline"
                                                    className="flex-1 h-9 font-semibold text-[11px] border-white/10 bg-black text-white hover:bg-white/10 hover:text-white"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => handleDeleteLetter(letter.id, e)}
                                                    disabled={deletingLetterIds.has(letter.id)}
                                                    className="h-9 w-9 p-0 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg flex-shrink-0 border border-white/10"
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

