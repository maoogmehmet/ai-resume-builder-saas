'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    FileText,
    MoreVertical,
    Pencil,
    Eye,
    Trash2,
    Copy,
    Type,
    Loader2,
    Sparkles,
    DownloadCloud,
    LinkIcon
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MagicBuilderDialog } from './magic-builder-dialog'

interface Resume {
    id: string;
    title: string;
    updated_at: string;
    ai_generated_json: any;
    pdf_url?: string;
}

export function ResumeCard({ resume, onRefresh }: { resume: Resume, onRefresh: () => void }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isRenameOpen, setIsRenameOpen] = useState(false)
    const [newTitle, setNewTitle] = useState(resume.title)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this resume?')) return;
        setIsLoading(true)
        try {
            const res = await fetch('/api/resume/manage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', resumeId: resume.id })
            })
            if (!res.ok) throw new Error('Failed to delete')
            toast.success('Resume deleted')
            onRefresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDuplicate = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/resume/manage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'duplicate', resumeId: resume.id })
            })
            if (!res.ok) throw new Error('Failed to duplicate')
            toast.success('Resume duplicated')
            onRefresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRename = async () => {
        if (!newTitle.trim()) return
        setIsLoading(true)
        try {
            const res = await fetch('/api/resume/manage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'rename', resumeId: resume.id, title: newTitle })
            })
            if (!res.ok) throw new Error('Failed to rename')
            toast.success('Resume renamed')
            setIsRenameOpen(false)
            onRefresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const isCompleted = !!resume.pdf_url;

    return (
        <>
            <div className="group flex items-center justify-between px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                {/* Content Container simulating a 12-col grid implicitly through flex widths */}
                <div className="flex items-center w-full gap-4">
                    {/* Document Name (5/12) */}
                    <div className="flex items-center gap-3 w-[41.666%] shrink-0">
                        <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${isCompleted ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-zinc-500/10 border border-zinc-500/20'}`}>
                            <FileText className={`h-4 w-4 ${isCompleted ? 'text-emerald-500' : 'text-zinc-500'}`} />
                        </div>
                        <span className="font-medium text-zinc-200 truncate pr-4 text-[13px] cursor-pointer hover:underline" onClick={() => router.push(`/editor/${resume.id}`)}>
                            {resume.title}
                        </span>
                    </div>

                    {/* Status (2/12) */}
                    <div className="w-[16.666%] shrink-0 flex items-center">
                        {isCompleted ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Completed
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                                Draft
                            </span>
                        )}
                    </div>

                    {/* Target Role (3/12) */}
                    <div className="w-[25%] shrink-0 flex items-center">
                        <span className="text-[13px] text-zinc-400 truncate pr-4">
                            {resume.ai_generated_json?.personal_info?.title || 'General Application'}
                        </span>
                    </div>

                    {/* Updated & Actions (2/12) */}
                    <div className="w-[16.666%] shrink-0 flex items-center justify-end gap-4 text-[13px] text-zinc-500">
                        <span className="whitespace-nowrap">
                            {new Date(resume.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-white hover:bg-white/10 rounded-md shrink-0">
                                    <span className="text-xs">•••</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-[#1e1e1e] border-white/10 text-zinc-200 shadow-xl">
                                <DropdownMenuItem onClick={() => router.push(`/editor/${resume.id}`)} className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-sm">
                                    <Pencil className="mr-2 h-4 w-4" /> Edit CV
                                </DropdownMenuItem>
                                {isCompleted && (
                                    <DropdownMenuItem onClick={() => window.open(resume.pdf_url, '_blank')} className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-sm">
                                        <DownloadCloud className="mr-2 h-4 w-4" /> Download PDF
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => setIsRenameOpen(true)} className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-sm">
                                    <Type className="mr-2 h-4 w-4" /> Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDuplicate} disabled={isLoading} className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-sm">
                                    <Copy className="mr-2 h-4 w-4" /> Duplicate
                                </DropdownMenuItem>
                                <div className="my-1 h-px bg-white/10" />
                                <DropdownMenuItem onClick={handleDelete} disabled={isLoading} className="text-red-400 hover:bg-red-400/10 focus:bg-red-400/10 cursor-pointer text-sm">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent className="bg-[#1e1e1e] border-white/10 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Rename Resume</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-zinc-400">New Title</Label>
                            <Input
                                id="title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                                className="bg-black border-white/10 focus-visible:ring-1 focus-visible:ring-white/20 text-white"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRenameOpen(false)} className="hover:bg-white/10 text-white">Cancel</Button>
                        <Button onClick={handleRename} disabled={isLoading} className="bg-white text-black hover:bg-zinc-200">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export function ResumeList({ initialResumes }: { initialResumes: Resume[] }) {
    const router = useRouter()
    const [resumes, setResumes] = useState<Resume[]>(initialResumes)
    const [isCreating, setIsCreating] = useState(false)

    const refreshResumes = async () => {
        const res = await fetch('/api/resume/list')
        const data = await res.json()
        setResumes(data.resumes)
    }

    const createBlank = async () => {
        setIsCreating(true)
        try {
            const res = await fetch('/api/resume/manage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create_blank' })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            router.push(`/editor/${data.resumeId}`)
            toast.success('Created Blank Resume')
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className="flex flex-col w-full">
            {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} onRefresh={refreshResumes} />
            ))}
        </div>
    )
}
